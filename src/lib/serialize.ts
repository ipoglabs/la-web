/**
 * Converts a Mongoose Post document (or .lean() result) into a plain
 * client-safe object — required whenever a Server Component/Server Action
 * passes data to a Client Component, since Mongoose documents, ObjectIds,
 * and nested Dates aren't serializable across that boundary as-is.
 *
 * The JSON round-trip works because Mongoose's ObjectId and Date both
 * implement toJSON (ObjectId → hex string, Date → ISO string), and a
 * hydrated Document's own toJSON applies the schema's toJSON transform
 * (if any) before this ever touches it. Safe for both .lean() results
 * (plain objects with ObjectId instances) and full hydrated documents.
 */
export function toClientPost<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc));
}