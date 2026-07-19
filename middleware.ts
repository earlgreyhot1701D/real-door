// Edge middleware. Locks API routes to the app origin (CORS). No wildcard.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const origin = req.headers.get("origin") ?? "";
  const appOrigin = process.env.APP_ORIGIN ?? "http://localhost:3000";

  // Preflight
  if (req.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: corsHeaders(origin, appOrigin),
    });
  }

  const res = NextResponse.next();
  for (const [key, value] of Object.entries(corsHeaders(origin, appOrigin))) {
    res.headers.set(key, value);
  }
  return res;
}

function corsHeaders(origin: string, appOrigin: string): Record<string, string> {
  const allowed = origin === appOrigin ? origin : "";
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-session-id",
    "Access-Control-Max-Age": "86400",
  };
}

export const config = {
  matcher: "/api/:path*",
};
