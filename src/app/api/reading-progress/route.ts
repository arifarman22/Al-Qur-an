import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { success, error, unauthorized, handleError } from "@/lib/api-response";
import { z } from "zod";

const schema = z.object({
  surahId: z.number().int().min(1).max(114),
  surahName: z.string().min(1).max(100),
  ayahNumber: z.number().int().min(1).max(300),
});

export async function GET() {
  try {
    const auth = await getAuthUser();
    if (!auth) return unauthorized();

    const progress = await prisma.readingProgress.findUnique({ where: { userId: auth.userId } });
    return success(progress);
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(req: Request) {
  try {
    const auth = await getAuthUser();
    if (!auth) return unauthorized();

    const text = await req.text();
    if (text.length > 512) return error("Request too large", 413);

    const body = JSON.parse(text);
    const data = schema.parse(body);

    const progress = await prisma.readingProgress.upsert({
      where: { userId: auth.userId },
      update: { surahId: data.surahId, surahName: data.surahName, ayahNumber: data.ayahNumber },
      create: { userId: auth.userId, surahId: data.surahId, surahName: data.surahName, ayahNumber: data.ayahNumber },
    });

    return success(progress);
  } catch (err) {
    return handleError(err);
  }
}
