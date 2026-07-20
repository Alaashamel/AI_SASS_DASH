"use client";

import React from "react";
import Link from "next/link";
import { FileText, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const recentDocuments = [
  {
    id: "1",
    name: "Q4 Financial Report.pdf",
    type: "PDF",
    size: "2.4 MB",
    status: "completed" as const,
    time: "2 hours ago",
    tags: ["finance", "quarterly"],
  },
  {
    id: "2",
    name: "Marketing Strategy.docx",
    type: "DOCX",
    size: "890 KB",
    status: "completed" as const,
    time: "5 hours ago",
    tags: ["marketing"],
  },
  {
    id: "3",
    name: "Product Roadmap.xlsx",
    type: "XLSX",
    size: "1.2 MB",
    status: "processing" as const,
    time: "1 day ago",
    tags: ["product"],
  },
  {
    id: "4",
    name: "User Research Notes.txt",
    type: "TXT",
    size: "156 KB",
    status: "completed" as const,
    time: "2 days ago",
    tags: ["research"],
  },
];

const statusColors: Record<string, string> = {
  completed: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
  processing: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
  failed: "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400",
};

export function RecentDocuments() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Recent Documents</CardTitle>
        <Link href="/documents">
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentDocuments.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted/50 transition-colors"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{doc.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-muted-foreground">{doc.size}</span>
                <span className="text-xs text-muted-foreground">·</span>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {doc.time}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Badge
                variant="secondary"
                className={`text-[10px] ${statusColors[doc.status]}`}
              >
                {doc.status}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
