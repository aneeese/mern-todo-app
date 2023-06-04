import { create } from 'zustand';

const useUserStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,

  setUser: (user) => {
    set({ user });
    localStorage.setItem('user', JSON.stringify(user));
  },

  clearUser: () => {
    set({ user: null });
    localStorage.removeItem('user');
  },

  logout: () => {
    // Clear the user data
    set({ user: null });
    localStorage.removeItem('user');
  },
}));

export default useUserStore;
