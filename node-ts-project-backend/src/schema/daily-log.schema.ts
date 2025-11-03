import { z } from "zod";

export const createDailyLogSchema = z.object({
  athleteId: z.string(),
  date: z.string().optional(),
  kneePain: z.number().int().min(0).max(10).default(0),
  legFreshness: z.number().int().min(0).max(10).default(0),
  sleepHours: z.number().min(0).max(24).default(0),
  trainingIntensity: z.number().int().min(0).max(10).default(0),
  aclInjuryScore: z.number().min(0).max(100).default(0),
  stiffnessLevel: z.number().int().min(0).max(10).default(0),
  calorieIntake: z.number().min(0).default(0),
});

export const updateDailyLogSchema = z.object({
  date: z.string().datetime().optional(),
  kneePain: z.number().int().min(0).max(10).optional(),
  legFreshness: z.number().int().min(0).max(10).optional(),
  sleepHours: z.number().min(0).max(24).optional(),
  trainingIntensity: z.number().int().min(0).max(10).optional(),
  aclInjuryScore: z.number().min(0).max(100).optional(),
  stiffnessLevel: z.number().int().min(0).max(10).optional(),
  calorieIntake: z.number().min(0).optional(),
});

export const getDailyLogsSchema = z.object({
  athleteId: z.string().uuid("Invalid athlete ID format").optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  limit: z.number().int().positive().optional(),
  page: z.number().int().positive().optional(),
});

export type CreateDailyLogInput = z.infer<typeof createDailyLogSchema>;
export type UpdateDailyLogInput = z.infer<typeof updateDailyLogSchema>;
export type GetDailyLogsInput = z.infer<typeof getDailyLogsSchema>;
