import { revalidatePath } from "next/cache";

export function serverActionWrapper<T>(
  action: () => Promise<T>
): Promise<{ data: T | null; error: string | null }> {
  return action()
    .then((data) => ({ data, error: null }))
    .catch((err) => ({
      data: null,
      error: err instanceof Error ? err.message : "An unexpected error occurred",
    }));
}

export function formatServerActionError(error: unknown): string {
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred";
}
