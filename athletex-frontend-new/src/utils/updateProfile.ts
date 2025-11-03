import apiClient from "@/axios/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface UpdateProfilePayload {
  fullName?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;
  bmi?: number;
  riskScore?: number;
  trainingType?: string;
  experienceLevel?: string;
  limitations?: string | null;
}

const updateProfile = async (
  userId: string,
  profileData: UpdateProfilePayload
) => {
  // Prepare payload for the main update endpoint
  const updatePayload: Record<string, string | number> = {};

  // Basic info (fullName, email)
  if (profileData.fullName !== undefined) {
    updatePayload.fullName = profileData.fullName;
  }
  if (profileData.email !== undefined) {
    updatePayload.email = profileData.email;
  }

  // Athlete profile (age, gender, height, weight, bmi, riskScore, trainingType, experienceLevel, limitations)
  if (profileData.age !== undefined) {
    updatePayload.age = profileData.age;
  }
  if (profileData.gender !== undefined) {
    updatePayload.gender = profileData.gender;
  }
  if (profileData.height !== undefined) {
    updatePayload.height = profileData.height;
  }
  if (profileData.weight !== undefined) {
    updatePayload.weight = profileData.weight;
  }
  if (profileData.bmi !== undefined) {
    updatePayload.bmi = profileData.bmi;
  }
  if (profileData.riskScore !== undefined) {
    updatePayload.riskScore = profileData.riskScore;
  }
  if (profileData.trainingType !== undefined) {
    updatePayload.trainingType = profileData.trainingType;
  }
  if (profileData.experienceLevel !== undefined) {
    updatePayload.experienceLevel = profileData.experienceLevel;
  }
  if (profileData.limitations !== undefined) {
    updatePayload.limitations = profileData.limitations || "";
  }

  // Make API calls
  const requests = [];

  // Update profile (includes basic info and athlete profile)
  if (Object.keys(updatePayload).length > 0) {
    console.log("=== API Request Debug ===");
    console.log("Endpoint:", `users/${userId}/`);
    console.log("Payload:", updatePayload);
    requests.push(apiClient.patch(`users/${userId}/`, updatePayload));
  } else {
    console.log("⚠️ No fields to update - payload is empty!");
  }

  // Update password separately - uses authenticated endpoint (no userId in URL)
  if (profileData.currentPassword && profileData.newPassword) {
    const passwordPayload = {
      currentPassword: profileData.currentPassword,
      confirmPassword: profileData.newPassword,
      newPassword: profileData.newPassword,
    };
    requests.push(apiClient.patch(`users/change-password/`, passwordPayload));
  }

  const responses = await Promise.all(requests);
  return responses[0]?.data; // Return the main profile update response
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      profileData,
    }: {
      userId: string;
      profileData: UpdateProfilePayload;
    }) => updateProfile(userId, profileData),
    onSuccess: () => {
      // Invalidate relevant queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["getUser"] });
      queryClient.invalidateQueries({ queryKey: ["fetchAthletes"] });
      queryClient.invalidateQueries({ queryKey: ["fetchAthleteById"] });
      toast.success("Profile updated successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to update profile";
      toast.error(errorMessage);
    },
  });
};
