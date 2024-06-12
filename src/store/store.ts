import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import firebase from "firebase/auth";

type UserStore = {
  user: firebase.User | null;
  setUser: (user: firebase.User) => void;
  signOut: () => void;
  setDisplayName: (displayName: string) => void;
};

const useUserStore = create<UserStore>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        setUser: (user: firebase.User) => set({ user }),
        signOut: () => set({ user: null }),
        setDisplayName: (displayName: string) =>
          set({ user: { ...get(), displayName } }),
      }),
      {
        name: "user-store",
      }
    )
  )
);

export { useUserStore };
