import { create } from "zustand";

const useUserStore = create((set) => ({
  username: null,
  role: null,

  setUser: ({ username, role }) => set({ username, role }),

  clearUser: () => set({ username: null, role: null }),
}));

export default useUserStore;
