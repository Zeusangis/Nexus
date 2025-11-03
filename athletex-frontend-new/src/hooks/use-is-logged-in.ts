"use client";

import { useGetUser } from "@/utils/getUser";
import { getTokens } from "@/utils/token";
import { useEffect, useState } from "react";

export function useIsLoggedIn() {
  const [hasToken, setHasToken] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);

  useEffect(() => {
    const { accessToken } = getTokens();
    setHasToken(!!accessToken);
    setIsCheckingToken(false);
  }, []);

  const { data: user, isLoading: isUserLoading } = useGetUser({
    enabled: hasToken, // Only fetch user if we have a token
  });

  const isLoading = isCheckingToken || isUserLoading;
  const isLoggedIn = hasToken && !!user;

  return { user, isLoading, isLoggedIn };
}
