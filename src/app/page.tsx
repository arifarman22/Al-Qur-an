"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { apiGetSurahs, apiGetDailyAyah, apiGetReadingProgress, apiSearch, type SurahDTO, type DailyAyahDTO, type ReadingProgressDTO, type SearchResultDTO } from "@/utils/api";
import { useAuthStore } from "@/store/useAuthStore";
import SurahCard from "@/components/quran/SurahCard";
import Container from "@/components/ui/Container";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { QuranIcon, LearnIcon, MemorizeIcon, TasbihIcon, DuaIcon, BookmarkFilledIcon, OrnamentDivider } from "@/components/icons/IslamicIcons";
import { Search, ArrowUpDown, ChevronRight, Play, BookOpen, User, ArrowRight, Loader2, X } from "lucide-react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease },
  }),
};

const features = [
  { href: "/learn", icon: LearnIcon, label: "Learn Quran", desc: "Step-by-step Arabic & Tajweed course", color: "bg-primary/10 text-primary" },
  { href: "/memorize", icon: MemorizeIcon, label: "Memorize", desc: "Track your Hifz journey surah by surah", color: "bg-rose-100 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400" },
  { href: "/tasbih", icon: TasbihIcon, label: "Tasbih", desc: "Digital dhikr counter with presets", color: "bg-violet-100 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400" },
  { href: "/duas", icon: DuaIcon, label: "Duas", desc: "Essential Quranic supplications", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400" },
  { href: "/bookmarks", icon: BookmarkFilledIcon, label: "Bookmarks", desc: "Save ayahs with personal notes", color: "bg-sky-100 text-sky-600 dark:bg-sky-900/20 dark:text-sky-400" },
];

export default function HomePage() {
  const { user, loading: authLoading } = useAuthStore();
  const [surahs, setSurahs] = useState<SurahDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "meccan" | "medinan">("all");
  const [sort, setSort] = useState<"asc" | "desc">("asc");
  const [error, setError] = useState("");
  const [dailyAyah, setDailyAyah] = useState<DailyAyahDTO | null>(null);
  const [lastRead, setLastRead] = useState<ReadingProgressDTO | null>(null);

  const router = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 40]);

  // Hero search state
  const [heroQuery, setHeroQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SurahDTO[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResultDTO[]>([]);
  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Live suggestions as user types
  const onHeroQueryChange = useCallback((val: string) => {
    setHeroQuery(val);
    if (!val.trim()) { setSuggestions([]); setSearchResults([]); setShowDropdown(false); return; }
    // Surah name suggestions (instant)
    const matched = surahs.filter((s) =>
      s.name_simple.toLowerCase().includes(val.toLowerCase()) ||
      s.name_arabic.includes(val) ||
      s.translated_name.name.toLowerCase().includes(val.toLowerCase()) ||
      s.id.toString() === val.trim()
    ).slice(0, 5);
    setSuggestions(matched);
    setShowDropdown(true);
    // Debounced API search
    clearTimeout(debounceRef.current!);
    if (val.trim().length >= 3) {
      debounceRef.current = setTimeout(async () => {
        try {
          const res = await apiSearch(val);
          setSearchResults(res.slice(0, 5));
          setShowDropdown(true);
        } catch { setSearchResults([]); }
      }, 400);
    } else {
      setSearchResults([]);
    }
  }, [surahs]);

  const handleHeroSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroQuery.trim()) return;
    setShowDropdown(false);
    router.push(`/search?q=${encodeURIComponent(heroQuery)}`);
  };

  useEffect(() => {
    const fetches: Promise<unknown>[] = [
      apiGetSurahs().then(setSurahs),
      apiGetDailyAyah().then(setDailyAyah).catch(() => {}),
    ];
    if (!authLoading && user) {
      fetches.push(apiGetReadingProgress().then(setLastRead).catch(() => {}));
    }
    Promise.all(fetches)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  const filtered = surahs
    .filter((s) => {
      const matchQ = s.name_simple.toLowerCase().includes(query.toLowerCase()) || s.name_arabic.includes(query) || s.id.toString() === query;
      const matchF = filter === "all" || s.revelation_place.toLowerCase() === filter;
      return matchQ && matchF;
    })
    .sort((a, b) => (sort === "asc" ? a.id - b.id : b.id - a.id));

  const allFeatures = user
    ? [...features, { href: "/profile", icon: () => <User size={22} />, label: "Profile", desc: "View stats & manage account", color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" }]
    : features;

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* ═══ Hero ═══ */}
      <motion.section ref={heroRef} style={{ opacity: heroOpacity }}
        className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 islamic-geo-bg opacity-[0.03] dark:opacity-[0.05]" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.04] via-transparent to-background" />
        <div className="absolute top-16 -left-16 w-48 h-48 bg-primary/8 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-8 -right-16 w-56 h-56 bg-accent/8 rounded-full blur-3xl animate-float-delayed" />

        <Container className="relative py-16 sm:py-20 text-center">
          <motion.div style={{ y: heroY }}>
            {/* Bismillah */}
            <motion.p initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease }}
              className="text-3xl sm:text-[2.8rem] text-primary dark:text-primary/80 mb-8 leading-relaxed"
              style={{ fontFamily: "var(--font-amiri)" }} dir="rtl">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </motion.p>

            <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-3xl sm:text-4xl font-bold mb-3 tracking-tight">
              {user ? (
                <>Assalamu Alaikum, <span className="text-primary">{user.name.split(" ")[0]}</span></>
              ) : (
                <>The Holy <span className="text-primary">Quran</span></>
              )}
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="text-muted max-w-md mx-auto mb-8 text-[15px]">
              Read, listen, and reflect on the divine words of Allah ﷻ
            </motion.p>

            {/* Hero Search Bar */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              ref={searchRef}
              className="relative max-w-xl mx-auto w-full mb-6">
              <form onSubmit={handleHeroSearch}>
                <div className="relative">
                  <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    type="text"
                    placeholder="Search surah, ayah, or topic..."
                    value={heroQuery}
                    onChange={(e) => onHeroQueryChange(e.target.value)}
                    onFocus={() => { if (heroQuery.trim()) setShowDropdown(true); }}
                    className="w-full pl-12 pr-24 py-4 bg-surface border border-border rounded-2xl text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 shadow-lg shadow-black/5 dark:shadow-black/20 transition-all placeholder:text-muted/60"
                  />
                  {heroQuery && (
                    <button type="button" onClick={() => { setHeroQuery(""); setSuggestions([]); setSearchResults([]); setShowDropdown(false); }}
                      className="absolute right-[4.5rem] top-1/2 -translate-y-1/2 p-1 text-muted hover:text-foreground transition-colors">
                      <X size={16} />
                    </button>
                  )}
                  <button type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors">
                    Search
                  </button>
                </div>
              </form>

              {/* Dropdown */}
              <AnimatePresence>
                {showDropdown && (suggestions.length > 0 || searchResults.length > 0) && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border rounded-2xl shadow-xl shadow-black/10 dark:shadow-black/30 overflow-hidden z-50 max-h-[400px] overflow-y-auto"
                  >
                    {/* Surah suggestions */}
                    {suggestions.length > 0 && (
                      <div className="p-2">
                        <p className="text-[10px] font-semibold text-muted uppercase tracking-wider px-3 py-1.5">Surahs</p>
                        {suggestions.map((s) => (
                          <Link key={s.id} href={`/surah/${s.id}`}
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary/5 transition-colors">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                              {s.id}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{s.name_simple}</p>
                              <p className="text-[11px] text-muted">{s.translated_name.name} · {s.verses_count} Ayahs</p>
                            </div>
                            <p className="text-base text-primary/70 shrink-0" style={{ fontFamily: "var(--font-amiri)" }}>{s.name_arabic}</p>
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Ayah search results */}
                    {searchResults.length > 0 && (
                      <div className="p-2 border-t border-border">
                        <p className="text-[10px] font-semibold text-muted uppercase tracking-wider px-3 py-1.5">Ayahs</p>
                        {searchResults.map((r, i) => (
                          <Link key={`${r.verse_key}-${i}`}
                            href={`/surah/${r.verse_key.split(":")[0]}?ayah=${r.verse_key.split(":")[1]}`}
                            onClick={() => setShowDropdown(false)}
                            className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-primary/5 transition-colors">
                            <span className="text-[10px] font-semibold bg-primary/10 text-primary px-1.5 py-0.5 rounded mt-0.5 shrink-0">{r.verse_key}</span>
                            <p className="text-xs text-muted leading-relaxed line-clamp-2" dangerouslySetInnerHTML={{ __html: r.text }} />
                          </Link>
                        ))}
                        <button onClick={() => { setShowDropdown(false); router.push(`/search?q=${encodeURIComponent(heroQuery)}`); }}
                          className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs text-primary font-medium hover:bg-primary/5 rounded-xl transition-colors">
                          View all results <ArrowRight size={12} />
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="flex items-center justify-center gap-3 flex-wrap">
              {user && lastRead ? (
                <Link href={`/surah/${lastRead.surahId}?ayah=${lastRead.ayahNumber}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark shadow-md shadow-primary/15 transition-all hover:-translate-y-0.5">
                  <Play size={16} /> Continue · {lastRead.surahName}
                </Link>
              ) : (
                <Link href="/surah/1"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark shadow-md shadow-primary/15 transition-all hover:-translate-y-0.5">
                  <BookOpen size={16} /> Start Reading
                </Link>
              )}
            </motion.div>
          </motion.div>
        </Container>
      </motion.section>

      {/* ═══ Daily Ayah ═══ */}
      {dailyAyah && (
        <section>
          <Container className="py-10">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}
              className="card p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-accent/8 to-transparent rounded-bl-[3rem] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-primary/5 to-transparent rounded-tr-[2rem] pointer-events-none" />

              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-9 h-9 bg-accent/10 rounded-xl flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-accent">
                    <path d="M12 2L14 8L20 8L15 12L17 18L12 14L7 18L9 12L4 8L10 8L12 2Z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-accent">Ayah of the Day</p>
                  <p className="text-xs text-muted">{dailyAyah.surah.name_simple} · Ayah {dailyAyah.verse.verse_key}</p>
                </div>
              </div>

              <p className="text-right leading-[2.4] mb-6" dir="rtl"
                style={{ fontSize: "26px", fontFamily: "var(--font-amiri)" }}>
                {dailyAyah.verse.text_uthmani}
              </p>

              <OrnamentDivider className="mb-5" />

              <p className="text-sm text-muted leading-relaxed max-w-2xl mx-auto text-center"
                dangerouslySetInnerHTML={{ __html: dailyAyah.verse.translations?.[0]?.text || "" }} />

              <div className="text-center mt-5">
                <Link href={`/surah/${dailyAyah.surah.id}?ayah=${dailyAyah.verse.verse_number}`}
                  className="inline-flex items-center gap-1 text-sm text-primary font-medium hover:underline">
                  Read in context <ChevronRight size={14} />
                </Link>
              </div>
            </motion.div>
          </Container>
        </section>
      )}

      {/* ═══ Features ═══ */}
      <section>
        <Container className="py-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold">Explore</h2>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {allFeatures.map((f, i) => (
              <motion.div key={f.href}
                variants={fadeUp} custom={i} initial="hidden" whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}>
                <Link href={f.href} className="group block h-full">
                  <div className="card p-4 h-full flex flex-col items-center text-center hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${f.color} transition-transform duration-300 group-hover:scale-110`}>
                      <f.icon size={22} />
                    </div>
                    <p className="text-sm font-semibold mb-1">{f.label}</p>
                    <p className="text-[11px] text-muted leading-snug hidden sm:block">{f.desc}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      <OrnamentDivider className="max-w-2xl mx-auto px-4" />

      {/* ═══ Surah List ═══ */}
      <section id="surahs">
        <Container className="py-10 pb-16">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold">All 114 Surahs</h2>
              <p className="text-xs text-muted mt-0.5">{filtered.length} surahs · Browse the complete Quran</p>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input type="text" placeholder="Search by name, number, or Arabic..." value={query} onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
            </div>
            <select value={filter} onChange={(e) => setFilter(e.target.value as "all" | "meccan" | "medinan")}
              className="px-3 py-2.5 bg-surface border border-border rounded-xl text-sm outline-none focus:border-primary cursor-pointer">
              <option value="all">All Surahs</option>
              <option value="meccan">Meccan</option>
              <option value="medinan">Medinan</option>
            </select>
            <button onClick={() => setSort(sort === "asc" ? "desc" : "asc")}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-surface border border-border rounded-xl text-sm hover:border-primary/30 transition-colors">
              <ArrowUpDown size={15} />{sort === "asc" ? "1 → 114" : "114 → 1"}
            </button>
          </motion.div>

          {error && <div className="text-center py-8 text-red-500 text-sm">{error}</div>}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="h-24 bg-surface border border-border rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filtered.map((s, i) => <SurahCard key={s.id} surah={s} index={i} />)}
            </div>
          ) : (
            <div className="text-center py-20 text-muted">No surahs found.</div>
          )}
        </Container>
      </section>

      <Footer />
    </main>
  );
}
