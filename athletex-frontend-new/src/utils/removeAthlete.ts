import apiClient from "@/axios/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const removeAthlete = async (id: string) => {
  const res = apiClient.delete(`users/${id}/`);
  return res;
};
export const useRemoveAthlete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => removeAthlete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchAthletes"] });
    },
  });
};
