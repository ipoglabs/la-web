'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { GeneralInfoForm, PhoneForm, ProfileForm } from '@/lib/validators';

type RegisterState = {
  general: GeneralInfoForm;
  updateGeneral: (data: Partial<GeneralInfoForm>) => void;

  emailVerified: boolean;
  setEmailVerified: (v: boolean) => void;

  phones: PhoneForm;
  updatePhones: (data: Partial<PhoneForm>) => void;
  phoneVerified: boolean;
  setPhoneVerified: (v: boolean) => void;

  profile: ProfileForm;
  updateProfile: (data: Partial<ProfileForm>) => void;

  reset: () => void;

  _metaLastUpdated: number | null;
  _metaStorageType: 'session';
};

// One-time cleanup in the browser: remove any legacy localStorage copy
if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem('register-store');
  } catch {}
}

export const useRegisterStore = create<RegisterState>()(
  persist(
    (set) => ({
      general: {
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        email: '',
        // ✅ Optional fields initialized to empty string
        nationality: '',
        country: '',
        state: '',
        residency: '',
      },

      phones: {
        primaryNumber: '',
        secondaryNumber1: '',
        secondaryNumber2: '',
      },

      profile: {
        username: '',
        password: '',
        role: '',
      },

      emailVerified: false,
      phoneVerified: false,

      updateGeneral: (data) =>
        set((state) => ({
          general: { ...state.general, ...data },
          _metaLastUpdated: Date.now(),
        })),

      updatePhones: (data) =>
        set((state) => ({
          phones: { ...state.phones, ...data },
          _metaLastUpdated: Date.now(),
        })),

      updateProfile: (data) =>
        set((state) => ({
          profile: { ...state.profile, ...data },
          _metaLastUpdated: Date.now(),
        })),

      setEmailVerified: (v) => set({ emailVerified: v, _metaLastUpdated: Date.now() }),
      setPhoneVerified: (v) => set({ phoneVerified: v, _metaLastUpdated: Date.now() }),

      reset: () =>
        set({
          general: {
            firstName: '',
            lastName: '',
            dateOfBirth: '',
            gender: '',
            email: '',
            nationality: '',
            country: '',
            state: '',
            residency: '',
          },
          phones: {
            primaryNumber: '',
            secondaryNumber1: '',
            secondaryNumber2: '',
          },
          profile: {
            username: '',
            password: '',
            role: '',
          },
          emailVerified: false,
          phoneVerified: false,
          _metaLastUpdated: null,
          _metaStorageType: 'session',
        }),

      _metaLastUpdated: null,
      _metaStorageType: 'session',
    }),
    {
      name: 'register-store',
      storage: createJSONStorage(() => sessionStorage),
      version: 3, // 🔁 bump to avoid stale shapes in session
    }
  )
);
