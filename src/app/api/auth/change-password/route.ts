import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { success, error, unauthorized, handleError, tooManyRequests } from "@/lib/api-response";
import { rateLimit } from "@/lib/rate-limit";
import bcrypt from "bcryptjs";
import { z } from "zod";

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(128)
    .regex(/[A-Z]/, "Must contain uppercase")
    .regex(/[a-z]/, "Must contain lowercase")
    .regex(/[0-9]/, "Must contain number"),
});

export async function POST(req: Request) {
  try {
    const auth = await getAuthUser();
    if (!auth) return unauthorized();

    const rl = rateLimit(`chpwd:${auth.userId}`, 5, 15 * 60 * 1000);
    if (!rl.allowed) return tooManyRequests(rl.retryAfterMs);

    const text = await req.text();
    if (text.length > 1024) return error("Request too large", 413);

    const body = JSON.parse(text);
    const data = schema.parse(body);

    const user = await prisma.user.findUnique({ where: { id: auth.userId } });
    if (!user) return unauthorized();

    const valid = await bcrypt.compare(data.currentPassword, user.password);
    if (!valid) return error("Current password is incorrect", 401);

    if (data.currentPassword === data.newPassword) return error("New password must be different", 400);

    const hashed = await bcrypt.hash(data.newPassword, 12);
    await prisma.user.update({ where: { id: auth.userId }, data: { password: hashed } });

    return success({ message: "Password changed successfully" });
  } catch (err) {
    return handleError(err);
  }
}
