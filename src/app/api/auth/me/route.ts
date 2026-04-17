import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { success, unauthorized, handleError } from "@/lib/api-response";

export async function GET() {
  try {
    const auth = await getAuthUser();
    if (!auth) return unauthorized();

    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: { id: true, name: true, email: true },
    });
    if (!user) return unauthorized("Session expired");

    return success(user);
  } catch (err) {
    return handleError(err);
  }
}
