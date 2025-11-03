import apiClient from "@/axios/client";
import { LoginFormValues } from "@/schema/auth/login-schema";
import { useMutation } from "@tanstack/react-query";
import { storeTokens } from "./token";

export interface LoginResponse {
  success: boolean;
  message: string;
  data: Data;
}

export interface Data {
  token: string;
  id: string;
  email: string;
  fullName: string;
}

export const login = async (data: LoginFormValues) => {
  const res = await apiClient.post("users/login", data);
  return res.data as LoginResponse;
};
export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginFormValues) => login(data),
    onSuccess: (data) => {
      storeTokens(data.data.token);
    },
  });
};
