"use client";

import { useParams } from "next/navigation";
import ProfilePage from "../../../profile/[id]/_components/user-profile";
import { useFetchAthleteById } from "@/utils/fetchAthleteWithId";
import type { Athlete } from "@/utils/fetchAthletes";

export default function AthleteProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const { data, isLoading } = useFetchAthleteById(id);

  console.log("Athlete data from API:", data?.data);
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading athlete profile...</p>
        </div>
      </div>
    );
  }

  if (!data?.data?.user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Athlete not found</p>
      </div>
    );
  }

  // Map AthleteUser to Athlete format expected by ProfilePage
  const athleteData: Athlete = {
    id: data.data.user.athleteProfile.id,
    userId: data.data.user.id,
    age: data.data.user.athleteProfile.age,
    gender: data.data.user.athleteProfile.gender,
    height: data.data.user.athleteProfile.height,
    weight: data.data.user.athleteProfile.weight,
    bmi: data.data.user.athleteProfile.bmi,
    riskLevel: data.data.user.athleteProfile.riskLevel,
    sportId: data.data.user.athleteProfile.sportId,
    riskScore: data.data.user.athleteProfile.riskScore,
    trainingType: data.data.user.athleteProfile.trainingType,
    experienceLevel: data.data.user.athleteProfile.experienceLevel,
    limitations: data.data.user.athleteProfile.limitations ?? undefined,
    user: {
      email: data.data.user.email,
      fullName: data.data.user.fullName,
      role: data.data.user.role,
      isActive: true,
    },
  };

  // The ProfilePage component will display the profile with inline editing capability for coaches
  return <ProfilePage athleteData={athleteData} />;
}
