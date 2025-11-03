import apiClient from "@/axios/client";
import { useQuery } from "@tanstack/react-query";

const getUser = async () => {
  const res = await apiClient.get("/user");
  console.log(res.data);
  return res.data;
};

export const useFetchUser = () => {
  return useQuery({
    queryKey: ["fetchUser"],
    queryFn: getUser,
  });
};
