"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { mutationQueue, type QueuedMutation } from "@/lib/db/mutation-queue";
import { useOnlineStatus } from "@/hooks/use-online-status";

interface QueueableMutationOptions {
  endpoint: string;
  method: QueuedMutation["method"];
  body?: unknown;
  headers?: Record<string, string>;
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
}

export function useQueueableMutation() {
  const { isOnline } = useOnlineStatus();

  const mutate = useCallback(
    async (options: QueueableMutationOptions) => {
      const { endpoint, method, body, headers, onSuccess, onError } = options;

      if (isOnline) {
        try {
          const res = await fetch(endpoint, {
            method,
            headers: { "Content-Type": "application/json", ...headers },
            body: body ? JSON.stringify(body) : undefined,
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json().catch(() => null);
          onSuccess?.(data);
          return { queued: false, data };
        } catch (error) {
          onError?.(error);
          return { queued: false, error };
        }
      }

      await mutationQueue.enqueue({ endpoint, method, body: body ?? null, headers: headers ?? {} });
      toast.info("Action queued", {
        description: "This will be applied when you're back online.",
      });
      return { queued: true };
    },
    [isOnline]
  );

  return { mutate, isOnline };
}
