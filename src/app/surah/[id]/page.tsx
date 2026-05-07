"use client";

import { useEffect, useState, use, useRef } from "react";
import { apiGetSurahs, apiGetSurah, apiGetAyahs, apiSearch, type SurahDTO, type AyahDTO, type SearchResultDTO } from "@/utils/api";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useAudioStore } from "@/store/useAudioStore";
import { useBookmarkStore } from "@/store/useBookmarkStore";
import { cn } from "@/utils/utils";
import { toast } from "sonner";
import Link from "next/link";
import { Home, BookOpen, Search, Bookmark, Settings, Moon, Sun, Play, Pause, Copy, Check, Menu, X, ChevronLeft, ChevronRight } from "lucide-react";

export default function SurahPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { arabicFont, arabicFontSize, translationFontSize, arabicScript, theme, toggleTheme } = useSettingsStore();
  const { currentAyahId, isPlaying, setCurrentAyah, setIsPlaying } = useAudioStore();
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarkStore();

  const [surahs, setSurahs] = useState<SurahDTO[]>([]);
  const [surah, setSurah] = useState<SurahDTO | null>(null);
  const [ayahs, setAyahs] = useState<AyahDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResultDTO[]>([]);
  const [searching, setSearching] = useState(false);
  const [surahSearch, setSurahSearch] = useState("");

  const fontFamily = arabicFont === "amiri" ? "var(--font-amiri)" : "var(--font-scheherazade)";

  useEffect(() => {
    apiGetSurahs().then(setSurahs).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([apiGetSurah(+id), apiGetAyahs(+id, arabicScript)])
      .then(([s, a]) => { setSurah(s); setAyahs(a); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id, arabicScript]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try { setSearchResults(await apiSearch(searchQuery)); }
    catch { setSearchResults([]); }
    finally { setSearching(false); }
  };

  const filteredSurahs = surahs.filter((s) =>
    s.name_simple.toLowerCase().includes(surahSearch.toLowerCase()) || s.id.toString() === surahSearch
  );

  const prevSurah = +id > 1 ? +id - 1 : null;
  const nextSurah = +id < 114 ? +id + 1 : null;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* ═══ ICON SIDEBAR (desktop) ═══ */}
      <aside className="hidden md:flex flex-col items-center w-14 bg-surface border-r border-border py-3 shrink-0 h-screen">
        <Link href="/" className="w-9 h-9 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center mb-6">
          <span className="text-white text-sm font-bold" style={{ fontFamily: "var(--font-amiri)" }}>ق</span>
        </Link>
        {[
          { icon: Home, href: "/", label: "Home" },
          { icon: BookOpen, href: `/surah/${id}`, label: "Read", active: true },
          { icon: Search, href: "#", label: "Search", onClick: () => setSearchOpen(true) },
          { icon: Bookmark, href: "/bookmarks", label: "Bookmarks" },
          { icon: Settings, href: "#", label: "Settings", onClick: () => setSettingsOpen(true) },
        ].map((item, i) => (
          <Link key={i} href={item.href} onClick={item.onClick ? (e) => { e.preventDefault(); item.onClick!(); } : undefined}
            className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-1 transition-colors", item.active ? "bg-primary/15 text-primary" : "text-muted hover:text-foreground hover:bg-surface-alt")}>
            <item.icon size={18} />
          </Link>
        ))}
        <div className="mt-auto">
          <button onClick={toggleTheme} className="w-10 h-10 rounded-xl flex items-center justify-center text-muted hover:text-foreground hover:bg-surface-alt transition-colors">
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </aside>

      {/* ═══ SURAH SIDEBAR ═══ */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside className={cn(
        "w-72 bg-surface border-r border-border h-screen flex flex-col shrink-0 z-50 transition-transform",
        "max-md:fixed max-md:left-14 max-md:top-0",
        sidebarOpen ? "max-md:translate-x-0" : "max-md:-translate-x-[calc(100%+56px)]"
      )}>
        <div className="p-3 border-b border-border">
          <h2 className="text-sm font-bold mb-2">Surahs</h2>
          <input type="text" placeholder="Search surah..." value={surahSearch} onChange={(e) => setSurahSearch(e.target.value)}
            className="w-full text-xs px-3 py-2" />
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredSurahs.map((s) => (
            <Link key={s.id} href={`/surah/${s.id}`} onClick={() => setSidebarOpen(false)}
              className={cn("flex items-center gap-3 px-3 py-2.5 border-b border-border/50 transition-colors",
                +id === s.id ? "bg-primary/10 border-l-2 border-l-primary" : "hover:bg-surface-alt")}>
              <span className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0",
                +id === s.id ? "bg-primary text-white" : "bg-surface-alt text-muted")}>{s.id}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{s.name_simple}</p>
                <p className="text-[10px] text-muted">{s.translated_name.name} · {s.verses_count}</p>
              </div>
              <p className="text-sm font-bold text-primary shrink-0" style={{ fontFamily: "var(--font-amiri)" }}>{s.name_arabic}</p>
            </Link>
          ))}
        </div>
      </aside>

      {/* ═══ MAIN CONTENT ═══ */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header */}
        <header className="h-12 bg-surface border-b border-border flex items-center px-4 gap-3 shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden p-1.5 rounded-lg text-muted hover:text-foreground">
            <Menu size={18} />
          </button>
          {surah && (
            <div className="flex-1 min-w-0 flex items-center gap-2">
              <h1 className="text-sm font-semibold truncate">{surah.name_simple}</h1>
              <span className="text-xs text-muted">({surah.verses_count} ayahs · {surah.revelation_place})</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            {prevSurah && <Link href={`/surah/${prevSurah}`} className="p-1.5 rounded-lg text-muted hover:text-foreground"><ChevronLeft size={16} /></Link>}
            {nextSurah && <Link href={`/surah/${nextSurah}`} className="p-1.5 rounded-lg text-muted hover:text-foreground"><ChevronRight size={16} /></Link>}
            <button onClick={() => setSearchOpen(true)} className="p-1.5 rounded-lg text-muted hover:text-foreground md:hidden"><Search size={16} /></button>
            <button onClick={() => setSettingsOpen(true)} className="p-1.5 rounded-lg text-muted hover:text-foreground md:hidden"><Settings size={16} /></button>
          </div>
        </header>

        {/* Ayah Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-6 space-y-4">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-32 bg-surface-alt rounded-xl animate-pulse" />)}</div>
          ) : surah && (
            <>
              {/* Surah Header */}
              <div className="text-center py-6 border-b border-border">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <img src="/images/makkah.png" alt="" className="w-16 opacity-60 hidden sm:block" />
                  <div>
                    <h2 className="text-lg font-bold">{surah.name_simple}</h2>
                    <p className="text-xs text-muted capitalize">Ayah-{surah.verses_count}, {surah.revelation_place}</p>
                  </div>
                  <p className="text-2xl text-primary font-bold hidden sm:block" style={{ fontFamily }}>{surah.name_arabic}</p>
                </div>
              </div>

              {/* Bismillah */}
              {surah.id !== 1 && surah.id !== 9 && (
                <div className="text-center py-5 border-b border-border">
                  <p className="text-2xl" style={{ fontFamily }}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
                </div>
              )}

              {/* Ayahs */}
              {ayahs.map((ayah) => {
                const isCurrent = currentAyahId === ayah.verse_key;
                const bookmarked = isBookmarked(ayah.verse_key);
                const arabicText = arabicScript === "indopak" && ayah.text_indopak ? ayah.text_indopak : ayah.text_uthmani || "";
                const english = ayah.translations?.find((t) => t.resource_id === 131)?.text || "";
                const bengali = ayah.translations?.find((t) => t.resource_id === 161)?.text || "";

                return (
                  <div key={ayah.id} className={cn("px-4 py-5 md:px-6 border-b border-border group transition-colors", isCurrent && "bg-primary/5")}>
                    <div className="flex items-center justify-between mb-4">
                      <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold border border-primary/20">
                        {ayah.verse_number}
                      </span>
                      <div className="flex gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { if (isCurrent && isPlaying) setIsPlaying(false); else if (ayah.audio_url) setCurrentAyah(ayah.verse_key, surah.id, ayah.audio_url); else toast.error("No audio"); }}
                          disabled={!ayah.audio_url}
                          className={cn("w-7 h-7 rounded-lg flex items-center justify-center transition-colors", isCurrent && isPlaying ? "bg-primary text-white" : "text-muted hover:text-primary hover:bg-primary/10")}>
                          {isCurrent && isPlaying ? <Pause size={14} /> : <Play size={14} />}
                        </button>
                        <button onClick={() => { if (bookmarked) { removeBookmark(ayah.verse_key); toast.info("Removed"); } else { addBookmark({ verseKey: ayah.verse_key, surahId: surah.id, surahName: surah.name_simple, ayahNumber: ayah.verse_number }); toast.success("Bookmarked"); } }}
                          className={cn("w-7 h-7 rounded-lg flex items-center justify-center transition-colors", bookmarked ? "text-accent" : "text-muted hover:text-accent")}>
                          <Bookmark size={14} fill={bookmarked ? "currentColor" : "none"} />
                        </button>
                        <button onClick={() => { navigator.clipboard.writeText(`${arabicText}\n${english}\n— ${ayah.verse_key}`); toast.success("Copied"); }}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-muted hover:text-foreground">
                          <Copy size={14} />
                        </button>
                      </div>
                    </div>
                    <p className="text-right leading-[2.4] mb-4" dir="rtl" style={{ fontSize: `${arabicFontSize}px`, fontFamily }}>{arabicText}</p>
                    {english && <p className="text-muted leading-relaxed mb-2" style={{ fontSize: `${translationFontSize}px` }} dangerouslySetInnerHTML={{ __html: english }} />}
                    {bengali && <><p className="text-[10px] text-primary font-medium mt-2 mb-1">বাংলা</p><p className="text-muted leading-relaxed" style={{ fontSize: `${translationFontSize}px` }} dangerouslySetInnerHTML={{ __html: bengali }} /></>}
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>

      {/* ═══ SEARCH MODAL ═══ */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSearchOpen(false)} />
          <div className="relative w-full max-w-lg bg-surface border border-border rounded-2xl shadow-2xl p-5 max-h-[70vh] overflow-y-auto">
            <div className="flex items-center gap-2 mb-4">
              <Search size={16} className="text-muted" />
              <input type="text" placeholder="Search ayahs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()} className="flex-1 border-none bg-transparent outline-none text-sm" autoFocus />
              <button onClick={() => setSearchOpen(false)} className="text-muted hover:text-foreground"><X size={16} /></button>
            </div>
            {searching && <p className="text-xs text-muted text-center py-4">Searching...</p>}
            {searchResults.map((r, i) => (
              <Link key={i} href={`/surah/${r.verse_key.split(":")[0]}`} onClick={() => setSearchOpen(false)}
                className="block p-3 rounded-lg hover:bg-surface-alt mb-2 transition-colors">
                <span className="text-xs text-primary font-medium">{r.verse_key}</span>
                <p className="text-sm text-muted mt-1" dangerouslySetInnerHTML={{ __html: r.text }} />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ═══ SETTINGS PANEL ═══ */}
      {settingsOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSettingsOpen(false)} />
          <div className="relative w-80 bg-surface border-l border-border h-full overflow-y-auto p-5 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-bold">Font Settings</h2>
              <button onClick={() => setSettingsOpen(false)} className="text-muted hover:text-foreground"><X size={16} /></button>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted uppercase mb-2 block">Arabic Font</label>
              {([["amiri", "Amiri"], ["scheherazade", "Scheherazade"]] as const).map(([key, label]) => (
                <button key={key} onClick={() => useSettingsStore.getState().setArabicFont(key)}
                  className={cn("w-full text-left px-4 py-3 rounded-xl border mb-2", arabicFont === key ? "border-primary bg-primary/5" : "border-border")}>
                  <p className="text-lg" style={{ fontFamily: key === "amiri" ? "var(--font-amiri)" : "var(--font-scheherazade)" }}>بِسْمِ اللَّهِ</p>
                  <p className="text-xs text-muted">{label}</p>
                </button>
              ))}
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1"><span className="text-muted">Arabic Size</span><span className="text-primary font-bold">{arabicFontSize}px</span></div>
              <input type="range" min="20" max="56" value={arabicFontSize} onChange={(e) => useSettingsStore.getState().setArabicFontSize(+e.target.value)} className="w-full" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1"><span className="text-muted">Translation Size</span><span className="text-primary font-bold">{translationFontSize}px</span></div>
              <input type="range" min="12" max="22" value={translationFontSize} onChange={(e) => useSettingsStore.getState().setTranslationFontSize(+e.target.value)} className="w-full" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted uppercase mb-2 block">Theme</label>
              <div className="flex gap-2">
                {(["light", "dark"] as const).map((t) => (
                  <button key={t} onClick={() => useSettingsStore.getState().setTheme(t)}
                    className={cn("flex-1 py-2 text-sm rounded-xl border capitalize", theme === t ? "border-primary bg-primary/10 text-primary" : "border-border text-muted")}>{t}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
