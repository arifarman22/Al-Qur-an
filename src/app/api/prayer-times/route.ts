import { success, handleError } from "@/lib/api-response";
import { getCached, setCache } from "@/lib/cache";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get("lat") || "23.8103";
    const lng = searchParams.get("lng") || "90.4125";
    const method = searchParams.get("method") || "1"; // University of Islamic Sciences, Karachi

    const today = new Date();
    const dateStr = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
    const cacheKey = `prayer:${lat}:${lng}:${dateStr}`;

    const cached = getCached<any>(cacheKey);
    if (cached) return success(cached);

    const res = await fetch(
      `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${lat}&longitude=${lng}&method=${method}&school=1`
    );
    if (!res.ok) throw new Error("Failed to fetch prayer times");
    const data = await res.json();

    const result = {
      timings: data.data.timings,
      date: data.data.date,
      meta: data.data.meta,
    };

    setCache(cacheKey, result, 1000 * 60 * 30); // 30 min cache
    return success(result);
  } catch (err) {
    return handleError(err);
  }
}
