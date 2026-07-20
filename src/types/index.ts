export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  username: string;
  image: string;
  gender: string;
  birthDate: string;
  address: {
    address: string;
    city: string;
    coordinates: { lat: number; lng: number };
    postalCode: string;
    state: string;
  };
  company: {
    address: {
      address: string;
      city: string;
      coordinates: { lat: number; lng: number };
      postalCode: string;
      state: string;
    };
    department: string;
    name: string;
    title: string;
  };
  role: "admin" | "editor" | "viewer";
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  sku: string;
  weight: number;
  dimensions: { width: number; height: number; depth: number };
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: ProductReview[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: { createdAt: string; updatedAt: string; barcode: string; qrCode: string };
  images: string[];
  thumbnail: string;
}

export interface ProductReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface Todo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

export interface Post {
  id: number;
  title: string;
  body: string;
  tags: string[];
  reactions: { likes: number; dislikes: number };
  views: number;
  userId: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  model: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  status: "processing" | "completed" | "failed";
  createdAt: string;
  updatedAt: string;
  tags: string[];
  summary?: string;
}

export interface Notification {
  id: number;
  title: string;
  body: string;
  tags: string[];
  reactions: { likes: number; dislikes: number };
  views: number;
  userId: number;
}

export interface DashboardStats {
  totalUsers: number;
  totalRevenue: number;
  totalDocuments: number;
  totalConversations: number;
  usersChange: number;
  revenueChange: number;
  documentsChange: number;
  conversationsChange: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  value2?: number;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  status: "active" | "away" | "offline";
  lastActive: string;
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  createdAt: string;
  isDefault: boolean;
}

export interface Subscription {
  id: string;
  plan: "free" | "starter" | "pro" | "enterprise";
  status: "active" | "canceled" | "past_due" | "trialing";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  features: string[];
  limits: { messages: number; documents: number; storage: number; apiCalls: number };
  usage: { messages: number; documents: number; storage: number; apiCalls: number };
}

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: "month" | "year";
  features: string[];
  highlighted?: boolean;
  cta: string;
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  capabilities: string[];
  maxTokens: number;
  pricingPer1kTokens: number;
  isAvailable: boolean;
  category: "text" | "image" | "code" | "multimodal";
  icon: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  products: T[];
  total: number;
  skip: number;
  limit: number;
}

export type SortDirection = "asc" | "desc";

export interface SortConfig<T> {
  key: keyof T;
  direction: SortDirection;
}

export interface FilterConfig {
  search: string;
  category?: string;
  status?: string;
  dateRange?: { from: Date; to: Date };
}
