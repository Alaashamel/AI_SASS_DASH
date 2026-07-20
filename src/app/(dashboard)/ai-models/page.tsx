"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Brain,
  Atom,
  Image,
  Code,
  Layers,
  Zap,
  Check,
  Info,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { AI_MODELS } from "@/constants";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  Sparkles,
  Brain,
  Atom,
  Image,
  Code,
  Layers,
};

const categoryFilters = [
  { label: "All Models", value: "all" },
  { label: "Text", value: "text" },
  { label: "Code", value: "code" },
  { label: "Image", value: "image" },
  { label: "Multimodal", value: "multimodal" },
];

export default function AIModelsPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = AI_MODELS.filter((model) => {
    if (filter !== "all" && model.category !== filter) return false;
    if (search && !model.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">AI Models</h1>
        <p className="text-muted-foreground">
          Explore and configure AI models for your workflows.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-sm w-full">
          <Input
            placeholder="Search models..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categoryFilters.map((cat) => (
            <Button
              key={cat.value}
              variant={filter === cat.value ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(cat.value)}
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((model, index) => {
          const Icon = iconMap[model.icon] || Sparkles;
          return (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="h-full hover:shadow-md transition-all duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{model.name}</CardTitle>
                        <p className="text-xs text-muted-foreground">{model.provider}</p>
                      </div>
                    </div>
                    <Badge variant={model.isAvailable ? "secondary" : "outline"}>
                      {model.isAvailable ? "Available" : "Soon"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="line-clamp-2">
                    {model.description}
                  </CardDescription>

                  <div className="flex flex-wrap gap-1.5">
                    {model.capabilities.map((cap) => (
                      <Badge key={cap} variant="outline" className="text-[10px]">
                        {cap}
                      </Badge>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      Max Tokens: {(model.maxTokens / 1000).toFixed(0)}K
                    </div>
                    <div className="flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      ${model.pricingPer1kTokens}/1K tokens
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    variant={model.isAvailable ? "default" : "outline"}
                    disabled={!model.isAvailable}
                  >
                    {model.isAvailable ? "Use Model" : "Coming Soon"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
