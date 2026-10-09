import type { Metadata } from "next";

import { PlannerAppShell } from "@/components/planner/planner-app-shell";

export const metadata: Metadata = {
  title: {
    default: "MAPS | Marked Minds",
    template: "%s | MAPS by Marked Minds",
  },
  description: "Plan for the class you actually have.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function PlannerLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <PlannerAppShell activeItem="home">{children}</PlannerAppShell>;
}
