// Impact metrics. Update these numbers as programming grows — every value
// here is a plain field so this can later be swapped for a CMS or API call
// without changing the /impact page markup.

export type Metric = {
  label: string;
  value: number;
  suffix?: string;
  icon: "graduation-cap" | "heart-handshake" | "award" | "mic" | "handshake" | "clock";
};

export const metrics: Metric[] = [
  { label: "Students Served", value: 150, suffix: "+", icon: "graduation-cap" },
  { label: "Families Supported", value: 90, suffix: "+", icon: "heart-handshake" },
  { label: "Scholarships Awarded", value: 40, suffix: "+", icon: "award" },
  { label: "Guest Educators", value: 20, suffix: "+", icon: "mic" },
  { label: "Community Partners", value: 15, suffix: "+", icon: "handshake" },
  { label: "Volunteer Hours", value: 500, suffix: "+", icon: "clock" },
];
