import { create } from 'zustand';

export const useAdminStore = create((set) => ({
  pendingOrganizers: [],
  approvedOrganizers: [],
  
  setPendingOrganizers: (organizers) => set({ pendingOrganizers: organizers }),
  setApprovedOrganizers: (organizers) => set({ approvedOrganizers: organizers }),
  
  removePendingOrganizer: (id) => set((state) => ({
    pendingOrganizers: state.pendingOrganizers.filter(org => org._id !== id)
  })),
}));