"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { WifiOff, Wifi } from "lucide-react";
import { useOnlineStatus } from "@/hooks/use-online-status";

export function OfflineBanner() {
  const { isOnline, wasOffline } = useOnlineStatus();
  const prevOnline = useRef(isOnline);
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      if (!isOnline) {
        toast.error("You're offline", {
          id: "offline-status",
          description: "Changes will be saved locally and synced when you reconnect.",
          icon: <WifiOff className="h-4 w-4" />,
          duration: Infinity,
        });
      }
      prevOnline.current = isOnline;
      return;
    }

    if (prevOnline.current && !isOnline) {
      toast.error("You're offline", {
        id: "offline-status",
        description: "Changes will be saved locally and synced when you reconnect.",
        icon: <WifiOff className="h-4 w-4" />,
        duration: Infinity,
      });
    } else if (!prevOnline.current && isOnline && wasOffline) {
      toast.dismiss("offline-status");
      toast.success("Back online", {
        description: "Your connection has been restored.",
        icon: <Wifi className="h-4 w-4" />,
        duration: 3000,
      });
    }

    prevOnline.current = isOnline;
  }, [isOnline, wasOffline]);

  return null;
}
