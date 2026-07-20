"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/types";
import { useAuthStore } from "@/stores";
import { userService } from "@/services";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading, setUser, login: storeLogin, logout: storeLogout, setLoading } = useAuthStore();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("auth_token");
      if (token) {
        try {
          const userData = await userService.getCurrentUser();
          setUser(userData);
        } catch {
          localStorage.removeItem("auth_token");
          setUser(null);
        }
      }
      setLoading(false);
      setInitialized(true);
    };
    initAuth();
  }, [setUser, setLoading]);

  const login = async (email: string, _password: string) => {
    setLoading(true);
    try {
      const { user: userData } = await userService.login(email, _password);
      storeLogin(userData);
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    setLoading(true);
    try {
      const { user: userData } = await userService.register(data);
      storeLogin(userData);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    storeLogout();
  };

  if (!initialized) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
