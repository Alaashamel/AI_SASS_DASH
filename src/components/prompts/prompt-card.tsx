"use client";

import React from "react";
import {
  Sparkles,
  Copy,
  Trash2,
  MoreHorizontal,
  Heart,
  Tag,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { StoredPrompt } from "@/lib/db";

const CATEGORY_COLORS: Record<string, string> = {
  Code: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
  Writing:
    "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
  Analysis:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
  Communication:
    "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
  Other: "bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
};

interface PromptCardProps {
  prompt: StoredPrompt;
  onEdit: (prompt: StoredPrompt) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onUsePrompt: (prompt: StoredPrompt) => void;
}

export function PromptCard({
  prompt,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleFavorite,
  onUsePrompt,
}: PromptCardProps) {
  return (
    <Card className="hover:shadow-sm transition-all duration-150 group">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold truncate">
                {prompt.title}
              </h3>
              <Badge
                variant="secondary"
                className={cn(
                  "text-[10px] shrink-0",
                  CATEGORY_COLORS[prompt.category] || CATEGORY_COLORS.Other
                )}
              >
                {prompt.category}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {prompt.content}
            </p>
            {prompt.tags.length > 0 && (
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                {prompt.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-[10px]">
                    <Tag className="h-2.5 w-2.5 mr-0.5" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground">
              <span>Used {prompt.usageCount} times</span>
              <span>·</span>
              <span>
                {new Date(prompt.updatedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => onUsePrompt(prompt)}
              title="Use in chat"
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-7 w-7",
                prompt.isFavorite && "text-red-500 hover:text-red-600"
              )}
              onClick={() => onToggleFavorite(prompt.id)}
            >
              <Heart
                className={cn(
                  "h-3.5 w-3.5",
                  prompt.isFavorite && "fill-current"
                )}
              />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(prompt)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDuplicate(prompt.id)}>
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(prompt.id)}
                  className="text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
