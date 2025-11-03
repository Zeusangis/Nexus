import { z } from "zod";

export const createSportsCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .trim(),
});

export const updateSportsCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .trim(),
});

export type CreateSportsCategoryInput = z.infer<
  typeof createSportsCategorySchema
>;
export type UpdateSportsCategoryInput = z.infer<
  typeof updateSportsCategorySchema
>;
