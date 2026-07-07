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
