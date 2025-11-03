"use client";
import { AthleteUser, useFetchAthleteById } from "@/utils/fetchAthleteWithId";
import EditAthleteForm from "../../_components/edit-athlete-form";
import { useParams } from "next/navigation";
import PageLoader from "@/components/molecules/page-loader";

export default function EditPageToForm() {
  const params = useParams<{ id: string }>();
  const athleteIdParam = params?.id;
  const { data: athlete, isLoading } = useFetchAthleteById(athleteIdParam);
  console.log(athlete);
  if (isLoading) {
    return <PageLoader />;
  }
  return (
    <div>
      <h1>Edit Athlete</h1>
      <EditAthleteForm athlete={athlete?.data.user as AthleteUser} />
    </div>
  );
}
