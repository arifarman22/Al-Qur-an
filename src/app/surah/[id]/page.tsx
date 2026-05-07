"use client";

import { useEffect, useState, use } from "react";
import { apiGetSurahs, apiGetSurah, apiGetAyahs, type SurahDTO, type AyahDTO } from "@/utils/api";
import { useSettingsStore } from "@/store/useSettingsStore";
import { usePlaybackStore } from "@/store/usePlaybackStore";
import { useBookmarkStore } from "@/store/useBookmarkStore";
import AyahCard from "@/components/quran/AyahCard";
import MushafStyleSelector from "@/components/quran/MushafStyleSelector";
import { cn } from "@/utils/utils";
import { toast } from "sonner";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { Home, BookOpen, Search, Bookmark, Moon, Sun, Menu, X, ChevronLeft, ChevronRight, Settings, Type } from "lucide-react";

export default function SurahPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const settings = useSettingsStore();
  const playback = usePlaybackStore();
  const { isBookmarked } = useBookmarkStore();

  const [surahs, setSurahs] = useState<SurahDTO[]>([]);
  const [surah, setSurah] = useState<SurahDTO | null>(null);
  const [ayahs, setAyahs] = useState<AyahDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [rightTab, setRightTab] = useState<"translation" | "reading">("translation");
  const [readingMode, setReadingMode] = useState<"ayah" | "arabic" | "translation" | "mushaf" | "wordbyword">("ayah");
  const [mushafStyle, setMushafStyle] = useState("unicode");
  const [surahSearch, setSurahSearch] = useState("");

  const fontFamily = settings.arabicFont === "amiri" ? "var(--font-amiri)" : "var(--font-scheherazade)";

  useEffect(() => { apiGetSurahs().then(setSurahs).catch(() => {}); }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([apiGetSurah(+id), apiGetAyahs(+id, settings.arabicScript)])
      .then(([s, a]) => {
        setSurah(s); setAyahs(a);
        // Load into playback engine
        if (s) playback.loadSurah(s.id, s.name_simple, a);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id, settings.arabicScript]);

  const filteredSurahs = surahs.filter((s) =>
    s.name_simple.toLowerCase().includes(surahSearch.toLowerCase()) || s.id.toString() === surahSearch
  );

  const prevSurah = +id > 1 ? +id - 1 : null;
  const nextSurah = +id < 114 ? +id + 1 : null;

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* ═══ NAVBAR ═══ */}
      <Navbar />

      {/* ═══ MAIN 3-PANEL LAYOUT ═══ */}
      <div className="flex flex-1 overflow-hidden min-h-0">

        {/* ═══ LEFT: SURAH SIDEBAR ═══ */}
        {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
        <aside className={cn(
          "w-72 bg-surface border-r border-border flex flex-col shrink-0 z-50 transition-transform",
          "max-lg:fixed max-lg:left-0 max-lg:top-0 max-lg:h-full",
          sidebarOpen ? "max-lg:translate-x-0" : "max-lg:-translate-x-full"
        )}>
          <div className="p-4 border-b border-border shrink-0">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold">Surahs</h2>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-muted hover:text-foreground"><X size={16} /></button>
            </div>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input type="text" placeholder="Search surah..." value={surahSearch} onChange={(e) => setSurahSearch(e.target.value)} className="w-full pl-8 text-xs py-2" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredSurahs.map((s) => (
              <Link key={s.id} href={`/surah/${s.id}`} onClick={() => setSidebarOpen(false)}
                className={cn("flex items-center gap-2.5 px-4 py-2.5 border-b border-border/40 transition-all",
                  +id === s.id ? "bg-primary/8 border-l-[3px] border-l-primary" : "hover:bg-surface-alt")}>
                <span className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0",
                  +id === s.id ? "bg-primary text-white" : "bg-surface-alt text-muted")}>{s.id}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium truncate">{s.name_simple}</p>
                  <p className="text-[10px] text-muted truncate">{s.translated_name.name} · {s.verses_count} ayahs</p>
                </div>
                <p className="text-sm text-primary font-bold shrink-0" style={{ fontFamily: "var(--font-amiri)" }}>{s.name_arabic}</p>
              </Link>
            ))}
          </div>
        </aside>

        {/* ═══ CENTER: AYAH READER ═══ */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Sub Header */}
          <div className="h-11 bg-surface/50 backdrop-blur-sm border-b border-border flex items-center px-4 gap-3 shrink-0">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1.5 rounded-lg text-muted hover:text-foreground"><Menu size={16} /></button>
            {surah && (
              <div className="flex-1 min-w-0 flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">{surah.id}</span>
                <span className="text-sm font-medium truncate">{surah.name_simple}</span>
                <span className="text-[11px] text-muted hidden sm:inline">· {surah.verses_count} ayahs · {surah.revelation_place}</span>
              </div>
            )}
            <div className="flex items-center gap-0.5">
              {prevSurah && <Link href={`/surah/${prevSurah}`} className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-surface-alt transition-colors"><ChevronLeft size={15} /></Link>}
              {nextSurah && <Link href={`/surah/${nextSurah}`} className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-surface-alt transition-colors"><ChevronRight size={15} /></Link>}
              <button onClick={() => setRightPanelOpen(!rightPanelOpen)} className={cn("p-1.5 rounded-lg transition-colors", rightPanelOpen ? "text-primary bg-primary/10" : "text-muted hover:text-foreground hover:bg-surface-alt")}>
                <Type size={15} />
              </button>
            </div>
          </div>

          {/* Ayah Content */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-6 space-y-4">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-28 bg-surface-alt rounded-xl animate-pulse" />)}</div>
            ) : surah && (
              <>
                {/* Surah Header */}
                <div className="text-center py-8 border-b border-border bg-gradient-to-b from-primary/3 to-transparent">
                  <p className="text-3xl text-primary font-bold mb-1" style={{ fontFamily }}>{surah.name_arabic}</p>
                  <h2 className="text-base font-semibold">{surah.name_simple}</h2>
                  <p className="text-xs text-muted mt-1 capitalize">{surah.revelation_place} · {surah.verses_count} Ayahs · Revelation #{surah.revelation_order}</p>
                </div>

                {surah.id !== 1 && surah.id !== 9 && (
                  <div className="text-center py-5 border-b border-border">
                    <p className="text-xl text-foreground/80" style={{ fontFamily }}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
                    <p className="text-[11px] text-muted mt-1">In the name of Allah, the Most Gracious, the Most Merciful</p>
                  </div>
                )}

                {readingMode === "mushaf" ? (
                  /* Mushaf Mode — continuous flowing Arabic text */
                  <div className="px-6 py-8 md:px-12">
                    <p className="text-right leading-[3] text-foreground" dir="rtl" style={{ fontSize: `${settings.arabicFontSize}px`, fontFamily, wordSpacing: "8px", textAlign: "justify" }}>
                      {ayahs.map((ayah) => {
                        const text = settings.arabicScript === "indopak" && ayah.text_indopak ? ayah.text_indopak : ayah.text_uthmani || "";
                        return (
                          <span key={ayah.id} className="inline">
                            {text}
                            <span className="inline-flex items-center justify-center w-7 h-7 mx-1 rounded-md bg-primary/10 text-primary text-[10px] font-bold align-middle">{ayah.verse_number}</span>
                          </span>
                        );
                      })}
                    </p>
                  </div>
                ) : readingMode === "arabic" ? (
                  /* Arabic Only Mode */
                  <div className="divide-y divide-border/30">
                    {ayahs.map((ayah) => {
                      const text = settings.arabicScript === "indopak" && ayah.text_indopak ? ayah.text_indopak : ayah.text_uthmani || "";
                      return (
                        <div key={ayah.id} className="px-6 py-5 md:px-10 flex items-start gap-3">
                          <span className="w-7 h-7 rounded-md bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold shrink-0 mt-2">{ayah.verse_number}</span>
                          <p className="flex-1 text-right leading-[2.6] text-foreground" dir="rtl" style={{ fontSize: `${settings.arabicFontSize}px`, fontFamily }}>{text}</p>
                        </div>
                      );
                    })}
                  </div>
                ) : readingMode === "translation" ? (
                  /* Translation Only Mode */
                  <div className="divide-y divide-border/30">
                    {ayahs.map((ayah) => {
                      const english = ayah.translations?.find((t) => t.resource_id === 131)?.text || "";
                      const bengali = ayah.translations?.find((t) => t.resource_id === 161)?.text || "";
                      return (
                        <div key={ayah.id} className="px-6 py-5 md:px-10">
                          <span className="inline-flex items-center gap-1.5 mb-2">
                            <span className="w-6 h-6 rounded bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">{ayah.verse_number}</span>
                            <span className="text-[10px] text-muted">{ayah.verse_key}</span>
                          </span>
                          {english && <p className="text-foreground/80 leading-relaxed mb-2" style={{ fontSize: `${settings.translationFontSize}px` }} dangerouslySetInnerHTML={{ __html: english }} />}
                          {bengali && <p className="text-foreground/60 leading-relaxed" style={{ fontSize: `${settings.translationFontSize}px`, fontFamily: "var(--font-bengali)" }} dangerouslySetInnerHTML={{ __html: bengali }} />}
                        </div>
                      );
                    })}
                  </div>
                ) : readingMode === "wordbyword" ? (
                  /* Word by Word Mode */
                  <div className="divide-y divide-border/30">
                    {ayahs.map((ayah) => {
                      const text = settings.arabicScript === "indopak" && ayah.text_indopak ? ayah.text_indopak : ayah.text_uthmani || "";
                      const words = text.split(" ");
                      return (
                        <div key={ayah.id} className="px-4 py-5 md:px-8">
                          <span className="inline-flex items-center gap-1.5 mb-4">
                            <span className="w-6 h-6 rounded bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">{ayah.verse_number}</span>
                          </span>
                          <div className="flex flex-wrap gap-3 justify-center" dir="rtl">
                            {words.map((word, wi) => (
                              <div key={wi} className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-surface-alt transition-colors">
                                <span className="text-foreground" style={{ fontSize: `${Math.max(settings.arabicFontSize - 6, 20)}px`, fontFamily }}>{word}</span>
                                <span className="text-[10px] text-muted">Word {wi + 1}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* Default: Ayah by Ayah Mode (with AyahCard) */
                  ayahs.map((ayah, index) => (
                    <AyahCard key={ayah.id} ayah={ayah} index={index} surahId={surah.id} surahName={surah.name_simple} />
                  ))
                )}
              </>
            )}
          </div>
        </div>

        {/* ═══ RIGHT: TRANSLATION + READING SETTINGS ═══ */}
        {rightPanelOpen && (
          <>
            {/* Mobile overlay */}
            <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setRightPanelOpen(false)} />
            <aside className={cn(
              "w-[340px] bg-surface border-l border-border flex flex-col shrink-0 z-50 overflow-hidden",
              "max-lg:fixed max-lg:right-0 max-lg:top-0 max-lg:h-full"
            )}>
              {/* Tabs */}
              <div className="flex border-b border-border shrink-0 bg-surface-alt">
                {(["translation", "reading"] as const).map((tab) => (
                  <button key={tab} onClick={() => setRightTab(tab)}
                    className={cn("flex-1 py-3.5 text-[13px] font-semibold capitalize transition-all relative",
                      rightTab === tab ? "text-primary" : "text-muted hover:text-foreground")}>
                    {tab}
                    {rightTab === tab && <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-primary rounded-full" />}
                  </button>
                ))}
                <button onClick={() => setRightPanelOpen(false)} className="px-3 text-muted hover:text-foreground lg:hidden"><X size={16} /></button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {rightTab === "translation" ? (
                  <div className="p-5 space-y-6">
                    {/* Settings Header */}
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Settings size={15} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold">Reading Settings</h3>
                        <p className="text-[10px] text-muted">Customize your reading experience</p>
                      </div>
                    </div>

                    {/* Arabic Font Size */}
                    <div className="card p-4">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-medium">Arabic Font Size</span>
                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">{settings.arabicFontSize}</span>
                      </div>
                      <input type="range" min="20" max="56" value={settings.arabicFontSize} onChange={(e) => settings.setArabicFontSize(+e.target.value)} className="w-full" />
                      <div className="flex justify-between text-[10px] text-muted mt-1"><span>Small</span><span>Large</span></div>
                    </div>

                    {/* Translation Font Size */}
                    <div className="card p-4">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-medium">Translation Font Size</span>
                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">{settings.translationFontSize}</span>
                      </div>
                      <input type="range" min="12" max="24" value={settings.translationFontSize} onChange={(e) => settings.setTranslationFontSize(+e.target.value)} className="w-full" />
                      <div className="flex justify-between text-[10px] text-muted mt-1"><span>Small</span><span>Large</span></div>
                    </div>

                    {/* Arabic Font Face */}
                    <div>
                      <p className="text-xs font-medium mb-3">Arabic Font Face</p>
                      <div className="space-y-2">
                        {([["amiri", "Amiri Quran", "Classic Naskh style"], ["scheherazade", "Scheherazade New", "Traditional Naskh"]] as const).map(([key, label, desc]) => (
                          <button key={key} onClick={() => settings.setArabicFont(key)}
                            className={cn("w-full text-left px-4 py-3.5 rounded-xl border transition-all", settings.arabicFont === key ? "border-primary bg-primary/5 shadow-sm shadow-primary/10" : "border-border hover:border-primary/30 hover:bg-surface-alt")}>
                            <p className="text-lg leading-relaxed" style={{ fontFamily: key === "amiri" ? "var(--font-amiri)" : "var(--font-scheherazade)" }}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs font-medium">{label}</span>
                              <span className="text-[10px] text-muted">{desc}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Script */}
                    <div>
                      <p className="text-xs font-medium mb-3">Quran Script</p>
                      <div className="grid grid-cols-2 gap-2">
                        {(["uthmani", "indopak"] as const).map((sc) => (
                          <button key={sc} onClick={() => settings.setArabicScript(sc)}
                            className={cn("py-3 text-sm rounded-xl border capitalize font-medium transition-all", settings.arabicScript === sc ? "border-primary bg-primary/10 text-primary shadow-sm shadow-primary/10" : "border-border text-muted hover:border-primary/30")}>{sc}</button>
                        ))}
                      </div>
                    </div>

                    {/* Theme */}
                    <div>
                      <p className="text-xs font-medium mb-3">Appearance</p>
                      <div className="grid grid-cols-2 gap-2">
                        {(["light", "dark"] as const).map((t) => (
                          <button key={t} onClick={() => settings.setTheme(t)}
                            className={cn("py-3 text-sm rounded-xl border capitalize font-medium transition-all flex items-center justify-center gap-2", settings.theme === t ? "border-primary bg-primary/10 text-primary shadow-sm shadow-primary/10" : "border-border text-muted hover:border-primary/30")}>
                            {t === "dark" ? <Moon size={14} /> : <Sun size={14} />}
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* CTA Card */}
                    <div className="card p-5 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 text-center">
                      <div className="w-10 h-10 bg-primary/15 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <BookOpen size={18} className="text-primary" />
                      </div>
                      <p className="text-sm font-semibold text-primary">Help spread the knowledge of Islam</p>
                      <p className="text-[11px] text-muted mt-1">Share this app with your family and friends</p>
                    </div>
                  </div>
                ) : (
                  /* ═══ READING TAB — Reading Mode Selector ═══ */
                  <div className="p-5 space-y-6">
                    {/* Header */}
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <BookOpen size={15} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold">Reading Mode</h3>
                        <p className="text-[10px] text-muted">Choose how you want to read</p>
                      </div>
                    </div>

                    {/* Mode Options */}
                    <div className="space-y-2">
                      {([
                        { id: "ayah" as const, title: "Ayah by Ayah", desc: "Arabic text with translations below each ayah", icon: "book" },
                        { id: "arabic" as const, title: "Arabic Only", desc: "Clean Arabic text without translations", icon: "mosque" },
                        { id: "translation" as const, title: "Translation Only", desc: "English & Bengali translations only", icon: "globe" },
                        { id: "mushaf" as const, title: "Mushaf Mode", desc: "Continuous flowing text like a physical Quran", icon: "quran" },
                        { id: "wordbyword" as const, title: "Word by Word", desc: "Each word displayed individually for learning", icon: "text" },
                      ]).map((mode) => (
                        <button
                          key={mode.id}
                          onClick={() => setReadingMode(mode.id)}
                          className={cn(
                            "w-full text-left px-4 py-3.5 rounded-xl border transition-all flex items-center gap-3",
                            readingMode === mode.id
                              ? "border-primary bg-primary/5 shadow-sm shadow-primary/10"
                              : "border-border hover:border-primary/30 hover:bg-surface-alt"
                          )}
                        >
                          <span className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border bg-surface-alt border-border text-muted"><BookOpen size={16} /></span>
                          <div className="flex-1">
                            <p className={cn("text-sm font-medium", readingMode === mode.id && "text-primary")}>{mode.title}</p>
                            <p className="text-[10px] text-muted">{mode.desc}</p>
                          </div>
                          {readingMode === mode.id && (
                            <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-3 h-3"><path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" /></svg>
                            </span>
                          )}
                        </button>
                      ))}
                    </div>


                    {/* Mushaf Style Selector */}
                    {readingMode === "mushaf" && (
                      <div className="card p-4">
                        <MushafStyleSelector selected={mushafStyle} onSelect={setMushafStyle} />
                      </div>
                    )}

                    {/* Mode Preview */}
                    <div className="card p-4 bg-surface-alt/50">
                      <p className="text-[10px] text-muted uppercase tracking-wider font-semibold mb-2">Preview</p>
                      {readingMode === "ayah" && <p className="text-xs text-muted">Full ayah cards with Arabic, English & Bengali translations, action buttons, and word highlighting.</p>}
                      {readingMode === "arabic" && <p className="text-xs text-muted">Clean Arabic text with verse numbers. Perfect for those who can read Arabic fluently.</p>}
                      {readingMode === "translation" && <p className="text-xs text-muted">Only translations displayed. Ideal for understanding the meaning without Arabic text.</p>}
                      {readingMode === "mushaf" && <p className="text-xs text-muted">Continuous flowing Arabic text resembling a physical Quran page. No breaks between ayahs.</p>}
                      {readingMode === "wordbyword" && <p className="text-xs text-muted">Each Arabic word displayed separately. Great for beginners learning to read the Quran.</p>}
                    </div>

                    {/* Quick tip */}
                    <div className="card p-4 border-l-[3px] border-l-accent bg-accent/5">
                      <p className="text-xs text-foreground">Tip: Use "Ayah by Ayah" mode for the full experience with audio sync and word highlighting.</p>
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </>
        )}
      </div>

      {/* ═══ FOOTER ═══ */}
      {/* Footer removed from fixed layout — accessible via scroll in center panel */}
    </div>
  );
}
