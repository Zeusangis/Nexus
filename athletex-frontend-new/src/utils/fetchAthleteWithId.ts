import apiClient from "@/axios/client";
import { useQuery } from "@tanstack/react-query";

const getAthleteById = async (id: string) => {
  // const res = await axios.get("http://127.0.0.1:8000/api/athletes/");
  const res = await apiClient.get(`users/${id}/`);
  console.log(res.data);
  return res.data as Root;
};

export const useFetchAthleteById = (id: string) => {
  return useQuery({
    queryKey: ["fetchAthleteById", id],
    queryFn: () => getAthleteById(id),
    staleTime: 0, // Always consider data stale
    refetchOnMount: true, // Refetch when component mounts
  });
};

export interface Root {
  success: boolean;
  message: string;
  data: Data;
}

export interface Data {
  user: AthleteUser;
}

export interface AthleteUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
  athleteProfile: AthleteProfile;
}

export interface AthleteProfile {
  id: string;
  userId: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  bmi: number;
  riskLevel: string;
  sportId: string;
  riskScore: number;
  trainingType?: string;
  experienceLevel?: string;
  limitations?: string | null;
}
