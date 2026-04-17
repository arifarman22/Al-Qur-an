import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";
import { signToken, setAuthCookie } from "@/lib/auth";
import { success, error, handleError, tooManyRequests } from "@/lib/api-response";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { sanitize } from "@/lib/sanitize";
import bcrypt from "bcryptjs";

const MAX_BODY = 2048; // 2KB

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rl = rateLimit(`register:${ip}`, 5, 15 * 60 * 1000);
    if (!rl.allowed) return tooManyRequests(rl.retryAfterMs);

    const text = await req.text();
    if (text.length > MAX_BODY) return error("Request too large", 413);

    const body = JSON.parse(text);
    const data = registerSchema.parse(body);
    data.name = sanitize(data.name);

    const exists = await prisma.user.findUnique({ where: { email: data.email } });
    if (exists) return error("Email already registered", 409);

    const hashed = await bcrypt.hash(data.password, 12);
    const user = await prisma.user.create({
      data: { name: data.name, email: data.email, password: hashed },
    });

    const token = signToken({ userId: user.id, email: user.email });
    await setAuthCookie(token);

    return success({ id: user.id, name: user.name, email: user.email }, 201);
  } catch (err) {
    return handleError(err);
  }
}
