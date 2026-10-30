import { NextResponse } from "next/server";

import { isRotationPlanExportable } from "@/lib/planner/rotation-plan-schema";
import { getCurrentUserRotationPlan, PlanDataError } from "@/server/dal/plans";
import {
  renderRotationPlanDocx,
  rotationPlanDocxFilename,
} from "@/server/export/rotation-plan-docx";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ planId: string }> },
) {
  const { planId } = await params;
  try {
    const plan = await getCurrentUserRotationPlan(planId);
    if (!isRotationPlanExportable(plan.output)) {
      return new Response("This rotation plan is missing one or more teacher-supplied standards and cannot be exported yet.", {
        status: 409,
        headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
      });
    }
    const buffer = await renderRotationPlanDocx(plan.output);
    const filename = rotationPlanDocxFilename(plan.output.title);
    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "private, no-store, max-age=0",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    if (error instanceof PlanDataError && error.code === "unauthenticated") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (error instanceof PlanDataError && error.code === "not_found") {
      return new Response("Not found.", { status: 404, headers: { "Cache-Control": "no-store" } });
    }
    return new Response("MAPS could not prepare this document.", { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
