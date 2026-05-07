"use client";

import { useEffect, useState, use } from "react";
import { apiGetSurahs, apiGetSurah, apiGetAyahs, type SurahDTO, type AyahDTO } from "@/utils/api";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useAudioStore } from "@/store/useAudioStore";
import { useBookmarkStore } from "@/store/useBookmarkStore";
import { cn } from "@/utils/utils";
import { toast } from "sonner";
import Link from "next/link";
import { Home, BookOpen, Search, Bookmark, Moon, Sun, Play, Pause, Copy, Menu, X, ChevronLeft, ChevronRight, Settings, Type } from "lucide-react";

export default function SurahPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const settings = useSettingsStore();
  const { currentAyahId, isPlaying, setCurrentAyah, setIsPlaying } = useAudioStore();
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarkStore();

  const [surahs, setSurahs] = useState<SurahDTO[]>([]);
  const [surah, setSurah] = useState<SurahDTO | null>(null);
  const [ayahs, setAyahs] = useState<AyahDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [rightTab, setRightTab] = useState<"translation" | "reading">("translation");
  const [surahSearch, setSurahSearch] = useState("");

  const fontFamily = settings.arabicFont === "amiri" ? "var(--font-amiri)" : "var(--font-scheherazade)";

  useEffect(() => { apiGetSurahs().then(setSurahs).catch(() => {}); }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([apiGetSurah(+id), apiGetAyahs(+id, settings.arabicScript)])
      .then(([s, a]) => { setSurah(s); setAyahs(a); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id, settings.arabicScript]);

  const filteredSurahs = surahs.filter((s) =>
    s.name_simple.toLowerCase().includes(surahSearch.toLowerCase()) || s.id.toString() === surahSearch
  );

  const prevSurah = +id > 1 ? +id - 1 : null;
  const nextSurah = +id < 114 ? +id + 1 : null;

  return (
    <div className="flex h-screen overflow-hidden bg-background">

      {/* ═══ LEFT: ICON SIDEBAR (desktop) ═══ */}
      <aside className="hidden md:flex flex-col items-center w-14 bg-surface border-r border-border py-3 shrink-0 h-screen">
        <Link href="/" className="w-9 h-9 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center mb-6">
          <span className="text-white text-sm font-bold" style={{ fontFamily: "var(--font-amiri)" }}>ق</span>
        </Link>
        {[
          { icon: Home, href: "/", label: "Home" },
          { icon: BookOpen, href: "#", label: "Read", active: true },
          { icon: Search, href: "/search", label: "Search" },
          { icon: Bookmark, href: "/bookmarks", label: "Bookmarks" },
        ].map((item, i) => (
          <Link key={i} href={item.href}
            className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-1 transition-colors", item.active ? "bg-primary/15 text-primary" : "text-muted hover:text-foreground hover:bg-surface-alt")}>
            <item.icon size={18} />
          </Link>
        ))}
        <div className="mt-auto space-y-1">
          <button onClick={() => setRightPanelOpen(!rightPanelOpen)} className="w-10 h-10 rounded-xl flex items-center justify-center text-muted hover:text-foreground hover:bg-surface-alt transition-colors">
            <Settings size={18} />
          </button>
          <button onClick={settings.toggleTheme} className="w-10 h-10 rounded-xl flex items-center justify-center text-muted hover:text-foreground hover:bg-surface-alt transition-colors">
            {settings.theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </aside>

      {/* ═══ LEFT: SURAH SIDEBAR ═══ */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside className={cn(
        "w-64 bg-surface border-r border-border h-screen flex flex-col shrink-0 z-50 transition-transform",
        "max-md:fixed max-md:left-0 max-md:top-0",
        sidebarOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full"
      )}>
        <div className="p-3 border-b border-border">
          <h2 className="text-sm font-bold mb-2">Surahs</h2>
          <input type="text" placeholder="Search..." value={surahSearch} onChange={(e) => setSurahSearch(e.target.value)} className="w-full text-xs" />
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredSurahs.map((s) => (
            <Link key={s.id} href={`/surah/${s.id}`} onClick={() => setSidebarOpen(false)}
              className={cn("flex items-center gap-2.5 px-3 py-2 border-b border-border/50 transition-colors text-sm",
                +id === s.id ? "bg-primary/10 border-l-2 border-l-primary" : "hover:bg-surface-alt")}>
              <span className={cn("w-7 h-7 rounded-md flex items-center justify-center text-[11px] font-bold shrink-0",
                +id === s.id ? "bg-primary text-white" : "bg-surface-alt text-muted")}>{s.id}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate text-xs">{s.name_simple}</p>
                <p className="text-[10px] text-muted truncate">{s.translated_name.name}</p>
              </div>
              <p className="text-xs text-primary font-bold shrink-0" style={{ fontFamily: "var(--font-amiri)" }}>{s.name_arabic}</p>
            </Link>
          ))}
        </div>
      </aside>

      {/* ═══ CENTER: AYAH READER ═══ */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Bar */}
        <header className="h-12 bg-surface border-b border-border flex items-center px-4 gap-3 shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden p-1.5 rounded-lg text-muted hover:text-foreground"><Menu size={18} /></button>
          {surah && <div className="flex-1 min-w-0"><h1 className="text-sm font-semibold truncate">{surah.name_simple} <span className="text-muted font-normal">· {surah.verses_count} ayahs · {surah.revelation_place}</span></h1></div>}
          <div className="flex items-center gap-1">
            {prevSurah && <Link href={`/surah/${prevSurah}`} className="p-1.5 rounded-lg text-muted hover:text-foreground"><ChevronLeft size={16} /></Link>}
            {nextSurah && <Link href={`/surah/${nextSurah}`} className="p-1.5 rounded-lg text-muted hover:text-foreground"><ChevronRight size={16} /></Link>}
            <button onClick={() => setRightPanelOpen(!rightPanelOpen)} className="p-1.5 rounded-lg text-muted hover:text-foreground md:hidden"><Type size={16} /></button>
          </div>
        </header>

        {/* Ayahs */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-6 space-y-4">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-28 bg-surface-alt rounded-xl animate-pulse" />)}</div>
          ) : surah && (
            <>
              {/* Surah Header */}
              <div className="text-center py-5 border-b border-border">
                <h2 className="text-lg font-bold">{surah.name_simple}</h2>
                <p className="text-2xl text-primary mt-1" style={{ fontFamily }}>{surah.name_arabic}</p>
                <p className="text-xs text-muted mt-1 capitalize">{surah.revelation_place} · {surah.verses_count} Ayahs</p>
              </div>

              {surah.id !== 1 && surah.id !== 9 && (
                <div className="text-center py-4 border-b border-border">
                  <p className="text-xl" style={{ fontFamily }}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
                </div>
              )}

              {ayahs.map((ayah) => {
                const isCurrent = currentAyahId === ayah.verse_key;
                const bookmarked = isBookmarked(ayah.verse_key);
                const arabicText = settings.arabicScript === "indopak" && ayah.text_indopak ? ayah.text_indopak : ayah.text_uthmani || "";

                return (
                  <div key={ayah.id} className={cn("px-4 py-5 md:px-6 border-b border-border group", isCurrent && "bg-primary/5")}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="w-7 h-7 rounded-md bg-primary/10 text-primary flex items-center justify-center text-[11px] font-bold border border-primary/20">{ayah.verse_number}</span>
                      <div className="flex gap-0.5 opacity-40 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { if (isCurrent && isPlaying) setIsPlaying(false); else if (ayah.audio_url) setCurrentAyah(ayah.verse_key, surah.id, ayah.audio_url); }}
                          disabled={!ayah.audio_url}
                          className={cn("w-7 h-7 rounded-md flex items-center justify-center", isCurrent && isPlaying ? "bg-primary text-white" : "text-muted hover:text-primary hover:bg-primary/10")}>
                          {isCurrent && isPlaying ? <Pause size={13} /> : <Play size={13} />}
                        </button>
                        <button onClick={() => { if (bookmarked) removeBookmark(ayah.verse_key); else addBookmark({ verseKey: ayah.verse_key, surahId: surah.id, surahName: surah.name_simple, ayahNumber: ayah.verse_number }); toast.success(bookmarked ? "Removed" : "Bookmarked"); }}
                          className={cn("w-7 h-7 rounded-md flex items-center justify-center", bookmarked ? "text-accent" : "text-muted hover:text-accent")}>
                          <Bookmark size={13} fill={bookmarked ? "currentColor" : "none"} />
                        </button>
                        <button onClick={() => { navigator.clipboard.writeText(arabicText); toast.success("Copied"); }}
                          className="w-7 h-7 rounded-md flex items-center justify-center text-muted hover:text-foreground"><Copy size={13} /></button>
                      </div>
                    </div>
                    <p className="text-right leading-[2.4]" dir="rtl" style={{ fontSize: `${settings.arabicFontSize}px`, fontFamily }}>{arabicText}</p>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>

      {/* ═══ RIGHT: TRANSLATION + SETTINGS PANEL ═══ */}
      {rightPanelOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setRightPanelOpen(false)} />}
      <aside className={cn(
        "w-80 bg-surface border-l border-border h-screen flex flex-col shrink-0 z-50 transition-transform",
        "max-md:fixed max-md:right-0 max-md:top-0",
        rightPanelOpen ? "max-md:translate-x-0" : "max-md:translate-x-full",
        "hidden md:flex"
      )} style={{ display: rightPanelOpen ? "flex" : undefined }}>
        {/* Tabs */}
        <div className="flex border-b border-border shrink-0">
          <button onClick={() => setRightTab("translation")}
            className={cn("flex-1 py-3 text-sm font-medium transition-colors", rightTab === "translation" ? "text-primary border-b-2 border-primary" : "text-muted hover:text-foreground")}>
            Translation
          </button>
          <button onClick={() => setRightTab("reading")}
            className={cn("flex-1 py-3 text-sm font-medium transition-colors", rightTab === "reading" ? "text-primary border-b-2 border-primary" : "text-muted hover:text-foreground")}>
            Reading
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {rightTab === "translation" ? (
            /* Translation Tab — shows translations for each ayah */
            <div className="space-y-4">
              {ayahs.map((ayah) => {
                const english = ayah.translations?.find((t) => t.resource_id === 131)?.text || "";
                const bengali = ayah.translations?.find((t) => t.resource_id === 161)?.text || "";
                return (
                  <div key={ayah.id} className="pb-4 border-b border-border/50">
                    <span className="text-[10px] font-bold text-primary">{ayah.verse_key}</span>
                    {english && <p className="text-muted leading-relaxed mt-1" style={{ fontSize: `${settings.translationFontSize}px` }} dangerouslySetInnerHTML={{ __html: english }} />}
                    {bengali && <p className="text-muted leading-relaxed mt-2" style={{ fontSize: `${settings.translationFontSize}px`, fontFamily: "var(--font-kalpurush)" }} dangerouslySetInnerHTML={{ __html: bengali }} />}
                  </div>
                );
              })}
            </div>
          ) : (
            /* Reading Settings Tab */
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold mb-4">Reading Settings</h3>
              </div>

              {/* Font Settings */}
              <div>
                <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Font Settings</h4>

                {/* Arabic Font Size */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted">Arabic Font Size</span>
                    <span className="font-bold text-primary">{settings.arabicFontSize}</span>
                  </div>
                  <input type="range" min="20" max="56" value={settings.arabicFontSize} onChange={(e) => settings.setArabicFontSize(+e.target.value)} className="w-full" />
                </div>

                {/* Translation Font Size */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted">Translation Font Size</span>
                    <span className="font-bold text-primary">{settings.translationFontSize}</span>
                  </div>
                  <input type="range" min="12" max="24" value={settings.translationFontSize} onChange={(e) => settings.setTranslationFontSize(+e.target.value)} className="w-full" />
                </div>

                {/* Arabic Font Face */}
                <div className="mb-4">
                  <p className="text-sm text-muted mb-2">Arabic Font Face</p>
                  <div className="space-y-2">
                    {([["amiri", "Amiri"], ["scheherazade", "Scheherazade"]] as const).map(([key, label]) => (
                      <button key={key} onClick={() => settings.setArabicFont(key)}
                        className={cn("w-full text-left px-4 py-3 rounded-xl border transition-all", settings.arabicFont === key ? "border-primary bg-primary/5" : "border-border hover:border-primary/30")}>
                        <p className="text-lg" style={{ fontFamily: key === "amiri" ? "var(--font-amiri)" : "var(--font-scheherazade)" }}>بِسْمِ اللَّهِ الرَّحْمَٰنِ</p>
                        <p className="text-xs text-muted mt-1">{label}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Script */}
                <div className="mb-4">
                  <p className="text-sm text-muted mb-2">Quran Script</p>
                  <div className="flex gap-2">
                    {(["uthmani", "indopak"] as const).map((sc) => (
                      <button key={sc} onClick={() => settings.setArabicScript(sc)}
                        className={cn("flex-1 py-2.5 text-sm rounded-xl border capitalize font-medium", settings.arabicScript === sc ? "border-primary bg-primary/10 text-primary" : "border-border text-muted")}>{sc}</button>
                    ))}
                  </div>
                </div>

                {/* Theme */}
                <div>
                  <p className="text-sm text-muted mb-2">Theme</p>
                  <div className="flex gap-2">
                    {(["light", "dark"] as const).map((t) => (
                      <button key={t} onClick={() => settings.setTheme(t)}
                        className={cn("flex-1 py-2.5 text-sm rounded-xl border capitalize font-medium", settings.theme === t ? "border-primary bg-primary/10 text-primary" : "border-border text-muted")}>{t}</button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Help spread message */}
              <div className="card p-4 bg-primary/5 border-primary/20 text-center">
                <p className="text-xs font-medium text-primary">Help spread the knowledge of Islam</p>
                <p className="text-[10px] text-muted mt-1">Share this app with others</p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
