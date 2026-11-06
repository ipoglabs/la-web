// scripts/backup-db.ts
// Run with:
//   npx tsx --env-file=.env.local scripts/backup-db.ts [outDir]
//
// Read-only full backup of the database in MONGODB_URI (remember: prod uses
// lokalads-staging, the same DB as .env.local). Writes to
//   <outDir>/<dbName>-<timestamp>/
//     <collection>.json.gz   one document per line, canonical EJSON (keeps
//                            ObjectId / Date / Decimal128 types exactly)
//     manifest.json          doc counts, indexes and collection options
// outDir defaults to ~/lokalads-db-backups — keep it OUTSIDE the repo: the
// dump holds users' personal data, sessions and messages.
// Restore with scripts/restore-db.ts.

import fs from "fs";
import os from "os";
import path from "path";
import zlib from "zlib";
import { MongoClient } from "mongodb";
import { EJSON } from "bson";

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set (run with --env-file=.env.local)");
  const outRoot = path.resolve(process.argv[2] ?? path.join(os.homedir(), "lokalads-db-backups"));

  const client = await new MongoClient(uri).connect();
  try {
    const db = client.db();
    const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    const out = path.join(outRoot, `${db.databaseName}-${stamp}`);
    fs.mkdirSync(out, { recursive: true });

    const cols = (await db.listCollections().toArray())
      .filter((c) => c.type !== "view" && !c.name.startsWith("system."))
      .sort((a, b) => a.name.localeCompare(b.name));

    const manifest = {
      database: db.databaseName,
      createdAt: new Date().toISOString(),
      collections: {} as Record<string, { docs: number; indexes: unknown[]; options: unknown }>,
    };
    let problems = 0;

    for (const c of cols) {
      const col = db.collection(c.name);
      const gz = zlib.createGzip();
      const file = fs.createWriteStream(path.join(out, `${c.name}.json.gz`));
      gz.pipe(file);
      let n = 0;
      for await (const doc of col.find({})) {
        if (!gz.write(EJSON.stringify(doc, { relaxed: false }) + "\n")) {
          await new Promise<void>((r) => gz.once("drain", () => r()));
        }
        n++;
      }
      gz.end();
      await new Promise<void>((r) => file.on("finish", () => r()));

      const live = await col.countDocuments();
      if (live !== n) problems++;
      manifest.collections[c.name] = {
        docs: n,
        indexes: await col.indexes(),
        options: "options" in c ? c.options : {},
      };
      console.log(`${live === n ? "ok      " : "CHANGED "} ${c.name}: ${n} docs${live === n ? "" : ` (live now ${live})`}`);
    }

    fs.writeFileSync(path.join(out, "manifest.json"), JSON.stringify(manifest, null, 2));
    console.log(`\nBackup written to ${out}`);
    if (problems) console.log(`${problems} collection(s) changed while backing up — the dump is still valid, just not a single point in time.`);
  } finally {
    await client.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
