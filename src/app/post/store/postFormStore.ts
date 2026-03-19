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

  setField: (key: string, value: any) => void;
  setBulk: (data: Partial<PostFormState>) => void;
  reset: () => Promise<void>;

  addFiles: (files: FileList | File[]) => Promise<void>;
  removeImage: (index: number) => Promise<void>;
  setImagesFromRefs: () => Promise<void>;
};

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
  postId: undefined as string | undefined,
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

        // 🔥 delete all images from IndexedDB
        for (const ref of refs) {
          const parsed = decodeIdbRef(ref);
          if (parsed) await idbDel(parsed.key);
        }

        // ✅ reset everything but keep sellerInfo
        set(() => ({
          ...defaultState,
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
          if (!f.size || !f.type?.startsWith("image/")) continue;

          const key = makeImageKey(f);
          await idbSet(key, f);

          refs.push(encodeIdbRef(key, f.name));
        }

        set((s) => ({
          imageRefs: [...(s.imageRefs || []), ...refs],
        }));

        await get().setImagesFromRefs();
      },

      removeImage: async (index) => {
        const state = get();
        const refs = [...(state.imageRefs || [])];
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
        if (state?.setImagesFromRefs) {
          await state.setImagesFromRefs();
        }
      },
    }
  )
);