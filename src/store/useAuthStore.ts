import { create } from "zustand";
import { apiLogin, apiRegister, apiLogout, apiGetMe, type AuthUser } from "@/utils/api";

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  loading: true,
  error: null,

  login: async (email, password) => {
    set({ error: null });
    try {
      const user = await apiLogin(email, password);
      set({ user });
      return true;
    } catch (err: any) {
      set({ error: err.message });
      return false;
    }
  },

  register: async (name, email, password) => {
    set({ error: null });
    try {
      const user = await apiRegister(name, email, password);
      set({ user });
      return true;
    } catch (err: any) {
      set({ error: err.message });
      return false;
    }
  },

  logout: async () => {
    await apiLogout().catch(() => {});
    set({ user: null });
  },

  checkAuth: async () => {
    try {
      const user = await apiGetMe();
      set({ user, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
