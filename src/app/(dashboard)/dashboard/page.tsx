"use client";

import React, { Suspense } from "react";
import { Users, DollarSign, FileText, MessageSquare } from "lucide-react";
import { StatCard } from "@/components/shared";
import {
  RevenueChart,
  UsageChart,
  TokenConsumptionChart,
  MonthlyActivityChart,
  RecentConversations,
  RecentDocuments,
  TeamMembersList,
  SubscriptionCard,
  WorkspaceCard,
} from "@/components/dashboard";
import { DashboardSkeleton } from "@/components/shared";
import { DASHBOARD_STATS } from "@/constants";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, Sarah. Here&apos;s an overview of your platform.
        </p>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Users"
            value={DASHBOARD_STATS.totalUsers}
            change={DASHBOARD_STATS.usersChange}
            icon={Users}
            delay={0}
          />
          <StatCard
            title="Revenue"
            value={DASHBOARD_STATS.totalRevenue}
            change={DASHBOARD_STATS.revenueChange}
            icon={DollarSign}
            format="currency"
            delay={0.1}
          />
          <StatCard
            title="Documents"
            value={DASHBOARD_STATS.totalDocuments}
            change={DASHBOARD_STATS.documentsChange}
            icon={FileText}
            delay={0.2}
          />
          <StatCard
            title="Conversations"
            value={DASHBOARD_STATS.totalConversations}
            change={DASHBOARD_STATS.conversationsChange}
            icon={MessageSquare}
            delay={0.3}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-7 mt-6">
          <div className="lg:col-span-4">
            <RevenueChart />
          </div>
          <div className="lg:col-span-3">
            <TokenConsumptionChart />
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-7 mt-6">
          <div className="lg:col-span-4">
            <UsageChart />
          </div>
          <div className="lg:col-span-3">
            <MonthlyActivityChart />
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3 mt-6">
          <RecentConversations />
          <RecentDocuments />
          <div className="space-y-4">
            <SubscriptionCard />
            <TeamMembersList />
          </div>
        </div>
      </Suspense>
    </div>
  );
}
