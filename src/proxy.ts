import { type NextRequest, NextResponse } from "next/server";

const PLANNER_HOSTNAME = "app.markedminds.com";

// Repository-side preparation for the future Planner subdomain. This is inert
// on localhost and on markedminds.com. Once app.markedminds.com is assigned to
// this Vercel project, clean app URLs will resolve to the internal /planner
// route tree without changing the application's canonical code structure.
export function proxy(request: NextRequest) {
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const requestHost = forwardedHost ?? request.headers.get("host") ?? request.nextUrl.hostname;
  const hostname = requestHost.split(":")[0];

  if (hostname !== PLANNER_HOSTNAME) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  // Keep application APIs, public files, and already-internal routes stable.
  if (pathname.startsWith("/api") || pathname.startsWith("/planner") || pathname.includes(".")) {
    return NextResponse.next();
  }

  const destination = request.nextUrl.clone();
  destination.pathname = pathname === "/" ? "/planner" : `/planner${pathname}`;

  return NextResponse.rewrite(destination);
}

export const config = {
  matcher: "/:path*",
};
