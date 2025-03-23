"use client";

import { ConnectionStatus } from "@/components/connection-status";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { useDataContext } from "@/providers/data-provider";
import { Activity, Bell } from "lucide-react";
import Link from "next/link";

export function Header() {
  const { isConnected, lastUpdated } = useDataContext();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          <Link href="/" className="text-xl font-bold tracking-tight">
            MediTrack
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <ConnectionStatus
            isConnected={isConnected}
            lastUpdated={lastUpdated}
          />
          <Button variant="outline" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
