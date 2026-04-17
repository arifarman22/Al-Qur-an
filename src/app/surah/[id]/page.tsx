"use client";

import { useEffect, useState, use, useCallback } from "react";
import { useRouter } from "next/navigation";
import { apiGetSurah, apiGetAyahs, apiGetSurahInfo, apiGetBookmarks, apiSaveReadingProgress, type SurahDTO, type SurahInfoDTO, type AyahDTO } from "@/utils/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { getSurahImage } from "@/utils/surah-images";
import AyahItem from "@/components/quran/AyahItem";
import Container from "@/components/ui/Container";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ChevronLeft, MapPin, BookOpen, Hash, Layers, FileText, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SurahDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user, loading: authLoading } = useAuthStore();
  const { arabicScript } = useSettingsStore();
  const router = useRouter();
  const [surah, setSurah] = useState<SurahDTO | null>(null);
  const [surahInfo, setSurahInfo] = useState<SurahInfoDTO | null>(null);
  const [ayahs, setAyahs] = useState<AyahDTO[]>([]);
  const [bookmarkMap, setBookmarkMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFullHistory, setShowFullHistory] = useState(false);

  const loadBookmarks = useCallback(async () => {
    try {
      const bms = await apiGetBookmarks();
      const map: Record<string, string> = {};
      bms.forEach((b) => { map[b.verseKey] = b.id; });
      setBookmarkMap(map);
    } catch {}
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.replace("/login"); return; }
    Promise.all([
      apiGetSurah(+id),
      apiGetSurahInfo(+id).catch(() => null),
      apiGetAyahs(+id, arabicScript),
      loadBookmarks(),
    ])
      .then(([s, info, a]) => { setSurah(s); setSurahInfo(info); setAyahs(a); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id, arabicScript, user, authLoading, router, loadBookmarks]);

  if (authLoading || !user) return <div className="min-h-screen bg-surface-alt" />;

  if (loading) {
    return (
      <main className="min-h-screen bg-surface-alt">
        <Navbar />
        <Container className="py-8 space-y-4">
          <div className="h-64 bg-surface border border-border rounded-xl animate-pulse" />
          <div className="h-40 bg-surface border border-border rounded-xl animate-pulse" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-48 bg-surface border border-border rounded-xl animate-pulse" />
          ))}
        </Container>
      </main>
    );
  }

  if (error || !surah) return (
    <main className="min-h-screen bg-surface-alt">
      <Navbar />
      <Container className="py-8"><div className="text-center text-red-500 py-20">{error || "Surah not found"}</div></Container>
    </main>
  );

  const imageUrl = getSurahImage(surah.id, surah.revelation_place);

  return (
    <main className="min-h-screen bg-surface-alt pb-32">
      <Navbar />
      <Container className="py-8">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground mb-6 transition-colors">
          <ChevronLeft size={16} />Back to Surahs
        </Link>

        {/* Hero Header with Image */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="card overflow-hidden mb-8"
        >
          <div className="relative h-48 sm:h-56">
            <img
              src={imageUrl}
              alt={`${surah.name_simple} - ${surah.revelation_place}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2.5 py-0.5 bg-white/20 backdrop-blur-sm rounded-md text-xs font-medium">
                      Surah {surah.id}
                    </span>
                    <span className="px-2.5 py-0.5 bg-white/20 backdrop-blur-sm rounded-md text-xs font-medium capitalize">
                      {surah.revelation_place}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold">{surah.name_simple}</h1>
                  <p className="text-white/70 text-sm mt-1">{surah.translated_name.name}</p>
                </div>
                <p className="text-4xl sm:text-5xl font-bold text-white/90" style={{ fontFamily: "var(--font-amiri)" }}>
                  {surah.name_arabic}
                </p>
              </div>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-border border-t border-border">
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-1.5 text-muted mb-1">
                <BookOpen size={14} />
                <span className="text-xs font-medium">Ayahs</span>
              </div>
              <p className="text-lg font-bold">{surah.verses_count}</p>
            </div>
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-1.5 text-muted mb-1">
                <Hash size={14} />
                <span className="text-xs font-medium">Revelation</span>
              </div>
              <p className="text-lg font-bold">#{surah.revelation_order}</p>
            </div>
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-1.5 text-muted mb-1">
                <MapPin size={14} />
                <span className="text-xs font-medium">Place</span>
              </div>
              <p className="text-lg font-bold capitalize">{surah.revelation_place}</p>
            </div>
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-1.5 text-muted mb-1">
                <Layers size={14} />
                <span className="text-xs font-medium">Pages</span>
              </div>
              <p className="text-lg font-bold">
                {surah.pages ? `${surah.pages[0]}–${surah.pages[1]}` : "—"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Surah Info / History */}
        {surahInfo && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-6 mb-8"
          >
            <div className="flex items-center gap-2 mb-3">
              <FileText size={16} className="text-primary" />
              <h2 className="font-semibold">About this Surah</h2>
            </div>

            {surahInfo.short_text && (
              <p className="text-sm text-muted leading-relaxed mb-4">{surahInfo.short_text}</p>
            )}

            {surahInfo.text && (
              <>
                <div
                  className={`text-sm text-muted leading-relaxed prose prose-sm max-w-none ${!showFullHistory ? "line-clamp-6" : ""}`}
                  dangerouslySetInnerHTML={{ __html: surahInfo.text }}
                />
                <button
                  onClick={() => setShowFullHistory(!showFullHistory)}
                  className="flex items-center gap-1 text-primary text-xs font-medium mt-3 hover:underline"
                >
                  {showFullHistory ? (
                    <>Show less <ChevronUp size={14} /></>
                  ) : (
                    <>Read full history <ChevronDown size={14} /></>
                  )}
                </button>
              </>
            )}

            {surahInfo.source && (
              <p className="text-[11px] text-muted/60 mt-4 pt-3 border-t border-border">
                Source: {surahInfo.source}
              </p>
            )}
          </motion.div>
        )}

        {/* Bismillah */}
        {surah.id !== 1 && surah.id !== 9 && (
          <div className="text-center py-6 mb-6">
            <p className="text-3xl" style={{ fontFamily: "var(--font-amiri)" }}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
          </div>
        )}

        {/* Verses */}
        <div className="space-y-4">
          {ayahs.map((ayah) => (
            <AyahItem
              key={ayah.id}
              ayah={ayah}
              surahId={surah.id}
              surahName={surah.name_simple}
              bookmarkId={bookmarkMap[ayah.verse_key]}
              onBookmarkChange={loadBookmarks}
              onRead={(verseNum) => {
                apiSaveReadingProgress(surah.id, surah.name_simple, verseNum).catch(() => {});
              }}
            />
          ))}
        </div>
      </Container>
      <Footer />
    </main>
  );
}
