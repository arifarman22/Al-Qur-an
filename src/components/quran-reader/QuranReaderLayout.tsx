"use client";

import { useState } from "react";
import IconSidebar from "./IconSidebar";
import SurahSidebar from "./SurahSidebar";
import ReaderHeader from "./ReaderHeader";
import FontSettingsPanel from "./FontSettingsPanel";

interface Props {
  children: React.ReactNode;
  surahName?: string;
  surahArabic?: string;
  ayahCount?: number;
  revelationPlace?: string;
}

export default function QuranReaderLayout({ children, surahName, surahArabic, ayahCount, revelationPlace }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Icon Sidebar (desktop only) */}
      <IconSidebar />

      {/* Surah Sidebar */}
      <SurahSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <ReaderHeader
          surahName={surahName}
          surahArabic={surahArabic}
          ayahCount={ayahCount}
          revelationPlace={revelationPlace}
          onMenuClick={() => setSidebarOpen(true)}
          onSettingsClick={() => setSettingsOpen(true)}
        />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Font Settings Panel */}
      <FontSettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
