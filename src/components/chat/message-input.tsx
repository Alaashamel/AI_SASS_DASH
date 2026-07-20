"use client";

import React, { useRef, useCallback } from "react";
import { Send, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isStreaming: boolean;
}

export function MessageInput({
  value,
  onChange,
  onSend,
  isStreaming,
}: MessageInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onSend();
      }
    },
    [onSend]
  );

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
      const target = e.target;
      target.style.height = "auto";
      target.style.height = Math.min(target.scrollHeight, 120) + "px";
    },
    [onChange]
  );

  return (
    <div className="border-t p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-end gap-2 border rounded-xl p-2 bg-background focus-within:ring-2 focus-within:ring-ring">
          <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
            <Paperclip className="h-4 w-4" />
          </Button>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            rows={1}
            className="flex-1 resize-none border-0 bg-transparent text-sm focus:outline-none min-h-[36px] max-h-[120px] py-1.5"
            style={{ height: "auto", overflow: "hidden" }}
          />
          <Button
            onClick={onSend}
            disabled={!value.trim() || isStreaming}
            size="icon"
            className="h-9 w-9 shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-2">
          NeuralFlow AI may produce inaccurate information. Consider checking important info.
        </p>
      </div>
    </div>
  );
}
