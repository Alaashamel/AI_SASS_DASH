import { create } from "zustand";
import { db, type StoredPrompt } from "@/lib/db";
import { generateId } from "@/lib/utils";

interface PromptState {
  prompts: StoredPrompt[];
  isLoading: boolean;
  selectedPrompt: StoredPrompt | null;
  filter: string | null;
  searchQuery: string;
  setFilter: (filter: string | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedPrompt: (prompt: StoredPrompt | null) => void;
  loadPrompts: () => Promise<void>;
  createPrompt: (
    data: Omit<StoredPrompt, "id" | "usageCount" | "isFavorite" | "createdAt" | "updatedAt">
  ) => Promise<StoredPrompt>;
  updatePrompt: (id: string, data: Partial<StoredPrompt>) => Promise<void>;
  deletePrompt: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  incrementUsage: (id: string) => Promise<void>;
  duplicatePrompt: (id: string) => Promise<void>;
}

export const usePromptStore = create<PromptState>((set, get) => ({
  prompts: [],
  isLoading: false,
  selectedPrompt: null,
  filter: null,
  searchQuery: "",

  setFilter: (filter) => set({ filter }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedPrompt: (selectedPrompt) => set({ selectedPrompt }),

  loadPrompts: async () => {
    set({ isLoading: true });
    try {
      const prompts = await db.prompts.getAll();
      set({ prompts, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  createPrompt: async (data) => {
    const now = new Date().toISOString();
    const prompt: StoredPrompt = {
      ...data,
      id: generateId(),
      usageCount: 0,
      isFavorite: false,
      createdAt: now,
      updatedAt: now,
    };
    await db.prompts.put(prompt);
    set((state) => ({ prompts: [prompt, ...state.prompts] }));
    return prompt;
  },

  updatePrompt: async (id, data) => {
    const existing = get().prompts.find((p) => p.id === id);
    if (!existing) return;
    const updated: StoredPrompt = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    await db.prompts.put(updated);
    set((state) => ({
      prompts: state.prompts.map((p) => (p.id === id ? updated : p)),
      selectedPrompt:
        state.selectedPrompt?.id === id ? updated : state.selectedPrompt,
    }));
  },

  deletePrompt: async (id) => {
    await db.prompts.delete(id);
    set((state) => ({
      prompts: state.prompts.filter((p) => p.id !== id),
      selectedPrompt:
        state.selectedPrompt?.id === id ? null : state.selectedPrompt,
    }));
  },

  toggleFavorite: async (id) => {
    const existing = get().prompts.find((p) => p.id === id);
    if (!existing) return;
    const updated: StoredPrompt = {
      ...existing,
      isFavorite: !existing.isFavorite,
      updatedAt: new Date().toISOString(),
    };
    await db.prompts.put(updated);
    set((state) => ({
      prompts: state.prompts.map((p) => (p.id === id ? updated : p)),
    }));
  },

  incrementUsage: async (id) => {
    const existing = get().prompts.find((p) => p.id === id);
    if (!existing) return;
    const updated: StoredPrompt = {
      ...existing,
      usageCount: existing.usageCount + 1,
      updatedAt: new Date().toISOString(),
    };
    await db.prompts.put(updated);
    set((state) => ({
      prompts: state.prompts.map((p) => (p.id === id ? updated : p)),
    }));
  },

  duplicatePrompt: async (id) => {
    const existing = get().prompts.find((p) => p.id === id);
    if (!existing) return;
    const now = new Date().toISOString();
    const duplicate: StoredPrompt = {
      ...existing,
      id: generateId(),
      title: `${existing.title} (Copy)`,
      usageCount: 0,
      createdAt: now,
      updatedAt: now,
    };
    await db.prompts.put(duplicate);
    set((state) => ({ prompts: [duplicate, ...state.prompts] }));
  },
}));
