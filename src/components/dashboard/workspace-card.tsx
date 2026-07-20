"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardStore } from "@/stores";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Users, Check } from "lucide-react";

export function WorkspaceCard() {
  const { workspaces, activeWorkspaceId, setActiveWorkspace } = useDashboardStore();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Workspaces</CardTitle>
        <Button variant="ghost" size="sm">
          Create New
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {workspaces.map((workspace) => (
          <div
            key={workspace.id}
            onClick={() => setActiveWorkspace(workspace.id)}
            className={`flex items-center gap-3 rounded-lg p-3 cursor-pointer transition-colors ${
              activeWorkspaceId === workspace.id
                ? "bg-primary/10 border border-primary/20"
                : "hover:bg-muted/50 border border-transparent"
            }`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <Building2 className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium truncate">{workspace.name}</p>
                {workspace.isDefault && (
                  <Badge variant="secondary" className="text-[10px]">
                    Default
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="h-3 w-3" />
                  {workspace.memberCount} members
                </div>
              </div>
            </div>
            {activeWorkspaceId === workspace.id && (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shrink-0">
                <Check className="h-3 w-3" />
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
