"use client";

import React from "react";
import { motion } from "framer-motion";
import { FolderKanban, Plus, MoreHorizontal, Users, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared";

const MOCK_PROJECTS = [
  {
    id: "1",
    name: "Marketing Campaign Q4",
    description: "AI-powered content generation for holiday campaigns",
    memberCount: 8,
    documentCount: 24,
    status: "active",
    updatedAt: "2 hours ago",
  },
  {
    id: "2",
    name: "Code Review Bot",
    description: "Automated code review using AI models",
    memberCount: 5,
    documentCount: 12,
    status: "active",
    updatedAt: "1 day ago",
  },
  {
    id: "3",
    name: "Customer Support AI",
    description: "Intelligent ticket routing and response generation",
    memberCount: 12,
    documentCount: 45,
    status: "active",
    updatedAt: "3 days ago",
  },
];

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Organize your AI workflows into projects.
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {MOCK_PROJECTS.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card className="hover:shadow-md transition-all duration-200 cursor-pointer group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <FolderKanban className="h-5 w-5 text-primary" />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
                <CardTitle className="text-base mt-3">{project.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {project.memberCount} members
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {project.documentCount} docs
                  </div>
                  <span className="ml-auto">{project.updatedAt}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
