import { create } from "zustand";

const useUserStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  loading: false,

  setUser: (user) => {
    set({ user });
    localStorage.setItem("user", JSON.stringify(user));
  },

  clearUser: () => {
    set({ user: null });
    localStorage.removeItem("user");
  },

  logout: () => {
    set({ user: null });
    localStorage.removeItem("user");
  },

  startLoading: () => {
    set({ loading: true });
  },

  stopLoading: () => {
    set({ loading: false });
  },
}));

export default useUserStore;
