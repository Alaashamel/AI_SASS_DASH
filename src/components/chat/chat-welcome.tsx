"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatWelcomeProps {
  onSuggestionClick: (text: string) => void;
}

const SUGGESTIONS = ["Analyze data", "Write code", "Summarize text", "Brainstorm ideas"];

export function ChatWelcome({ onSuggestionClick }: ChatWelcomeProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-4">
        <Sparkles className="h-8 w-8 text-primary" />
      </div>
      <h2 className="text-xl font-semibold mb-2">How can I help you today?</h2>
      <p className="text-muted-foreground max-w-sm text-sm">
        I can help with analysis, writing, coding, and much more. Ask me anything!
      </p>
      <div className="flex flex-wrap gap-2 mt-6 justify-center">
        {SUGGESTIONS.map((suggestion) => (
          <Button
            key={suggestion}
            variant="outline"
            size="sm"
            onClick={() => onSuggestionClick(suggestion)}
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
}
