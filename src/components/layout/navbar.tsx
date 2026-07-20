"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  LogOut,
  User,
  Settings,
  ChevronDown,
  Command,
} from "lucide-react";
import { useSidebarStore, useThemeStore, useNotificationStore, useAuthStore } from "@/stores";
import { useDebouncedCallback } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const router = useRouter();
  const { toggleMobile } = useSidebarStore();
  const { resolvedTheme, setTheme } = useThemeStore();
  const { unreadCount } = useNotificationStore();
  const { logout } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedSearch = useDebouncedCallback((value: unknown) => {
    const str = String(value);
    if (str.trim()) {
      router.push(`/documents?search=${encodeURIComponent(str)}`);
    }
  }, 500);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    debouncedSearch(e.target.value);
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 px-4 lg:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden h-8 w-8"
        onClick={toggleMobile}
      >
        <Menu className="h-4 w-4" />
      </Button>

      <div className="flex-1 flex items-center gap-2">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search anything..."
            value={searchQuery}
            onChange={handleSearch}
            className="pl-9 h-8 text-sm bg-muted/50 border-0 focus-visible:ring-1"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5 rounded border bg-muted px-1.5 py-0.5">
            <Command className="h-2.5 w-2.5 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground font-medium">K</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="h-8 w-8"
        >
          {resolvedTheme === "dark" ? (
            <Sun className="h-3.5 w-3.5" />
          ) : (
            <Moon className="h-3.5 w-3.5" />
          )}
        </Button>

        <Link href="/notifications">
          <Button variant="ghost" size="icon" className="relative h-8 w-8">
            <Bell className="h-3.5 w-3.5" />
            {unreadCount > 0 && (
              <span className="absolute -right-0 -top-0 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-medium text-destructive-foreground">
                {unreadCount}
              </span>
            )}
          </Button>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 gap-2 px-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src="https://randomuser.me/api/portraits/women/44.jpg" />
                <AvatarFallback className="text-[10px] bg-gradient-to-br from-violet-500 to-blue-500 text-white">
                  SC
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:inline-flex text-sm font-medium">
                Sarah
              </span>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">Sarah Chen</p>
                <p className="text-xs text-muted-foreground">
                  sarah@neuralflow.ai
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/profile")}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                logout();
                router.push("/login");
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
