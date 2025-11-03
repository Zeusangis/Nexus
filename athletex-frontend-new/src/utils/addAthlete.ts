import apiClient from "@/axios/client";
import { AthleteAddSchemaType } from "@/schema/athletes/athlete-add";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const addAthlete = async (athlete: AthleteAddSchemaType) => {
  try {
    const res = await apiClient.post("users/register", {
      ...athlete,
      role: "ATHELETE", // Backend expects role field
    });
    return res.data;
  } catch (error) {
    console.error("Error adding athlete:", error);
    throw error;
  }
};

export const useAddAthlete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addAthlete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchAthletes"] });
      toast.success("Athlete added successfully!");
    },
  });
};

export default addAthlete;

// make coach to athlete relation if coach is adding athlete with endpoint coach-athlete/
export const addCoachAthleteRelation = async (athleteId: string) => {
  try {
    const res = await apiClient.post("coach-athlete/assign", { athleteId });
    return res.data;
  } catch (error) {
    console.error("Error adding coach-athlete relation:", error);
    throw error;
  }
};

export const useAddCoachAthleteRelation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (athleteId: string) => addCoachAthleteRelation(athleteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchAthletes"] });
      toast.success("Coach-Athlete relation added successfully!");
    },
  });
};
