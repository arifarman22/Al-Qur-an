"use client";

import { useEffect, useState } from "react";
import { useSettingsStore } from "@/store/useSettingsStore";
import GlobalSurahPlayer from "@/components/audio/GlobalSurahPlayer";
import SplashScreen from "@/components/layout/SplashScreen";

export default function QuranProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useSettingsStore();
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    localStorage.removeItem("quran-auth");
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.classList.remove("light");
  }, [theme]);

  useEffect(() => {
    const timer = setTimeout(() => setSplashDone(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!splashDone) return <SplashScreen />;

  return (
    <>
      {children}
      <GlobalSurahPlayer />
    </>
  );
}
