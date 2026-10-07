// Real connections only — do not add names here without confirming accuracy.
// Use "Partner," "Collaborator," "Client," or "Community Connection" per the
// nature of the actual relationship.

export type Partner = {
  name: string;
  category: "Partner" | "Collaborator" | "Client" | "Community Connection";
  note?: string;
  placeholder?: boolean;
};

export const partners: Partner[] = [
  { name: "Re:imagine/ATL", category: "Collaborator" },
  { name: "Pharaoh's Conclave", category: "Collaborator" },
  {
    name: "Atlanta Track Club",
    category: "Partner",
    // Scoped to Focus + FLEX Run Club | Bouldercrest's participation in
    // Kilometer Kids — not a sponsor of Marked Minds or Focus + FLEX
    // Academy as a whole. See /focus-flex/run-club for the full context.
    note: "Run Club Program Partner",
  },
  { name: "Cedar Grove community", category: "Community Connection" },
  { name: "Focus + FLEX Academy families", category: "Community Connection" },
  {
    name: "Black2SchoolMvmt",
    category: "Community Connection",
    note: "Black educator conference opportunity — developing",
  },
  {
    name: "Additional partners to be confirmed",
    category: "Community Connection",
    placeholder: true,
  },
];
