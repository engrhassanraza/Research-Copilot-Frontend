"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import * as authApi from "@/services/auth";
import { ApiError } from "@/services/api";
import { useAuthStore } from "@/stores/auth-store";

export function useMe() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: ["me"],
    queryFn: authApi.getMe,
    enabled: !!token,
    retry: false,
  });
}

export function useLogin() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: async (data) => {
      setSession(data.access_token, null);
      const me = await authApi.getMe();
      setSession(data.access_token, me);
      router.push("/dashboard");
    },
  });
}

export function useRegister() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: async (data) => {
      setSession(data.access_token, null);
      const me = await authApi.getMe();
      setSession(data.access_token, me);
      router.push("/dashboard");
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const clear = useAuthStore((s) => s.clear);
  return () => {
    clear();
    router.push("/login");
  };
}

export function authErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) return error.message;
  return fallback;
}
