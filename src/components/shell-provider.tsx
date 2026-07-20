"use client";

import React, { useState, useCallback } from "react";
import { CommandPalette } from "@/components/command/command-palette";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";

export function ShellProvider({ children }: { children: React.ReactNode }) {
  const [commandOpen, setCommandOpen] = useState(false);

  const toggleCommand = useCallback(() => {
    setCommandOpen((prev) => !prev);
  }, []);

  useKeyboardShortcuts(toggleCommand);

  return (
    <>
      {children}
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </>
  );
}
