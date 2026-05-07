"use client";

import { useEffect, useState, use } from "react";
import { apiGetSurah, apiGetAyahs, type SurahDTO, type AyahDTO } from "@/utils/api";
import { useSettingsStore } from "@/store/useSettingsStore";
import AyahItem from "@/components/quran/AyahItem";
import QuranReaderLayout from "@/components/quran-reader/QuranReaderLayout";

export default function SurahDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { arabicScript } = useSettingsStore();
  const [surah, setSurah] = useState<SurahDTO | null>(null);
  const [ayahs, setAyahs] = useState<AyahDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([apiGetSurah(+id), apiGetAyahs(+id, arabicScript)])
      .then(([s, a]) => { setSurah(s); setAyahs(a); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id, arabicScript]);

  const isMakkah = surah?.revelation_place?.toLowerCase() === "makkah";

  return (
    <QuranReaderLayout
      surahName={surah?.name_simple}
      surahArabic={surah?.name_arabic}
      ayahCount={surah?.verses_count}
      revelationPlace={surah?.revelation_place}
    >
      {loading ? (
        <div className="p-6 space-y-4">
          <div className="h-40 bg-surface-alt rounded-xl animate-pulse" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-surface-alt rounded-xl animate-pulse" />
          ))}
        </div>
      ) : surah ? (
        <div>
          <section className="relative overflow-hidden">
            <div className="grid grid-cols-1 items-center px-4 py-5 md:px-8 md:grid-cols-3 gap-y-4">
              <div className="hidden md:block w-[120px] opacity-70">
                <img src={isMakkah ? "/images/makkah.png" : "/images/makkah.png"} alt={isMakkah ? "Makkah" : "Madinah"} className="w-full" />
              </div>
              <div className="text-center space-y-2">
                <h1 className="text-lg md:text-xl font-semibold">{surah.name_simple}</h1>
                <p className="text-sm text-subtitle capitalize">Ayah-{surah.verses_count}, {surah.revelation_place}</p>
              </div>
              <div className="hidden md:block text-right">
                <p className="text-3xl text-primary font-bold" style={{ fontFamily: "var(--font-kfgq)" }}>{surah.name_arabic}</p>
              </div>
            </div>
          </section>

          {surah.id !== 1 && surah.id !== 9 && (
            <div className="text-center py-6 border-b border-border">
              <p className="text-2xl md:text-3xl text-foreground" style={{ fontFamily: "var(--font-kfgq)" }}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
            </div>
          )}

          <div>
            {ayahs.map((ayah) => (
              <AyahItem key={ayah.id} ayah={ayah} surahId={surah.id} surahName={surah.name_simple} />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-muted">Surah not found</div>
      )}
    </QuranReaderLayout>
  );
}
