import { NextResponse, type NextRequest } from "next/server";

import { getTrustedRequestOrigin } from "@/lib/supabase/redirects";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const origin = getTrustedRequestOrigin(request);

  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.signOut({ scope: "local" });

    if (error) {
      return NextResponse.redirect(new URL("/planner?error=logout", origin), {
        status: 303,
        headers: { "Cache-Control": "private, no-store" },
      });
    }
  } catch {
    return NextResponse.redirect(new URL("/login?error=configuration", origin), {
      status: 303,
      headers: { "Cache-Control": "private, no-store" },
    });
  }

  return NextResponse.redirect(new URL("/login", origin), {
    status: 303,
    headers: { "Cache-Control": "private, no-store" },
  });
}
