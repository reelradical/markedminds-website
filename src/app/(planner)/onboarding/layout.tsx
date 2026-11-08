import type { Metadata } from "next";

import { PlannerAppShell } from "@/components/planner/planner-app-shell";

export const metadata: Metadata = {
  title: "Set up your profile | MAPS by Marked Minds",
  description: "Choose and configure the planning context MAPS will remember for your account.",
  robots: { index: false, follow: false, nocache: true },
};

export default function OnboardingLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <PlannerAppShell>{children}</PlannerAppShell>;
}
