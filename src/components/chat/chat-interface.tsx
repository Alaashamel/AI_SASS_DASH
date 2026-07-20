"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore } from "@/stores";
import { ChatMessage, Conversation } from "@/types";
import { generateId } from "@/lib/utils";
import chatService from "@/services/chat.service";
import { ChatSidebar } from "./chat-sidebar";
import { ChatHeader } from "./chat-header";
import { MessageBubble } from "./message-bubble";
import { MessageInput } from "./message-input";
import { ChatWelcome } from "./chat-welcome";

export function ChatInterface() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { selectedModel, setSelectedModel } = useChatStore();

  useEffect(() => {
    chatService.getConversations().then((convs) => {
      setConversations(convs);
      if (convs.length > 0) {
        setActiveConversation(convs[0]);
      }
    });
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages, scrollToBottom]);

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    const assistantMessage: ChatMessage = {
      id: generateId(),
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isStreaming: true,
    };

    setInput("");

    let conv = activeConversation;
    if (!conv) {
      conv = {
        id: generateId(),
        title: input.slice(0, 50),
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        model: selectedModel,
      };
      setActiveConversation(conv);
      setConversations((prev) => [conv!, ...prev]);
    }

    const updatedConv = {
      ...conv,
      messages: [...conv.messages, userMessage, assistantMessage],
      updatedAt: new Date(),
    };

    setActiveConversation(updatedConv);
    setIsStreaming(true);

    try {
      await chatService.sendMessage(conv.id, input, (chunk) => {
        setActiveConversation((prev) => {
          if (!prev) return prev;
          const msgs = prev.messages.map((m) =>
            m.id === assistantMessage.id ? { ...m, content: chunk } : m
          );
          return { ...prev, messages: msgs, updatedAt: new Date() };
        });
      });

      setActiveConversation((prev) => {
        if (!prev) return prev;
        const msgs = prev.messages.map((m) =>
          m.id === assistantMessage.id ? { ...m, isStreaming: false } : m
        );
        const finalConv = { ...prev, messages: msgs, updatedAt: new Date() };
        setConversations((prev2) =>
          prev2.map((c) => (c.id === finalConv.id ? finalConv : c))
        );
        chatService.saveConversations(
          conversations.map((c) => (c.id === finalConv.id ? finalConv : c))
        );
        return finalConv;
      });
    } finally {
      setIsStreaming(false);
    }
  };

  const handleNewConversation = () => {
    const newConv: Conversation = {
      id: generateId(),
      title: "New Conversation",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      model: selectedModel,
    };
    setActiveConversation(newConv);
    setConversations((prev) => [newConv, ...prev]);
  };

  const handleDeleteConversation = async (id: string) => {
    await chatService.deleteConversation(id);
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConversation?.id === id) {
      setActiveConversation(conversations.find((c) => c.id !== id) || null);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] lg:h-[calc(100vh-4rem)]">
      {showSidebar && (
        <ChatSidebar
          conversations={conversations}
          activeConversationId={activeConversation?.id ?? null}
          searchQuery={searchQuery}
          onSelectConversation={setActiveConversation}
          onNewConversation={handleNewConversation}
          onDeleteConversation={handleDeleteConversation}
          onSearchChange={setSearchQuery}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <ChatHeader
          showSidebar={showSidebar}
          selectedModel={selectedModel}
          onToggleSidebar={() => setShowSidebar(!showSidebar)}
          onModelChange={setSelectedModel}
        />

        <ScrollArea className="flex-1 px-4">
          <div className="max-w-3xl mx-auto py-6 space-y-6">
            {(!activeConversation || activeConversation.messages.length === 0) && (
              <ChatWelcome onSuggestionClick={setInput} />
            )}

            <AnimatePresence>
              {activeConversation?.messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <MessageInput
          value={input}
          onChange={setInput}
          onSend={handleSend}
          isStreaming={isStreaming}
        />
      </div>
    </div>
  );
}
