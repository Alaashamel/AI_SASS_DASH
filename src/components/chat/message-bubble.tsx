"use client";

import React from "react";
import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MarkdownRenderer, MessageActions } from "./markdown-renderer";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types";

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("flex gap-3 group", isUser && "justify-end")}
    >
      {!isUser && (
        <Avatar className="h-8 w-8 shrink-0">
          <div className="flex h-full w-full items-center justify-center bg-primary rounded-full">
            <Bot className="h-4 w-4 text-primary-foreground" />
          </div>
        </Avatar>
      )}
      <div
        className={cn(
          "rounded-xl px-4 py-3 max-w-[85%]",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted"
        )}
      >
        {isUser ? (
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        ) : (
          <MarkdownRenderer
            content={message.content}
            isStreaming={message.isStreaming}
          />
        )}
        <div
          className={cn(
            "flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity",
            isUser && "justify-end"
          )}
        >
          <MessageActions content={message.content} />
        </div>
      </div>
      {isUser && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src="https://randomuser.me/api/portraits/women/44.jpg" />
          <AvatarFallback className="text-xs">SC</AvatarFallback>
        </Avatar>
      )}
    </motion.div>
  );
}
