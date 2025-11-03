"use client";

import type React from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useGetUser } from "@/utils/getUser";
import { useUpdateProfile } from "@/utils/updateProfile";
import { useFetchAthleteById } from "@/utils/fetchAthleteWithId";
import { useProfileForm } from "./_hooks/use-profile-form";
import {
  validatePasswordChange,
  buildUpdatePayload,
} from "./_utils/form-helpers";
import {
  ProfilePictureCard,
  BasicInformationCard,
  SecurityCard,
  AthleteProfileCard,
  FormActions,
} from "./_components";
import { MOCK_USER } from "./_constants/mock-data";
import type { ExtendedAthleteProfile } from "./_types";

export default function EditProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { data: currentUserData, isLoading: isLoadingCurrentUser } =
    useGetUser();
  const { data: athleteData, isLoading: isLoadingAthlete } =
    useFetchAthleteById(params.id as string);
  const updateProfileMutation = useUpdateProfile();

  // Determine which data to use - athlete by ID or current user
  const isViewingOtherUser = params.id !== currentUserData?.data?.user?.id;
  const data = isViewingOtherUser ? athleteData : currentUserData;
  const isLoading = isViewingOtherUser
    ? isLoadingAthlete
    : isLoadingCurrentUser;

  // Get user data with fallback to mock
  const mockUserWithId = {
    ...MOCK_USER,
    id: params.id as string,
    athleteProfile: {
      ...MOCK_USER.athleteProfile,
      userId: params.id as string,
    },
  };
  const user = data?.data?.user || mockUserWithId;

  // Form state management
  const { formData, handleInputChange, handleSelectChange } =
    useProfileForm(user);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords if changing (only for own profile)
    if (!isViewingOtherUser && !validatePasswordChange(formData)) {
      return;
    }

    // Build payload (exclude password for coaches editing athletes)
    const payload = buildUpdatePayload(formData, !isViewingOtherUser);

    // Call the mutation
    updateProfileMutation.mutate(
      {
        userId: params.id as string,
        profileData: payload,
      },
      {
        onSuccess: () => {
          router.push(`/dashboard/profile/${params.id}`);
        },
      }
    );
  };

  const handleCancel = () => {
    router.push(`/dashboard/profile/${params.id}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-balance">Edit Profile</h1>
          <p className="text-muted-foreground">
            Update your personal information and settings
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture */}
          <ProfilePictureCard fullName={user.fullName} />

          {/* Basic Information */}
          <BasicInformationCard
            formData={formData}
            handleInputChange={handleInputChange}
          />

          {/* Security - Only show when editing own profile */}
          {!isViewingOtherUser && (
            <SecurityCard
              formData={formData}
              handleInputChange={handleInputChange}
            />
          )}

          {/* Athlete Profile (only for athletes) */}
          {user.role === "ATHLETE" && (
            <AthleteProfileCard
              formData={formData}
              handleInputChange={handleInputChange}
              handleSelectChange={handleSelectChange}
            />
          )}

          {/* Action Buttons */}
          <FormActions
            onCancel={handleCancel}
            isSubmitting={updateProfileMutation.isPending}
          />
        </form>
      </motion.div>
    </div>
  );
}
