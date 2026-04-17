import { surahIdSchema } from "@/lib/validations";
import { success, error, handleError } from "@/lib/api-response";

const BASE = "https://api.quran.com/api/v4";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: rawId } = await params;
    const id = surahIdSchema.parse(rawId);

    const res = await fetch(`${BASE}/chapters/${id}/info?language=en`, { next: { revalidate: 86400 } });
    if (!res.ok) return error("Surah info not found", 404);
    const data = await res.json();

    return success(data.chapter_info);
  } catch (err) {
    return handleError(err);
  }
}
