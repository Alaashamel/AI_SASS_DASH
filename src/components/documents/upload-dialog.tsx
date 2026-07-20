"use client";

import React, { useState, useRef, useCallback } from "react";
import { Upload, X, FileText, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatFileSize } from "@/lib/utils";

interface UploadFileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (files: File[]) => void;
}

interface StagedFile {
  file: File;
  status: "staged" | "uploading" | "done";
}

export function UploadFileDialog({ open, onOpenChange, onUpload }: UploadFileDialogProps) {
  const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((files: FileList | File[]) => {
    const arr = Array.from(files);
    setStagedFiles((prev) => [
      ...prev,
      ...arr.map((file) => ({ file, status: "staged" as const })),
    ]);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (e.dataTransfer.files.length > 0) addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragOver(false), []);

  const removeFile = (index: number) => {
    setStagedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    onUpload(stagedFiles.map((sf) => sf.file));
    setStagedFiles([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload Documents</DialogTitle>
          <DialogDescription>
            Drag and drop files or click to browse. Max 50MB per file.
          </DialogDescription>
        </DialogHeader>

        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors cursor-pointer",
            isDragOver
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
          )}
        >
          <Upload className="h-8 w-8 text-muted-foreground mb-3" />
          <p className="text-sm font-medium">Drop files here or click to browse</p>
          <p className="text-xs text-muted-foreground mt-1">
            PDF, DOCX, XLSX, TXT, PNG, JPG up to 50MB
          </p>
          <input
            ref={inputRef}
            type="file"
            multiple
            className="hidden"
            accept=".pdf,.docx,.xlsx,.txt,.png,.jpg,.jpeg,.csv"
            onChange={(e) => {
              if (e.target.files) addFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>

        {stagedFiles.length > 0 && (
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {stagedFiles.map((sf, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{sf.file.name}</p>
                  <p className="text-[11px] text-muted-foreground">{formatFileSize(sf.file.size)}</p>
                </div>
                {sf.status === "done" ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0"
                    onClick={() => removeFile(i)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => { setStagedFiles([]); onOpenChange(false); }}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={stagedFiles.length === 0}>
            <Upload className="mr-2 h-4 w-4" />
            Upload {stagedFiles.length > 0 && `(${stagedFiles.length})`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
