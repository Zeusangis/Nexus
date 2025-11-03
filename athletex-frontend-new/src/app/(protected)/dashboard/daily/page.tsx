"use client";
import { unauthorized } from "next/navigation";
import AthleteComparisonDashboard from "./_components/daily";
import useGetRole from "@/utils/getRole";

export default function DailyDashboardPage() {
  const role = useGetRole().normalizedRole;

  if (role === "COACH") {
    return unauthorized();
  }
  return <AthleteComparisonDashboard />;
}
