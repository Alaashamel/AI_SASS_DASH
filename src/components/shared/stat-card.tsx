"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatNumber, formatCurrency } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number;
  change: number;
  icon: React.ElementType;
  format?: "number" | "currency";
  delay?: number;
}

export function StatCard({
  title,
  value,
  change,
  icon: Icon,
  format = "number",
  delay = 0,
}: StatCardProps) {
  const formattedValue = format === "currency" ? formatCurrency(value) : formatNumber(value);
  const isPositive = change > 0;
  const isNegative = change < 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div className="rounded-lg bg-primary/10 p-2">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formattedValue}</div>
          <div className="flex items-center gap-1 mt-1">
            {isPositive && <TrendingUp className="h-3 w-3 text-emerald-500" />}
            {isNegative && <TrendingDown className="h-3 w-3 text-red-500" />}
            {!isPositive && !isNegative && <Minus className="h-3 w-3 text-gray-500" />}
            <span
              className={cn(
                "text-xs font-medium",
                isPositive && "text-emerald-500",
                isNegative && "text-red-500",
                !isPositive && !isNegative && "text-gray-500"
              )}
            >
              {isPositive ? "+" : ""}
              {change}%
            </span>
            <span className="text-xs text-muted-foreground">from last month</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
