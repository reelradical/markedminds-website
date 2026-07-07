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

export const metrics: Metric[] = [
  { label: "Students Served", value: null, suffix: "+", icon: "graduation-cap" },
  { label: "Families Supported", value: null, suffix: "+", icon: "heart-handshake" },
  { label: "Scholarships Awarded", value: null, suffix: "+", icon: "award" },
  { label: "Guest Educators", value: null, suffix: "+", icon: "mic" },
  { label: "Community Partners", value: null, suffix: "+", icon: "handshake" },
  { label: "Volunteer Hours", value: null, suffix: "+", icon: "clock" },
];
