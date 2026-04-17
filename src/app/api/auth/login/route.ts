import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations";
import { signToken, setAuthCookie } from "@/lib/auth";
import { success, error, handleError, tooManyRequests } from "@/lib/api-response";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import bcrypt from "bcryptjs";

const MAX_BODY = 1024;
const GENERIC_ERROR = "Invalid email or password";

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rl = rateLimit(`login:${ip}`, 10, 15 * 60 * 1000);
    if (!rl.allowed) return tooManyRequests(rl.retryAfterMs);

    const text = await req.text();
    if (text.length > MAX_BODY) return error("Request too large", 413);

    const body = JSON.parse(text);
    const data = loginSchema.parse(body);

    const user = await prisma.user.findUnique({ where: { email: data.email } });

    // Constant-time: always hash even if user not found (prevents timing attacks)
    const storedHash = user?.password || "$2a$12$000000000000000000000000000000000000000000000000000000";
    const valid = await bcrypt.compare(data.password, storedHash);

    if (!user || !valid) return error(GENERIC_ERROR, 401);

    const token = signToken({ userId: user.id, email: user.email });
    await setAuthCookie(token);

    return success({ id: user.id, name: user.name, email: user.email });
  } catch (err) {
    return handleError(err);
  }
}
