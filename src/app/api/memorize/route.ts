import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { success, error, unauthorized, handleError } from "@/lib/api-response";
import { z } from "zod";

const updateSchema = z.object({
  surahId: z.number().int().min(1).max(114),
  surahName: z.string().min(1).max(100),
  status: z.enum(["not_started", "in_progress", "memorized"]),
});

export async function GET() {
  try {
    const auth = await getAuthUser();
    if (!auth) return unauthorized();

    const progress = await prisma.memorizationProgress.findMany({
      where: { userId: auth.userId },
      orderBy: { surahId: "asc" },
    });
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
    const data = updateSchema.parse(body);

    const progress = await prisma.memorizationProgress.upsert({
      where: { userId_surahId: { userId: auth.userId, surahId: data.surahId } },
      update: { status: data.status, surahName: data.surahName },
      create: { userId: auth.userId, surahId: data.surahId, surahName: data.surahName, status: data.status },
    });

    return success(progress);
  } catch (err) {
    return handleError(err);
  }
}
