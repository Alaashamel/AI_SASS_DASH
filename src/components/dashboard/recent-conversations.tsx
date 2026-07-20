"use client";

import React from "react";
import { MessageSquare, Clock } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const recentConversations = [
  {
    id: "1",
    title: "Data Analysis Request",
    preview: "Can you analyze the quarterly report data?",
    model: "GPT-4o",
    time: "2 min ago",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: "2",
    title: "Code Review",
    preview: "Review this React component for performance...",
    model: "Claude 3.5",
    time: "15 min ago",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    id: "3",
    title: "Content Writing",
    preview: "Help me write a blog post about AI trends...",
    model: "GPT-4o",
    time: "1 hour ago",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: "4",
    title: "Product Research",
    preview: "Compare pricing strategies for SaaS products",
    model: "Gemini Pro",
    time: "3 hours ago",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
  },
];

export function RecentConversations() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Recent Conversations</CardTitle>
        <Link href="/chat">
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentConversations.map((conv) => (
          <Link
            key={conv.id}
            href="/chat"
            className="flex items-start gap-3 rounded-lg p-2 hover:bg-muted/50 transition-colors"
          >
            <Avatar className="h-9 w-9">
              <AvatarImage src={conv.avatar} />
              <AvatarFallback className="text-xs">
                {conv.title.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium truncate">{conv.title}</p>
                <span className="text-[10px] rounded-full bg-primary/10 px-1.5 py-0.5 text-primary font-medium">
                  {conv.model}
                </span>
              </div>
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {conv.preview}
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
              <Clock className="h-3 w-3" />
              {conv.time}
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
