// src/stores/project.store.js
import { create } from 'zustand';

export const useProjectStore = create((set) => ({
  // --------------------------------------------------------
  // My Projects State
  // --------------------------------------------------------
  myProjects: [],
  setMyProjects: (projects) => set({ myProjects: projects }),
  removeProject: (projectId) => set((state) => ({
    myProjects: state.myProjects.filter((project) => project._id !== projectId)
  })),

  // --------------------------------------------------------
  // Feed Projects State
  // --------------------------------------------------------
  feedProjects: [],
  setFeedProjects: (projects) => set({ feedProjects: projects }),

  // --------------------------------------------------------
  // Single/Current Project State
  // --------------------------------------------------------
  currentProject: null,
  isProjectLoading: true,
  projectError: null,

  setCurrentProject: (project) => set({ 
    currentProject: project, 
    isProjectLoading: false, 
    projectError: null 
  }),
  
  setProjectLoading: (isLoading) => set({ 
    isProjectLoading: isLoading 
  }),
  
  setProjectError: (error) => set({ 
    projectError: error, 
    isProjectLoading: false 
  }),
  
  clearCurrentProject: () => set({ 
    currentProject: null, 
    projectError: null,
    isProjectLoading: true 
  }),

  // --------------------------------------------------------
  // Search Projects State
  // --------------------------------------------------------
  searchResults: [],
  isSearchLoading: true,
  searchError: null,

  setSearchResults: (projects) => set({ 
    searchResults: projects, 
    isSearchLoading: false, 
    searchError: null 
  }),
  
  setSearchLoading: (isLoading) => set({ 
    isSearchLoading: isLoading 
  }),
  
  setSearchError: (error) => set({ 
    searchError: error, 
    isSearchLoading: false 
  }),
}));