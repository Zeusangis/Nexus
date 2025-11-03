export const getRiskColor = (level: "LOW" | "MEDIUM" | "HIGH") => {
  switch (level) {
    case "LOW":
      return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20";
    case "MEDIUM":
      return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20";
    case "HIGH":
      return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
  }
};

export const getRoleColor = (role: string) => {
  return role === "ATHELETE"
    ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
    : "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
};

export const formatGender = (gender: string): string => {
  if (gender === "MALE") return "Male";
  if (gender === "FEMALE") return "Female";
  return gender;
};
