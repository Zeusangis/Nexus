//http://127.0.0.1:8000/api/v1/users/get_user/

import apiClient from "@/axios/client";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

const getUser = async () => {
  const res = await apiClient.get("users/me/");
  console.log(res.data);
  return res.data as Root;
};

export const useGetUser = (
  options?: Omit<UseQueryOptions<Root>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: ["getUser"],
    queryFn: getUser,
    ...options,
  });
};

export interface Root {
  success: boolean;
  message: string;
  data: Data;
}

export interface Data {
  user: User;
}

export interface User {
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
}
