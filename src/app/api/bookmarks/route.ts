import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { success, error, unauthorized, handleError, tooManyRequests } from "@/lib/api-response";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { sanitize } from "@/lib/sanitize";
import { z } from "zod";

const createSchema = z.object({
  verseKey: z.string().regex(/^\d{1,3}:\d{1,3}$/, "Invalid verse key"),
  surahId: z.number().int().min(1).max(114),
  surahName: z.string().min(1).max(100),
  ayahNumber: z.number().int().min(1).max(300),
  note: z.string().max(1000).optional().default(""),
});

const MAX_BODY = 4096;
const MAX_BOOKMARKS_PER_USER = 500;

export async function GET(req: Request) {
  try {
    const auth = await getAuthUser();
    if (!auth) return unauthorized();

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: auth.userId },
      orderBy: { createdAt: "desc" },
      take: MAX_BOOKMARKS_PER_USER,
    });

    return success(bookmarks);
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(req: Request) {
  try {
    const auth = await getAuthUser();
    if (!auth) return unauthorized();

    const ip = getClientIp(req);
    const rl = rateLimit(`bookmark:${auth.userId}`, 30, 60 * 1000);
    if (!rl.allowed) return tooManyRequests(rl.retryAfterMs);

    const text = await req.text();
    if (text.length > MAX_BODY) return error("Request too large", 413);

    const body = JSON.parse(text);
    const data = createSchema.parse(body);
    const note = sanitize(data.note || "");

    // Check bookmark limit
    const count = await prisma.bookmark.count({ where: { userId: auth.userId } });
    if (count >= MAX_BOOKMARKS_PER_USER) return error("Bookmark limit reached (500)", 400);

    const existing = await prisma.bookmark.findUnique({
      where: { userId_verseKey: { userId: auth.userId, verseKey: data.verseKey } },
    });
    if (existing) return error("Already bookmarked", 409);

    const bookmark = await prisma.bookmark.create({
      data: {
        userId: auth.userId,
        verseKey: data.verseKey,
        surahId: data.surahId,
        surahName: sanitize(data.surahName),
        ayahNumber: data.ayahNumber,
        note,
      },
    });

    return success(bookmark, 201);
  } catch (err) {
    return handleError(err);
  }
}
