'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import type {
  GeneralInfoForm,
  PhoneForm,
  ProfileForm,
} from '@/lib/validators';

type RegisterState = {
  /* ------------------------------------------------ */
  /* GENERAL INFO                                     */
  /* ------------------------------------------------ */

  general: GeneralInfoForm;

  updateGeneral: (
    data: Partial<GeneralInfoForm>
  ) => void;

  /* ------------------------------------------------ */
  /* EMAIL VERIFICATION                               */
  /* ------------------------------------------------ */

  emailVerified: boolean;

  setEmailVerified: (
    v: boolean
  ) => void;

  /* ✅ NEW */
  verifiedEmail: string;

  /* ✅ NEW */
  setVerifiedEmail: (
    email: string
  ) => void;

  /* ------------------------------------------------ */
  /* PHONE                                            */
  /* ------------------------------------------------ */

  phones: PhoneForm;

  updatePhones: (
    data: Partial<PhoneForm>
  ) => void;

  phoneVerified: boolean;

  setPhoneVerified: (
    v: boolean
  ) => void;

  /* ------------------------------------------------ */
  /* PROFILE                                          */
  /* ------------------------------------------------ */

  profile: ProfileForm;

  updateProfile: (
    data: Partial<ProfileForm>
  ) => void;

  /* ------------------------------------------------ */
  /* RESET                                            */
  /* ------------------------------------------------ */

  reset: () => void;

  /* ------------------------------------------------ */
  /* META                                             */
  /* ------------------------------------------------ */

  _metaLastUpdated: number | null;

  _metaStorageType: 'session';
};

/* ------------------------------------------------ */
/* CLEANUP LEGACY STORAGE                           */
/* ------------------------------------------------ */

if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem('register-store');
  } catch {}
}

/* ------------------------------------------------ */
/* STORE                                            */
/* ------------------------------------------------ */

export const useRegisterStore =
  create<RegisterState>()(
    persist(
      (set) => ({
        /* ------------------------------------------------ */
        /* GENERAL                                           */
        /* ------------------------------------------------ */

        general: {
          fullName: '',
          dateOfBirth: '',
          gender: '',
          email: '',

          nationality: '',
          country: '',
          state: '',
          residency: '',
        },

        updateGeneral: (data) =>
          set((state) => ({
            general: {
              ...state.general,
              ...data,
            },

            _metaLastUpdated:
              Date.now(),
          })),

        /* ------------------------------------------------ */
        /* EMAIL                                             */
        /* ------------------------------------------------ */

        emailVerified: false,

        setEmailVerified: (v) =>
          set({
            emailVerified: v,

            _metaLastUpdated:
              Date.now(),
          }),

        /* ✅ NEW */
        verifiedEmail: '',

        /* ✅ NEW */
        setVerifiedEmail: (email) =>
          set({
            verifiedEmail:
              email.toLowerCase(),

            _metaLastUpdated:
              Date.now(),
          }),

        /* ------------------------------------------------ */
        /* PHONE                                             */
        /* ------------------------------------------------ */

        phones: {
          primaryNumber: '',
          secondaryNumber1: '',
          secondaryNumber2: '',
        },

        updatePhones: (data) =>
          set((state) => ({
            phones: {
              ...state.phones,
              ...data,
            },

            _metaLastUpdated:
              Date.now(),
          })),

        phoneVerified: false,

        setPhoneVerified: (v) =>
          set({
            phoneVerified: v,

            _metaLastUpdated:
              Date.now(),
          }),

        /* ------------------------------------------------ */
        /* PROFILE                                           */
        /* ------------------------------------------------ */

        profile: {
          username: '',
          password: '',
          role: '',
        },

        updateProfile: (data) =>
          set((state) => ({
            profile: {
              ...state.profile,
              ...data,
            },

            _metaLastUpdated:
              Date.now(),
          })),

        /* ------------------------------------------------ */
        /* RESET                                             */
        /* ------------------------------------------------ */

        reset: () =>
          set({
            general: {
              fullName: '',
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

            /* ✅ RESET */
            verifiedEmail: '',

            phoneVerified: false,

            _metaLastUpdated: null,

            _metaStorageType:
              'session',
          }),

        /* ------------------------------------------------ */
        /* META                                              */
        /* ------------------------------------------------ */

        _metaLastUpdated: null,

        _metaStorageType: 'session',
      }),

      {
        name: 'register-store',

        storage:
          createJSONStorage(
            () => sessionStorage
          ),

        version: 4,
      }
    )
  );