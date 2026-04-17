import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  arabicFont: "amiri" | "scheherazade";
  arabicFontSize: number;
  translationFontSize: number;
  theme: "light" | "dark";
  arabicScript: "uthmani" | "indopak";
  setArabicFont: (font: "amiri" | "scheherazade") => void;
  setArabicFontSize: (size: number) => void;
  setTranslationFontSize: (size: number) => void;
  setTheme: (theme: "light" | "dark") => void;
  setArabicScript: (script: "uthmani" | "indopak") => void;
  toggleTheme: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      arabicFont: "amiri",
      arabicFontSize: 32,
      translationFontSize: 16,
      theme: "light",
      arabicScript: "uthmani",
      setArabicFont: (font) => set({ arabicFont: font }),
      setArabicFontSize: (size) => set({ arabicFontSize: size }),
      setTranslationFontSize: (size) => set({ translationFontSize: size }),
      setTheme: (theme) => set({ theme }),
      setArabicScript: (script) => set({ arabicScript: script }),
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
    }),
    {
      name: "quran-settings",
    }
  )
);
