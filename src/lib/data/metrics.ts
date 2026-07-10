// Impact metrics. Values are intentionally left `null` until real numbers are
// pulled from actual program records — do not fill these in with estimates.
// Set `value` once a figure is confirmed; MetricCard renders "Coming soon"
// for any metric still at `null`.

export type Metric = {
  label: string;
  value: number | null;
  suffix?: string;
  icon: "graduation-cap" | "heart-handshake" | "award" | "mic" | "handshake" | "clock";
};

// Confirmed from the Session I Pilot Evidence & Impact Report (July 2026).
// Community Partners and Volunteer Hours stay `null` — the source report
// itself marks those counts TBD/inconsistent, so we don't guess.
export const metrics: Metric[] = [
  { label: "Students Served", value: 13, icon: "graduation-cap" },
  { label: "Families Supported", value: 7, icon: "heart-handshake" },
  { label: "Scholarships Awarded", value: 11, icon: "award" },
  { label: "Guest Educators", value: 2, icon: "mic" },
  { label: "Community Partners", value: null, suffix: "+", icon: "handshake" },
  { label: "Volunteer Hours", value: null, suffix: "+", icon: "clock" },
];
