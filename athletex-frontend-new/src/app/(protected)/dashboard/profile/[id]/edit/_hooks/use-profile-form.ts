import { useState, useEffect } from "react";
import type { ProfileFormData, ExtendedAthleteProfile } from "../_types";

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  athleteProfile?: Partial<ExtendedAthleteProfile>;
}

export const useProfileForm = (user: User) => {
  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: user.fullName,
    email: user.email,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    age: user.athleteProfile?.age || "",
    gender: user.athleteProfile?.gender || "",
    height: user.athleteProfile?.height || "",
    weight: user.athleteProfile?.weight || "",
    riskScore: (user.athleteProfile as ExtendedAthleteProfile)?.riskScore || "",
    trainingType:
      (user.athleteProfile as ExtendedAthleteProfile)?.trainingType ||
      "General",
    experienceLevel:
      (user.athleteProfile as ExtendedAthleteProfile)?.experienceLevel ||
      "Beginner",
    limitations:
      (user.athleteProfile as ExtendedAthleteProfile)?.limitations || "",
  });

  // Update form data when user data changes
  useEffect(() => {
    setFormData({
      fullName: user.fullName,
      email: user.email,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      age: user.athleteProfile?.age || "",
      gender: user.athleteProfile?.gender || "",
      height: user.athleteProfile?.height || "",
      weight: user.athleteProfile?.weight || "",
      riskScore:
        (user.athleteProfile as ExtendedAthleteProfile)?.riskScore || "",
      trainingType:
        (user.athleteProfile as ExtendedAthleteProfile)?.trainingType ||
        "General",
      experienceLevel:
        (user.athleteProfile as ExtendedAthleteProfile)?.experienceLevel ||
        "Beginner",
      limitations:
        (user.athleteProfile as ExtendedAthleteProfile)?.limitations || "",
    });
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return {
    formData,
    handleInputChange,
    handleSelectChange,
  };
};
