import { success, handleError } from "@/lib/api-response";
import { getCached, setCache } from "@/lib/cache";

const BASE = "https://api.quran.com/api/v4";

// Deterministic "random" based on date — same ayah for everyone on the same day
function getDailyVerseKey(): string {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  // Total ayahs in Quran: 6236
  const ayahIndex = seed % 6236;

  // Map index to surah:ayah using cumulative verse counts
  const verseCounts = [7,286,200,176,120,165,206,75,129,109,123,111,43,52,99,128,111,110,98,135,112,78,118,64,77,227,93,88,69,60,34,30,73,54,45,83,182,88,75,85,54,53,89,59,37,35,38,29,18,45,60,49,62,55,78,96,29,22,24,13,14,11,11,18,12,12,30,52,52,44,28,28,20,56,40,31,50,40,46,42,29,19,36,25,22,17,19,26,30,20,15,21,11,8,8,19,5,8,8,11,11,8,3,9,5,4,7,3,6,3,5,4,5,6];
  let cumulative = 0;
  for (let i = 0; i < verseCounts.length; i++) {
    cumulative += verseCounts[i];
    if (ayahIndex < cumulative) {
      const verseNum = verseCounts[i] - (cumulative - ayahIndex - 1);
      return `${i + 1}:${verseNum}`;
    }
  }
  return "1:1";
}

export async function GET() {
  try {
    const verseKey = getDailyVerseKey();
    const cacheKey = `daily:${verseKey}`;
    const cached = getCached<any>(cacheKey);
    if (cached) return success(cached);

    const [surahId, verseNum] = verseKey.split(":");
    const [verseRes, surahRes] = await Promise.all([
      fetch(`${BASE}/verses/by_key/${verseKey}?language=en&words=false&translations=131,161&fields=text_uthmani`),
      fetch(`${BASE}/chapters/${surahId}?language=en`),
    ]);

    if (!verseRes.ok || !surahRes.ok) throw new Error("Failed to fetch daily ayah");

    const verseData = await verseRes.json();
    const surahData = await surahRes.json();

    const result = {
      verse: verseData.verse,
      surah: {
        id: surahData.chapter.id,
        name_simple: surahData.chapter.name_simple,
        name_arabic: surahData.chapter.name_arabic,
      },
    };

    // Cache until midnight
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    setCache(cacheKey, result, midnight.getTime() - now.getTime());

    return success(result);
  } catch (err) {
    return handleError(err);
  }
}
