import apiClient from "@/axios/client";
import { useQuery } from "@tanstack/react-query";
import { DailyLogAddSchemaType } from "@/schema/daily-log/daily-log-add";

// API response type (camelCase from backend)
interface ApiDailyLog {
  id: string;
  athleteId: string;
  date: string;
  kneePain: number;
  legFreshness: number;
  sleepHours: number;
  trainingIntensity: number;
  aclInjuryScore: number;
  stiffnessLevel: number;
  calorieIntake: number;
  athlete?: unknown;
}

// Map API response to schema format
const mapApiLogToSchema = (apiLog: ApiDailyLog): DailyLogAddSchemaType => ({
  athleteId: apiLog.athleteId,
  date: apiLog.date,
  kneePain: apiLog.kneePain,
  legFreshness: apiLog.legFreshness,
  sleepHours: apiLog.sleepHours,
  trainingIntensity: apiLog.trainingIntensity,
  aclInjuryScore: apiLog.aclInjuryScore,
  stiffnessLevel: apiLog.stiffnessLevel,
  calorieIntake: apiLog.calorieIntake,
});

const getDailyLogsById = async (
  athleteId: string
): Promise<DailyLogAddSchemaType[]> => {
  try {
    const res = await apiClient.get("daily-logs/");
    // only fetch logs for the specified athleteId if provided

    let apiLogs: ApiDailyLog[] = [];

    // Handle the response structure: { success, message, data: { dailyLogs: [...] } }
    if (res.data?.data?.dailyLogs && Array.isArray(res.data.data.dailyLogs)) {
      apiLogs = res.data.data.dailyLogs;
    }
    // Handle wrapped in data.dailylogs
    else if (
      res.data?.data?.dailylogs &&
      Array.isArray(res.data.data.dailylogs)
    ) {
      apiLogs = res.data.data.dailylogs;
    }
    // Handle wrapped in dailyLogs directly
    else if (res.data?.dailyLogs && Array.isArray(res.data.dailyLogs)) {
      apiLogs = res.data.dailyLogs;
    }
    // Handle direct array
    else if (Array.isArray(res.data)) {
      apiLogs = res.data;
    } else {
      console.warn("Unexpected data structure:", res.data);
      return [];
    }

    // Map API response to schema format
    const mappedLogs = apiLogs.map(mapApiLogToSchema);
    console.log("Mapped daily logs:", mappedLogs);

    return mappedLogs;
  } catch (error) {
    console.error("Error fetching daily logs:", error);
    return [];
  }
};

export const useFetchDailyLogs = () => {
  return useQuery<DailyLogAddSchemaType[]>({
    queryKey: ["dailyLogs"],
    queryFn: () => getDailyLogsById(""),
  });
};

export const useFetchDailyLogsById = (athleteId: string) => {
  return useQuery<DailyLogAddSchemaType[]>({
    queryKey: ["dailyLogs", athleteId],
    queryFn: () => getDailyLogsById(athleteId),
    enabled: !!athleteId, // Only fetch if athleteId is provided
  });
};
