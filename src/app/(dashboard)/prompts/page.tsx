"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Bookmark,
  Plus,
  Search,
  Heart,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePromptStore } from "@/stores/prompt-store";
import { PromptCard, PromptEditor } from "@/components/prompts";
import type { StoredPrompt } from "@/lib/db";

export default function PromptsPage() {
  const {
    prompts,
    isLoading,
    filter,
    searchQuery,
    setFilter,
    setSearchQuery,
    loadPrompts,
    deletePrompt,
    toggleFavorite,
    duplicatePrompt,
  } = usePromptStore();

  const [editorOpen, setEditorOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<StoredPrompt | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  useEffect(() => {
    loadPrompts();
  }, [loadPrompts]);

  const categories = Array.from(new Set(prompts.map((p) => p.category)));

  const filtered = prompts.filter((p) => {
    if (showFavoritesOnly && !p.isFavorite) return false;
    if (filter && p.category !== filter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleEdit = (prompt: StoredPrompt) => {
    setEditingPrompt(prompt);
    setEditorOpen(true);
  };

  const handleNew = () => {
    setEditingPrompt(null);
    setEditorOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Prompt Library</h1>
          <p className="text-muted-foreground">
            Save and organize your most effective prompts.
          </p>
        </div>
        <Button className="gap-2" onClick={handleNew}>
          <Plus className="h-4 w-4" />
          New Prompt
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search prompts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap items-center">
          <Button
            variant={showFavoritesOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className="gap-1.5"
          >
            <Heart className="h-3 w-3" />
            Favorites
          </Button>
          <div className="w-px h-5 bg-border mx-1 hidden sm:block" />
          <Button
            variant={filter === null ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(null)}
          >
            All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={filter === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(filter === cat ? null : cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
            <Bookmark className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">
            {searchQuery || filter || showFavoritesOnly
              ? "No prompts found"
              : "No prompts yet"}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            {searchQuery || filter || showFavoritesOnly
              ? "Try adjusting your filters or search query."
              : "Create your first prompt template to get started."}
          </p>
          {!searchQuery && !filter && !showFavoritesOnly && (
            <Button className="mt-4 gap-2" onClick={handleNew}>
              <Plus className="h-4 w-4" />
              Create Prompt
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((prompt, index) => (
            <motion.div
              key={prompt.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.03 }}
            >
              <PromptCard
                prompt={prompt}
                onEdit={handleEdit}
                onDuplicate={duplicatePrompt}
                onDelete={deletePrompt}
                onToggleFavorite={toggleFavorite}
                onUsePrompt={(p) => {
                  navigator.clipboard.writeText(p.content);
                  toggleFavorite(p.id);
                }}
              />
            </motion.div>
          ))}
        </div>
      )}

      <PromptEditor
        open={editorOpen}
        onOpenChange={(open) => {
          setEditorOpen(open);
          if (!open) setEditingPrompt(null);
        }}
        prompt={editingPrompt}
      />
    </div>
  );
}
