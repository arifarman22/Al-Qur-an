import { surahIdSchema } from "@/lib/validations";
import { success, handleError } from "@/lib/api-response";
import { getCached, setCache } from "@/lib/cache";

const BASE = "https://api.quran.com/api/v4";
const AUDIO_CDN = "https://audio.qurancdn.com";
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

async function fetchAllPages(baseUrl: string, dataKey: string, perPage = 50) {
  const all: any[] = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const res = await fetch(`${baseUrl}&per_page=${perPage}&page=${page}`);
    if (!res.ok) break;
    const data = await res.json();
    all.push(...(data[dataKey] || []));
    totalPages = data.pagination?.total_pages || 1;
    page++;
  }
  return all;
}

async function fetchAudioMap(surahId: number): Promise<Record<string, string>> {
  const cacheKey = `audio:${surahId}`;
  const cached = getCached<Record<string, string>>(cacheKey);
  if (cached) return cached;

  const audioFiles = await fetchAllPages(
    `${BASE}/recitations/7/by_chapter/${surahId}?`,
    "audio_files",
    50
  );

  const map: Record<string, string> = {};
  for (const af of audioFiles) {
    if (af.verse_key && af.url) {
      map[af.verse_key] = af.url.startsWith("http") ? af.url : `${AUDIO_CDN}/${af.url}`;
    }
  }

  setCache(cacheKey, map, CACHE_TTL);
  return map;
}

async function fetchVerses(surahId: number, script: string): Promise<any[]> {
  const cacheKey = `verses:${surahId}:${script}`;
  const cached = getCached<any[]>(cacheKey);
  if (cached) return cached;

  const verses = await fetchAllPages(
    `${BASE}/verses/by_chapter/${surahId}?language=en&words=false&translations=131,161&fields=${script}`,
    "verses",
    50
  );

  setCache(cacheKey, verses, CACHE_TTL);
  return verses;
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: rawId } = await params;
    const surahId = surahIdSchema.parse(rawId);

    const { searchParams } = new URL(req.url);
    const script = searchParams.get("script") === "indopak" ? "text_indopak" : "text_uthmani";

    // Fetch verses and audio in parallel
    const [verses, audioMap] = await Promise.all([
      fetchVerses(surahId, script),
      fetchAudioMap(surahId),
    ]);

    // Attach audio URL to each verse
    const enriched = verses.map((v: any) => ({
      ...v,
      audio_url: audioMap[v.verse_key] || null,
    }));

    return success(enriched);
  } catch (err) {
    return handleError(err);
  }
}
