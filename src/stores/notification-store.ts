import { create } from "zustand";

export type NotificationType = "system" | "mention" | "update" | "alert" | "success";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
}

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
  dismiss: (id: string) => void;
  addNotification: (n: Omit<AppNotification, "id" | "read" | "createdAt">) => void;
}

const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: "1",
    type: "success",
    title: "Document processed",
    description: "Q4 Financial Report.pdf has been fully analyzed and is ready for review.",
    read: false,
    createdAt: new Date(Date.now() - 300000),
    actionUrl: "/documents",
  },
  {
    id: "2",
    type: "mention",
    title: "Marcus mentioned you",
    description: "In Marketing Strategy 2025: '@Sarah what do you think about the Q1 timeline?'",
    read: false,
    createdAt: new Date(Date.now() - 1800000),
    actionUrl: "/documents",
  },
  {
    id: "3",
    type: "alert",
    title: "Usage limit approaching",
    description: "You've used 65% of your monthly AI message quota. Consider upgrading your plan.",
    read: false,
    createdAt: new Date(Date.now() - 3600000),
    actionUrl: "/billing",
  },
  {
    id: "4",
    type: "system",
    title: "Scheduled maintenance",
    description: "NeuralFlow will undergo maintenance on Oct 28, 2024 from 2:00 AM to 4:00 AM UTC.",
    read: true,
    createdAt: new Date(Date.now() - 7200000),
  },
  {
    id: "5",
    type: "update",
    title: "New model available",
    description: "GPT-4o has been updated to the latest version with improved reasoning capabilities.",
    read: true,
    createdAt: new Date(Date.now() - 86400000),
    actionUrl: "/ai-models",
  },
  {
    id: "6",
    type: "success",
    title: "Project created",
    description: "Your new project 'Customer Support AI' has been created and is ready for setup.",
    read: true,
    createdAt: new Date(Date.now() - 172800000),
    actionUrl: "/projects",
  },
  {
    id: "7",
    type: "mention",
    title: "Priya mentioned you",
    description: "In Engineering: '@Sarah the API integration is ready for your review.'",
    read: true,
    createdAt: new Date(Date.now() - 259200000),
  },
];

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: MOCK_NOTIFICATIONS,
  unreadCount: MOCK_NOTIFICATIONS.filter((n) => !n.read).length,
  markRead: (id) =>
    set((state) => {
      const notifications = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      return { notifications, unreadCount: notifications.filter((n) => !n.read).length };
    }),
  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),
  dismiss: (id) =>
    set((state) => {
      const notifications = state.notifications.filter((n) => n.id !== id);
      return { notifications, unreadCount: notifications.filter((n) => !n.read).length };
    }),
  addNotification: (n) =>
    set((state) => {
      const notification: AppNotification = {
        ...n,
        id: crypto.randomUUID(),
        read: false,
        createdAt: new Date(),
      };
      const notifications = [notification, ...state.notifications];
      return { notifications, unreadCount: notifications.filter((nn) => !nn.read).length };
    }),
}));
