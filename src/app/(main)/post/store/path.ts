// Dot-path helpers: "sellerInfo.name" -> nested get/set

export function getAtPath(obj: any, path: string) {
  if (!path) return obj;
  return path.split(".").reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
}

export function setAtPath(obj: any, path: string, value: any) {
  const keys = path.split(".");
  const clone = Array.isArray(obj) ? [...obj] : { ...obj };
  let cur: any = clone;

  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i]!;
    const next = cur[k];
    cur[k] = Array.isArray(next) ? [...next] : typeof next === "object" && next !== null ? { ...next } : {};
    cur = cur[k];
  }

  cur[keys[keys.length - 1]!] = value;
  return clone;
}
