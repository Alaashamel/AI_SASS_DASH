import { create } from "zustand";
import { User, Subscription, Workspace } from "@/types";
import { SUBSCRIPTION, WORKSPACES } from "@/constants";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  login: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  login: (user) => {
    localStorage.setItem("auth_token", "mock_token");
    set({ user, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem("auth_token");
    set({ user: null, isAuthenticated: false });
  },
  setLoading: (isLoading) => set({ isLoading }),
}));

interface ThemeState {
  theme: "light" | "dark" | "system";
  resolvedTheme: "light" | "dark";
  setTheme: (theme: "light" | "dark" | "system") => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: "system",
  resolvedTheme: "dark",
  setTheme: (theme) => {
    let resolved: "light" | "dark" = "dark";
    if (theme === "light") resolved = "light";
    else if (theme === "dark") resolved = "dark";
    else if (typeof window !== "undefined") {
      resolved = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    document.documentElement.classList.toggle("dark", resolved === "dark");
    set({ theme, resolvedTheme: resolved });
  },
}));

interface SidebarState {
  isOpen: boolean;
  isMobileOpen: boolean;
  toggle: () => void;
  close: () => void;
  open: () => void;
  toggleMobile: () => void;
  closeMobile: () => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: true,
  isMobileOpen: false,
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
  close: () => set({ isOpen: false }),
  open: () => set({ isOpen: true }),
  toggleMobile: () => set((s) => ({ isMobileOpen: !s.isMobileOpen })),
  closeMobile: () => set({ isMobileOpen: false }),
}));

interface DashboardState {
  subscription: Subscription;
  workspaces: Workspace[];
  activeWorkspaceId: string;
  setActiveWorkspace: (id: string) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  subscription: SUBSCRIPTION,
  workspaces: WORKSPACES,
  activeWorkspaceId: WORKSPACES.find((w) => w.isDefault)?.id || WORKSPACES[0].id,
  setActiveWorkspace: (id) => set({ activeWorkspaceId: id }),
}));

interface ChatState {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  selectedModel: "gpt-4o",
  setSelectedModel: (model) => set({ selectedModel: model }),
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
}));

interface NotificationState {
  unreadCount: number;
  markAllRead: () => void;
  decrementUnread: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  unreadCount: 5,
  markAllRead: () => set({ unreadCount: 0 }),
  decrementUnread: () => set((s) => ({ unreadCount: Math.max(0, s.unreadCount - 1) })),
}));
