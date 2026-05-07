"use client";

import { useEffect, useState } from "react";
import { useSettingsStore } from "@/store/useSettingsStore";
import GlobalAudioPlayer from "@/components/audio/AudioPlayer";
import SplashScreen from "@/components/layout/SplashScreen";

export default function QuranProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useSettingsStore();
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    // Clean up old auth data from localStorage
    localStorage.removeItem("quran-auth");

    const root = document.documentElement;
    root.classList.toggle("light", theme === "light");
    root.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    const timer = setTimeout(() => setSplashDone(true), 1800);
    return () => clearTimeout(timer);
  }, []);

  if (!splashDone) return <SplashScreen />;

  return (
    <>
      {children}
      <GlobalAudioPlayer />
    </>
  );
}
