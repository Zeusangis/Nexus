import apiClient from "@/axios/client";
import { AthleteAddSchemaType } from "@/schema/athletes/athlete-add";
import { useMutation } from "@tanstack/react-query";
import { login } from "./login";

export interface Root {
  success: boolean;
  message: string;
  data: Data;
}

export interface Data {
  id: string;
}

export const register = async (data: AthleteAddSchemaType) => {
  console.log(data);
  const res = await apiClient.post("users/register", data);

  return res.data as Root;
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: AthleteAddSchemaType) => register(data),
    onSuccess: async (data, variables) => {
      // Auto-login after successful registration
      if (variables.email) {
        try {
          await login({
            email: variables.email,
            password: data.data.id,
          });
        } catch (error) {
          console.error("Auto-login failed:", error);
        }
      }
    },
  });
};
