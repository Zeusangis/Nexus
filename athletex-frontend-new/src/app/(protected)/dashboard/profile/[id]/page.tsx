"use client";

import ProfilePage from "./_components/user-profile";
import { useGetUser } from "@/utils/getUser";
import { AthleteAddSchemaType } from "@/schema/athletes/athlete-add";

export default function MyProfilePage() {
  const { data: currentUser } = useGetUser();

  // Transform the current user data to match AthleteAddSchemaType
  const athlete: AthleteAddSchemaType | undefined = currentUser?.data?.user
    ? {
        fullName: currentUser.data.user.fullName || "",
        email: currentUser.data.user.email || "",
        password: "", // Password not returned from API
        age: currentUser.data.user.athleteProfile?.age || 0,
        gender: currentUser.data.user.athleteProfile?.gender || "male",
        height: currentUser.data.user.athleteProfile?.height || 0,
        weight: currentUser.data.user.athleteProfile?.weight || 0,
        bmi: currentUser.data.user.athleteProfile?.bmi || 0,
      }
    : undefined;

  return <ProfilePage />;
}
