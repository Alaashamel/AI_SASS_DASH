"use client";

import React, { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  FileText,
  Search,
  Upload,
  Filter,
  Grid,
  List,
  MoreHorizontal,
  Download,
  Trash2,
  Eye,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState, TableSkeleton } from "@/components/shared";
import { productService } from "@/services";
import { formatFileSize, formatDate, cn } from "@/lib/utils";
import { useDebounce } from "@/hooks";
import { Document } from "@/types";

const MOCK_DOCUMENTS: Document[] = [
  { id: "1", name: "Q4 Financial Report.pdf", type: "pdf", size: 2516582, status: "completed", createdAt: "2024-10-15", updatedAt: "2024-10-15", tags: ["finance", "quarterly"], summary: "Comprehensive financial analysis for Q4 2024" },
  { id: "2", name: "Marketing Strategy 2025.docx", type: "docx", size: 911360, status: "completed", createdAt: "2024-10-14", updatedAt: "2024-10-14", tags: ["marketing", "strategy"] },
  { id: "3", name: "Product Roadmap.xlsx", type: "xlsx", size: 1258291, status: "processing", createdAt: "2024-10-13", updatedAt: "2024-10-13", tags: ["product"] },
  { id: "4", name: "User Research Notes.txt", type: "txt", size: 159744, status: "completed", createdAt: "2024-10-12", updatedAt: "2024-10-12", tags: ["research", "ux"] },
  { id: "5", name: "API Documentation v3.pdf", type: "pdf", size: 3145728, status: "completed", createdAt: "2024-10-11", updatedAt: "2024-10-11", tags: ["engineering", "api"] },
  { id: "6", name: "Annual Report 2024.pdf", type: "pdf", size: 5242880, status: "failed", createdAt: "2024-10-10", updatedAt: "2024-10-10", tags: ["finance", "annual"] },
];

const statusConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  completed: { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
  processing: { icon: Clock, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
  failed: { icon: AlertCircle, color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20" },
};

export default function DocumentsPage() {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const debouncedSearch = useDebounce(search, 300);

  const { data: productsData, isLoading } = useQuery({
    queryKey: ["products", debouncedSearch],
    queryFn: () =>
      debouncedSearch
        ? productService.searchProducts(debouncedSearch, 0, 10)
        : productService.getProducts(0, 10),
  });

  const documents = MOCK_DOCUMENTS.filter((doc) => {
    if (typeFilter !== "all" && doc.type !== typeFilter) return false;
    if (debouncedSearch && !doc.name.toLowerCase().includes(debouncedSearch.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    if (sortOrder === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortOrder === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (sortOrder === "name_asc") return a.name.localeCompare(b.name);
    if (sortOrder === "name_desc") return b.name.localeCompare(a.name);
    if (sortOrder === "size_desc") return b.size - a.size;
    return a.size - b.size;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground">
            Manage and analyze your uploaded documents.
          </p>
        </div>
        <Button className="gap-2">
          <Upload className="h-4 w-4" />
          Upload Document
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="docx">Word</SelectItem>
              <SelectItem value="xlsx">Spreadsheet</SelectItem>
              <SelectItem value="txt">Text</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="name_asc">Name A-Z</SelectItem>
              <SelectItem value="name_desc">Name Z-A</SelectItem>
              <SelectItem value="size_desc">Largest</SelectItem>
              <SelectItem value="size_asc">Smallest</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="h-9 w-9 rounded-r-none"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              className="h-9 w-9 rounded-l-none"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton rows={6} cols={5} />
      ) : documents.length === 0 ? (
        <EmptyState
          variant="documents"
          title="No documents found"
          description="Upload your first document to get started with AI-powered analysis."
          action={{ label: "Upload Document", onClick: () => {} }}
        />
      ) : viewMode === "grid" ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc, index) => {
            const status = statusConfig[doc.status];
            const StatusIcon = status.icon;
            return (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="hover:shadow-md transition-all duration-200 group">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted shrink-0">
                        <FileText className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate">{doc.name}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-[10px] uppercase">
                            {doc.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatFileSize(doc.size)}
                          </span>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" /> View
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" /> Download
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    {doc.summary && (
                      <p className="text-xs text-muted-foreground mt-3 line-clamp-2">
                        {doc.summary}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t">
                      <div className={cn("flex items-center gap-1 text-xs", status.color)}>
                        <StatusIcon className="h-3 w-3" />
                        <span className="capitalize">{doc.status}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(doc.createdAt)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <Card>
          <div className="divide-y">
            {documents.map((doc) => {
              const status = statusConfig[doc.status];
              const StatusIcon = status.icon;
              return (
                <div key={doc.id} className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted shrink-0">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(doc.size)}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px] uppercase">
                    {doc.type}
                  </Badge>
                  <div className={cn("flex items-center gap-1 text-xs", status.color)}>
                    <StatusIcon className="h-3 w-3" />
                    <span className="capitalize">{status.color.includes("emerald") ? "Completed" : status.color.includes("blue") ? "Processing" : "Failed"}</span>
                  </div>
                  <span className="text-xs text-muted-foreground w-20 text-right">
                    {formatDate(doc.createdAt)}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
