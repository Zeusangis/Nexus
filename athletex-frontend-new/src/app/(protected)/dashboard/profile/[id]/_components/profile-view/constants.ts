import type { UserData } from "./types";

export const MOCK_USER: UserData = {
  id: "",
  fullName: "Alex Johnson",
  email: "alex.johnson@example.com",
  role: "ATHELETE",
  athleteProfile: {
    age: 24,
    gender: "FEMALE",
    height: 168,
    weight: 62,
    bmi: 22.0,
    riskLevel: "LOW",
    riskScore: 15,
    trainingType: "General",
    experienceLevel: "Beginner",
    limitations: "None",
  },
};
