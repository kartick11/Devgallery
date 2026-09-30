// src/stores/organizer.store.js
import { create } from "zustand";

export const useOrganizerStore = create((set) => ({
  // Initial State
  pendingProjects: [],
  approvedProjects: [],
  profile: null,
  isLoading: false,
  error: null,

  // Actions
  setLoading: (isLoading) => set({ isLoading }),
  
  setDashboardData: (pending, approved) => set({ 
    pendingProjects: pending, 
    approvedProjects: approved, 
    isLoading: false, 
    error: null 
  }),

  setProfile: (profile) => set({ 
    profile, 
    isLoading: false, 
    error: null 
  }),

  setPendingDeletion: (date) => set((state) => ({
    profile: state.profile 
      ? { ...state.profile, isPendingDeletion: true, deletionScheduledAt: date } 
      : null
  })),
  
  setError: (error) => set({ 
    error, 
    isLoading: false 
  }),
  
  clearOrganizerData: () => set({ 
    pendingProjects: [], 
    approvedProjects: [], 
    profile: null, 
    error: null 
  }),
}));