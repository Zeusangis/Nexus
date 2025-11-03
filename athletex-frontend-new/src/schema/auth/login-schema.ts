import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({
      error: "Email is required",
    })
    .email("Invalid email address"),
  password: z
    .string({
      error: "Password is required",
    })
    .min(8, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
