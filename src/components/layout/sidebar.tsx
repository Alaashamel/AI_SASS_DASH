"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  MessageSquare,
  Brain,
  FileText,
  BarChart3,
  CreditCard,
  Settings,
  Bell,
  ChevronLeft,
  ChevronRight,
  Zap,
  X,
  Bookmark,
  FolderKanban,
  HelpCircle,
  Key,
  Terminal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebarStore, useNotificationStore } from "@/stores";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  MessageSquare,
  Brain,
  FileText,
  BarChart3,
  CreditCard,
  Settings,
  Bell,
  Bookmark,
  FolderKanban,
  HelpCircle,
  Key,
  Terminal,
};

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Chat", href: "/chat", icon: "MessageSquare" },
  { label: "Projects", href: "/projects", icon: "FolderKanban" },
  { label: "Prompts", href: "/prompts", icon: "Bookmark" },
  { label: "Documents", href: "/documents", icon: "FileText" },
  { label: "Analytics", href: "/analytics", icon: "BarChart3" },
];

const NAV_ITEMS_SECONDARY = [
  { label: "AI Models", href: "/ai-models", icon: "Brain" },
  { label: "Billing", href: "/billing", icon: "CreditCard" },
  { label: "API Keys", href: "/api-keys", icon: "Key" },
  { label: "Developer", href: "/developer", icon: "Terminal" },
  { label: "Help Center", href: "/help-center", icon: "HelpCircle" },
  { label: "Notifications", href: "/notifications", icon: "Bell" },
  { label: "Settings", href: "/settings", icon: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isOpen, isMobileOpen, toggle, closeMobile } = useSidebarStore();
  const { unreadCount } = useNotificationStore();

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href + "/");

  const renderNavItem = (item: (typeof NAV_ITEMS)[0]) => {
    const Icon = iconMap[item.icon] || LayoutDashboard;
    const active = isActive(item.href);
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={closeMobile}
        className={cn(
          "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
          active
            ? "bg-primary/10 text-primary dark:bg-primary/10 dark:text-primary"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
          !isOpen && "justify-center px-2"
        )}
      >
        {active && (
          <motion.div
            layoutId="sidebar-active"
            className="absolute inset-0 rounded-lg bg-primary/10"
            transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
          />
        )}
        <Icon className="relative h-[18px] w-[18px] shrink-0" />
        {isOpen && (
          <span className="relative truncate">{item.label}</span>
        )}
        {item.label === "Notifications" && unreadCount > 0 && (
          <Badge
            variant="destructive"
            className={cn(
              "ml-auto h-4 min-w-4 justify-center rounded-full px-1 text-[10px]",
              !isOpen && "absolute -right-0.5 -top-0.5 h-3.5 min-w-3.5 text-[9px]"
            )}
          >
            {unreadCount}
          </Badge>
        )}
      </Link>
    );
  };

  const navContent = useMemo(
    () => (
      <nav className="flex flex-col gap-0.5 px-3 py-2">
        {NAV_ITEMS.map(renderNavItem)}
        <Separator className="my-2" />
        {NAV_ITEMS_SECONDARY.map(renderNavItem)}
      </nav>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pathname, isOpen, closeMobile, unreadCount]
  );

  return (
    <>
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={closeMobile}
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen border-r bg-card transition-all duration-300 ease-in-out",
          isOpen ? "w-60" : "w-[64px]",
          isMobileOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          <div
            className={cn(
              "flex h-14 items-center border-b px-4",
              isOpen ? "justify-between" : "justify-center"
            )}
          >
            {isOpen ? (
              <Link href="/dashboard" className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-blue-500">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <span className="text-[15px] font-bold tracking-tight">
                  NeuralFlow
                </span>
              </Link>
            ) : (
              <Link
                href="/dashboard"
                className="flex items-center justify-center"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-blue-500">
                  <Zap className="h-4 w-4 text-white" />
                </div>
              </Link>
            )}
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="hidden lg:flex h-7 w-7"
                onClick={toggle}
              >
                {isOpen ? (
                  <ChevronLeft className="h-3.5 w-3.5" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-7 w-7"
                onClick={closeMobile}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-1 py-1">{navContent}</ScrollArea>

          <div className={cn("border-t p-3", !isOpen && "px-2 py-3 flex justify-center")}>
            <div
              className={cn(
                "flex items-center gap-2.5",
                !isOpen && "flex-col gap-1"
              )}
            >
              <Avatar className="h-8 w-8 ring-2 ring-background">
                <AvatarImage src="https://randomuser.me/api/portraits/women/44.jpg" />
                <AvatarFallback className="text-xs bg-gradient-to-br from-violet-500 to-blue-500 text-white">
                  SC
                </AvatarFallback>
              </Avatar>
              {isOpen && (
                <div className="flex-1 truncate min-w-0">
                  <p className="text-sm font-medium truncate">Sarah Chen</p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    sarah@neuralflow.ai
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
