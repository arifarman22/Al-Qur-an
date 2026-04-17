import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { success, error, unauthorized, handleError } from "@/lib/api-response";
import { z } from "zod";

const completeSchema = z.object({
  lessonId: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/),
});

export async function GET() {
  try {
    const auth = await getAuthUser();
    if (!auth) return unauthorized();

    const progress = await prisma.learningProgress.findMany({
      where: { userId: auth.userId },
      orderBy: { completedAt: "desc" },
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
    const data = completeSchema.parse(body);

    const progress = await prisma.learningProgress.upsert({
      where: { userId_lessonId: { userId: auth.userId, lessonId: data.lessonId } },
      update: { completed: true, completedAt: new Date() },
      create: { userId: auth.userId, lessonId: data.lessonId, completed: true, completedAt: new Date() },
    });

    return success(progress);
  } catch (err) {
    return handleError(err);
  }
}
