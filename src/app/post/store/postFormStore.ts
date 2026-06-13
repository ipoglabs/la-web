"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  decodeIdbRef,
  encodeIdbRef,
  idbGet,
  idbSet,
  makeImageKey,
  blobToFile,
  idbDel,
} from "../wizard/imagePersistence";
import { processImage } from "@/lib/media/processImage";

export type SellerInfo = { name: string; email: string; phone: string };
export type Location = { address: string; lat?: number; lng?: number };

export type PostFormState = {
  category: string;
  subcategory: string;
  name: string;
  description: string;
  sellerInfo: SellerInfo;

  images: (File | string)[];
  imageRefs: string[];

  location: Location;
  facilities: string[];

  editMode?: boolean;
  postId?: string;
  lastActiveAt: number;

  setField: (key: string, value: any) => void;
  setBulk: (data: Partial<PostFormState>) => void;
  reset: () => Promise<void>;

  addFiles: (files: FileList | File[]) => Promise<void>;
  removeImage: (index: number) => Promise<void>;
  setImagesFromRefs: () => Promise<void>;
};

const STALE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Generates a valid 24-char MongoDB ObjectId hex string on the client.
 * Format: 4-byte timestamp + 8 random bytes (matches ObjectId spec).
 * Safe to use as _id in MongoDB via new Types.ObjectId(hex).
 */
function generateObjectId(): string {
  const ts = Math.floor(Date.now() / 1000).toString(16).padStart(8, "0");
  const rand = Array.from(crypto.getRandomValues(new Uint8Array(8)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return ts + rand;
}

const defaultState = {
  category: "",
  subcategory: "",
  name: "",
  description: "",
  sellerInfo: { name: "", email: "", phone: "" },

  images: [],
  imageRefs: [],

  location: { address: "" },
  facilities: [],

  editMode: false,
  postId: generateObjectId(),
  lastActiveAt: 0,
};

export const usePostFormStore = create<PostFormState>()(
  persist(
    (set, get) => ({
      ...defaultState,

      /* ---------------- SETTERS ---------------- */

      setField: (key, value) =>
        set((s) => ({ ...s, [key]: value })),

      setBulk: (data) =>
        set((s) => ({ ...s, ...data })),

      /* ---------------- RESET (KEEP SELLER INFO) ---------------- */

      reset: async () => {
        const refs = get().imageRefs || [];
        const seller = get().sellerInfo;

        for (const ref of refs) {
          const parsed = decodeIdbRef(ref);
          if (parsed) await idbDel(parsed.key);
        }

        set(() => ({
          ...defaultState,
          postId: generateObjectId(), // fresh ID for the next post
          sellerInfo: seller,
        }));
      },

      /* ---------------- IMAGE HANDLING ---------------- */

      addFiles: async (files) => {
        const arr = Array.from(files || []);
        if (!arr.length) return;

        const refs: string[] = [];

        for (const f of arr) {
          if (!(f instanceof File)) continue;
          if (!f.size) continue;

          const processed = await processImage(f);

          const key = makeImageKey(processed);
          await idbSet(key, processed);

          refs.push(encodeIdbRef(key, processed.name));
        }

        set((s) => ({
          imageRefs: [...(s.imageRefs || []), ...refs],
          lastActiveAt: Date.now(),
        }));

        await get().setImagesFromRefs();
      },

      removeImage: async (index) => {
        const state = get();

        const refs = [...(state.imageRefs || [])];
        const runtimeImages = [...(state.images || [])];

        const target = runtimeImages[index];

        // CASE 1: already-uploaded URL (edit mode or previously uploaded)
        if (typeof target === "string" && !target.startsWith("idb:")) {
          set(() => ({
            images: runtimeImages.filter((_, i) => i !== index),
          }));
          return;
        }

        // CASE 2: local IDB blob
        const removed = refs[index];
        if (!removed) return;

        const parsed = decodeIdbRef(removed);
        if (parsed) await idbDel(parsed.key);

        refs.splice(index, 1);
        set(() => ({ imageRefs: refs }));
        await get().setImagesFromRefs();
      },

      setImagesFromRefs: async () => {
        const refs = get().imageRefs || [];
        const runtime: (File | string)[] = [];

        for (const r of refs) {
          const parsed = decodeIdbRef(r);

          if (!parsed) {
            runtime.push(r);
            continue;
          }

          const blob = await idbGet(parsed.key);
          if (blob) {
            runtime.push(blobToFile(blob, parsed.filename));
          }
        }

        set(() => ({ images: runtime }));
      },
    }),
    {
      name: "post-form-store",

      partialize: (state) => {
        const { images, ...rest } = state;
        return rest;
      },

      onRehydrateStorage: () => async (state) => {
        if (!state) return;
        const hasImages = (state.imageRefs?.length ?? 0) > 0;
        const isStale = Date.now() - (state.lastActiveAt ?? 0) > STALE_MS;
        if (hasImages && isStale) {
          await state.reset();
        } else if (state.setImagesFromRefs) {
          await state.setImagesFromRefs();
        }
      },
    }
  )
);
