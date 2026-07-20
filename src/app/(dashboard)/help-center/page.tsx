"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronDown,
  MessageSquare,
  BookOpen,
  Video,
  Mail,
  ExternalLink,
  HelpCircle,
  FileText,
  Shield,
  Zap,
  CreditCard,
  Bot,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

const FAQS: FAQ[] = [
  {
    question: "How do I create a new workspace?",
    answer: "Navigate to Settings > Workspaces and click 'Create Workspace'. Give it a name and description, then invite team members via email.",
    category: "Getting Started",
  },
  {
    question: "Can I use my own API keys?",
    answer: "Yes! Go to API Keys page to add your own OpenAI, Anthropic, or Google API keys. Your keys are encrypted at rest and never shared.",
    category: "API",
  },
  {
    question: "How does the billing work?",
    answer: "NeuralFlow uses a credit-based system. Each AI model call costs credits based on token usage. Check the Billing page for your current usage and plan details.",
    category: "Billing",
  },
  {
    question: "What AI models are supported?",
    answer: "We support GPT-4o, Claude 3.5 Sonnet, Gemini Pro, Llama 3, Mistral, and more. Visit the AI Models page to see all available models and their capabilities.",
    category: "AI Models",
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely. All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We are SOC 2 Type II compliant and offer enterprise SSO.",
    category: "Security",
  },
  {
    question: "Can I export my data?",
    answer: "Yes, you can export all your conversations, documents, and settings from Settings > Data Management. We support JSON, CSV, and Markdown formats.",
    category: "Data",
  },
  {
    question: "How do I integrate with Slack?",
    answer: "Go to Settings > Integrations > Slack and click 'Connect'. Authorize the NeuralFlow app in your Slack workspace to enable notifications and slash commands.",
    category: "Integrations",
  },
  {
    question: "What happens when I exceed my plan limits?",
    answer: "You'll receive a warning at 80% usage. At 100%, AI features are throttled but your data remains accessible. You can upgrade anytime from the Billing page.",
    category: "Billing",
  },
];

const categories = [...new Set(FAQS.map((f) => f.category))];

const supportChannels = [
  {
    icon: MessageSquare,
    title: "Live Chat",
    description: "Chat with our support team in real-time.",
    badge: "24/7",
    action: "Start Chat",
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "Send us a detailed message and we'll respond within 24 hours.",
    badge: "< 24h",
    action: "Send Email",
  },
  {
    icon: BookOpen,
    title: "Documentation",
    description: "Browse our comprehensive guides and tutorials.",
    badge: null,
    action: "View Docs",
  },
  {
    icon: Video,
    title: "Video Tutorials",
    description: "Step-by-step video guides for all features.",
    badge: null,
    action: "Watch Videos",
  },
];

const quickLinks = [
  { icon: Zap, title: "Getting Started Guide", category: "Quickstart" },
  { icon: FileText, title: "API Reference", category: "Developers" },
  { icon: Shield, title: "Security Overview", category: "Compliance" },
  { icon: CreditCard, title: "Billing FAQ", category: "Billing" },
  { icon: Bot, title: "AI Model Comparison", category: "Models" },
  { icon: HelpCircle, title: "Troubleshooting", category: "Support" },
];

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);

  const filteredFAQs = FAQS.filter((faq) => {
    if (activeCategory && faq.category !== activeCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Help Center</h1>
        <p className="text-muted-foreground">
          Find answers, get support, and learn how to get the most out of NeuralFlow.
        </p>
      </div>

      {/* Hero search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search for help articles, FAQs, and guides..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 h-12 text-base"
        />
      </div>

      {/* Quick links */}
      <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Card key={link.title} className="hover:shadow-md transition-all cursor-pointer">
              <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-xs font-medium">{link.title}</p>
                <Badge variant="outline" className="text-[10px]">
                  {link.category}
                </Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Support channels */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Contact Support</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {supportChannels.map((channel) => {
            const Icon = channel.icon;
            return (
              <Card key={channel.title} className="hover:shadow-md transition-all">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-sm">{channel.title}</h3>
                        {channel.badge && (
                          <Badge variant="secondary" className="text-[10px]">
                            {channel.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {channel.description}
                      </p>
                      <Button variant="link" size="sm" className="px-0 mt-2 h-auto text-xs">
                        {channel.action}
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Separator />

      {/* FAQs */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Frequently Asked Questions</h2>
        <div className="flex gap-2 mb-4 flex-wrap">
          <Button
            variant={activeCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(null)}
          >
            All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>

        <div className="space-y-2">
          {filteredFAQs.map((faq) => (
            <Card key={faq.question} className="overflow-hidden">
              <button
                className="w-full text-left p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                onClick={() => setOpenFAQ(openFAQ === faq.question ? null : faq.question)}
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-sm font-medium">{faq.question}</span>
                </div>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform shrink-0",
                    openFAQ === faq.question && "rotate-180"
                  )}
                />
              </button>
              <AnimatePresence>
                {openFAQ === faq.question && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 text-sm text-muted-foreground pl-11">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
