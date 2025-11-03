"use client";
import React from "react";

import AuthLayout from "@/components/layouts/auth-layout";
import { useIsLoggedIn } from "@/hooks/use-is-logged-in"; // ✅ import your new hook
import PageLoader from "@/components/molecules/page-loader";
import { useRouter } from "next/navigation";

type Props = {
  children?: React.ReactNode;
};

const Layout = (props: Props) => {
  const { isLoading, isLoggedIn } = useIsLoggedIn();
  const router = useRouter();

  if (isLoading) return <PageLoader />;
  if (isLoggedIn) {
    // router.push handled inside the hook
    router.push("/dashboard"); // router.push handled inside the hook
    return null;
  }

  return <AuthLayout>{props.children}</AuthLayout>;
};

export default Layout;
