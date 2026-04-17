import { success, handleError } from "@/lib/api-response";
import { getCached, setCache } from "@/lib/cache";

const BASE = "https://api.quran.com/api/v4";
const CACHE_KEY = "surahs:all";
const CACHE_TTL = 1000 * 60 * 60 * 6; // 6 hours

export async function GET() {
  try {
    const cached = getCached<any[]>(CACHE_KEY);
    if (cached) return success(cached);

    const res = await fetch(`${BASE}/chapters?language=en`, { next: { revalidate: 86400 } });
    if (!res.ok) throw new Error("Failed to fetch surahs");
    const data = await res.json();

    setCache(CACHE_KEY, data.chapters, CACHE_TTL);
    return success(data.chapters);
  } catch (err) {
    return handleError(err);
  }
}
