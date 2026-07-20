"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TEAM_MEMBERS } from "@/constants";
import { cn } from "@/lib/utils";

const statusColorMap: Record<string, string> = {
  active: "bg-emerald-500",
  away: "bg-amber-500",
  offline: "bg-gray-400",
};

export function TeamMembersList() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Team Members</CardTitle>
        <Button variant="ghost" size="sm">
          Manage
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {TEAM_MEMBERS.map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted/50 transition-colors"
          >
            <div className="relative">
              <Avatar className="h-9 w-9">
                <AvatarImage src={member.avatar} />
                <AvatarFallback className="text-xs">
                  {member.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <span
                className={cn(
                  "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background",
                  statusColorMap[member.status]
                )}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{member.name}</p>
              <p className="text-xs text-muted-foreground truncate">{member.email}</p>
            </div>
            <div className="shrink-0">
              <Badge variant="outline" className="text-[10px]">
                {member.role}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
