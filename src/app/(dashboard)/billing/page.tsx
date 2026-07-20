"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, Zap, Building2, Crown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PRICING_PLANS } from "@/constants";
import { cn } from "@/lib/utils";
import { useToast } from "@/contexts/toast-context";

const planIcons: Record<string, React.ElementType> = {
  free: Zap,
  starter: Crown,
  pro: Building2,
  enterprise: Building2,
};

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
            <Badge variant="secondary" className="ml-2 text-xs">
              Save 20%
            </Badge>
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
              <Card
                className={cn(
                  "relative h-full transition-all duration-200",
                  plan.highlighted &&
                    "border-primary shadow-lg ring-2 ring-primary/20"
                )}
              >
                {plan.highlighted && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center pt-8">
                  <div className="flex justify-center mb-3">
                    <div
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-xl",
                        plan.highlighted
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {plan.description}
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">
                      ${price === 0 ? "0" : price}
                    </span>
                    <span className="text-muted-foreground">
                      /{annual ? "year" : "month"}
                    </span>
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
                    onClick={() =>
                      toast({
                        title: "Plan selected",
                        description: `You selected the ${plan.name} plan.`,
                        variant: "success",
                      })
                    }
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Card className="max-w-2xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-lg">Current Subscription</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Professional Plan</p>
              <p className="text-xs text-muted-foreground">
                Renews on November 1, 2024
              </p>
            </div>
            <Badge
              variant="secondary"
              className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
            >
              Active
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Messages Used</span>
              <span>32,450 / 50,000</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-primary" style={{ width: "65%" }} />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Storage Used</span>
              <span>45.2 GB / 100 GB</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-chart-2" style={{ width: "45%" }} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
