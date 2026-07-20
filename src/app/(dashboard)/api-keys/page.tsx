"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Key,
  Plus,
  Copy,
  Eye,
  EyeOff,
  Trash2,
  Shield,
  Clock,
  AlertTriangle,
  Check,
  MoreHorizontal,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/contexts/toast-context";
import { cn, formatRelativeTime } from "@/lib/utils";

interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  fullKey: string;
  permissions: string[];
  lastUsedAt: Date | null;
  expiresAt: Date | null;
  createdAt: Date;
  isActive: boolean;
}

const MOCK_KEYS: ApiKey[] = [
  {
    id: "1",
    name: "Production API",
    prefix: "nf_sk_prod_",
    fullKey: "nf_sk_prod_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
    permissions: ["read", "write", "admin"],
    lastUsedAt: new Date(Date.now() - 3600000),
    expiresAt: null,
    createdAt: new Date(Date.now() - 86400000 * 30),
    isActive: true,
  },
  {
    id: "2",
    name: "Development",
    prefix: "nf_sk_dev_",
    fullKey: "nf_sk_dev_x9y8z7w6v5u4t3s2r1q0p9o8n7m6l5k4",
    permissions: ["read", "write"],
    lastUsedAt: new Date(Date.now() - 86400000),
    expiresAt: new Date(Date.now() + 86400000 * 60),
    createdAt: new Date(Date.now() - 86400000 * 7),
    isActive: true,
  },
  {
    id: "3",
    name: "CI/CD Pipeline",
    prefix: "nf_sk_ci_",
    fullKey: "nf_sk_ci_h6g5f4e3d2c1b0a9z8y7x6w5v4u3t2s1",
    permissions: ["read"],
    lastUsedAt: new Date(Date.now() - 86400000 * 5),
    expiresAt: new Date(Date.now() - 86400000 * 2),
    createdAt: new Date(Date.now() - 86400000 * 90),
    isActive: false,
  },
];

export default function ApiKeysPage() {
  const { toast } = useToast();
  const [keys, setKeys] = useState<ApiKey[]>(MOCK_KEYS);
  const [showCreate, setShowCreate] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyPermissions, setNewKeyPermissions] = useState("read");
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const maskKey = (key: string) => {
    const prefix = key.slice(0, key.indexOf("_", key.indexOf("_") + 1) + 1);
    return prefix + "••••••••••••••••••••••••••••••••••••";
  };

  const handleCreateKey = () => {
    if (!newKeyName.trim()) return;
    const newKey: ApiKey = {
      id: crypto.randomUUID(),
      name: newKeyName,
      prefix: "nf_sk_new_",
      fullKey: `nf_sk_new_${Array.from({ length: 32 }, () => "abcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(Math.random() * 36)]).join("")}`,
      permissions: newKeyPermissions.split(","),
      lastUsedAt: null,
      expiresAt: null,
      createdAt: new Date(),
      isActive: true,
    };
    setKeys((prev) => [newKey, ...prev]);
    setShowCreate(false);
    setNewKeyName("");
    toast({
      title: "API key created",
      description: "Copy your new key now — it won't be shown again.",
      variant: "success",
    });
  };

  const handleRevokeKey = (id: string) => {
    setKeys((prev) => prev.map((k) => (k.id === id ? { ...k, isActive: false } : k)));
    toast({
      title: "API key revoked",
      description: "The key can no longer be used for authentication.",
      variant: "error",
    });
  };

  const handleDeleteKey = (id: string) => {
    setKeys((prev) => prev.filter((k) => k.id !== id));
    toast({ title: "API key deleted", variant: "success" });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">API Keys</h1>
          <p className="text-muted-foreground">
            Manage API keys for programmatic access to NeuralFlow.
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Key
        </Button>
      </div>

      {/* Usage summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Key className="h-4 w-4" />
              <span className="text-xs">Active Keys</span>
            </div>
            <p className="text-2xl font-bold">{keys.filter((k) => k.isActive).length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Clock className="h-4 w-4" />
              <span className="text-xs">Last Used</span>
            </div>
            <p className="text-sm font-medium">Today</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Shield className="h-4 w-4" />
              <span className="text-xs">Rate Limit</span>
            </div>
            <p className="text-2xl font-bold">10K<span className="text-xs font-normal text-muted-foreground"> /day</span></p>
          </CardContent>
        </Card>
      </div>

      {/* Key list */}
      <div className="space-y-3">
        {keys.map((key) => (
          <motion.div
            key={key.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card className={cn(!key.isActive && "opacity-60")}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-sm">{key.name}</h3>
                      <Badge variant={key.isActive ? "secondary" : "destructive"} className="text-[10px]">
                        {key.isActive ? "Active" : "Revoked"}
                      </Badge>
                      {key.expiresAt && key.expiresAt < new Date() && (
                        <Badge variant="destructive" className="text-[10px]">Expired</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                        {visibleKeys.has(key.id) ? key.fullKey : maskKey(key.fullKey)}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => toggleKeyVisibility(key.id)}
                      >
                        {visibleKeys.has(key.id) ? (
                          <EyeOff className="h-3 w-3" />
                        ) : (
                          <Eye className="h-3 w-3" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => {
                          navigator.clipboard.writeText(key.fullKey);
                          toast({ title: "Copied to clipboard", variant: "success" });
                        }}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>Permissions: {key.permissions.join(", ")}</span>
                      {key.lastUsedAt && (
                        <span>Last used {formatRelativeTime(key.lastUsedAt)}</span>
                      )}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {key.isActive && (
                        <DropdownMenuItem
                          onClick={() => handleRevokeKey(key.id)}
                          className="text-yellow-600"
                        >
                          <AlertTriangle className="mr-2 h-3 w-3" />
                          Revoke Key
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => handleDeleteKey(key.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-3 w-3" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Create dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create API Key</DialogTitle>
            <DialogDescription>
              Generate a new API key for programmatic access.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Key Name</Label>
              <Input
                placeholder="e.g., Production API"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Permissions</Label>
              <Select value={newKeyPermissions} onValueChange={setNewKeyPermissions}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="read">Read Only</SelectItem>
                  <SelectItem value="read,write">Read & Write</SelectItem>
                  <SelectItem value="read,write,admin">Full Access</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateKey} disabled={!newKeyName.trim()}>
              <Key className="mr-2 h-4 w-4" />
              Create Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
