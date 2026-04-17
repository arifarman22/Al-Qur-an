"use client";

import { useEffect, useState } from "react";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useAuthStore } from "@/store/useAuthStore";
import GlobalAudioPlayer from "@/components/audio/AudioPlayer";

export default function QuranProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useSettingsStore();
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    checkAuth().finally(() => setMounted(true));
  }, [checkAuth]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  if (!mounted) return <div className="min-h-screen bg-background" />;

  return (
    <>
      {children}
      <GlobalAudioPlayer />
    </>
  );
}
