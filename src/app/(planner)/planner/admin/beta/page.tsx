import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { guidedRevisionIntents } from "@/lib/planner/plan-contract";
import {
  BetaInsightsDataError,
  getMapsBetaInsights,
  type MapsBetaInsightsView,
} from "@/server/dal/beta-insights";

export const metadata: Metadata = {
  title: "Private beta insights",
  description: "Internal MAPS private-beta product metrics.",
};

export const dynamic = "force-dynamic";

const integerFormatter = new Intl.NumberFormat("en-US");
const decimalFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

const intentLabels = new Map(guidedRevisionIntents.map((intent) => [intent.value, intent.label]));

function formatInteger(value: number) {
  return integerFormatter.format(value);
}

function formatPercent(value: number) {
  return `${decimalFormatter.format(value)}%`;
}

function formatDate(value: string | null) {
  return value ? dateFormatter.format(new Date(value)) : "No activity yet";
}

function formatLatency(value: number | null) {
  if (value === null) return "—";
  return value >= 1000 ? `${decimalFormatter.format(value / 1000)}s` : `${formatInteger(value)}ms`;
}

function formatCost(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: value < 0.01 ? 4 : 2,
    maximumFractionDigits: 4,
  }).format(value);
}

export default async function BetaInsightsPage() {
  let insights: MapsBetaInsightsView;

  try {
    insights = await getMapsBetaInsights();
  } catch (error) {
    if (error instanceof BetaInsightsDataError && error.code === "unauthenticated") {
      redirect("/login");
    }
    if (error instanceof BetaInsightsDataError && error.code === "forbidden") {
      notFound();
    }
    return <InsightsUnavailable />;
  }

  const { summary } = insights;
  const summaryMetrics = [
    ["Total beta users", summary.total_beta_users],
    ["Users with a saved plan", summary.users_with_saved_plan],
    ["Returning users", summary.returning_users],
    ["Active in last 7 days", summary.users_active_last_7_days],
    ["Saved plans", summary.total_saved_plans],
    ["Guided revisions", summary.total_revisions],
    ["Plans per active user", decimalFormatter.format(summary.plans_per_active_user)],
    ["Revision rate", formatPercent(summary.revision_rate_percent)],
  ] as const;

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
      <header className="border-b border-ink/8 pb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange-dark">
          Internal · Private beta
        </p>
        <h1 className="mt-3 text-balance font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          MAPS beta insights
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-charcoal/65">
          Product-usage signals from persisted MAPS actions. These metrics describe adoption and workflow behavior—not instructional quality or student outcomes.
        </p>
        <p className="mt-3 text-xs text-charcoal/45">
          Generated {formatDate(insights.generated_at)} · UTC activity days
        </p>
      </header>

      <section aria-labelledby="overview-heading" className="py-9">
        <SectionHeading id="overview-heading" eyebrow="Overview" title="Private-beta activity" />
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryMetrics.map(([label, value]) => (
            <MetricCard key={label} label={label} value={String(value)} />
          ))}
        </div>
      </section>

      <section aria-labelledby="feedback-heading" className="border-t border-ink/8 py-9">
        <SectionHeading
          id="feedback-heading"
          eyebrow="Feedback"
          title="Could teachers use the plan tomorrow?"
          description="Comments are intentionally excluded. Counts reflect the current response stored for each immutable plan version."
        />
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Feedback submissions" value={formatInteger(summary.total_feedback_submissions)} />
          <MetricCard label="Feedback response rate" value={formatPercent(summary.feedback_response_rate_percent)} />
          <MetricCard label="Strict teachability rate" value={formatPercent(summary.teachability_rate_percent)} />
          <MetricCard label="Yes or Mostly" value={formatPercent(summary.yes_or_mostly_rate_percent)} />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <DataPanel title="Response mix">
            <div className="grid grid-cols-3 gap-3">
              {([
                ["Yes", insights.feedback.totals.yes, insights.feedback.totals.yes_percent],
                ["Mostly", insights.feedback.totals.mostly, insights.feedback.totals.mostly_percent],
                ["No", insights.feedback.totals.no, insights.feedback.totals.no_percent],
              ] as const).map(([label, count, percent]) => (
                <div key={label} className="rounded-2xl bg-mist p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-charcoal/45">{label}</p>
                  <p className="mt-2 text-2xl font-semibold text-ink">{formatInteger(count)}</p>
                  <p className="mt-1 text-sm text-charcoal/55">{formatPercent(percent)}</p>
                </div>
              ))}
            </div>
          </DataPanel>

          <DataPanel title="Original versus revised">
            <CompactTable
              headers={["Version", "Responses", "Yes", "Mostly", "No"]}
              rows={insights.feedback.by_version_type.map((row) => [
                row.version_type === "original" ? "Original" : "Revised",
                formatInteger(row.feedback_count),
                formatInteger(row.yes),
                formatInteger(row.mostly),
                formatInteger(row.no),
              ])}
            />
          </DataPanel>
        </div>

        <div className="mt-6">
          <DataPanel title="Feedback by guided-revision intent">
            <CompactTable
              headers={["Intent", "Responses", "Yes", "Mostly", "No"]}
              rows={insights.feedback.by_revision_intent.map((row) => [
                intentLabels.get(row.revision_intent) ?? row.revision_intent,
                formatInteger(row.feedback_count),
                formatInteger(row.yes),
                formatInteger(row.mostly),
                formatInteger(row.no),
              ])}
            />
          </DataPanel>
        </div>
      </section>

      <GenerationSection insights={insights} />

      <section aria-labelledby="daily-heading" className="border-t border-ink/8 py-9">
        <SectionHeading
          id="daily-heading"
          eyebrow="Usage over time"
          title="Daily persisted activity"
          description="A day can include a saved plan, guided revision, new feedback response, or feedback update. Pure logins and page reopens are not recorded."
        />
        <div className="mt-5 overflow-hidden rounded-3xl border border-ink/8 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-left text-sm">
              <thead className="bg-mist text-xs uppercase tracking-wide text-charcoal/50">
                <tr>
                  {['UTC date', 'Active users', 'Plans', 'Revisions', 'Feedback'].map((heading) => (
                    <th key={heading} scope="col" className="px-5 py-4 font-semibold">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/8">
                {[...insights.daily_usage].reverse().map((day) => (
                  <tr key={day.date}>
                    <th scope="row" className="px-5 py-4 font-medium text-ink">{formatDate(`${day.date}T00:00:00Z`)}</th>
                    <td className="px-5 py-4 text-charcoal/65">{formatInteger(day.active_users)}</td>
                    <td className="px-5 py-4 text-charcoal/65">{formatInteger(day.plans_created)}</td>
                    <td className="px-5 py-4 text-charcoal/65">{formatInteger(day.revisions_created)}</td>
                    <td className="px-5 py-4 text-charcoal/65">{formatInteger(day.feedback_submitted)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section aria-labelledby="users-heading" className="border-t border-ink/8 py-9">
        <SectionHeading
          id="users-heading"
          eyebrow="Beta users"
          title="Privacy-safe participation summary"
          description="No email, raw user UUID, lesson content, classroom context, student-needs text, or feedback comment appears here."
        />
        <div className="mt-5 overflow-hidden rounded-3xl border border-ink/8 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] border-collapse text-left text-sm">
              <thead className="bg-mist text-xs uppercase tracking-wide text-charcoal/50">
                <tr>
                  {['Beta user', 'First activity', 'Last activity', 'Plans', 'Revisions', 'Feedback', 'Active days'].map((heading) => (
                    <th key={heading} scope="col" className="px-5 py-4 font-semibold">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/8">
                {insights.users.map((user) => (
                  <tr key={user.beta_id}>
                    <th scope="row" className="px-5 py-4">
                      <span className="block font-medium text-ink">{user.display_name ?? "Unnamed beta user"}</span>
                      <span className="mt-1 block font-mono text-xs text-charcoal/40">{user.beta_id}</span>
                    </th>
                    <td className="px-5 py-4 text-charcoal/65">{formatDate(user.first_activity)}</td>
                    <td className="px-5 py-4 text-charcoal/65">{formatDate(user.last_activity)}</td>
                    <td className="px-5 py-4 text-charcoal/65">{formatInteger(user.plans_created)}</td>
                    <td className="px-5 py-4 text-charcoal/65">{formatInteger(user.revisions_created)}</td>
                    <td className="px-5 py-4 text-charcoal/65">{formatInteger(user.feedback_submitted)}</td>
                    <td className="px-5 py-4 text-charcoal/65">{formatInteger(user.active_day_count)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section aria-labelledby="definitions-heading" className="border-t border-ink/8 py-9">
        <SectionHeading id="definitions-heading" eyebrow="Interpretation" title="Metric definitions" />
        <dl className="mt-5 grid gap-4 md:grid-cols-2">
          <Definition term="Active user">A completed-onboarding user with at least one persisted plan, guided revision, or feedback action.</Definition>
          <Definition term="Active day">A UTC date containing at least one qualifying persisted action.</Definition>
          <Definition term="Returning user">A user with another qualifying persisted action on a different UTC day—not merely another login or page reopen.</Definition>
          <Definition term="Revision rate">Saved plans with at least one guided revision divided by all saved plans.</Definition>
          <Definition term="Feedback response rate">Immutable plan versions with feedback divided by all immutable plan versions.</Definition>
          <Definition term="Teachability rate">Strict Yes responses divided by all feedback responses. Yes-or-Mostly is reported separately.</Definition>
        </dl>
      </section>
    </div>
  );
}

function GenerationSection({ insights }: { insights: MapsBetaInsightsView }) {
  const cost = insights.generation.cost_estimate;

  return (
    <section aria-labelledby="generation-heading" className="border-t border-ink/8 py-9">
      <SectionHeading
        id="generation-heading"
        eyebrow="Operations"
        title="Generation performance and estimated cost"
        description="Only successful calls with recorded metadata are included. Failed-call token cost may be missing from the current data model."
      />
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <MetricCard label="Estimated recorded cost" value={formatCost(cost.estimatedCostUsd)} />
        <MetricCard label="Priced metered runs" value={`${formatInteger(cost.pricedMeteredRuns)} / ${formatInteger(cost.totalMeteredRuns)}`} />
        <MetricCard label="Pricing coverage" value={formatPercent(cost.pricingCoveragePercent)} />
      </div>
      <div className="mt-6 overflow-hidden rounded-3xl border border-ink/8 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] border-collapse text-left text-sm">
            <thead className="bg-mist text-xs uppercase tracking-wide text-charcoal/50">
              <tr>
                {['Run type', 'Runs', 'Avg latency', 'Median latency', 'Avg input', 'Avg output', 'Avg total', 'Est. cost'].map((heading) => (
                  <th key={heading} scope="col" className="px-5 py-4 font-semibold">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/8">
              {insights.generation.by_run_type.map((row) => (
                <tr key={row.run_type}>
                  <th scope="row" className="px-5 py-4 font-medium text-ink">
                    {row.run_type === "initial_generation" ? "Plan Tomorrow" : "Guided revision"}
                  </th>
                  <td className="px-5 py-4 text-charcoal/65">{formatInteger(row.successful_runs)}</td>
                  <td className="px-5 py-4 text-charcoal/65">{formatLatency(row.average_latency_ms)}</td>
                  <td className="px-5 py-4 text-charcoal/65">{formatLatency(row.median_latency_ms)}</td>
                  <td className="px-5 py-4 text-charcoal/65">{row.average_input_tokens === null ? "—" : formatInteger(row.average_input_tokens)}</td>
                  <td className="px-5 py-4 text-charcoal/65">{row.average_output_tokens === null ? "—" : formatInteger(row.average_output_tokens)}</td>
                  <td className="px-5 py-4 text-charcoal/65">{row.average_total_tokens === null ? "—" : formatInteger(row.average_total_tokens)}</td>
                  <td className="px-5 py-4 text-charcoal/65">{formatCost(cost.estimatedCostByRunType[row.run_type])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="mt-4 max-w-4xl text-xs leading-5 text-charcoal/50">
        Upper-bound estimate using standard uncached GPT-5.4 mini text-token rates checked {cost.pricingDate}: $0.75 input and $4.50 output per million tokens. Cached-token detail is not stored, so actual billed cost may be lower. Regional-processing uplifts and failed calls without token metadata are not included.{' '}
        <a className="font-medium text-ink underline underline-offset-2" href="https://developers.openai.com/api/docs/models/gpt-5.4-mini">Official pricing reference</a>.
      </p>
    </section>
  );
}

function SectionHeading({
  id,
  eyebrow,
  title,
  description,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-orange-dark">{eyebrow}</p>
      <h2 id={id} className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink">{title}</h2>
      {description ? <p className="mt-2 max-w-3xl text-sm leading-6 text-charcoal/60">{description}</p> : null}
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-2xl border border-ink/8 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-charcoal/45">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{value}</p>
    </article>
  );
}

function DataPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-ink/8 bg-white p-5 shadow-sm sm:p-6">
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function CompactTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] border-collapse text-left text-sm">
        <thead className="text-xs uppercase tracking-wide text-charcoal/45">
          <tr>{headers.map((header) => <th key={header} scope="col" className="border-b border-ink/8 px-3 py-3 font-semibold first:pl-0">{header}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-ink/8">
          {rows.map((row) => (
            <tr key={row[0]}>{row.map((cell, index) => index === 0
              ? <th key={cell} scope="row" className="px-3 py-3 font-medium text-ink first:pl-0">{cell}</th>
              : <td key={`${row[0]}-${index}`} className="px-3 py-3 text-charcoal/65">{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Definition({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-ink/8 bg-white p-5 shadow-sm">
      <dt className="font-semibold text-ink">{term}</dt>
      <dd className="mt-2 text-sm leading-6 text-charcoal/60">{children}</dd>
    </div>
  );
}

function InsightsUnavailable() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8">
      <div role="alert" className="rounded-3xl border border-red-200 bg-white p-7 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-700">Insights unavailable</p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-ink">MAPS could not load private-beta metrics.</h1>
        <p className="mt-4 text-sm leading-6 text-charcoal/65">Please refresh and try again. No teacher or lesson data was displayed.</p>
      </div>
    </div>
  );
}
