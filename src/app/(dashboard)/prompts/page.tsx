"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Bookmark,
  Plus,
  Copy,
  Trash2,
  Search,
  Tag,
  MoreHorizontal,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  usageCount: number;
  createdAt: string;
}

const MOCK_PROMPTS: Prompt[] = [
  {
    id: "1",
    title: "Code Review Assistant",
    content: "Review the following code for potential bugs, performance issues, and security vulnerabilities. Provide specific suggestions for improvement.",
    category: "Code",
    tags: ["review", "security"],
    usageCount: 42,
    createdAt: "2 days ago",
  },
  {
    id: "2",
    title: "Summarize Document",
    content: "Provide a concise summary of the following document, highlighting key findings, recommendations, and actionable insights.",
    category: "Writing",
    tags: ["summary", "analysis"],
    usageCount: 38,
    createdAt: "1 week ago",
  },
  {
    id: "3",
    title: "Data Analysis Prompt",
    content: "Analyze the following dataset and identify key trends, outliers, and correlations. Present findings in a clear, structured format.",
    category: "Analysis",
    tags: ["data", "trends"],
    usageCount: 25,
    createdAt: "3 days ago",
  },
  {
    id: "4",
    title: "Email Draft",
    content: "Draft a professional email to [recipient] regarding [topic]. Keep the tone [formal/friendly] and include a clear call to action.",
    category: "Writing",
    tags: ["email", "communication"],
    usageCount: 67,
    createdAt: "5 days ago",
  },
  {
    id: "5",
    title: "API Documentation",
    content: "Generate comprehensive API documentation for the following endpoint, including request/response examples, error codes, and rate limiting info.",
    category: "Code",
    tags: ["api", "docs"],
    usageCount: 19,
    createdAt: "1 day ago",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  Code: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
  Writing: "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
  Analysis: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
};

export default function PromptsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(MOCK_PROMPTS.map((p) => p.category)));

  const filtered = MOCK_PROMPTS.filter((p) => {
    if (selectedCategory && p.category !== selectedCategory) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Prompt Library</h1>
          <p className="text-muted-foreground">
            Save and organize your most effective prompts.
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Prompt
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search prompts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-3">
        {filtered.map((prompt, index) => (
          <motion.div
            key={prompt.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
          >
            <Card className="hover:shadow-sm transition-all duration-150 group">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold">{prompt.title}</h3>
                      <Badge
                        variant="secondary"
                        className={`text-[10px] ${CATEGORY_COLORS[prompt.category] || ""}`}
                      >
                        {prompt.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {prompt.content}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      {prompt.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-[10px]">
                          <Tag className="h-2.5 w-2.5 mr-0.5" />
                          {tag}
                        </Badge>
                      ))}
                      <span className="text-[10px] text-muted-foreground ml-auto">
                        Used {prompt.usageCount} times
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Copy className="mr-2 h-4 w-4" /> Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
            <Bookmark className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No prompts found</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            Create your first prompt template to get started.
          </p>
        </div>
      )}
    </div>
  );
}
