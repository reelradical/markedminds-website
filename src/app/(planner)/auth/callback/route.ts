import { NextResponse, type NextRequest } from "next/server";

import { SupabaseConfigurationError } from "@/lib/supabase/config";
import { getTrustedRequestOrigin, sanitizeNextPath } from "@/lib/supabase/redirects";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function loginRedirect(request: NextRequest, error: "callback" | "configuration") {
  const destination = new URL("/login", getTrustedRequestOrigin(request));
  destination.searchParams.set("error", error);
  return NextResponse.redirect(destination, {
    headers: { "Cache-Control": "private, no-store" },
  });
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const next = sanitizeNextPath(request.nextUrl.searchParams.get("next"), "/planner");

  if (!code) {
    return loginRedirect(request, "callback");
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return loginRedirect(request, "callback");
    }

    return NextResponse.redirect(new URL(next, getTrustedRequestOrigin(request)), {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    if (error instanceof SupabaseConfigurationError) {
      return loginRedirect(request, "configuration");
    }

    return loginRedirect(request, "callback");
  }
}
