"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDashboardStore } from "@/stores";
import { SUBSCRIPTION } from "@/constants";
import { formatCurrency } from "@/lib/utils";

export function SubscriptionCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Subscription</CardTitle>
        <Badge
          variant="secondary"
          className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
        >
          Active
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold capitalize">{SUBSCRIPTION.plan}</span>
            <span className="text-muted-foreground">Plan</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Renews on {SUBSCRIPTION.currentPeriodEnd}
          </p>
        </div>

        <div className="space-y-3">
          <UsageBar
            label="Messages"
            current={SUBSCRIPTION.usage.messages}
            limit={SUBSCRIPTION.limits.messages}
          />
          <UsageBar
            label="Documents"
            current={SUBSCRIPTION.usage.documents}
            limit={SUBSCRIPTION.limits.documents}
          />
          <UsageBar
            label="Storage"
            current={SUBSCRIPTION.usage.storage}
            limit={SUBSCRIPTION.limits.storage}
            unit="GB"
          />
          <UsageBar
            label="API Calls"
            current={SUBSCRIPTION.usage.apiCalls}
            limit={SUBSCRIPTION.limits.apiCalls}
          />
        </div>

        <Button className="w-full" variant="outline">
          Upgrade Plan
        </Button>
      </CardContent>
    </Card>
  );
}

function UsageBar({
  label,
  current,
  limit,
  unit = "",
}: {
  label: string;
  current: number;
  limit: number;
  unit?: string;
}) {
  const percentage = limit === -1 ? 0 : Math.min((current / limit) * 100, 100);

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-xs text-muted-foreground">
          {limit === -1 ? "Unlimited" : `${formatCompact(current)}${unit} / ${formatCompact(limit)}${unit}`}
        </span>
      </div>
      {limit !== -1 && (
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
    </div>
  );
}

function formatCompact(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}
