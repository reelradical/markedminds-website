"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { ProfileActionState } from "@/lib/planner/profile-action-state";
import { completeOnboarding, ProfileDataError, updateCurrentTeacherProfile } from "@/server/dal/profiles";
import {
  parseTeacherProfileForm,
  ProfileValidationError,
} from "@/server/validation/teacher-profile";

function validationState(error: ProfileValidationError): ProfileActionState {
  return {
    status: "error",
    message: "Review the highlighted profile details and try again.",
    fieldErrors: error.fieldErrors,
  };
}

function saveErrorState(message = "MAPS could not save your profile. Please try again."): ProfileActionState {
  return { status: "error", message, fieldErrors: {} };
}

export async function saveOnboardingProfile(
  _previousState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  let shouldRedirectToLogin = false;

  try {
    const input = parseTeacherProfileForm(formData);
    await completeOnboarding(input);
  } catch (error) {
    if (error instanceof ProfileValidationError) return validationState(error);
    if (error instanceof ProfileDataError && error.code === "unauthenticated") {
      shouldRedirectToLogin = true;
    } else {
      return saveErrorState();
    }
  }

  if (shouldRedirectToLogin) redirect("/login");
  revalidatePath("/planner");
  revalidatePath("/onboarding");
  redirect("/planner");
}

export async function saveProfileSettings(
  _previousState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  let redirectDestination: "/login" | "/onboarding" | null = null;

  try {
    const input = parseTeacherProfileForm(formData);
    const expectedVersion = formData.get("profile_version");
    await updateCurrentTeacherProfile(input, typeof expectedVersion === "string" ? expectedVersion : "");
  } catch (error) {
    if (error instanceof ProfileValidationError) return validationState(error);
    if (error instanceof ProfileDataError) {
      if (error.code === "unauthenticated") redirectDestination = "/login";
      else if (error.code === "incomplete") redirectDestination = "/onboarding";
      else if (error.code === "conflict") {
        return saveErrorState("Your profile changed in another session. Reload this page before saving again.");
      } else return saveErrorState();
    } else return saveErrorState();
  }

  if (redirectDestination) redirect(redirectDestination);
  revalidatePath("/planner");
  revalidatePath("/settings/profile");
  redirect("/settings/profile?saved=1");
}
