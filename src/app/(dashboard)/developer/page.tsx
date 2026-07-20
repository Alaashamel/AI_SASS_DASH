"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Terminal,
  Code,
  Copy,
  Check,
  Send,
  BookOpen,
  Activity,
  Zap,
  ArrowRight,
  Play,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const ENDPOINTS = [
  {
    method: "POST",
    path: "/v1/chat/completions",
    description: "Create a chat completion",
    body: '{\n  "model": "gpt-4o",\n  "messages": [\n    {\n      "role": "user",\n      "content": "Hello, how are you?"\n    }\n  ],\n  "stream": true\n}',
  },
  {
    method: "GET",
    path: "/v1/models",
    description: "List available models",
    body: null,
  },
  {
    method: "POST",
    path: "/v1/embeddings",
    description: "Create embeddings",
    body: '{\n  "model": "text-embedding-3-small",\n  "input": "The quick brown fox"\n}',
  },
  {
    method: "DELETE",
    path: "/v1/conversations/{id}",
    description: "Delete a conversation",
    body: null,
  },
];

const USAGE_STATS = [
  { label: "Total Requests", value: "12,847", change: "+12%", icon: Activity },
  { label: "Tokens Used", value: "2.4M", change: "+8%", icon: Zap },
  { label: "Avg Latency", value: "234ms", change: "-5%", icon: ArrowRight },
  { label: "Error Rate", value: "0.2%", change: "-0.1%", icon: Check },
];

const CODE_EXAMPLES: Record<string, string> = {
  javascript: `import NeuralFlow from '@neuralflow/sdk';

const client = new NeuralFlow({
  apiKey: process.env.NEURALFLOW_API_KEY,
});

const response = await client.chat.completions.create({
  model: 'gpt-4o',
  messages: [
    { role: 'user', content: 'Hello!' }
  ],
});

console.log(response.choices[0].message.content);`,
  python: `from neuralflow import NeuralFlow

client = NeuralFlow(api_key="nf_sk_...")

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "user", "content": "Hello!"}
    ]
)

print(response.choices[0].message.content)`,
  curl: `curl -X POST https://api.neuralflow.ai/v1/chat/completions \\
  -H "Authorization: Bearer nf_sk_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-4o",
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'`,
};

export default function DeveloperPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState(0);
  const [responseBody, setResponseBody] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState("javascript");
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState("playground");

  const handleSendRequest = () => {
    setIsSending(true);
    setTimeout(() => {
      setResponseBody(
        JSON.stringify(
          {
            id: `chatcmpl-${crypto.randomUUID().slice(0, 12)}`,
            object: "chat.completion",
            model: "gpt-4o",
            choices: [
              {
                index: 0,
                message: {
                  role: "assistant",
                  content: "Hello! I'm doing well, thank you for asking. How can I help you today?",
                },
                finish_reason: "stop",
              },
            ],
            usage: {
              prompt_tokens: 12,
              completion_tokens: 18,
              total_tokens: 30,
            },
          },
          null,
          2
        )
      );
      setIsSending(false);
    }, 1200);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(CODE_EXAMPLES[codeLanguage]);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const methodColor: Record<string, string> = {
    GET: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    POST: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    DELETE: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    PUT: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Developer Console</h1>
        <p className="text-muted-foreground">
          Test API endpoints, view usage, and explore code examples.
        </p>
      </div>

      {/* Usage stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {USAGE_STATS.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Icon className="h-4 w-4" />
                      <span className="text-xs">{stat.label}</span>
                    </div>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-[10px]",
                        stat.change.startsWith("+") ? "text-emerald-600" : "text-blue-600"
                      )}
                    >
                      {stat.change}
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="playground" className="gap-2">
            <Play className="h-3.5 w-3.5" />
            Playground
          </TabsTrigger>
          <TabsTrigger value="endpoints" className="gap-2">
            <Terminal className="h-3.5 w-3.5" />
            Endpoints
          </TabsTrigger>
          <TabsTrigger value="sdks" className="gap-2">
            <Code className="h-3.5 w-3.5" />
            SDKs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="playground" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Request</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Select
                    value={String(selectedEndpoint)}
                    onValueChange={(v) => setSelectedEndpoint(Number(v))}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ENDPOINTS.map((ep, i) => (
                        <SelectItem key={i} value={String(i)}>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={cn("text-[10px] px-1.5 py-0", methodColor[ep.method])}
                            >
                              {ep.method}
                            </Badge>
                            <span className="text-xs">{ep.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={cn("text-[10px] px-1.5 py-0", methodColor[ENDPOINTS[selectedEndpoint].method])}>
                    {ENDPOINTS[selectedEndpoint].method}
                  </Badge>
                  <code className="text-xs text-muted-foreground font-mono">
                    https://api.neuralflow.ai{ENDPOINTS[selectedEndpoint].path}
                  </code>
                </div>
                {ENDPOINTS[selectedEndpoint].body && (
                  <div className="space-y-1">
                    <Label className="text-xs">Body</Label>
                    <textarea
                      readOnly
                      className="w-full h-48 rounded-md border bg-muted/50 p-3 font-mono text-xs resize-none focus:outline-none"
                      value={ENDPOINTS[selectedEndpoint].body ?? ""}
                    />
                  </div>
                )}
                <Button
                  onClick={handleSendRequest}
                  disabled={isSending}
                  className="w-full gap-2"
                >
                  {isSending ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  {isSending ? "Sending..." : "Send Request"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Response</CardTitle>
              </CardHeader>
              <CardContent>
                {responseBody ? (
                  <ScrollArea className="h-[320px]">
                    <pre className="text-xs font-mono whitespace-pre-wrap">{responseBody}</pre>
                  </ScrollArea>
                ) : (
                  <div className="h-[320px] flex items-center justify-center text-muted-foreground text-sm">
                    <div className="text-center">
                      <Terminal className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Send a request to see the response</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="endpoints" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">API Endpoints</CardTitle>
              <CardDescription>Available REST API endpoints</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {ENDPOINTS.map((ep, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <Badge className={cn("text-[10px] px-1.5 py-0 w-14 justify-center", methodColor[ep.method])}>
                      {ep.method}
                    </Badge>
                    <code className="text-xs font-mono flex-1">{ep.path}</code>
                    <span className="text-xs text-muted-foreground">{ep.description}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sdks" className="mt-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Select value={codeLanguage} onValueChange={setCodeLanguage}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="curl">cURL</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={handleCopyCode} className="gap-2">
                {copiedCode ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedCode ? "Copied!" : "Copy"}
              </Button>
            </div>
            <Card>
              <CardContent className="p-4">
                <pre className="text-xs font-mono whitespace-pre-wrap leading-relaxed">
                  {CODE_EXAMPLES[codeLanguage]}
                </pre>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
