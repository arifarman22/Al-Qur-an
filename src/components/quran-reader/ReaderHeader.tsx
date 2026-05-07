"use client";

import { useSettingsStore } from "@/store/useSettingsStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { cn } from "@/utils/utils";

interface Props {
  surahName?: string;
  surahArabic?: string;
  ayahCount?: number;
  revelationPlace?: string;
  onMenuClick?: () => void;
  onSettingsClick?: () => void;
}

export default function ReaderHeader({ surahName, surahArabic, ayahCount, revelationPlace, onMenuClick, onSettingsClick }: Props) {
  const { theme, toggleTheme } = useSettingsStore();
  const { user, logout } = useAuthStore();
  const router = useRouter();

  return (
    <header className="h-14 bg-surface border-b border-border flex items-center px-4 gap-4 shrink-0 sticky top-0 z-30">
      {/* Mobile menu button */}
      <button onClick={onMenuClick} className="md:hidden p-2 rounded-lg text-muted hover:text-foreground hover:bg-surface-hover transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      {/* Surah info */}
      {surahName && (
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-semibold truncate">{surahName}</h1>
            {surahArabic && <span className="text-sm text-primary font-bold" style={{ fontFamily: "var(--font-amiri)" }}>{surahArabic}</span>}
          </div>
          <p className="text-[11px] text-muted">
            {ayahCount && `${ayahCount} Ayahs`}{revelationPlace && ` · ${revelationPlace}`}
          </p>
        </div>
      )}

      {!surahName && <div className="flex-1" />}

      {/* Actions */}
      <div className="flex items-center gap-1">
        {/* Settings */}
        <button onClick={onSettingsClick} className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-surface-hover transition-colors" title="Font Settings">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        {/* Theme toggle */}
        <button onClick={toggleTheme} className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-surface-hover transition-colors" title="Toggle theme">
          {theme === "dark" ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
            </svg>
          )}
        </button>

        {/* User */}
        {user && (
          <button onClick={() => router.push("/profile")} className="w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-bold ml-1">
            {user.name[0].toUpperCase()}
          </button>
        )}
      </div>
    </header>
  );
}
