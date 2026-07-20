"use client";

import React from "react";
import { FileX, SearchX, AlertTriangle, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: React.ElementType;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: "default" | "search" | "error" | "documents";
}

const variantConfig = {
  default: { icon: Inbox, bg: "bg-muted/50" },
  search: { icon: SearchX, bg: "bg-blue-50 dark:bg-blue-950/20" },
  error: { icon: AlertTriangle, bg: "bg-red-50 dark:bg-red-950/20" },
  documents: { icon: FileX, bg: "bg-muted/50" },
};

export function EmptyState({
  icon: CustomIcon,
  title,
  description,
  action,
  variant = "default",
}: EmptyStateProps) {
  const config = variantConfig[variant];
  const Icon = CustomIcon || config.icon;

  return (
    <div className={`flex flex-col items-center justify-center rounded-xl p-12 text-center ${config.bg}`}>
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>
      {action && (
        <Button onClick={action.onClick} size="sm">
          {action.label}
        </Button>
      )}
    </div>
  );
}
