import { toast } from "sonner";
import type { ProfileFormData, UpdateProfilePayload } from "../_types";
import { calculateBmi } from "@/utils/bmi";

export const validatePasswordChange = (formData: ProfileFormData): boolean => {
  if (formData.newPassword) {
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match");
      return false;
    }
    if (!formData.currentPassword) {
      toast.error("Current password is required to set a new password");
      return false;
    }
  }
  return true;
};

export const buildUpdatePayload = (
  formData: ProfileFormData,
  includePassword: boolean = true
): UpdateProfilePayload => {
  const payload: UpdateProfilePayload = {
    fullName: formData.fullName,
    email: formData.email,
  };

  // Add athlete profile data if available
  if (formData.age) {
    payload.age = Number(formData.age);
  }
  if (formData.gender) {
    payload.gender = formData.gender;
  }
  if (formData.height) {
    payload.height = Number(formData.height);
  }
  if (formData.weight) {
    payload.weight = Number(formData.weight);
  }
  if (formData.riskScore) {
    payload.riskScore = Number(formData.riskScore);
  }
  if (formData.trainingType) {
    payload.trainingType = formData.trainingType;
  }
  if (formData.experienceLevel) {
    payload.experienceLevel = formData.experienceLevel;
  }
  if (formData.limitations) {
    payload.limitations = formData.limitations;
  }

  // Calculate BMI if both height and weight are provided
  if (formData.height && formData.weight) {
    payload.bmi = calculateBmi(
      Number(formData.weight),
      Number(formData.height)
    );
  }

  // Add password change if provided and allowed
  if (includePassword && formData.currentPassword && formData.newPassword) {
    payload.currentPassword = formData.currentPassword;
    payload.newPassword = formData.newPassword;
  }

  return payload;
};
