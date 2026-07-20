"use client";

import React from "react";
import { Sidebar, Navbar } from "@/components/layout";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Sidebar />
      <Navbar />
      <DashboardLayout>{children}</DashboardLayout>
    </>
  );
}
