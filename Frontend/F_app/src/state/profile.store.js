// src/stores/profile.store.js
import { create } from 'zustand';

export const useProfileStore = create((set) => ({
  profile: null,
  isProfileLoading: true,
  profileError: null,

  setProfileData: (profile) => set({
    profile,
    isProfileLoading: false,
    profileError: null
  }),

  setProfileLoading: (isLoading) => set({
    isProfileLoading: isLoading
  }),

  setProfileError: (error) => set({
    profileError: error,
    isProfileLoading: false
  }),

  clearProfile: () => set({
    profile: null,
    profileError: null,
    isProfileLoading: true
  })
}));