import { date, z } from "zod";
export const DailyLogAddSchema = z.object({
  athleteId: z.string().min(1, "Athlete ID is required"),
  date: z.string(),
  kneePain: z
    .number()
    .min(0, "Knee pain must be a positive number")
    .max(10, "Knee pain cannot exceed 10"),
  legFreshness: z
    .number()
    .min(0, "Leg freshness must be a positive number")
    .max(10, "Leg freshness cannot exceed 10"),
  sleepHours: z.number().min(0, "Sleep hours must be a positive number"),
  trainingIntensity: z
    .number()
    .min(0, "Training intensity must be a positive number")
    .max(10, "Training intensity cannot exceed 10"),
  aclInjuryScore: z
    .number()
    .min(0, "ACL injury score must be a positive number")
    .max(1, "ACL injury score cannot exceed 1"),
  stiffnessLevel: z
    .number()
    .min(0, "Stiffness level must be a positive number")
    .max(10, "Stiffness level cannot exceed 10"),
  calorieIntake: z.number().min(0, "Calorie intake must be a positive number"),
});

export type DailyLogAddSchemaType = z.infer<typeof DailyLogAddSchema>;
