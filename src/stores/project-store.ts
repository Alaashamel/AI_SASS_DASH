import { create } from "zustand";
import { db, type StoredProject } from "@/lib/db";
import { generateId } from "@/lib/utils";

interface ProjectState {
  projects: StoredProject[];
  isLoading: boolean;
  activeProjectId: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setActiveProject: (id: string | null) => void;
  loadProjects: () => Promise<void>;
  createProject: (
    data: Omit<StoredProject, "id" | "createdAt" | "updatedAt">
  ) => Promise<StoredProject>;
  updateProject: (id: string, data: Partial<StoredProject>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  isLoading: false,
  activeProjectId: null,
  searchQuery: "",

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setActiveProject: (activeProjectId) => set({ activeProjectId }),

  loadProjects: async () => {
    set({ isLoading: true });
    try {
      const projects = await db.projects.getAll();
      set({
        projects,
        isLoading: false,
        activeProjectId:
          projects.length > 0 ? projects[0].id : null,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  createProject: async (data) => {
    const now = new Date().toISOString();
    const project: StoredProject = {
      ...data,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    await db.projects.put(project);
    set((state) => ({
      projects: [project, ...state.projects],
      activeProjectId: state.activeProjectId || project.id,
    }));
    return project;
  },

  updateProject: async (id, data) => {
    const existing = get().projects.find((p) => p.id === id);
    if (!existing) return;
    const updated: StoredProject = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    await db.projects.put(updated);
    set((state) => ({
      projects: state.projects.map((p) => (p.id === id ? updated : p)),
    }));
  },

  deleteProject: async (id) => {
    await db.projects.delete(id);
    set((state) => {
      const remaining = state.projects.filter((p) => p.id !== id);
      return {
        projects: remaining,
        activeProjectId:
          state.activeProjectId === id
            ? remaining[0]?.id || null
            : state.activeProjectId,
      };
    });
  },
}));
