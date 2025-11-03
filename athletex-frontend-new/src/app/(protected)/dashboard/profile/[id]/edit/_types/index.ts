export interface ExtendedAthleteProfile {
  id?: string;
  userId?: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  bmi: number;
  riskLevel?: string;
  sportId?: string;
  riskScore: number;
  trainingType: string;
  experienceLevel: string;
  limitations: string | null;
}

export interface ProfileFormData {
  fullName: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  age: string | number;
  gender: string;
  height: string | number;
  weight: string | number;
  riskScore: string | number;
  trainingType: string;
  experienceLevel: string;
  limitations: string;
}

export interface UpdateProfilePayload {
  fullName?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;
  bmi?: number;
  riskScore?: number;
  trainingType?: string;
  experienceLevel?: string;
  limitations?: string | null;
}
