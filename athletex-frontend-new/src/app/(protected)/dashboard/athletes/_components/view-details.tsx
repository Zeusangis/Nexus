"use client";

import ProfilePage from "../../profile/[id]/_components/user-profile";
import { Athlete } from "@/utils/fetchAthletes";

type Props = {
  athlete: Athlete;
};

export default function AthleteDetailsPage({ athlete }: Props) {
  return <ProfilePage athleteData={athlete} />;
}
