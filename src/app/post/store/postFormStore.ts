// src/app/post/store/postFormStore.ts
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SellerInfo = { name: string; email: string; phone: string };
export type Location = { address: string; lat?: number; lng?: number };

export type PostFormState = {
  /* Core fields captured across steps */
  category: string;
  subcategory: string;
  name: string;
  description: string;
  sellerInfo: SellerInfo;
  images: (File | string)[];
  location: Location;
  facilities: string[];

  /* ---- Edit mode wiring ---- */
  /** true when editing an existing post (loaded via /post/edit/[id]) */
  editMode?: boolean;
  /** the DB id of the post being edited */
  postId?: string;

  /* generic extras from forms (vehicles/jobs/pets/services/etc.) */
  // You can keep this index signature for flexibility:
  [key: string]: any;

  /* Mutators */
  /** set any top-level field (replace semantics) */
  setField: (key: string, value: any) => void;
  /** bulk-merge a slice of state (great for edit hydration) */
  setBulk: (data: Partial<PostFormState>) => void;
  /** convenience for setting multiple primitives at once */
  setMany: (data: Partial<PostFormState>) => void;

  /** toggle a facility in the facilities[] list */
  toggleFacility: (facility: string) => void;

  /** nested helpers */
  updateSellerInfo: (patch: Partial<SellerInfo>) => void;
  updateLocation: (patch: Partial<Location>) => void;

  /** image helpers */
  setImages: (imgs: (File | string)[]) => void;
  addImage: (img: File | string) => void;
  removeImage: (index: number) => void;

  /** reset the whole wizard back to defaults */
  reset: () => void;
};

const defaultState: Omit<
  PostFormState,
  | "setField"
  | "setBulk"
  | "setMany"
  | "toggleFacility"
  | "updateSellerInfo"
  | "updateLocation"
  | "setImages"
  | "addImage"
  | "removeImage"
  | "reset"
> = {
  category: "",
  subcategory: "",
  name: "",
  description: "",
  sellerInfo: { name: "", email: "", phone: "" },
  images: [],
  location: { address: "" },
  facilities: [],

  // edit wiring defaults
  editMode: false,
  postId: undefined,
};

export const usePostFormStore = create<PostFormState>()(
  persist(
    (set, get) =>
      ({
        ...defaultState,

        setField: (key, value) =>
          set((s) => ({
            ...s,
            [key]: value,
          })),

        setBulk: (data) =>
          set((s) => ({
            ...s,
            ...data,
          })),

        setMany: (data) =>
          set((s) => ({
            ...s,
            ...data,
          })),

        toggleFacility: (facility) =>
          set((s) => ({
            facilities: s.facilities.includes(facility)
              ? s.facilities.filter((f) => f !== facility)
              : [...s.facilities, facility],
          })),

        updateSellerInfo: (patch) =>
          set((s) => ({
            sellerInfo: { ...s.sellerInfo, ...patch },
          })),

        updateLocation: (patch) =>
          set((s) => ({
            location: { ...s.location, ...patch },
          })),

        setImages: (imgs) => set(() => ({ images: imgs })),
        addImage: (img) => set((s) => ({ images: [...s.images, img] })),
        removeImage: (index) =>
          set((s) => ({
            images: s.images.filter((_, i) => i !== index),
          })),

        reset: () => set(() => ({ ...defaultState })),
      } as PostFormState),

    {
      name: "post-form-store",
      // Persist progress across refresh, but avoid storing File objects
      partialize: (state) => {
        const safeImages = state.images.filter(
          (i): i is string => typeof i === "string"
        );

        return {
          // core
          category: state.category,
          subcategory: state.subcategory,
          name: state.name,
          description: state.description,
          sellerInfo: state.sellerInfo,
          images: safeImages, // only string URLs are persisted
          location: state.location,
          facilities: state.facilities,

          // edit wiring
          editMode: state.editMode,
          postId: state.postId,

          // any extra primitive fields you set during forms will also persist
          // because of the index signature; add them here explicitly if needed
          // e.g. price: state.price, make: state.make, etc.
        } as Partial<PostFormState>;
      },
    }
  )
);
