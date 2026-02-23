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

  /** In-memory runtime images (File | url string) */
  images: (File | string)[];

  /** Persisted image refs (url strings + idb refs) */
  imageRefs: string[];

  location: Location;
  facilities: string[];

  editMode?: boolean;
  postId?: string;

  [key: string]: any;

  setField: (key: string, value: any) => void;
  setBulk: (data: Partial<PostFormState>) => void;
  reset: () => void;

  /** Images API */
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

      setField: (key, value) => set((s) => ({ ...s, [key]: value })),
      setBulk: (data) => set((s) => ({ ...s, ...data })),

      reset: () => set(() => ({ ...defaultState })),

      /** Persist local files to IDB; keep urls as-is */
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

        // rehydrate runtime images from refs
        await get().setImagesFromRefs();
      },

      removeImage: async (index) => {
        const state = get();
        const refs = [...(state.imageRefs || [])];
        const removed = refs[index];
        if (!removed) return;

        // delete IDB entry if it is idb ref
        const parsed = decodeIdbRef(removed);
        if (parsed) await idbDel(parsed.key);

        refs.splice(index, 1);
        set(() => ({ imageRefs: refs }));
        await get().setImagesFromRefs();
      },

      /** Build runtime images[] from imageRefs[] */
      setImagesFromRefs: async () => {
        const refs = get().imageRefs || [];
        const runtime: (File | string)[] = [];

        for (const r of refs) {
          const parsed = decodeIdbRef(r);
          if (!parsed) {
            runtime.push(r); // hosted url string
            continue;
          }
          const blob = await idbGet(parsed.key);
          if (blob) runtime.push(blobToFile(blob, parsed.filename));
        }

        set(() => ({ images: runtime }));
      },
    }),
    {
      name: "post-form-store",
      partialize: (state) => ({
        // core
        category: state.category,
        subcategory: state.subcategory,
        name: state.name,
        description: state.description,
        sellerInfo: state.sellerInfo,
        location: state.location,
        facilities: state.facilities,

        // edit
        editMode: state.editMode,
        postId: state.postId,

        // images persisted as refs only (urls + idb refs)
        imageRefs: state.imageRefs,

        // if your forms set additional primitives, add them explicitly here if needed
      }),
      onRehydrateStorage: () => async (state) => {
        // after rehydrate, rebuild runtime images[] from refs
        if (state?.setImagesFromRefs) {
          await state.setImagesFromRefs();
        }
      },
    }
  )
);
