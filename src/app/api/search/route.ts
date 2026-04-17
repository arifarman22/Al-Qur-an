import { searchSchema } from "@/lib/validations";
import { success, handleError, tooManyRequests } from "@/lib/api-response";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { getCached, setCache } from "@/lib/cache";

const BASE = "https://api.quran.com/api/v4";

export async function GET(req: Request) {
  try {
    const ip = getClientIp(req);
    const rl = rateLimit(`search:${ip}`, 20, 60 * 1000);
    if (!rl.allowed) return tooManyRequests(rl.retryAfterMs);

    const { searchParams } = new URL(req.url);
    const { q } = searchSchema.parse({ q: searchParams.get("q") || "" });

    const cacheKey = `search:${q.toLowerCase()}`;
    const cached = getCached<any[]>(cacheKey);
    if (cached) return success(cached);

    const res = await fetch(`${BASE}/search?q=${encodeURIComponent(q)}&size=20&page=1&language=en`);
    if (!res.ok) throw new Error("Search failed");
    const data = await res.json();
    const results = data.search?.results || [];

    setCache(cacheKey, results, 1000 * 60 * 30); // 30 min cache
    return success(results);
  } catch (err) {
    return handleError(err);
  }
}
