import apiClient from "@/axios/client";
import { DailyLogAddSchemaType } from "@/schema/daily-log/daily-log-add";
import { useMutation } from "@tanstack/react-query";

export const dailyLog = async (data: DailyLogAddSchemaType) => {
  const res = await apiClient.post("daily-logs", data);
  return res.data;
};
export const useDailyLog = () => {
  return useMutation({
    mutationFn: (data: DailyLogAddSchemaType) => dailyLog(data),
    onSuccess: (data) => {},
  });
};
