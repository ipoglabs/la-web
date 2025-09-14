// src/app/post/store/postFormStore.ts
"use client";

import { create } from "zustand";

export type SellerInfo = { name: string; email: string; phone: string };
export type Location = { address: string; lat?: number; lng?: number };

export type PostFormState = {
  category: string;
  subcategory: string;
  name: string;
  description: string;
  sellerInfo: SellerInfo;
  images: (File | string)[];
  location: Location;
  facilities: string[];

  // generic extras from forms
  [key: string]: any;

  setField: (key: string, value: any) => void;
  toggleFacility: (facility: string) => void;
  reset: () => void;
};

const defaultState: Omit<
  PostFormState,
  "setField" | "toggleFacility" | "reset"
> = {
  category: "",
  subcategory: "",
  name: "",
  description: "",
  sellerInfo: { name: "", email: "", phone: "" },
  images: [],
  location: { address: "" },
  facilities: [],
};

export const usePostFormStore = create<PostFormState>()((set, get) =>
  ({
    ...defaultState,
    setField: (key, value) => set((s) => ({ ...s, [key]: value })),
    toggleFacility: (facility) =>
      set((s) => ({
        facilities: s.facilities.includes(facility)
          ? s.facilities.filter((f) => f !== facility)
          : [...s.facilities, facility],
      })),
    reset: () => set(() => ({ ...defaultState })),
  } as PostFormState)
);

