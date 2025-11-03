import { useMemo } from "react";
import { useGetUser } from "@/utils/getUser";

export type NormalizedRole = "COACH" | "ATHELETE" | "unknown";

export const useGetRole = () => {
  const { data, isLoading, isError } = useGetUser();

  const rawRole: string | undefined = data?.data?.user?.role;

  const normalizedRole: NormalizedRole = useMemo(() => {
    if (!rawRole) return "unknown";
    const r = String(rawRole).trim().toUpperCase();

    if (r.includes("COACH")) return "COACH";
    if (r.includes("ATHLETE") || r.includes("ATHELETE")) return "ATHELETE"; // tolerate typo
    return "unknown";
  }, [rawRole]);

  return {
    role: rawRole,
    normalizedRole,
    isLoading,
    isError,
    user: data?.data?.user,
    isCoach: normalizedRole === "COACH",
    isAthlete: normalizedRole === "ATHELETE",
  } as const;
};

export default useGetRole;
