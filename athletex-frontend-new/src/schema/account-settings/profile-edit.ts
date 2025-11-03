import { z } from "zod";

// Schema for updating basic profile information
export const profileEditSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
});

// Schema for updating password
export const passwordUpdateSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Schema for updating athlete profile
export const athleteProfileEditSchema = z.object({
  age: z.number().min(1, "Age must be at least 1").max(150, "Invalid age"),
  gender: z.string().min(1, "Gender is required"),
  height: z.number().min(1, "Height must be at least 1 cm"),
  weight: z.number().min(1, "Weight must be at least 1 kg"),
});

// Combined schema for full profile update
export const fullProfileEditSchema = z
  .object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email address"),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
    age: z.number().optional(),
    gender: z.string().optional(),
    height: z.number().optional(),
    weight: z.number().optional(),
  })
  .refine(
    (data) => {
      // If any password field is filled, all must be filled
      const hasPasswordFields =
        data.currentPassword || data.newPassword || data.confirmPassword;
      if (hasPasswordFields) {
        return data.currentPassword && data.newPassword && data.confirmPassword;
      }
      return true;
    },
    {
      message: "All password fields must be filled if changing password",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => {
      // If changing password, new and confirm must match
      if (data.newPassword && data.confirmPassword) {
        return data.newPassword === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  )
  .refine(
    (data) => {
      // New password must be at least 6 characters if provided
      if (data.newPassword) {
        return data.newPassword.length >= 6;
      }
      return true;
    },
    {
      message: "New password must be at least 6 characters",
      path: ["newPassword"],
    }
  );

export type ProfileEditSchemaType = z.infer<typeof profileEditSchema>;
export type PasswordUpdateSchemaType = z.infer<typeof passwordUpdateSchema>;
export type AthleteProfileEditSchemaType = z.infer<
  typeof athleteProfileEditSchema
>;
export type FullProfileEditSchemaType = z.infer<typeof fullProfileEditSchema>;
