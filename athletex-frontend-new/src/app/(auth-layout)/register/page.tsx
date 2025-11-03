"use client";

import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

// UI Components
import { Button } from "@/components/ui/button";
import TextInput from "@/components/molecules/text-input";
import PasswordInput from "@/components/molecules/password-input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// Schema
import { z } from "zod";
import { useRegister } from "@/utils/register";

// ✅ Schema for this form
const extendedLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  fullName: z.string().min(1, "Full name is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["ATHELETE", "COACH"] as const, { message: "Role is required" }),
});

type ExtendedLoginFormValues = z.infer<typeof extendedLoginSchema>;

const RegisterPage = () => {
  const { handleSubmit, register, setValue, formState } =
    useForm<ExtendedLoginFormValues>({
      mode: "onChange",
      resolver: zodResolver(extendedLoginSchema),
      defaultValues: {
        email: "",
        fullName: "",
        password: "",
        role: "ATHELETE",
      },
    });
  const router = useRouter();
  const { mutate: signUp, isPending } = useRegister();

  const handleSubmitForm = (data: ExtendedLoginFormValues) => {
    // ✅ Attach default values for rest of data before sending
    const payload = {
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      role: data.role,
      age: 21,
      gender: "Male",
      height: 175,
      weight: 68,
      bmi: 22.2,
    };

    signUp(payload, {
      onSuccess: () => {
        router.push("/dashboard");
      },
    });
  };

  return (
    <div className="w-full max-w-md mx-auto mt-20 p-6">
      <h2 className="text-3xl text-center mb-6 font-semibold">Welcome</h2>

      <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-5">
        <TextInput
          id="fullName"
          label="Full Name"
          placeholder="Enter your full name"
          {...register("fullName")}
          error={formState.errors.fullName?.message}
        />

        <TextInput
          id="email"
          label="Email"
          type="email"
          placeholder="Enter your email"
          {...register("email")}
          error={formState.errors.email?.message}
        />

        <PasswordInput
          id="password"
          label="Password"
          placeholder="Enter your password"
          {...register("password")}
          error={formState.errors.password?.message}
        />

        <div>
          <label className="block text-sm font-medium mb-1">Role</label>
          <Select
            onValueChange={(value) =>
              setValue("role", value as "ATHELETE" | "COACH")
            }
            defaultValue="athlete"
          >
            <SelectTrigger className="rounded-md">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ATHELETE">Athlete</SelectItem>
              <SelectItem value="COACH">Coach</SelectItem>
            </SelectContent>
          </Select>
          {formState.errors.role && (
            <p className="text-red-500 text-sm mt-1">
              {formState.errors.role.message}
            </p>
          )}
        </div>

        <Button
          loading={isPending}
          loadingText="Submitting..."
          type="submit"
          className="w-full rounded-full"
        >
          Continue
        </Button>

        <div className="flex justify-center">
          <Link href="/login" className="text-primary text-center mt-8">
            Login?
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
