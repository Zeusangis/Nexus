import { z } from "zod";

export const assignAthleteSchema = z.object({
  athleteId: z.string(),
  coachId: z.string().optional(),
});

export const getRelationshipsSchema = z.object({
  coachId: z.string().optional(),
  athleteId: z.string().optional(),
});

export type AssignAthleteInput = z.infer<typeof assignAthleteSchema>;
export type GetRelationshipsInput = z.infer<typeof getRelationshipsSchema>;
