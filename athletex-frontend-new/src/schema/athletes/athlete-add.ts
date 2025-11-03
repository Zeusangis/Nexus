// export interface AthleteAddSchemaType {
//   full_name: string;
//   email: string;
//   age: number;
//   gender: string;
//   height: number;
//   weight: number;
//   bmi: number;
//   profile_image: string;
//   date_joined: string;
// }

import { z } from "zod";

export const athleteAddSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email").optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  age: z.number().min(0, "Age must be a positive number"),
  gender: z.string().min(1, "Gender is required"),
  height: z.number().min(0, "Height must be a positive number"),
  weight: z.number().min(0, "Weight must be a positive number"),
  bmi: z.number().min(0, "BMI must be a positive number"),
  // profile_image: z.string().url("Invalid URL").optional(),
  // date_joined: z.string().optional(),
});

export const athleteEditSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email").optional(),
  age: z.number().min(0, "Age must be a positive number"),
  gender: z.string().min(1, "Gender is required"),
  height: z.number().min(0, "Height must be a positive number"),
  weight: z.number().min(0, "Weight must be a positive number"),
  bmi: z.number().min(0, "BMI must be a positive number"),
});

export type AthleteAddSchemaType = z.infer<typeof athleteAddSchema>;
export type AthleteEditSchemaType = z.infer<typeof athleteEditSchema>;
