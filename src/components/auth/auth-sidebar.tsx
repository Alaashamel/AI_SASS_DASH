"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Zap, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const features = [
  "Advanced AI models",
  "Real-time analytics",
  "Document intelligence",
  "Team collaboration",
];

export function AuthSidebar() {
  const pathname = usePathname();
  const isLogin = pathname === "/login";

  return (
    <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-primary/5 via-primary/10 to-muted/20 p-10 w-[480px] shrink-0 border-r">
      <div>
        <Link href="/" className="flex items-center gap-2 mb-12">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <Zap className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold">NeuralFlow</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-3xl font-bold tracking-tight mb-4">
            {isLogin ? "Welcome back" : "Start building today"}
          </h1>
          <p className="text-muted-foreground mb-8">
            {isLogin
              ? "Sign in to access your AI-powered workspace and continue where you left off."
              : "Create your account and unlock the full power of AI-driven automation."}
          </p>
        </motion.div>

        <div className="space-y-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + i * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <ArrowRight className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-medium">{feature}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        Trusted by 50,000+ teams worldwide
      </div>
    </div>
  );
}
