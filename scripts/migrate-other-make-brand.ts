// scripts/migrate-other-make-brand.ts
// Run with (after syncing the Vehicles / Electronics / Guitars forms):
//   npx tsx --env-file=.env.local scripts/migrate-other-make-brand.ts [--dry-run]
//
// The Make and Brand dropdowns used to end with "Other", which showed an
// Other Make (`makeOther`) / Brand Name (`otherBrand`) text box. Now the
// dropdown itself takes a typed value, so this moves each such post onto it:
// the list's option when the typed name is one (e.g. "Lenovo" → lenovo),
// else the typed name itself, queued in /admin → Option requests (no email).

import mongoose from "mongoose";
import dbConnect from "../src/lib/db";
import Post from "../src/models/post";
import { CATEGORIES } from "../src/config/categories";
import { getPostFormSchema } from "../src/posting/form-schema/getPostFormSchema";
import { recordOptionRequests } from "../src/posting/form-schema/optionRequests";
import { CUSTOM_OPTION } from "../src/posting/form-schema/types";

const MOVES = [
  { key: "make", path: "make", other: "Other", typedKey: "makeOther" },
  { key: "brand", path: "attributes.brand", other: "other", typedKey: "otherBrand" },
];

/** Category / subcategory labels for a post saved with either labels or ids. */
function labels(category: string, subcategory: string) {
  const cat = CATEGORIES.find((c) => c.id === category || c.label === category);
  const sub = cat?.subcategories.find((s) => s.id === subcategory || s.label === subcategory);
  return { category: cat?.label ?? category, subcategory: sub?.label ?? subcategory };
}

async function run() {
  const dryRun = process.argv.includes("--dry-run");
  await dbConnect();

  for (const move of MOVES) {
    const posts = await Post.find({ [move.path]: move.other }).lean();
    for (const post of posts) {
      const attributes = (post.attributes ?? {}) as Record<string, unknown>;
      const typed = String(attributes[move.typedKey] ?? "").trim().replace(/\s+/g, " ");
      const { category, subcategory } = labels(post.category, post.subcategory);
      const { schema } = await getPostFormSchema(category, subcategory, post.country ?? "");
      const field = schema?.sections.flatMap((s) => s.fields).find((f) => f.key === move.key);
      const tag = `${post._id} ${category} › ${subcategory} (${post.country})`;

      if (!schema || !field?.allowCustom) { console.log(`skip ${tag}: ${move.key} takes no typed value`); continue; }
      if (!typed || typed.length > CUSTOM_OPTION.maxLength || !CUSTOM_OPTION.pattern.test(typed)) {
        console.log(`skip ${tag}: no usable ${move.typedKey} ("${typed}")`);
        continue;
      }

      const option = field.options?.find((o) => [o.value, o.label].some((v) => v.toLowerCase() === typed.toLowerCase()));
      const value = option?.value ?? typed;
      console.log(`${tag}: ${move.key} ${move.other} + "${typed}" → "${value}"${option ? "" : " (queued)"}`);
      if (dryRun) continue;

      await Post.updateOne(
        { _id: post._id },
        { $set: { [move.path]: value }, $unset: { [`attributes.${move.typedKey}`]: "" } },
      );
      if (!option) {
        await recordOptionRequests(schema, { ...post, ...attributes, [move.key]: value }, String(post._id), { notify: false });
      }
    }
  }

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
