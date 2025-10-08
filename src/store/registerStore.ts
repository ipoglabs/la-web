// store/registerStore.ts
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { GeneralInfoForm, PhoneForm, ProfileForm } from '@/lib/validators';

type RegisterState = {
  // Step 1 – General Info
  general: GeneralInfoForm;
  updateGeneral: (data: Partial<GeneralInfoForm>) => void;

  // Step 2 – Email
  emailVerified: boolean;
  setEmailVerified: (v: boolean) => void;

  // Step 3 – Phone
  phones: PhoneForm;
  updatePhones: (data: Partial<PhoneForm>) => void;
  phoneVerified: boolean;
  setPhoneVerified: (v: boolean) => void;

  // Step 4 – Profile
  profile: ProfileForm;
  updateProfile: (data: Partial<ProfileForm>) => void;

  // Reset entire flow
  reset: () => void;
};

export const useRegisterStore = create<RegisterState>()(
  persist(
    (set) => ({
      general: {
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        nationality: '',
        residency: '',
        email: '',
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
        set((state) => ({ general: { ...state.general, ...data } })),

      updatePhones: (data) =>
        set((state) => ({ phones: { ...state.phones, ...data } })),

      updateProfile: (data) =>
        set((state) => ({ profile: { ...state.profile, ...data } })),

      setEmailVerified: (v) => set({ emailVerified: v }),
      setPhoneVerified: (v) => set({ phoneVerified: v }),

      reset: () =>
        set({
          general: {
            firstName: '',
            lastName: '',
            dateOfBirth: '',
            gender: '',
            nationality: '',
            residency: '',
            email: '',
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
        }),
    }),
    {
      name: 'register-store', // key in localStorage
      partialize: (state) => ({
        general: state.general,
        phones: state.phones,
        profile: state.profile,
        emailVerified: state.emailVerified,
        phoneVerified: state.phoneVerified,
      }),
    }
  )
);
