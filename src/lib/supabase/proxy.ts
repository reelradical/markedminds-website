import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { NextRequest, NextResponse } from "next/server";

import { getSupabasePublicConfig } from "@/lib/supabase/config";

type PendingCookie = {
  name: string;
  value: string;
  options: CookieOptions;
};

export type SupabaseSessionRefresh = {
  cookies: PendingCookie[];
  headers: Headers;
};

export async function refreshSupabaseSession(
  request: NextRequest,
): Promise<SupabaseSessionRefresh> {
  const config = getSupabasePublicConfig();
  const pendingCookies: PendingCookie[] = [];
  const pendingHeaders = new Headers();

  if (!config) {
    return { cookies: pendingCookies, headers: pendingHeaders };
  }

  const supabase = createServerClient(config.url, config.publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: PendingCookie[], cacheHeaders: Record<string, string>) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          pendingCookies.push({ name, value, options });
        });
        Object.entries(cacheHeaders).forEach(([name, value]) => {
          pendingHeaders.set(name, value);
        });
      },
    },
  });

  // getClaims verifies and refreshes the token when needed. Authorization is
  // still enforced in the protected Server Component, not in the proxy alone.
  await supabase.auth.getClaims();

  return { cookies: pendingCookies, headers: pendingHeaders };
}

export function applySupabaseSession(
  response: NextResponse,
  refresh: SupabaseSessionRefresh,
) {
  refresh.cookies.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options);
  });
  ["cache-control", "expires", "pragma"].forEach((name) => {
    const value = refresh.headers.get(name);

    if (value) {
      response.headers.set(name, value);
    }
  });

  return response;
}
