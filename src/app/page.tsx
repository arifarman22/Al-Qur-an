"use client";

import { useEffect, useState, useRef } from "react";
import { apiGetSurahs, apiGetDailyAyah, apiGetReadingProgress, type SurahDTO, type DailyAyahDTO, type ReadingProgressDTO } from "@/utils/api";
import { useAuthStore } from "@/store/useAuthStore";
import SurahCard from "@/components/quran/SurahCard";
import Container from "@/components/ui/Container";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  Search, ArrowUpDown, BookOpen, Star, GraduationCap, Brain,
  Heart, Bookmark, User, ChevronRight, Sparkles, Play
} from "lucide-react";
import Link from "next/link";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number = 0) => ({
    opacity: 1, scale: 1,
    transition: { duration: 0.5, delay: i * 0.08, ease },
  }),
};

function FeatureCard({ href, icon: Icon, label, color, delay }: {
  href: string; icon: any; label: string; color: string; delay: number;
}) {
  return (
    <motion.div variants={scaleIn} custom={delay} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
      <Link href={href} className="group block">
        <div className="card p-5 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
          <div className={`w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center ${color} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
            <Icon size={22} className="text-white" />
          </div>
          <p className="text-sm font-semibold">{label}</p>
          <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>
      </Link>
    </motion.div>
  );
}

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
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  useEffect(() => {
    const fetches: Promise<any>[] = [
      apiGetSurahs().then(setSurahs),
      apiGetDailyAyah().then(setDailyAyah).catch(() => {}),
    ];
    if (!authLoading && user) {
      fetches.push(apiGetReadingProgress().then(setLastRead).catch(() => {}));
    }
    Promise.all(fetches)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  const filtered = surahs
    .filter((s) => {
      const matchQ = s.name_simple.toLowerCase().includes(query.toLowerCase()) || s.name_arabic.includes(query) || s.id.toString() === query;
      const matchF = filter === "all" || s.revelation_place.toLowerCase() === filter;
      return matchQ && matchF;
    })
    .sort((a, b) => (sort === "asc" ? a.id - b.id : b.id - a.id));

  const featureLinks = [
    { href: "/learn", icon: GraduationCap, label: "Learn Quran", color: "bg-emerald-600" },
    { href: "/memorize", icon: Brain, label: "Memorize", color: "bg-violet-600" },
    { href: "/tasbih", icon: Heart, label: "Tasbih", color: "bg-rose-600" },
    { href: "/duas", icon: Sparkles, label: "Duas", color: "bg-amber-600" },
    { href: "/bookmarks", icon: Bookmark, label: "Bookmarks", color: "bg-sky-600" },
    ...(user ? [{ href: "/profile", icon: User, label: "Profile", color: "bg-slate-600" }] : []),
  ];

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* ── Hero Section ── */}
      <motion.section ref={heroRef} style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative overflow-hidden">
        {/* Islamic geometric background */}
        <div className="absolute inset-0 islamic-geo-bg opacity-[0.04] dark:opacity-[0.06]" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-background" />

        {/* Floating decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl animate-float-delayed" />

        <Container className="relative py-16 sm:py-24 text-center">
          {/* Bismillah */}
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            <p className="text-3xl sm:text-5xl text-primary/80 dark:text-primary/70 mb-6 leading-relaxed"
              style={{ fontFamily: "var(--font-amiri)" }} dir="rtl">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
          </motion.div>

          {/* Greeting */}
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl sm:text-4xl font-bold mb-3 tracking-tight">
            {user ? (
              <>Assalamu Alaikum, <span className="text-primary">{user.name.split(" ")[0]}</span></>
            ) : (
              <>Welcome to <span className="text-primary">Al-Quran</span></>
            )}
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-muted max-w-lg mx-auto mb-8">
            Read, listen, and reflect on the divine words of Allah ﷻ
          </motion.p>

          {/* CTA Buttons */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center justify-center gap-3 flex-wrap">
            {user && lastRead ? (
              <Link href={`/surah/${lastRead.surahId}?ayah=${lastRead.ayahNumber}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-0.5">
                <Play size={16} /> Continue · {lastRead.surahName}
              </Link>
            ) : (
              <Link href="/surah/1"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-0.5">
                <BookOpen size={16} /> Start Reading
              </Link>
            )}
            <Link href="/search"
              className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-xl text-sm font-semibold hover:border-primary/40 hover:bg-primary/5 transition-all">
              <Search size={16} /> Search Quran
            </Link>
          </motion.div>
        </Container>
      </motion.section>

      {/* ── Daily Ayah ── */}
      {dailyAyah && (
        <section className="relative">
          <Container className="py-8">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
              className="card p-6 sm:p-8 relative overflow-hidden">
              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-accent/10 to-transparent rounded-bl-[3rem]" />

              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Star size={16} className="text-accent" />
                </div>
                <span className="text-sm font-semibold text-accent">Ayah of the Day</span>
                <span className="text-xs text-muted ml-auto">{dailyAyah.surah.name_simple} · {dailyAyah.verse.verse_key}</span>
              </div>

              <p className="text-right leading-[2.2] mb-5" dir="rtl"
                style={{ fontSize: "28px", fontFamily: "var(--font-amiri)" }}>
                {dailyAyah.verse.text_uthmani}
              </p>

              <div className="w-16 h-px bg-border mx-auto mb-4" />

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

      {/* ── Feature Cards ── */}
      <section>
        <Container className="py-8">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-lg font-bold mb-5">
            Explore
          </motion.h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {featureLinks.map((f, i) => (
              <FeatureCard key={f.href} {...f} delay={i} />
            ))}
          </div>
        </Container>
      </section>

      {/* ── Surah List ── */}
      <section>
        <Container className="py-8 pb-16">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold">All 114 Surahs</h2>
            <span className="text-xs text-muted">{filtered.length} surahs</span>
          </motion.div>

          {/* Filters */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input type="text" placeholder="Search by name, number, or Arabic..." value={query} onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border rounded-xl text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all" />
            </div>
            <select value={filter} onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-2.5 bg-surface border border-border rounded-xl text-sm outline-none focus:border-primary">
              <option value="all">All Surahs</option>
              <option value="meccan">Meccan</option>
              <option value="medinan">Medinan</option>
            </select>
            <button onClick={() => setSort(sort === "asc" ? "desc" : "asc")}
              className="flex items-center gap-1.5 px-3 py-2.5 bg-surface border border-border rounded-xl text-sm hover:border-primary transition-colors">
              <ArrowUpDown size={16} />{sort === "asc" ? "1 → 114" : "114 → 1"}
            </button>
          </motion.div>

          {error && <div className="text-center py-8 text-red-500 text-sm">{error}</div>}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="h-[72px] bg-surface border border-border rounded-xl animate-pulse" />
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
