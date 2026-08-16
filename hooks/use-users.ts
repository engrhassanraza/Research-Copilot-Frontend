"use client";

import { useQuery } from "@tanstack/react-query";

import * as usersApi from "@/services/users";

export function useUser(id: string | null) {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => usersApi.getUser(id as string),
    enabled: !!id,
  });
}
