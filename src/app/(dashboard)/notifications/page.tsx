"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Bell, Check, CheckCheck, MessageSquare, ThumbsUp, ThumbsDown, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { postService } from "@/services";
import { useNotificationStore } from "@/stores";
import { formatRelativeTime, cn } from "@/lib/utils";

export default function NotificationsPage() {
  const { unreadCount, markAllRead } = useNotificationStore();

  const { data: postsData, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => postService.getPosts(0, 20),
  });

  const notifications = postsData?.posts || [];

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated with your latest activity.
          </p>
        </div>
        <Button variant="outline" onClick={markAllRead}>
          <CheckCheck className="mr-2 h-4 w-4" />
          Mark all read
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">
            All
            <Badge variant="secondary" className="ml-2 h-5 min-w-5 text-[10px]">
              {notifications.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread
            <Badge variant="secondary" className="ml-2 h-5 min-w-5 text-[10px]">
              {unreadCount}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="mentions">Mentions</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <Card>
            <ScrollArea className="h-[calc(100vh-20rem)]">
              <div className="divide-y">
                {notifications.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                  >
                    <div
                      className={cn(
                        "flex gap-4 p-4 hover:bg-muted/50 transition-colors cursor-pointer",
                        index < unreadCount && "bg-primary/5"
                      )}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 shrink-0">
                        <Bell className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{post.title}</p>
                          {index < unreadCount && (
                            <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {post.body}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <ThumbsUp className="h-3 w-3" />
                            {post.reactions.likes}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <ThumbsDown className="h-3 w-3" />
                            {post.reactions.dislikes}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Eye className="h-3 w-3" />
                            {post.views}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatRelativeTime(new Date())}
                          </span>
                        </div>
                        <div className="flex gap-1.5 mt-2">
                          {post.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-[10px]">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </TabsContent>

        <TabsContent value="unread" className="mt-4">
          <Card>
            <div className="divide-y">
              {notifications.slice(0, unreadCount).map((post, index) => (
                <div
                  key={post.id}
                  className="flex gap-4 p-4 hover:bg-muted/50 transition-colors cursor-pointer bg-primary/5"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 shrink-0">
                    <Bell className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{post.title}</p>
                      <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{post.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="mentions" className="mt-4">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
              <MessageSquare className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No mentions yet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              When someone mentions you, it will appear here.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
