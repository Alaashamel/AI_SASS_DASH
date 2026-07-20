"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface UsageChartProps {
  data: Array<{ month: string; messages: number; apiCalls: number }>;
}

export function UsageChart({ data }: UsageChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey="month" className="text-xs" />
        <YAxis className="text-xs" />
        <Tooltip />
        <Bar dataKey="messages" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Messages" />
        <Bar dataKey="apiCalls" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} name="API Calls" />
      </BarChart>
    </ResponsiveContainer>
  );
}
