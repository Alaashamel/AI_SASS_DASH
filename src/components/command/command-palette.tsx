"use client";

import React, { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  LayoutDashboard,
  MessageSquare,
  Bookmark,
  FolderKanban,
  FileText,
  BarChart3,
  CreditCard,
  Settings,
  Bell,
  Brain,
  Sun,
  Moon,
  User,
  LogOut,
  Plus,
  Sparkles,
  HelpCircle,
  Key,
  Terminal,
} from "lucide-react";
import { useThemeStore, useAuthStore, useSidebarStore } from "@/stores";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, group: "Navigation" },
  { label: "Chat", href: "/chat", icon: MessageSquare, group: "Navigation" },
  { label: "Projects", href: "/projects", icon: FolderKanban, group: "Navigation" },
  { label: "Prompts", href: "/prompts", icon: Bookmark, group: "Navigation" },
  { label: "Documents", href: "/documents", icon: FileText, group: "Navigation" },
  { label: "Analytics", href: "/analytics", icon: BarChart3, group: "Navigation" },
  { label: "AI Models", href: "/ai-models", icon: Brain, group: "Navigation" },
  { label: "Billing", href: "/billing", icon: CreditCard, group: "Navigation" },
  { label: "Profile", href: "/profile", icon: User, group: "Navigation" },
  { label: "Settings", href: "/settings", icon: Settings, group: "Navigation" },
  { label: "Notifications", href: "/notifications", icon: Bell, group: "Navigation" },
  { label: "Help Center", href: "/help-center", icon: HelpCircle, group: "Navigation" },
  { label: "API Keys", href: "/api-keys", icon: Key, group: "Navigation" },
  { label: "Developer Console", href: "/developer", icon: Terminal, group: "Navigation" },
];

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useThemeStore();
  const { logout } = useAuthStore();
  const { isOpen: sidebarOpen, toggle: toggleSidebar } = useSidebarStore();
  const [search, setSearch] = useState("");

  const runAction = useCallback(
    (action: () => void) => {
      onOpenChange(false);
      setSearch("");
      action();
    },
    [onOpenChange]
  );

  const handleSelect = useCallback(
    (value: string) => {
      const navItem = NAV_ITEMS.find((item) => item.href === value);
      if (navItem) {
        runAction(() => router.push(navItem.href));
        return;
      }

      switch (value) {
        case "toggle-theme":
          runAction(() =>
            setTheme(resolvedTheme === "dark" ? "light" : "dark")
          );
          break;
        case "toggle-sidebar":
          runAction(() => toggleSidebar());
          break;
        case "new-chat":
          runAction(() => router.push("/chat"));
          break;
        case "new-project":
          runAction(() => router.push("/projects"));
          break;
        case "new-prompt":
          runAction(() => router.push("/prompts"));
          break;
        case "logout":
          runAction(() => {
            logout();
            router.push("/login");
          });
          break;
      }
    },
    [runAction, router, resolvedTheme, setTheme, toggleSidebar, logout]
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (e.key === "Escape" && open) {
        onOpenChange(false);
        setSearch("");
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => {
              onOpenChange(false);
              setSearch("");
            }}
          />
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ duration: 0.15 }}
              className="w-full max-w-[560px] mx-4"
            >
              <Command
                value={search}
                onValueChange={setSearch}
                filter={(value, search) => {
                  if (value.toLowerCase().includes(search.toLowerCase())) return 1;
                  return 0;
                }}
                className="overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-2xl"
              >
                <div className="flex items-center border-b px-3">
                  <Search className="h-4 w-4 shrink-0 opacity-50" />
                  <Command.Input
                    placeholder="Type a command or search..."
                    className="flex h-11 w-full rounded-md bg-transparent py-3 pl-2 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    autoFocus
                  />
                  <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
                    ESC
                  </kbd>
                </div>
                <Command.List className="max-h-[360px] overflow-y-auto p-2">
                  <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
                    No results found.
                  </Command.Empty>

                  <Command.Group heading="Navigation" className="text-xs text-muted-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground">
                    {NAV_ITEMS.map((item) => (
                      <Command.Item
                        key={item.href}
                        value={item.href}
                        onSelect={handleSelect}
                        className="relative flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span>{item.label}</span>
                      </Command.Item>
                    ))}
                  </Command.Group>

                  <Command.Separator className="my-1.5 h-px bg-border" />

                  <Command.Group heading="Actions" className="text-xs text-muted-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground">
                    <Command.Item
                      value="new-chat"
                      onSelect={handleSelect}
                      className="relative flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                    >
                      <Plus className="h-4 w-4 shrink-0" />
                      <span>New Chat</span>
                      <kbd className="ml-auto pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
                        N
                      </kbd>
                    </Command.Item>
                    <Command.Item
                      value="new-project"
                      onSelect={handleSelect}
                      className="relative flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                    >
                      <FolderKanban className="h-4 w-4 shrink-0" />
                      <span>New Project</span>
                    </Command.Item>
                    <Command.Item
                      value="new-prompt"
                      onSelect={handleSelect}
                      className="relative flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                    >
                      <Sparkles className="h-4 w-4 shrink-0" />
                      <span>New Prompt</span>
                    </Command.Item>
                  </Command.Group>

                  <Command.Separator className="my-1.5 h-px bg-border" />

                  <Command.Group heading="Preferences" className="text-xs text-muted-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground">
                    <Command.Item
                      value="toggle-theme"
                      onSelect={handleSelect}
                      className="relative flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                    >
                      {resolvedTheme === "dark" ? (
                        <Sun className="h-4 w-4 shrink-0" />
                      ) : (
                        <Moon className="h-4 w-4 shrink-0" />
                      )}
                      <span>
                        {resolvedTheme === "dark"
                          ? "Switch to Light Mode"
                          : "Switch to Dark Mode"}
                      </span>
                      <kbd className="ml-auto pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
                        ⇧ D
                      </kbd>
                    </Command.Item>
                    <Command.Item
                      value="toggle-sidebar"
                      onSelect={handleSelect}
                      className="relative flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                    >
                      <LayoutDashboard className="h-4 w-4 shrink-0" />
                      <span>
                        {sidebarOpen
                          ? "Collapse Sidebar"
                          : "Expand Sidebar"}
                      </span>
                    </Command.Item>
                    <Command.Item
                      value="logout"
                      onSelect={handleSelect}
                      className="relative flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-red-500"
                    >
                      <LogOut className="h-4 w-4 shrink-0" />
                      <span>Log Out</span>
                    </Command.Item>
                  </Command.Group>
                </Command.List>
              </Command>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
