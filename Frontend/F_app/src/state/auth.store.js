import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: localStorage.getItem("loggedInUser") || null,
  role: localStorage.getItem("user") || null,
  token: localStorage.getItem("token") || null,
  
  setCredentials: (user, role, token) => {
    localStorage.setItem("loggedInUser", user);
    localStorage.setItem("user", role);
    localStorage.setItem("token", token);
    set({ user, role, token });
  },
  
  clearCredentials: () => {
    localStorage.clear();
    set({ user: null, role: null, token: null });
  }
}));