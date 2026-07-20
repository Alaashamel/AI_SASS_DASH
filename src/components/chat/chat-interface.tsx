"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import {
  Send,
  Copy,
  Check,
  Edit3,
  Trash2,
  Paperclip,
  Download,
  Search,
  Plus,
  Bot,
  User,
  MoreHorizontal,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useChatStore } from "@/stores";
import { CHAT_MODELS } from "@/constants";
import { ChatMessage, Conversation } from "@/types";
import { generateId, formatRelativeTime, cn } from "@/lib/utils";
import chatService from "@/services/chat.service";

export function ChatInterface() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
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
    inputRef.current?.focus();
  };

  const handleDeleteConversation = async (id: string) => {
    await chatService.deleteConversation(id);
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConversation?.id === id) {
      setActiveConversation(conversations.find((c) => c.id !== id) || null);
    }
  };

  const filteredConversations = searchQuery
    ? conversations.filter(
        (c) =>
          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.messages.some((m) =>
            m.content.toLowerCase().includes(searchQuery.toLowerCase())
          )
      )
    : conversations;

  return (
    <div className="flex h-[calc(100vh-4rem)] lg:h-[calc(100vh-4rem)]">
      {showSidebar && (
        <div className="w-72 border-r bg-card flex flex-col shrink-0">
          <div className="p-3 border-b">
            <Button
              onClick={handleNewConversation}
              className="w-full justify-start gap-2"
              variant="outline"
            >
              <Plus className="h-4 w-4" />
              New Chat
            </Button>
          </div>
          <div className="p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>
          </div>
          <ScrollArea className="flex-1 px-3">
            <div className="space-y-1">
              {filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setActiveConversation(conv)}
                  className={cn(
                    "group flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer transition-colors",
                    activeConversation?.id === conv.id
                      ? "bg-accent"
                      : "hover:bg-muted/50"
                  )}
                >
                  <Sparkles className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{conv.title}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {formatRelativeTime(conv.updatedAt)}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteConversation(conv.id);
                        }}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-3 w-3" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <div className="border-b px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              <Search className="h-4 w-4" />
            </Button>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-[180px] h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CHAT_MODELS.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    <div className="flex items-center gap-2">
                      <span>{model.name}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {model.provider}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <ScrollArea className="flex-1 px-4">
          <div className="max-w-3xl mx-auto py-6 space-y-6">
            {(!activeConversation || activeConversation.messages.length === 0) && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-4">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-xl font-semibold mb-2">How can I help you today?</h2>
                <p className="text-muted-foreground max-w-sm text-sm">
                  I can help with analysis, writing, coding, and much more. Ask me anything!
                </p>
                <div className="flex flex-wrap gap-2 mt-6 justify-center">
                  {["Analyze data", "Write code", "Summarize text", "Brainstorm ideas"].map(
                    (suggestion) => (
                      <Button
                        key={suggestion}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setInput(suggestion);
                          inputRef.current?.focus();
                        }}
                      >
                        {suggestion}
                      </Button>
                    )
                  )}
                </div>
              </div>
            )}

            <AnimatePresence>
              {activeConversation?.messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    "flex gap-3 group",
                    message.role === "user" && "justify-end"
                  )}
                >
                  {message.role === "assistant" && (
                    <Avatar className="h-8 w-8 shrink-0">
                      <div className="flex h-full w-full items-center justify-center bg-primary rounded-full">
                        <Bot className="h-4 w-4 text-primary-foreground" />
                      </div>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "rounded-xl px-4 py-3 max-w-[85%]",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    {message.role === "assistant" ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown
                          components={{
                            code({ className, children, ...props }) {
                              const match = /language-(\w+)/.exec(className || "");
                              return match ? (
                                <SyntaxHighlighter
                                  style={oneDark}
                                  language={match[1]}
                                  PreTag="div"
                                  className="rounded-lg text-sm"
                                >
                                  {String(children).replace(/\n$/, "")}
                                </SyntaxHighlighter>
                              ) : (
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              );
                            },
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                        {message.isStreaming && (
                          <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-0.5" />
                        )}
                      </div>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    )}
                    <div
                      className={cn(
                        "flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity",
                        message.role === "user" && "justify-end"
                      )}
                    >
                      <MessageActions content={message.content} />
                    </div>
                  </div>
                  {message.role === "user" && (
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarImage src="https://randomuser.me/api/portraits/women/44.jpg" />
                      <AvatarFallback className="text-xs">SC</AvatarFallback>
                    </Avatar>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="border-t p-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-2 border rounded-xl p-2 bg-background focus-within:ring-2 focus-within:ring-ring">
              <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
                <Paperclip className="h-4 w-4" />
              </Button>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                rows={1}
                className="flex-1 resize-none border-0 bg-transparent text-sm focus:outline-none min-h-[36px] max-h-[120px] py-1.5"
                style={{
                  height: "auto",
                  overflow: "hidden",
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height = Math.min(target.scrollHeight, 120) + "px";
                }}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isStreaming}
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
      </div>
    </div>
  );
}

function MessageActions({ content }: { content: string }) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={() => copy(content)}
      >
        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      </Button>
      <Button variant="ghost" size="icon" className="h-6 w-6">
        <Edit3 className="h-3 w-3" />
      </Button>
    </>
  );
}

function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, []);

  return { copied, copy };
}
