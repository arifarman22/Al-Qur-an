import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const SECRET = process.env.JWT_SECRET;
const JWT_SECRET = SECRET || "dev-only-fallback-secret-not-for-production";

function getSecret(): string {
  if (process.env.NODE_ENV === "production" && (!SECRET || SECRET.length < 32)) {
    throw new Error("JWT_SECRET must be set and at least 32 characters in production");
  }
  return JWT_SECRET;
}

const TOKEN_NAME = "qtoken";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days
const ISSUER = "al-quran-app";

export interface JwtPayload {
  userId: string;
  email: string;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, getSecret(), {
    expiresIn: MAX_AGE,
    issuer: ISSUER,
    audience: "al-quran-web",
  });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, getSecret(), {
      issuer: ISSUER,
      audience: "al-quran-web",
    }) as jwt.JwtPayload & JwtPayload;
    if (!decoded.userId || !decoded.email) return null;
    return { userId: decoded.userId, email: decoded.email };
  } catch {
    return null;
  }
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: MAX_AGE,
    path: "/",
  });
}

export async function removeAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_NAME, "", { httpOnly: true, maxAge: 0, path: "/" });
}

export async function getAuthUser(): Promise<JwtPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}
