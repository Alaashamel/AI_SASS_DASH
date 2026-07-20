import { describe, it, expect, beforeEach, vi } from "vitest";
import { useAuthStore, useThemeStore, useSidebarStore, useChatStore } from "@/stores";

describe("Auth Store", () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  });

  it("starts with default state", () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it("sets user and updates auth state", () => {
    const mockUser = {
      id: 1,
      firstName: "Sarah",
      lastName: "Chen",
      email: "sarah@test.com",
    } as any;
    useAuthStore.getState().setUser(mockUser);
    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
  });

  it("clears user on logout", () => {
    localStorage.setItem("auth_token", "test");
    useAuthStore.getState().logout();
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});

describe("Theme Store", () => {
  beforeEach(() => {
    document.documentElement.classList.remove("dark");
    useThemeStore.setState({ theme: "system", resolvedTheme: "dark" });
  });

  it("sets theme to light", () => {
    useThemeStore.getState().setTheme("light");
    expect(useThemeStore.getState().theme).toBe("light");
    expect(useThemeStore.getState().resolvedTheme).toBe("light");
  });

  it("sets theme to dark", () => {
    useThemeStore.getState().setTheme("dark");
    expect(useThemeStore.getState().resolvedTheme).toBe("dark");
  });
});

describe("Sidebar Store", () => {
  beforeEach(() => {
    useSidebarStore.setState({ isOpen: true, isMobileOpen: false });
  });

  it("toggles sidebar", () => {
    useSidebarStore.getState().toggle();
    expect(useSidebarStore.getState().isOpen).toBe(false);
    useSidebarStore.getState().toggle();
    expect(useSidebarStore.getState().isOpen).toBe(true);
  });

  it("toggles mobile sidebar", () => {
    useSidebarStore.getState().toggleMobile();
    expect(useSidebarStore.getState().isMobileOpen).toBe(true);
    useSidebarStore.getState().closeMobile();
    expect(useSidebarStore.getState().isMobileOpen).toBe(false);
  });
});

describe("Chat Store", () => {
  beforeEach(() => {
    useChatStore.setState({ selectedModel: "gpt-4o", searchQuery: "" });
  });

  it("sets selected model", () => {
    useChatStore.getState().setSelectedModel("claude-3-5-sonnet");
    expect(useChatStore.getState().selectedModel).toBe("claude-3-5-sonnet");
  });

  it("sets search query", () => {
    useChatStore.getState().setSearchQuery("test query");
    expect(useChatStore.getState().searchQuery).toBe("test query");
  });
});
