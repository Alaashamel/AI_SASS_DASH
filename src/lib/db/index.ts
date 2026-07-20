import { openDB, type IDBPDatabase } from "idb";

const DB_NAME = "neuralflow";
const DB_VERSION = 1;

export interface StoredPrompt {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  usageCount: number;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

interface NeuralFlowDB {
  prompts: {
    key: string;
    value: StoredPrompt;
    indexes: {
      "by-category": string;
      "by-updated": string;
    };
  };
  projects: {
    key: string;
    value: StoredProject;
    indexes: {
      "by-updated": string;
    };
  };
  conversations: {
    key: string;
    value: StoredConversation;
  };
}

export interface StoredProject {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  documentCount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoredConversation {
  id: string;
  title: string;
  messages: string;
  model: string;
  createdAt: string;
  updatedAt: string;
}

let dbPromise: Promise<IDBPDatabase<NeuralFlowDB>> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<NeuralFlowDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("prompts")) {
          const promptStore = db.createObjectStore("prompts", { keyPath: "id" });
          promptStore.createIndex("by-category", "category");
          promptStore.createIndex("by-updated", "updatedAt");
        }
        if (!db.objectStoreNames.contains("projects")) {
          const projectStore = db.createObjectStore("projects", { keyPath: "id" });
          projectStore.createIndex("by-updated", "updatedAt");
        }
        if (!db.objectStoreNames.contains("conversations")) {
          db.createObjectStore("conversations", { keyPath: "id" });
        }
      },
    });
  }
  return dbPromise;
}

export const db = {
  prompts: {
    async getAll(): Promise<StoredPrompt[]> {
      const database = await getDB();
      const all = await database.getAll("prompts");
      return all.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    },

    async get(id: string): Promise<StoredPrompt | undefined> {
      const database = await getDB();
      return database.get("prompts", id);
    },

    async put(prompt: StoredPrompt): Promise<void> {
      const database = await getDB();
      await database.put("prompts", prompt);
    },

    async delete(id: string): Promise<void> {
      const database = await getDB();
      await database.delete("prompts", id);
    },

    async getByCategory(category: string): Promise<StoredPrompt[]> {
      const database = await getDB();
      return database.getAllFromIndex("prompts", "by-category", category);
    },
  },

  projects: {
    async getAll(): Promise<StoredProject[]> {
      const database = await getDB();
      const all = await database.getAll("projects");
      return all.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    },

    async get(id: string): Promise<StoredProject | undefined> {
      const database = await getDB();
      return database.get("projects", id);
    },

    async put(project: StoredProject): Promise<void> {
      const database = await getDB();
      await database.put("projects", project);
    },

    async delete(id: string): Promise<void> {
      const database = await getDB();
      await database.delete("projects", id);
    },
  },

  conversations: {
    async getAll(): Promise<StoredConversation[]> {
      const database = await getDB();
      return database.getAll("conversations");
    },

    async put(conversation: StoredConversation): Promise<void> {
      const database = await getDB();
      await database.put("conversations", conversation);
    },

    async delete(id: string): Promise<void> {
      const database = await getDB();
      await database.delete("conversations", id);
    },
  },
};
