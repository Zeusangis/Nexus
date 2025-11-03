import apiClient from "@/axios/client";
import { useQuery } from "@tanstack/react-query";

const getAthletes = async () => {
  const res = await apiClient.get("athlete/");
  return res.data as Root;
};

export const useFetchAthletes = () => {
  return useQuery({
    queryKey: ["fetchAthletes"],
    queryFn: getAthletes,
  });
};

export interface Root {
  success: boolean;
  message: string;
  data: Data;
}

export interface Data {
  athletes: Athlete[];
}

export interface Athlete {
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
  limitations?: string;
  user: User;
}

export interface User {
  email: string;
  fullName: string;
  role: string;
  isActive: boolean;
}
