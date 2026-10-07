import type { IconKey } from "@/lib/icon-map";

// Focus + FLEX Run Club | Bouldercrest — a year-round Focus + FLEX
// community program. Participates in Kilometer Kids, Atlanta Track Club's
// youth running program, but is its own Focus + FLEX team identity, not a
// rebrand of Kilometer Kids. See the "Powered by Community" section on
// /focus-flex/run-club for the accurate scope of that relationship.

export type ProgramDetail = {
  label: string;
  value: string;
  subValue?: string;
  icon: IconKey;
};

// Fall 2026 season specifics. Update (or add a new season array) rather
// than overwrite when a new season is confirmed, so past seasons stay
// accurate for historical reference.
export const fall2026ProgramDetails: ProgramDetail[] = [
  {
    label: "Location",
    value: "Bouldercrest Park",
    subValue: "4184 Bouldercrest Park Rd, Ellenwood, GA 30294",
    icon: "map-pin",
  },
  {
    label: "Practices",
    value: "Tuesdays + Thursdays",
    icon: "calendar-days",
  },
  {
    label: "Time",
    value: "5:00–6:00 PM",
    icon: "clock",
  },
  {
    label: "Program Type",
    value: "Public community team",
    icon: "users",
  },
  {
    label: "Running Experience",
    value: "No prior running experience required",
    icon: "footprints",
  },
];

export type RunClubPillar = {
  name: string;
  description: string;
  icon: IconKey;
};

// "More Than Miles" — the Focus + FLEX framework applied to the Run Club,
// distinct from Kilometer Kids' own marketing. Keep these in Focus + FLEX's
// voice (perseverance, self-management, belonging), not generic running copy.
export const runClubPillars: RunClubPillar[] = [
  {
    name: "Move",
    description:
      "Build endurance, coordination, and healthy movement habits.",
    icon: "footprints",
  },
  {
    name: "Focus",
    description:
      "Practice goal setting, consistency, attention, and self-management.",
    icon: "target",
  },
  {
    name: "Flex",
    description:
      "Learn to adjust, persevere, problem-solve, and keep moving through challenges.",
    icon: "repeat",
  },
  {
    name: "Belong",
    description:
      "Be part of a supportive neighborhood team where effort, encouragement, and growth matter more than speed.",
    icon: "heart-handshake",
  },
];

// Season goals, not yet real outcomes — explicitly not framed as metrics.
// When real Fall 2026 data exists (participants, attendance, miles,
// events, volunteer hours, family feedback, testimonials), replace this
// array with a stat-card structure matching sessionIStats in academy.ts
// rather than editing this list's wording in place.
export const fall2026Goals: string[] = [
  "10 weeks of community-based programming",
  "Two practices each week",
  "Individual cumulative mileage goals",
  "Family participation opportunities",
  "Atlanta Track Club youth event participation",
  "Community-building experiences",
  "End-of-season celebration",
];

export const kilometerKidsUrl = "https://www.atlantatrackclub.org/kilometerkids";
