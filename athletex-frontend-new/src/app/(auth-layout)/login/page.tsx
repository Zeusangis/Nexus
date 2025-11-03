"use client";

// External Packages
import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// UI Components
import { Button } from "@/components/ui/button";
import TextInput from "@/components/molecules/text-input";
import PasswordInput from "@/components/molecules/password-input";

// Utilities
import { LoginFormValues, loginSchema } from "@/schema/auth/login-schema";
import { useRouter } from "next/navigation";
import { useLogin } from "@/utils/login";

const LoginPage = () => {
  const form = useForm<LoginFormValues>({
    mode: "onChange",
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { handleSubmit, register, formState } = form;
  const router = useRouter();
  const { mutate: login, isPending } = useLogin();

  const handleSubmitForm = async (data: LoginFormValues) => {
    login(data, {
      onSuccess: () => {
        router.push("/dashboard");
      },
    });
  };

  return (
    <div className="w-full max-w-md mx-auto mt-20 p-6">
      <h2 className="text-3xl text-center mb-6 font-semibold">Welcome Back</h2>
      <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-5">
        <TextInput
          className="rounded-md"
          id="email"
          label="Email"
          type="email"
          placeholder="Enter your email"
          {...register("email")}
          error={formState.errors.email?.message}
        />
        <PasswordInput
          className="rounded-md"
          id="password"
          label="Password"
          placeholder="Enter your password"
          {...register("password")}
          error={formState.errors.password?.message}
        />
        <Button
          loading={isPending}
          loadingText="Logging in"
          type="submit"
          className="w-full rounded-full"
        >
          Login
        </Button>
        <div className="flex justify-center">
          <Link href={"/register"} className="text-primary text-center mt-8">
            Don&apos;t have an account? Register
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
