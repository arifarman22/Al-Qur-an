"use client";

import { useEffect, useState, use, useCallback } from "react";
import { useRouter } from "next/navigation";
import { apiGetSurah, apiGetAyahs, apiGetBookmarks, apiSaveReadingProgress, type SurahDTO, type AyahDTO } from "@/utils/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import AyahItem from "@/components/quran/AyahItem";
import QuranReaderLayout from "@/components/quran-reader/QuranReaderLayout";

export default function SurahDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user, loading: authLoading } = useAuthStore();
  const { arabicScript } = useSettingsStore();
  const router = useRouter();
  const [surah, setSurah] = useState<SurahDTO | null>(null);
  const [ayahs, setAyahs] = useState<AyahDTO[]>([]);
  const [bookmarkMap, setBookmarkMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

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
    Promise.all([apiGetSurah(+id), apiGetAyahs(+id, arabicScript), loadBookmarks()])
      .then(([s, a]) => { setSurah(s); setAyahs(a); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id, arabicScript, user, authLoading, router, loadBookmarks]);

  if (authLoading || !user) return <div className="h-screen bg-background" />;

  return (
    <QuranReaderLayout
      surahName={surah?.name_simple}
      surahArabic={surah?.name_arabic}
      ayahCount={surah?.verses_count}
      revelationPlace={surah?.revelation_place}
    >
      {loading ? (
        <div className="p-6 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-40 bg-surface-alt border border-border rounded-xl animate-pulse" />
          ))}
        </div>
      ) : surah ? (
        <div className="p-4 md:p-6 space-y-4 max-w-4xl mx-auto">
          {/* Bismillah */}
          {surah.id !== 1 && surah.id !== 9 && (
            <div className="text-center py-6">
              <p className="text-3xl text-foreground" style={{ fontFamily: "var(--font-amiri)" }}>
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
            </div>
          )}

          {/* Ayahs */}
          {ayahs.map((ayah) => (
            <AyahItem
              key={ayah.id}
              ayah={ayah}
              surahId={surah.id}
              surahName={surah.name_simple}
              bookmarkId={bookmarkMap[ayah.verse_key]}
              onBookmarkChange={loadBookmarks}
              onRead={(vn) => apiSaveReadingProgress(surah.id, surah.name_simple, vn).catch(() => {})}
            />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-muted">Surah not found</div>
      )}
    </QuranReaderLayout>
  );
}
