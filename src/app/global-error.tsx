"use client";

import { GlobalError } from "@/components/shared/error-boundary";

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <GlobalError error={error} reset={reset} />;
}
