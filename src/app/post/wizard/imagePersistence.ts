"use client";

/**
 * Minimal IndexedDB wrapper to store File blobs safely (so refresh keeps images).
 * Stores each file under a generated key; returns key strings.
 */

const DB_NAME = "lokalads-post-wizard";
const STORE = "images";
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function idbSet(key: string, value: Blob): Promise<void> {
  const db = await openDB();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

export async function idbGet(key: string): Promise<Blob | null> {
  const db = await openDB();
  const blob = await new Promise<Blob | null>((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).get(key);
    req.onsuccess = () => resolve((req.result as Blob) ?? null);
    req.onerror = () => reject(req.error);
  });
  db.close();
  return blob;
}

export async function idbDel(key: string): Promise<void> {
  const db = await openDB();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

export function makeImageKey(file: File) {
  return `img_${Date.now()}_${Math.random().toString(16).slice(2)}_${file.name}`;
}

/** Convert persisted Blob back to File */
export function blobToFile(blob: Blob, name: string) {
  return new File([blob], name, { type: blob.type || "image/jpeg" });
}

/**
 * Stored format in Zustand:
 * - string URL (already hosted)
 * - "idb:<key>|<filename>" for local File persisted in IndexedDB
 */
export function encodeIdbRef(key: string, filename: string) {
  return `idb:${key}|${filename}`;
}

export function decodeIdbRef(ref: string): { key: string; filename: string } | null {
  if (!ref.startsWith("idb:")) return null;
  const raw = ref.slice(4);
  const idx = raw.indexOf("|");
  if (idx === -1) return null;
  return { key: raw.slice(0, idx), filename: raw.slice(idx + 1) };
}
