import type { Metadata } from "next";

import { PlannerAppShell } from "@/components/planner/planner-app-shell";

export const metadata: Metadata = {
  title: "Profile settings | MAPS by Marked Minds",
  description: "Update the teaching defaults MAPS remembers for your account.",
  robots: { index: false, follow: false, nocache: true },
};

export default function SettingsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <PlannerAppShell>{children}</PlannerAppShell>;
}
