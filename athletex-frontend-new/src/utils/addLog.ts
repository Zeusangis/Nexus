import apiClient from "@/axios/client";
import { DailyLog } from "@/schema/daily-log/daily-log";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const AddLog = async (logData: DailyLog) => {
  const res = await apiClient.post("logs/", logData);
  return res.data;
};

export const useAddLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (logData: DailyLog) => AddLog(logData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dailyLogs"] });
      toast.success("Daily log added successfully!");
    },
  });
};
