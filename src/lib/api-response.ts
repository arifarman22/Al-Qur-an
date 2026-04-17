import { NextResponse } from "next/server";
import { ZodError } from "zod";

const IS_PROD = process.env.NODE_ENV === "production";

const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

function withHeaders(res: NextResponse): NextResponse {
  for (const [key, val] of Object.entries(SECURITY_HEADERS)) {
    res.headers.set(key, val);
  }
  return res;
}

export function success(data: unknown, status = 200) {
  return withHeaders(NextResponse.json({ success: true, data }, { status }));
}

export function error(message: string, status = 400) {
  return withHeaders(NextResponse.json({ success: false, error: message }, { status }));
}

export function handleError(err: unknown) {
  if (err instanceof ZodError) {
    const msg = err.issues.map((e) => e.message).join(", ");
    return error(msg, 422);
  }
  if (IS_PROD) {
    console.error("[API Error]", err instanceof Error ? err.message : "Unknown");
    return error("Something went wrong", 500);
  }
  console.error("[API Error]", err);
  return error(err instanceof Error ? err.message : "Internal server error", 500);
}

export function unauthorized(message = "Unauthorized") {
  return error(message, 401);
}

export function forbidden(message = "Forbidden") {
  return error(message, 403);
}

export function tooManyRequests(retryAfterMs: number) {
  const res = error("Too many requests. Please try again later.", 429);
  res.headers.set("Retry-After", Math.ceil(retryAfterMs / 1000).toString());
  return res;
}
