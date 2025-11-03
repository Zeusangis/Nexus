"use client";

// External Packages
import React, { Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// UI Components
import { Button } from "@/components/ui/button";
import PasswordInput from "@/components/molecules/password-input";

// Utilities
import {
  SetPasswordFormValues,
  setPasswordSchema,
} from "@/schema/auth/set-password-schema";
import PageLoader from "@/components/molecules/page-loader";

const SetPasswordForm = () => {
  const token = "123abc";
  const form = useForm<SetPasswordFormValues>({
    mode: "onChange",
    resolver: zodResolver(setPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  const { handleSubmit, register, formState } = form;

  const handleSubmitForm = (data: SetPasswordFormValues) => {
    // TODO: handle password update logic
    console.log(data);
    console.log(token);
  };

  return (
    <div className="w-full h-96">
      <h2 className="text-3xl text-center">Set your new password</h2>
      <p className="text-gray-600 mt-2 mb-6 text-center">
        Please enter your new password. Make sure it is strong.
      </p>
      <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-5">
        <PasswordInput
          className="rounded-md"
          id="password"
          label="Password"
          placeholder="Enter your password"
          {...register("password")}
          error={formState.errors.password?.message}
        />
        <PasswordInput
          className="rounded-md"
          id="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm your password"
          {...register("confirmPassword")}
          error={formState.errors.confirmPassword?.message}
        />
        <Button type="submit" className="w-full rounded-full">
          Update Password
        </Button>
      </form>
    </div>
  );
};

export default function SetPassword() {
  return (
    <Suspense fallback={<PageLoader />}>
      <SetPasswordForm />
    </Suspense>
  );
}
