export type ProfileField =
  | "displayName"
  | "role"
  | "subjectAreas"
  | "gradeLevels"
  | "typicalClassDurationMinutes"
  | "typicalClassSize"
  | "commonMaterials"
  | "teachingContextNotes"
  | "preferences";

export type ProfileActionState = {
  status: "idle" | "error";
  message: string;
  fieldErrors: Partial<Record<ProfileField, string>>;
};

export const initialProfileActionState: ProfileActionState = {
  status: "idle",
  message: "",
  fieldErrors: {},
};
