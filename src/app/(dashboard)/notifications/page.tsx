"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  CheckCheck,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
  Trash2,
  Settings,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNotificationStore, type NotificationType, type AppNotification } from "@/stores/notification-store";
import { cn, formatRelativeTime } from "@/lib/utils";

const typeConfig: Record<NotificationType, { icon: React.ElementType; color: string; bg: string }> = {
  system: { icon: Info, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30" },
  mention: { icon: MessageSquare, color: "text-violet-500", bg: "bg-violet-100 dark:bg-violet-900/30" },
  update: { icon: Bell, color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-900/30" },
  alert: { icon: AlertTriangle, color: "text-orange-500", bg: "bg-orange-100 dark:bg-orange-900/30" },
  success: { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-900/30" },
};

function NotificationItem({ notification }: { notification: AppNotification }) {
  const router = useRouter();
  const { markRead, dismiss } = useNotificationStore();
  const config = typeConfig[notification.type];
  const Icon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10, height: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className={cn(
          "flex gap-4 p-4 hover:bg-muted/50 transition-colors group",
          !notification.read && "bg-primary/5"
        )}
        onClick={() => {
          markRead(notification.id);
          if (notification.actionUrl) router.push(notification.actionUrl);
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            markRead(notification.id);
            if (notification.actionUrl) router.push(notification.actionUrl);
          }
        }}
        aria-label={`${notification.title} - ${notification.read ? "read" : "unread"}`}
      >
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-full shrink-0", config.bg)}>
          <Icon className={cn("h-4 w-4", config.color)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">{notification.title}</p>
            {!notification.read && (
              <div className="h-2 w-2 rounded-full bg-primary shrink-0" aria-label="Unread" />
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {notification.description}
          </p>
          <span className="text-[11px] text-muted-foreground mt-1 block">
            {formatRelativeTime(notification.createdAt)}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 opacity-0 group-hover:opacity-100 shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            dismiss(notification.id);
          }}
          aria-label="Dismiss notification"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    </motion.div>
  );
}

export default function NotificationsPage() {
  const { notifications, unreadCount, markAllRead } = useNotificationStore();

  const unread = notifications.filter((n) => !n.read);
  const mentions = notifications.filter((n) => n.type === "mention");

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated with your latest activity.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={markAllRead} disabled={unreadCount === 0}>
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark all read
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all" className="gap-2">
            All
            <Badge variant="secondary" className="h-5 min-w-5 text-[10px]">{notifications.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="unread" className="gap-2">
            Unread
            {unreadCount > 0 && (
              <Badge variant="secondary" className="h-5 min-w-5 text-[10px]">{unreadCount}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="mentions" className="gap-2">
            Mentions
            {mentions.length > 0 && (
              <Badge variant="secondary" className="h-5 min-w-5 text-[10px]">{mentions.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <AnimatePresence mode="popLayout">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Bell className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">No notifications</p>
                    <p className="text-xs text-muted-foreground">You&apos;re all caught up!</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <NotificationItem key={n.id} notification={n} />
                  ))
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="unread" className="mt-4">
          <Card>
            <CardContent className="p-0">
              {unread.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle2 className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">All caught up!</p>
                  <p className="text-xs text-muted-foreground">No unread notifications.</p>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {unread.map((n) => (
                    <NotificationItem key={n.id} notification={n} />
                  ))}
                </AnimatePresence>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mentions" className="mt-4">
          <Card>
            <CardContent className="p-0">
              {mentions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <MessageSquare className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">No mentions</p>
                  <p className="text-xs text-muted-foreground">When someone mentions you, it will appear here.</p>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {mentions.map((n) => (
                    <NotificationItem key={n.id} notification={n} />
                  ))}
                </AnimatePresence>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
