"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useThemeStore } from "@/stores";

interface ShortcutConfig {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description: string;
}

export function useKeyboardShortcuts(
  onCommandPaletteToggle: () => void
) {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useThemeStore();

  const shortcuts: ShortcutConfig[] = [
    {
      key: "k",
      ctrl: true,
      action: onCommandPaletteToggle,
      description: "Toggle command palette",
    },
    {
      key: "d",
      shift: true,
      action: () => setTheme(resolvedTheme === "dark" ? "light" : "dark"),
      description: "Toggle theme",
    },
    {
      key: "g",
      ctrl: true,
      action: () => router.push("/dashboard"),
      description: "Go to Dashboard",
    },
    {
      key: "g",
      shift: true,
      action: () => router.push("/chat"),
      description: "Go to Chat",
    },
  ];

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrl
          ? e.metaKey || e.ctrlKey
          : !(e.metaKey || e.ctrlKey);
        const shiftMatch = shortcut.shift
          ? e.shiftKey
          : !e.shiftKey;
        const altMatch = shortcut.alt ? e.altKey : !e.altKey;

        if (
          e.key.toLowerCase() === shortcut.key.toLowerCase() &&
          ctrlMatch &&
          shiftMatch &&
          altMatch
        ) {
          e.preventDefault();
          shortcut.action();
          return;
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [resolvedTheme, setTheme, router, onCommandPaletteToggle]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}
