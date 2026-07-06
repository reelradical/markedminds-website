export type Partner = {
  name: string;
  category: "School" | "Business" | "Community Organization" | "Sponsor";
};

export const partners: Partner[] = [
  { name: "Riverside Elementary", category: "School" },
  { name: "Lincoln Middle School", category: "School" },
  { name: "Horizon Charter Academy", category: "School" },
  { name: "Union Street Coffee Co.", category: "Business" },
  { name: "Brightline Realty Group", category: "Business" },
  { name: "Cedar & Co. Design Studio", category: "Business" },
  { name: "Neighborhood Family Alliance", category: "Community Organization" },
  { name: "East Side Youth Coalition", category: "Community Organization" },
  { name: "The Reading Room Foundation", category: "Community Organization" },
  { name: "Founders Circle Giving Fund", category: "Sponsor" },
  { name: "Northgate Community Bank", category: "Sponsor" },
];

export const partnerCategories: Partner["category"][] = [
  "School",
  "Business",
  "Community Organization",
  "Sponsor",
];

export const partnerCategoryPlurals: Record<Partner["category"], string> = {
  School: "Schools",
  Business: "Businesses",
  "Community Organization": "Community Organizations",
  Sponsor: "Sponsors",
};
