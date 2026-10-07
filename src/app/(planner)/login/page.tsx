import type { Metadata } from "next";
import Link from "next/link";

import { GoogleSignInButton } from "@/components/planner/google-sign-in-button";
import { PlannerBrand } from "@/components/planner/planner-navigation";
import { site } from "@/lib/data/site";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Sign in | Marked Minds Planner",
  description: "Sign in to Marked Minds Planner.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export const dynamic = "force-dynamic";

type LoginPageProps = {
  searchParams: Promise<{ error?: string | string[] }>;
};

const errorMessages: Record<string, string> = {
  callback: "Google sign-in could not be completed. Please try again.",
  configuration: "Sign-in is not configured for this environment yet.",
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;
  const errorCode = Array.isArray(error) ? error[0] : error;
  const configurationReady = getSupabasePublicConfig() !== null;
  const message = errorCode ? errorMessages[errorCode] : undefined;

  return (
    <main id="main-content" className="min-h-screen bg-mist px-5 py-8 text-ink sm:px-8 sm:py-12">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl flex-col">
        <div className="flex items-center justify-between">
          <PlannerBrand />
          <Link href={`${site.url}/plan`} className="text-sm font-medium text-charcoal/60 hover:text-ink">
            About Planner
          </Link>
        </div>

        <div className="my-auto grid gap-8 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange-dark">
              Marked Minds Planner
            </p>
            <h1 className="mt-4 max-w-xl text-balance font-display text-4xl font-semibold tracking-tight sm:text-6xl">
              Plan for the class you actually have.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-charcoal/65 sm:text-lg">
              Sign in to enter the private planning workspace. Planning workflows remain inactive during this proof of concept.
            </p>
          </div>

          <section aria-labelledby="sign-in-heading" className="rounded-3xl border border-ink/8 bg-white p-6 shadow-sm sm:p-8">
            <h2 id="sign-in-heading" className="text-2xl font-semibold tracking-tight">
              Sign in
            </h2>
            <p className="mt-2 text-sm leading-6 text-charcoal/60">
              Use the Google account you want associated with Planner.
            </p>

            {message ? (
              <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm leading-6 text-red-800">
                {message}
              </p>
            ) : null}

            <div className="mt-6">
              {configurationReady ? (
                <GoogleSignInButton />
              ) : (
                <p role="status" className="rounded-xl bg-mist px-4 py-3 text-sm leading-6 text-charcoal/70">
                  Sign-in is not configured for this environment yet. Add the documented Supabase environment variables to enable it.
                </p>
              )}
            </div>

            <p className="mt-6 border-t border-ink/8 pt-5 text-xs leading-5 text-charcoal/50">
              Authentication is used only to protect your Planner workspace. No lesson or student data is collected in this phase.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
