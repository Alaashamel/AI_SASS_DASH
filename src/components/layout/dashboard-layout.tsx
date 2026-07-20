"use client";

import React from "react";
import { useSidebarStore } from "@/stores";
import { cn } from "@/lib/utils";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSidebarStore();

  return (
    <div className="min-h-screen bg-background">
      <main
        className={cn(
          "transition-all duration-300 ease-in-out pt-14 lg:pt-0",
          isOpen ? "lg:pl-60" : "lg:pl-[64px]"
        )}
      >
        <div className="p-4 lg:p-6">{children}</div>
      </main>
    </div>
  );
}
