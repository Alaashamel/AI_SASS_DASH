"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableSkeleton } from "@/components/shared";
import { productService, todoService, postService } from "@/services";
import { formatNumber } from "@/lib/utils";

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d");

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ["analytics-products"],
    queryFn: () => productService.getProducts(0, 100),
  });

  const { data: todosData, isLoading: todosLoading } = useQuery({
    queryKey: ["analytics-todos"],
    queryFn: () => todoService.getTodos(0, 100),
  });

  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ["analytics-posts"],
    queryFn: () => postService.getPosts(0, 100),
  });

  const isLoading = productsLoading || todosLoading || postsLoading;

  const categoryData = useMemo(() => {
    if (!productsData?.products) return [];
    const categories: Record<string, number> = {};
    productsData.products.forEach((p) => {
      categories[p.category] = (categories[p.category] || 0) + 1;
    });
    return Object.entries(categories)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [productsData]);

  const priceDistribution = useMemo(() => {
    if (!productsData?.products) return [];
    const ranges = [
      { name: "$0-25", min: 0, max: 25 },
      { name: "$25-50", min: 25, max: 50 },
      { name: "$50-100", min: 50, max: 100 },
      { name: "$100-200", min: 100, max: 200 },
      { name: "$200+", min: 200, max: Infinity },
    ];
    return ranges.map((r) => ({
      name: r.name,
      value: productsData.products.filter(
        (p) => p.price >= r.min && p.price < r.max
      ).length,
    }));
  }, [productsData]);

  const ratingData = useMemo(() => {
    if (!productsData?.products) return [];
    const ratings: Record<string, number> = {};
    productsData.products.forEach((p) => {
      const bucket = Math.floor(p.rating);
      ratings[bucket] = (ratings[bucket] || 0) + 1;
    });
    return Object.entries(ratings)
      .map(([name, value]) => ({ name: `${name}★`, value }))
      .sort((a, b) => parseInt(a.name) - parseInt(b.name));
  }, [productsData]);

  const todoCompletionData = useMemo(() => {
    if (!todosData?.todos) return [];
    const completed = todosData.todos.filter((t) => t.completed).length;
    const pending = todosData.todos.length - completed;
    return [
      { name: "Completed", value: completed },
      { name: "Pending", value: pending },
    ];
  }, [todosData]);

  const postsByReactions = useMemo(() => {
    if (!postsData?.posts) return [];
    return postsData.posts
      .slice(0, 10)
      .map((p) => ({
        name: p.title.slice(0, 20) + (p.title.length > 20 ? "..." : ""),
        likes: p.reactions.likes,
        dislikes: p.reactions.dislikes,
      }));
  }, [postsData]);

  const chartTooltipStyle = {
    backgroundColor: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "8px",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Insights and analytics from your data across all services.
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-5 w-32 bg-muted rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-[300px] bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(productsData?.total || 0)}</div>
                <Badge variant="secondary" className="mt-1">From DummyJSON</Badge>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Todos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(todosData?.total || 0)}</div>
                <Badge variant="secondary" className="mt-1">{todoCompletionData[0]?.value || 0} completed</Badge>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(postsData?.total || 0)}</div>
                <Badge variant="secondary" className="mt-1">User engagement data</Badge>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Avg Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {productsData?.products
                    ? (productsData.products.reduce((acc, p) => acc + p.rating, 0) / productsData.products.length).toFixed(1)
                    : "0"}
                </div>
                <Badge variant="secondary" className="mt-1">Out of 5.0</Badge>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Products by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={chartTooltipStyle} />
                      <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Price Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={priceDistribution}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={chartTooltipStyle} />
                      <Bar dataKey="value" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Todo Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={todoCompletionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {todoCompletionData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={chartTooltipStyle} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Post Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={postsByReactions}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} angle={-45} textAnchor="end" height={80} />
                      <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={chartTooltipStyle} />
                      <Legend />
                      <Bar dataKey="likes" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="dislikes" fill="hsl(var(--chart-5))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
