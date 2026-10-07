import { type NextRequest, NextResponse } from "next/server";

import {
  applySupabaseSession,
  refreshSupabaseSession,
  type SupabaseSessionRefresh,
} from "@/lib/supabase/proxy";

const PLANNER_HOSTNAME = "maps.markedminds.com";

// Repository-side preparation for the future Planner subdomain. This is inert
// on localhost and on markedminds.com. Once maps.markedminds.com is assigned to
// this Vercel project, clean app URLs will resolve to the internal /planner
// route tree without changing the application's canonical code structure.
const PUBLIC_PLANNER_PATHS = ["/login", "/auth", "/logout"];

export async function proxy(request: NextRequest) {
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const requestHost = forwardedHost ?? request.headers.get("host") ?? request.nextUrl.hostname;
  const hostname = requestHost.split(":")[0];
  const { pathname } = request.nextUrl;
  const isPlannerHost = hostname === PLANNER_HOSTNAME;
  const isPlannerRequest =
    isPlannerHost ||
    pathname.startsWith("/planner") ||
    PUBLIC_PLANNER_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));

  let sessionRefresh: SupabaseSessionRefresh = { cookies: [], headers: new Headers() };

  if (isPlannerRequest) {
    try {
      sessionRefresh = await refreshSupabaseSession(request);
    } catch {
      // The protected Server Component performs the authoritative user check.
      // A temporary auth-service failure must not affect the marketing site.
    }

  }

  if (!isPlannerHost) {
    return applySupabaseSession(NextResponse.next({ request }), sessionRefresh);
  }

  // Keep auth endpoints, APIs, public files, and already-internal routes stable.
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/planner") ||
    PUBLIC_PLANNER_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`)) ||
    pathname.includes(".")
  ) {
    return applySupabaseSession(NextResponse.next({ request }), sessionRefresh);
  }

  const destination = request.nextUrl.clone();
  destination.pathname = pathname === "/" ? "/planner" : `/planner${pathname}`;

  return applySupabaseSession(NextResponse.rewrite(destination, { request }), sessionRefresh);
}

export const config = {
  matcher: "/:path*",
};
