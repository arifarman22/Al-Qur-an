import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Security headers
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-XSS-Protection", "1; mode=block");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  if (process.env.NODE_ENV === "production") {
    res.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }

  // Block non-JSON content types on API POST/PATCH/DELETE
  if (req.nextUrl.pathname.startsWith("/api/")) {
    const method = req.method.toUpperCase();
    if (["POST", "PATCH", "PUT", "DELETE"].includes(method)) {
      const ct = req.headers.get("content-type") || "";
      if (method !== "DELETE" && !ct.includes("application/json")) {
        return NextResponse.json(
          { success: false, error: "Content-Type must be application/json" },
          { status: 415 }
        );
      }
    }
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
