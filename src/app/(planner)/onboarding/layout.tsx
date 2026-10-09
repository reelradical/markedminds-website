import type { Metadata } from "next";

import { PlannerAppShell } from "@/components/planner/planner-app-shell";

export const metadata: Metadata = {
  title: "Set up your profile | MAPS by Marked Minds",
  description: "Set the teaching defaults MAPS will remember for your account.",
  robots: { index: false, follow: false, nocache: true },
};

export default function OnboardingLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <PlannerAppShell activeItem={null}>{children}</PlannerAppShell>;
}
