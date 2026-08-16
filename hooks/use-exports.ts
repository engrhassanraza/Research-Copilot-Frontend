"use client";

import { useMutation } from "@tanstack/react-query";

import * as exportsApi from "@/services/exports";

export function useCreateExport(projectId: string) {
  return useMutation({
    mutationFn: (body: { message_id: string; format: "docx" | "pdf"; style?: string; title?: string }) =>
      exportsApi.createExport(projectId, body),
  });
}
