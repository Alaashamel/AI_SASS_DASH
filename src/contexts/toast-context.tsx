"use client";

import { toast as sonnerToast, type ExternalToast } from "sonner";

interface ToastOptions extends ExternalToast {
  title?: string;
  description?: string;
  variant?: "default" | "success" | "error" | "warning";
}

function toast({ title, description, variant, ...options }: ToastOptions) {
  switch (variant) {
    case "success":
      return sonnerToast.success(title, { description, ...options });
    case "error":
      return sonnerToast.error(title, { description, ...options });
    case "warning":
      return sonnerToast.warning(title, { description, ...options });
    default:
      return sonnerToast(title, { description, ...options });
  }
}

function useToast() {
  return {
    toast,
    dismiss: sonnerToast.dismiss,
  };
}

export { toast, useToast };
