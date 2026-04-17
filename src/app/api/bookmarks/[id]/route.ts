import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { bookmarkIdSchema } from "@/lib/validations";
import { success, error, unauthorized, handleError } from "@/lib/api-response";
import { sanitize } from "@/lib/sanitize";
import { z } from "zod";

const updateSchema = z.object({ note: z.string().max(1000) });
const MAX_BODY = 2048;

async function getOwnedBookmark(rawId: string, userId: string) {
  const id = bookmarkIdSchema.parse(rawId);
  const bm = await prisma.bookmark.findUnique({ where: { id } });
  if (!bm || bm.userId !== userId) return null;
  return bm;
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getAuthUser();
    if (!auth) return unauthorized();

    const { id } = await params;
    const bm = await getOwnedBookmark(id, auth.userId);
    if (!bm) return error("Bookmark not found", 404);

    const text = await req.text();
    if (text.length > MAX_BODY) return error("Request too large", 413);

    const body = JSON.parse(text);
    const data = updateSchema.parse(body);

    const updated = await prisma.bookmark.update({
      where: { id: bm.id },
      data: { note: sanitize(data.note) },
    });
    return success(updated);
  } catch (err) {
    return handleError(err);
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getAuthUser();
    if (!auth) return unauthorized();

    const { id } = await params;
    const bm = await getOwnedBookmark(id, auth.userId);
    if (!bm) return error("Bookmark not found", 404);

    await prisma.bookmark.delete({ where: { id: bm.id } });
    return success({ message: "Deleted" });
  } catch (err) {
    return handleError(err);
  }
}
