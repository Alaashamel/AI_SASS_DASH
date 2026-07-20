"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Check, Zap, Building2, Crown, Download, Receipt, TrendingUp, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PRICING_PLANS } from "@/constants";
import { cn } from "@/lib/utils";
import { useToast } from "@/contexts/toast-context";

const UsageChart = dynamic(
  () => import("@/components/billing/usage-chart").then((m) => m.UsageChart),
  { ssr: false, loading: () => <div className="h-[300px] bg-muted animate-pulse rounded-lg" /> }
);

const planIcons: Record<string, React.ElementType> = {
  free: Zap,
  starter: Crown,
  pro: Building2,
  enterprise: Building2,
};

const USAGE_DATA = [
  { month: "Jul", messages: 18200, tokens: 1200000, apiCalls: 24500 },
  { month: "Aug", messages: 22400, tokens: 1500000, apiCalls: 31200 },
  { month: "Sep", messages: 26800, tokens: 1800000, apiCalls: 38400 },
  { month: "Oct", messages: 32450, tokens: 2400000, apiCalls: 67800 },
];

const INVOICES = [
  { id: "INV-2024-010", date: "Oct 1, 2024", amount: 99.0, status: "paid", plan: "Professional" },
  { id: "INV-2024-009", date: "Sep 1, 2024", amount: 99.0, status: "paid", plan: "Professional" },
  { id: "INV-2024-008", date: "Aug 1, 2024", amount: 29.0, status: "paid", plan: "Starter" },
  { id: "INV-2024-007", date: "Jul 1, 2024", amount: 29.0, status: "paid", plan: "Starter" },
  { id: "INV-2024-006", date: "Jun 1, 2024", amount: 0, status: "paid", plan: "Free" },
];

const usageMetrics = [
  { label: "Messages", used: 32450, limit: 50000, color: "bg-primary" },
  { label: "Tokens", used: 2400000, limit: 5000000, color: "bg-chart-2" },
  { label: "Storage", used: 45.2, limit: 100, color: "bg-chart-3", unit: "GB" },
  { label: "API Calls", used: 67800, limit: 100000, color: "bg-chart-4" },
];

function formatUsage(used: number, unit?: string) {
  if (unit) return `${used}${unit}`;
  if (used >= 1000000) return `${(used / 1000000).toFixed(1)}M`;
  if (used >= 1000) return `${(used / 1000).toFixed(1)}K`;
  return String(used);
}

export default function BillingPage() {
  const [annual, setAnnual] = useState(false);
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">Billing & Plans</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Choose the plan that fits your needs. Upgrade or downgrade at any time.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Label htmlFor="annual-toggle" className={cn(!annual && "font-semibold")}>
            Monthly
          </Label>
          <Switch
            id="annual-toggle"
            checked={annual}
            onCheckedChange={setAnnual}
          />
          <Label htmlFor="annual-toggle" className={cn(annual && "font-semibold")}>
            Annual
            <Badge variant="secondary" className="ml-2 text-xs">Save 20%</Badge>
          </Label>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
        {PRICING_PLANS.map((plan, index) => {
          const Icon = planIcons[plan.id] || Zap;
          const price = annual ? Math.round(plan.price * 0.8) : plan.price;
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className={cn("relative h-full transition-all duration-200", plan.highlighted && "border-primary shadow-lg ring-2 ring-primary/20")}>
                {plan.highlighted && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Most Popular</Badge>
                )}
                <CardHeader className="text-center pt-8">
                  <div className="flex justify-center mb-3">
                    <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", plan.highlighted ? "bg-primary text-primary-foreground" : "bg-muted")}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <CardDescription className="text-sm">{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">${price === 0 ? "0" : price}</span>
                    <span className="text-muted-foreground">/{annual ? "year" : "month"}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  <ul className="space-y-2.5">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan.highlighted ? "default" : "outline"}
                    onClick={() => toast({ title: "Plan selected", description: `You selected the ${plan.name} plan.`, variant: "success" })}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Tabs defaultValue="usage">
        <TabsList className="mx-auto">
          <TabsTrigger value="usage" className="gap-2"><TrendingUp className="h-3.5 w-3.5" /> Usage</TabsTrigger>
          <TabsTrigger value="invoices" className="gap-2"><Receipt className="h-3.5 w-3.5" /> Invoices</TabsTrigger>
        </TabsList>

        <TabsContent value="usage" className="mt-6 space-y-6">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-lg">Current Usage</CardTitle>
              <CardDescription>Professional Plan — Renews Nov 1, 2024</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {usageMetrics.map((m) => {
                const pct = Math.round((m.used / m.limit) * 100);
                const isHigh = pct > 80;
                return (
                  <div key={m.label} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{m.label}</span>
                      <span className="text-muted-foreground">
                        {formatUsage(m.used, m.unit)} / {formatUsage(m.limit, m.unit)}
                        {isHigh && <AlertCircle className="inline h-3 w-3 ml-1 text-amber-500" />}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className={cn("h-full rounded-full transition-all", m.color)} style={{ width: `${Math.min(pct, 100)}%` }} />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-lg">Monthly Usage Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <UsageChart data={USAGE_DATA} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="mt-6">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-lg">Invoice History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {INVOICES.map((inv, i) => (
                  <motion.div
                    key={inv.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between py-3"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <Receipt className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{inv.id}</p>
                        <p className="text-xs text-muted-foreground">{inv.date} — {inv.plan}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium">${inv.amount.toFixed(2)}</span>
                      <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 text-[10px]">
                        {inv.status}
                      </Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
