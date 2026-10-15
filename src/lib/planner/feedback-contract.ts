export const planFeedbackResponses = [
  { value: "yes", label: "Yes" },
  { value: "mostly", label: "Mostly" },
  { value: "no", label: "No" },
] as const;

export type PlanFeedbackResponse = (typeof planFeedbackResponses)[number]["value"];

export type SavedPlanFeedback = {
  response: PlanFeedbackResponse;
  comment: string | null;
  updatedAt: string;
};

export type PlanFeedbackActionState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors: Partial<Record<"response" | "comment", string>>;
};

export const initialPlanFeedbackActionState: PlanFeedbackActionState = {
  status: "idle",
  message: "",
  fieldErrors: {},
};
