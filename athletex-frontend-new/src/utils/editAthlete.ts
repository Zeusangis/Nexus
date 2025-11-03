import apiClient from "@/axios/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AthleteEditSchemaType } from "@/schema/athletes/athlete-add";

const editAthlete = async (id: string, athleteData: AthleteEditSchemaType) => {
  const res = await apiClient.patch(`users/${id}/`, athleteData);
  return res.data;
};
export const useEditAthlete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      athleteData,
    }: {
      id: string;
      athleteData: AthleteEditSchemaType;
    }) => editAthlete(id, athleteData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchAthletes"] });
      toast.success("Athlete edited successfully!");
    },
  });
};
