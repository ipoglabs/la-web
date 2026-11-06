// scripts/restore-db.ts
// Run with:
//   npx tsx --env-file=.env.local scripts/restore-db.ts <backupDir> [options]
//
// Loads a backup made by scripts/backup-db.ts back into MongoDB.
// Dry run by default — prints what it would do and writes nothing.
//
// Options:
//   --db=<name>           target database (default: the DB in MONGODB_URI —
//                         which is the LIVE site's database)
//   --only=a,b            restore just these collections
//   --drop                replace collections that already have data
//                         (without it, any non-empty target collection
//                         stops the restore before anything is written)
//   --confirm=<dbName>    required to actually write; must equal the target
//                         database name, so you can't hit the wrong DB by
//                         accident
//
// Examples:
//   # see what would happen
//   npx tsx --env-file=.env.local scripts/restore-db.ts ~/lokalads-db-backups/lokalads-staging-2026-11-06T07-39-16
//   # restore one collection over the live data
//   npx tsx --env-file=.env.local scripts/restore-db.ts <dir> --only=posts --drop --confirm=lokalads-staging
//   # restore everything into a fresh copy to inspect it
//   npx tsx --env-file=.env.local scripts/restore-db.ts <dir> --db=lokalads-restored --confirm=lokalads-restored

import fs from "fs";
import path from "path";
import readline from "readline";
import zlib from "zlib";
import { MongoClient, type Document, type IndexDescription } from "mongodb";
import { EJSON } from "bson";

type Manifest = {
  database: string;
  createdAt: string;
  collections: Record<string, { docs: number; indexes: (IndexDescription & { v?: number; ns?: string })[]; options?: Document }>;
};

const BATCH = 500;

function arg(name: string): string | undefined {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit?.slice(name.length + 3);
}

async function main() {
  const dir = process.argv[2] && !process.argv[2].startsWith("--") ? path.resolve(process.argv[2].replace(/^~/, process.env.HOME ?? "~")) : "";
  if (!dir || !fs.existsSync(path.join(dir, "manifest.json"))) {
    throw new Error("Usage: restore-db.ts <backupDir> [--db=name] [--only=a,b] [--drop] [--confirm=dbName]\n(backupDir must contain manifest.json)");
  }
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set (run with --env-file=.env.local)");

  const manifest: Manifest = JSON.parse(fs.readFileSync(path.join(dir, "manifest.json"), "utf8"));
  const only = arg("only")?.split(",").map((s) => s.trim()).filter(Boolean);
  const drop = process.argv.includes("--drop");

  const names = Object.keys(manifest.collections).filter((n) => !only || only.includes(n));
  const unknown = only?.filter((n) => !manifest.collections[n]) ?? [];
  if (unknown.length) throw new Error(`Not in this backup: ${unknown.join(", ")}`);

  const client = await new MongoClient(uri).connect();
  try {
    const db = arg("db") ? client.db(arg("db")) : client.db();
    const write = arg("confirm") === db.databaseName;
    if (arg("confirm") !== undefined && !write) {
      throw new Error(`--confirm=${arg("confirm")} does not match the target database "${db.databaseName}"`);
    }

    console.log(`Backup:  ${manifest.database} @ ${manifest.createdAt}`);
    console.log(`Target:  ${db.databaseName}${db.databaseName === manifest.database ? "  (same DB the backup came from)" : ""}`);
    console.log(`Mode:    ${write ? (drop ? "WRITE, replacing existing data" : "WRITE, empty collections only") : "dry run (add --confirm=" + db.databaseName + " to write)"}\n`);

    // Check everything before writing anything.
    const existing = new Map<string, number>();
    for (const n of names) existing.set(n, await db.collection(n).estimatedDocumentCount());
    const blocked = names.filter((n) => (existing.get(n) ?? 0) > 0);
    for (const n of names) {
      const have = existing.get(n) ?? 0;
      const action = have === 0 ? "load" : drop ? `drop ${have} live docs, then load` : `BLOCKED — already has ${have} docs`;
      console.log(`  ${n}: ${manifest.collections[n].docs} docs → ${action}`);
    }
    if (blocked.length && !drop) {
      throw new Error(`\n${blocked.length} collection(s) already have data. Add --drop to replace them, or use --only / --db.`);
    }
    if (!write) {
      console.log("\nDry run only — nothing written.");
      return;
    }

    let mismatches = 0;
    for (const n of names) {
      const meta = manifest.collections[n];
      if ((existing.get(n) ?? 0) > 0 || (await db.listCollections({ name: n }).hasNext())) {
        await db.collection(n).drop();
      }
      const { validator, validationLevel, validationAction, collation, capped, size, max, timeseries, expireAfterSeconds, clusteredIndex } =
        (meta.options ?? {}) as Document;
      const opts = Object.fromEntries(
        Object.entries({ validator, validationLevel, validationAction, collation, capped, size, max, timeseries, expireAfterSeconds, clusteredIndex })
          .filter(([, v]) => v !== undefined),
      );
      const col = await db.createCollection(n, opts);

      const lines = readline.createInterface({
        input: fs.createReadStream(path.join(dir, `${n}.json.gz`)).pipe(zlib.createGunzip()),
        crlfDelay: Infinity,
      });
      let batch: Document[] = [];
      for await (const line of lines) {
        if (!line.trim()) continue;
        batch.push(EJSON.parse(line, { relaxed: false }) as Document);
        if (batch.length >= BATCH) {
          await col.insertMany(batch, { ordered: false });
          batch = [];
        }
      }
      if (batch.length) {
        await col.insertMany(batch, { ordered: false });
      }

      // Recreate indexes (the default _id index comes with the collection).
      const idx = meta.indexes
        .filter((i) => i.name !== "_id_")
        .map((i) => {
          const rest: Document = { ...i };
          delete rest.v; // server-generated, rejected by createIndexes
          delete rest.ns;
          return rest as IndexDescription;
        });
      if (idx.length) await col.createIndexes(idx);

      const count = await col.countDocuments();
      if (count !== meta.docs) mismatches++;
      console.log(`${count === meta.docs ? "ok      " : "MISMATCH"} ${n}: ${count}/${meta.docs} docs, ${idx.length} indexes`);
    }
    console.log(mismatches ? `\n${mismatches} collection(s) did not match the backup count.` : "\nRestore complete — every count matches the backup.");
    if (mismatches) process.exitCode = 1;
  } finally {
    await client.close();
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
