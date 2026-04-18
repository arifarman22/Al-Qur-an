"use client";

import { useEffect, useState, useRef } from "react";
import { apiGetSurahs, apiGetDailyAyah, apiGetReadingProgress, type SurahDTO, type DailyAyahDTO, type ReadingProgressDTO } from "@/utils/api";
import { useAuthStore } from "@/store/useAuthStore";
import SurahCard from "@/components/quran/SurahCard";
import Container from "@/components/ui/Container";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { QuranIcon, LearnIcon, MemorizeIcon, TasbihIcon, DuaIcon, BookmarkFilledIcon, OrnamentDivider } from "@/components/icons/IslamicIcons";
import { Search, ArrowUpDown, ChevronRight, Play, BookOpen, User } from "lucide-react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

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

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 40]);

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
                <>The Noble <span className="text-primary">Quran</span></>
              )}
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="text-muted max-w-md mx-auto mb-8 text-[15px]">
              Read, listen, and reflect on the divine words of Allah ﷻ
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
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
              <Link href="/search"
                className="inline-flex items-center gap-2 px-6 py-3 bg-surface border border-border rounded-xl text-sm font-semibold hover:border-primary/30 hover:bg-primary/5 transition-all">
                <Search size={16} /> Search Quran
              </Link>
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
