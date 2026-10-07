"use client";

import { useState } from "react";

import { createBrowserSupabaseClient } from "@/lib/supabase/client";

const PLANNER_HOSTNAME = "maps.markedminds.com";

export function GoogleSignInButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function signIn() {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const callbackUrl = new URL("/auth/callback", window.location.origin);
      callbackUrl.searchParams.set(
        "next",
        window.location.hostname === PLANNER_HOSTNAME ? "/" : "/planner",
      );

      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: callbackUrl.toString(),
        },
      });

      if (error) {
        throw error;
      }
    } catch {
      setErrorMessage("Sign-in could not be started. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={signIn}
        disabled={isLoading}
        className="flex min-h-12 w-full items-center justify-center rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-charcoal disabled:cursor-wait disabled:opacity-65"
      >
        {isLoading ? "Opening Google…" : "Continue with Google"}
      </button>
      {errorMessage ? (
        <p role="alert" className="mt-3 text-sm leading-6 text-red-700">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
