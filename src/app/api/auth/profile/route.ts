import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { success, error, unauthorized, handleError } from "@/lib/api-response";
import { sanitize } from "@/lib/sanitize";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(2).max(100).trim().regex(/^[a-zA-Z\s\-'.]+$/, "Invalid name"),
});

export async function GET() {
  try {
    const auth = await getAuthUser();
    if (!auth) return unauthorized();

    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: { id: true, name: true, email: true, createdAt: true, _count: { select: { bookmarks: true } } },
    });
    if (!user) return unauthorized();

    const progress = await prisma.readingProgress.findUnique({ where: { userId: auth.userId } });

    return success({
      ...user,
      bookmarkCount: user._count.bookmarks,
      lastRead: progress ? { surahId: progress.surahId, surahName: progress.surahName, ayahNumber: progress.ayahNumber, updatedAt: progress.updatedAt } : null,
    });
  } catch (err) {
    return handleError(err);
  }
}

export async function PATCH(req: Request) {
  try {
    const auth = await getAuthUser();
    if (!auth) return unauthorized();

    const text = await req.text();
    if (text.length > 1024) return error("Request too large", 413);

    const body = JSON.parse(text);
    const data = updateSchema.parse(body);

    const user = await prisma.user.update({
      where: { id: auth.userId },
      data: { name: sanitize(data.name) },
      select: { id: true, name: true, email: true },
    });

    return success(user);
  } catch (err) {
    return handleError(err);
  }
}
