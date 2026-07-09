import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, AuthTokens } from "@juice-vibe/types";

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, tokens: AuthTokens) => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      setAuth: (user, tokens) => set({ user, tokens, isAuthenticated: true }),
      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ user: null, tokens: null, isAuthenticated: false }),
    }),
    { name: "juice-vibe-auth", partialize: (state) => ({ tokens: state.tokens }) }
  )
);
