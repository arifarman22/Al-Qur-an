"use client";

import { useEffect, useState } from "react";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useAuthStore } from "@/store/useAuthStore";
import GlobalAudioPlayer from "@/components/audio/AudioPlayer";
import SplashScreen from "@/components/layout/SplashScreen";

export default function QuranProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useSettingsStore();
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const [ready, setReady] = useState(false);
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    checkAuth().finally(() => setReady(true));
  }, [checkAuth]);

  useEffect(() => {
    const root = document.documentElement;
    // Dark is default in CSS, so we add 'light' class for light mode
    root.classList.toggle("light", theme === "light");
    root.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    const timer = setTimeout(() => setSplashDone(true), 1800);
    return () => clearTimeout(timer);
  }, []);

  if (!ready || !splashDone) return <SplashScreen />;

  return (
    <>
      {children}
      <GlobalAudioPlayer />
    </>
  );
}
