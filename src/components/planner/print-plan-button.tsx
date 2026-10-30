"use client";

export function PrintPlanButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex min-h-11 items-center justify-center rounded-xl border border-ink/15 bg-white px-5 py-2.5 text-sm font-semibold text-ink"
    >
      Print / Save as PDF
    </button>
  );
}
