export interface AthleteProfile {
  id?: string;
  userId?: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  bmi: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  sportId?: string;
  riskScore: number;
  trainingType?: string;
  experienceLevel?: string;
  limitations?: string | null;
}

export interface UserData {
  id: string;
  fullName: string;
  email: string;
  role: "ATHELETE" | "COACH";
  athleteProfile?: AthleteProfile;
}
