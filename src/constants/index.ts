import { PricingPlan, AIModel } from "@/types";

export const APP_NAME = "NeuralFlow AI";
export const APP_DESCRIPTION = "Enterprise AI Platform for Intelligent Automation";
export const APP_URL = "https://neuralflow.ai";

export const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Chat", href: "/chat", icon: "MessageSquare" },
  { label: "AI Models", href: "/ai-models", icon: "Brain" },
  { label: "Documents", href: "/documents", icon: "FileText" },
  { label: "Analytics", href: "/analytics", icon: "BarChart3" },
  { label: "Billing", href: "/billing", icon: "CreditCard" },
  { label: "Settings", href: "/settings", icon: "Settings" },
  { label: "Notifications", href: "/notifications", icon: "Bell" },
] as const;

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    description: "Perfect for getting started",
    price: 0,
    interval: "month",
    features: [
      "100 AI messages/month",
      "5 document uploads",
      "1GB storage",
      "Basic AI models",
      "Email support",
    ],
    cta: "Get Started Free",
  },
  {
    id: "starter",
    name: "Starter",
    description: "For individuals and small teams",
    price: 29,
    interval: "month",
    features: [
      "5,000 AI messages/month",
      "50 document uploads",
      "10GB storage",
      "Advanced AI models",
      "Priority email support",
      "API access",
    ],
    cta: "Start Free Trial",
  },
  {
    id: "pro",
    name: "Professional",
    description: "For growing businesses",
    price: 99,
    interval: "month",
    highlighted: true,
    features: [
      "50,000 AI messages/month",
      "Unlimited documents",
      "100GB storage",
      "All AI models",
      "Priority support",
      "Advanced analytics",
      "Team collaboration",
      "Custom integrations",
    ],
    cta: "Start Free Trial",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large organizations",
    price: 299,
    interval: "month",
    features: [
      "Unlimited messages",
      "Unlimited documents",
      "Unlimited storage",
      "All AI models + custom training",
      "Dedicated support",
      "Advanced analytics & reporting",
      "Team collaboration",
      "Custom integrations",
      "SSO & SAML",
      "SLA guarantee",
      "On-premise deployment",
    ],
    cta: "Contact Sales",
  },
];

export const AI_MODELS: AIModel[] = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    description: "Most capable model for complex reasoning and creative tasks",
    capabilities: ["Text Generation", "Code Writing", "Analysis", "Vision"],
    maxTokens: 128000,
    pricingPer1kTokens: 0.005,
    isAvailable: true,
    category: "text",
    icon: "Sparkles",
  },
  {
    id: "claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    description: "Best balance of intelligence and speed",
    capabilities: ["Text Generation", "Analysis", "Code Writing", "Reasoning"],
    maxTokens: 200000,
    pricingPer1kTokens: 0.003,
    isAvailable: true,
    category: "text",
    icon: "Brain",
  },
  {
    id: "gemini-pro",
    name: "Gemini Pro",
    provider: "Google",
    description: "Google's most capable multimodal model",
    capabilities: ["Text Generation", "Vision", "Code", "Multimodal"],
    maxTokens: 32000,
    pricingPer1kTokens: 0.00025,
    isAvailable: true,
    category: "multimodal",
    icon: "Atom",
  },
  {
    id: "dall-e-3",
    name: "DALL-E 3",
    provider: "OpenAI",
    description: "Generate stunning images from text descriptions",
    capabilities: ["Image Generation", "Image Editing", "Variations"],
    maxTokens: 4000,
    pricingPer1kTokens: 0.04,
    isAvailable: true,
    category: "image",
    icon: "Image",
  },
  {
    id: "codestral",
    name: "Codestral",
    provider: "Mistral AI",
    description: "Specialized model for code generation and completion",
    capabilities: ["Code Generation", "Code Completion", "Bug Detection"],
    maxTokens: 32000,
    pricingPer1kTokens: 0.001,
    isAvailable: true,
    category: "code",
    icon: "Code",
  },
  {
    id: "llama-3-70b",
    name: "Llama 3 70B",
    provider: "Meta",
    description: "Open-source model with strong performance",
    capabilities: ["Text Generation", "Analysis", "Summarization"],
    maxTokens: 8192,
    pricingPer1kTokens: 0.0009,
    isAvailable: true,
    category: "text",
    icon: "Layers",
  },
];

export const CHAT_MODELS = [
  { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI" },
  { id: "claude-3-5-sonnet", name: "Claude 3.5 Sonnet", provider: "Anthropic" },
  { id: "gemini-pro", name: "Gemini Pro", provider: "Google" },
];

export const DASHBOARD_STATS = {
  totalUsers: 12847,
  totalRevenue: 284920,
  totalDocuments: 45231,
  totalConversations: 89432,
  usersChange: 12.5,
  revenueChange: 8.3,
  documentsChange: 23.1,
  conversationsChange: 15.7,
};

export const REVENUE_CHART_DATA = [
  { name: "Jan", value: 18500, value2: 12000 },
  { name: "Feb", value: 22800, value2: 15000 },
  { name: "Mar", value: 19200, value2: 13500 },
  { name: "Apr", value: 25600, value2: 17000 },
  { name: "May", value: 28400, value2: 19500 },
  { name: "Jun", value: 31200, value2: 21000 },
  { name: "Jul", value: 29800, value2: 22500 },
  { name: "Aug", value: 35400, value2: 25000 },
  { name: "Sep", value: 38200, value2: 27500 },
  { name: "Oct", value: 42100, value2: 29000 },
  { name: "Nov", value: 45800, value2: 31500 },
  { name: "Dec", value: 48200, value2: 33000 },
];

export const USAGE_CHART_DATA = [
  { name: "Mon", value: 1200 },
  { name: "Tue", value: 1900 },
  { name: "Wed", value: 1500 },
  { name: "Thu", value: 2200 },
  { name: "Fri", value: 1800 },
  { name: "Sat", value: 900 },
  { name: "Sun", value: 600 },
];

export const TOKEN_CONSUMPTION_DATA = [
  { name: "GPT-4o", value: 42500 },
  { name: "Claude 3.5", value: 28300 },
  { name: "Gemini Pro", value: 15200 },
  { name: "Codestral", value: 12800 },
  { name: "Llama 3", value: 8900 },
];

export const MONTHLY_ACTIVITY_DATA = [
  { name: "Week 1", value: 320, value2: 180 },
  { name: "Week 2", value: 450, value2: 220 },
  { name: "Week 3", value: 380, value2: 200 },
  { name: "Week 4", value: 520, value2: 280 },
];

export const TEAM_MEMBERS = [
  { id: "1", name: "Sarah Chen", email: "sarah@neuralflow.ai", avatar: "https://randomuser.me/api/portraits/women/44.jpg", role: "Admin", status: "active" as const, lastActive: "2 min ago" },
  { id: "2", name: "Marcus Johnson", email: "marcus@neuralflow.ai", avatar: "https://randomuser.me/api/portraits/men/32.jpg", role: "Editor", status: "active" as const, lastActive: "5 min ago" },
  { id: "3", name: "Priya Patel", email: "priya@neuralflow.ai", avatar: "https://randomuser.me/api/portraits/women/68.jpg", role: "Viewer", status: "away" as const, lastActive: "1 hour ago" },
  { id: "4", name: "Alex Kim", email: "alex@neuralflow.ai", avatar: "https://randomuser.me/api/portraits/men/75.jpg", role: "Editor", status: "offline" as const, lastActive: "3 hours ago" },
  { id: "5", name: "Emily Watson", email: "emily@neuralflow.ai", avatar: "https://randomuser.me/api/portraits/women/17.jpg", role: "Admin", status: "active" as const, lastActive: "just now" },
];

export const WORKSPACES = [
  { id: "1", name: "Marketing Team", description: "AI tools for marketing campaigns", memberCount: 8, createdAt: "2024-01-15", isDefault: true },
  { id: "2", name: "Engineering", description: "Development and code review AI", memberCount: 12, createdAt: "2024-02-20", isDefault: false },
  { id: "3", name: "Customer Support", description: "AI-powered support automation", memberCount: 6, createdAt: "2024-03-10", isDefault: false },
];

export const SUBSCRIPTION = {
  id: "sub_123456",
  plan: "pro" as const,
  status: "active" as const,
  currentPeriodStart: "2024-10-01",
  currentPeriodEnd: "2024-11-01",
  cancelAtPeriodEnd: false,
  features: [
    "50,000 AI messages/month",
    "Unlimited documents",
    "100GB storage",
    "All AI models",
    "Priority support",
    "Advanced analytics",
  ],
  limits: { messages: 50000, documents: -1, storage: 100, apiCalls: 100000 },
  usage: { messages: 32450, documents: 156, storage: 45.2, apiCalls: 67800 },
};

export const STATUS_COLORS: Record<string, string> = {
  active: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20",
  away: "text-amber-600 bg-amber-50 dark:bg-amber-900/20",
  offline: "text-gray-500 bg-gray-50 dark:bg-gray-800",
  processing: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
  completed: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20",
  failed: "text-red-600 bg-red-50 dark:bg-red-900/20",
};

export const DOCUMENT_TYPES = [
  { label: "All Types", value: "all" },
  { label: "PDF", value: "pdf" },
  { label: "Word", value: "docx" },
  { label: "Spreadsheet", value: "xlsx" },
  { label: "Text", value: "txt" },
  { label: "Image", value: "image" },
];

export const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Name A-Z", value: "name_asc" },
  { label: "Name Z-A", value: "name_desc" },
  { label: "Largest", value: "size_desc" },
  { label: "Smallest", value: "size_asc" },
];

export const API_BASE_URL = "https://dummyjson.com";
export const CHAT_API_URL = "https://jsonplaceholder.typicode.com";
