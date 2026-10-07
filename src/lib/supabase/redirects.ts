import type { NextRequest } from "next/server";

const PLANNER_HOSTNAME = "maps.markedminds.com";

export function sanitizeNextPath(value: string | null, fallback: string) {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\") ||
    /[\u0000-\u001F\u007F]/.test(value)
  ) {
    return fallback;
  }

  return value;
}

export function getTrustedRequestOrigin(request: NextRequest) {
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();

  if (forwardedHost?.split(":")[0] === PLANNER_HOSTNAME) {
    return `https://${PLANNER_HOSTNAME}`;
  }

  return request.nextUrl.origin;
}
