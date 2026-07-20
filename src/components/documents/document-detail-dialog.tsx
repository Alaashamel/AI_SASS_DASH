"use client";

import React from "react";
import {
  FileText,
  Download,
  Trash2,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertCircle,
  Tag,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn, formatFileSize, formatDate } from "@/lib/utils";
import type { Document } from "@/types";

interface DocumentDetailDialogProps {
  document: Document | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (id: string) => void;
}

const statusConfig: Record<string, { icon: React.ElementType; label: string; color: string }> = {
  completed: { icon: CheckCircle2, label: "Processed", color: "text-emerald-500" },
  processing: { icon: Clock, label: "Processing", color: "text-blue-500" },
  failed: { icon: AlertCircle, label: "Failed", color: "text-red-500" },
};

export function DocumentDetailDialog({
  document,
  open,
  onOpenChange,
  onDelete,
}: DocumentDetailDialogProps) {
  if (!document) return null;

  const status = statusConfig[document.status];
  const StatusIcon = status.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted shrink-0">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-base break-words">{document.name}</DialogTitle>
              <DialogDescription>
                {document.type.toUpperCase()} — {formatFileSize(document.size)}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className={cn("flex items-center gap-1.5", status.color)}>
              <StatusIcon className="h-4 w-4" />
              <span className="text-sm font-medium">{status.label}</span>
            </div>
          </div>

          {document.summary && (
            <>
              <Separator />
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Summary</p>
                <p className="text-sm">{document.summary}</p>
              </div>
            </>
          )}

          <Separator />

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Created</p>
              <p className="font-medium">{formatDate(document.createdAt)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Updated</p>
              <p className="font-medium">{formatDate(document.updatedAt)}</p>
            </div>
          </div>

          {document.tags.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {document.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-[10px]">
                    <Tag className="h-2.5 w-2.5 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="outline" className="flex-1 gap-2">
            <Download className="h-4 w-4" />
            Download
          </Button>
          <Button variant="outline" className="flex-1 gap-2">
            <ExternalLink className="h-4 w-4" />
            Open
          </Button>
          <Button
            variant="destructive"
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={() => {
              onDelete(document.id);
              onOpenChange(false);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
