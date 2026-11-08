export const planningContextValues = ["school_classroom", "adult_creator"] as const;

export type PlanningContext = (typeof planningContextValues)[number];

export const planningContextOptions = [
  {
    value: "school_classroom",
    label: "School / Classroom",
    description: "Plan around grades, class conditions, materials, transitions, and student needs.",
  },
  {
    value: "adult_creator",
    label: "Adult / Creator",
    description: "Plan adult learning for an asynchronous teaching video without school or grade fields.",
  },
] as const;
