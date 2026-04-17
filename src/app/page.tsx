"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiGetSurahs, apiGetDailyAyah, apiGetReadingProgress, type SurahDTO, type DailyAyahDTO, type ReadingProgressDTO } from "@/utils/api";
import { useAuthStore } from "@/store/useAuthStore";
import SurahCard from "@/components/quran/SurahCard";
import Container from "@/components/ui/Container";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Search, ArrowUpDown, BookOpen, Star, HandHeart } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HomePage() {
  const { user, loading: authLoading } = useAuthStore();
  const router = useRouter();
  const [surahs, setSurahs] = useState<SurahDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "meccan" | "medinan">("all");
  const [sort, setSort] = useState<"asc" | "desc">("asc");
  const [error, setError] = useState("");
  const [dailyAyah, setDailyAyah] = useState<DailyAyahDTO | null>(null);
  const [lastRead, setLastRead] = useState<ReadingProgressDTO | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.replace("/login"); return; }
    Promise.all([
      apiGetSurahs().then(setSurahs),
      apiGetDailyAyah().then(setDailyAyah).catch(() => {}),
      apiGetReadingProgress().then(setLastRead).catch(() => {}),
    ])
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [user, authLoading, router]);

  if (authLoading || !user) return <div className="min-h-screen bg-surface-alt" />;

  const filtered = surahs
    .filter((s) => {
      const matchQ = s.name_simple.toLowerCase().includes(query.toLowerCase()) || s.name_arabic.includes(query) || s.id.toString() === query;
      const matchF = filter === "all" || s.revelation_place.toLowerCase() === filter;
      return matchQ && matchF;
    })
    .sort((a, b) => (sort === "asc" ? a.id - b.id : b.id - a.id));

  return (
    <main className="min-h-screen bg-surface-alt">
      <Navbar />
      <Container className="py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Assalamu Alaikum, {user.name.split(" ")[0]}</h1>
          <p className="text-muted text-sm">Read, listen, and reflect on the divine words.</p>
        </div>

        {/* Feature Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
          {/* Daily Ayah */}
          {dailyAyah && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card p-5 sm:col-span-2 lg:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <Star size={16} className="text-accent" />
                <span className="text-xs font-medium text-accent">Ayah of the Day</span>
                <span className="text-xs text-muted ml-auto">{dailyAyah.surah.name_simple} · {dailyAyah.verse.verse_key}</span>
              </div>
              <p className="text-right leading-[2] mb-3" dir="rtl"
                style={{ fontSize: "24px", fontFamily: "var(--font-amiri)" }}>
                {dailyAyah.verse.text_uthmani}
              </p>
              <p className="text-sm text-muted leading-relaxed"
                dangerouslySetInnerHTML={{ __html: dailyAyah.verse.translations?.[0]?.text || "" }} />
              <Link href={`/surah/${dailyAyah.surah.id}?ayah=${dailyAyah.verse.verse_number}`}
                className="text-xs text-primary font-medium mt-3 inline-block hover:underline">
                Read in context →
              </Link>
            </motion.div>
          )}

          {/* Continue Reading / Quick Links */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="card p-5 flex flex-col justify-between">
            {lastRead ? (
              <>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen size={16} className="text-primary" />
                    <span className="text-xs font-medium text-primary">Continue Reading</span>
                  </div>
                  <p className="font-semibold">{lastRead.surahName}</p>
                  <p className="text-xs text-muted">Ayah {lastRead.ayahNumber}</p>
                </div>
                <Link href={`/surah/${lastRead.surahId}?ayah=${lastRead.ayahNumber}`}
                  className="mt-4 block text-center py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
                  Resume
                </Link>
              </>
            ) : (
              <>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen size={16} className="text-primary" />
                    <span className="text-xs font-medium text-primary">Start Reading</span>
                  </div>
                  <p className="text-sm text-muted">Begin your Quran journey today.</p>
                </div>
                <Link href="/surah/1"
                  className="mt-4 block text-center py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
                  Start with Al-Fatihah
                </Link>
              </>
            )}
          </motion.div>
        </div>

        {/* Quick Links */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
          <Link href="/tasbih" className="card px-4 py-2.5 flex items-center gap-2 text-sm font-medium whitespace-nowrap hover:border-primary/30 transition-colors">
            📿 Tasbih
          </Link>
          <Link href="/duas" className="card px-4 py-2.5 flex items-center gap-2 text-sm font-medium whitespace-nowrap hover:border-primary/30 transition-colors">
            🤲 Duas
          </Link>
          <Link href="/bookmarks" className="card px-4 py-2.5 flex items-center gap-2 text-sm font-medium whitespace-nowrap hover:border-primary/30 transition-colors">
            🔖 Bookmarks
          </Link>
          <Link href="/profile" className="card px-4 py-2.5 flex items-center gap-2 text-sm font-medium whitespace-nowrap hover:border-primary/30 transition-colors">
            👤 Profile
          </Link>
        </div>

        {/* Surah List */}
        <h2 className="text-lg font-bold mb-4">All Surahs</h2>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input type="text" placeholder="Search surah..." value={query} onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border rounded-lg text-sm outline-none focus:border-primary transition-colors" />
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-2.5 bg-surface border border-border rounded-lg text-sm outline-none focus:border-primary">
            <option value="all">All</option>
            <option value="meccan">Meccan</option>
            <option value="medinan">Medinan</option>
          </select>
          <button onClick={() => setSort(sort === "asc" ? "desc" : "asc")}
            className="flex items-center gap-1.5 px-3 py-2.5 bg-surface border border-border rounded-lg text-sm hover:border-primary transition-colors">
            <ArrowUpDown size={16} />{sort === "asc" ? "1→114" : "114→1"}
          </button>
        </div>

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
      <Footer />
    </main>
  );
}
