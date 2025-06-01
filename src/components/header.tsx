"use client";

import { ConnectionStatus } from "@/components/connection-status";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { useDataContext } from "@/providers/data-provider";
import { Activity } from "lucide-react";
import Link from "next/link";
import { JSX } from "react";

export function Header(): JSX.Element {
  const { isConnected, lastUpdated } = useDataContext();
  const {
    address,
    isRegistered,
    role,
    loggedIn,
    connectWallet,
    signup,
    login,
    logout,
  } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3 sm:py-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          <Link href="/" className="text-xl font-bold tracking-tight">
            HealthChain
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {!address ? (
            <Button onClick={connectWallet} size="sm">
              Connect Wallet
            </Button>
          ) : !isRegistered ? (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="truncate text-sm">
                {`${address.slice(0, 6)}…${address.slice(-4)}`}
              </span>
              <Button
                onClick={() => signup("Patient")}
                size="sm"
                className="whitespace-nowrap"
              >
                Signup as Patient
              </Button>
              <Button
                onClick={() => signup("Doctor")}
                size="sm"
                className="whitespace-nowrap"
              >
                Signup as Doctor
              </Button>
            </div>
          ) : !loggedIn ? (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="truncate text-sm">
                {`${address.slice(0, 6)}…${address.slice(-4)}`}
              </span>
              <Button onClick={login} size="sm">
                Login
              </Button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 items-center">
              <ConnectionStatus
                isConnected={isConnected}
                lastUpdated={lastUpdated}
              />

              <ModeToggle />
              <div className="flex flex-col md:flex-row gap-2 justify-center">
                {loggedIn && isRegistered && role === "Doctor" && (
                  <Link href="/upload">
                    <Button size="sm" className="ml-2">
                      Upload Health Record
                    </Button>
                  </Link>
                )}
                <Link href="/records">
                  <Button className="px-4 py-2 rounded">View Records</Button>
                </Link>
                {loggedIn && isRegistered && role === "Patient" && (
                  <Link href="/consent">
                    <Button className="px-4 py-2 rounded">
                      Manage Consent
                    </Button>
                  </Link>
                )}
              </div>
              <span className="truncate text-sm">
                {`${address.slice(0, 6)}…${address.slice(-4)}`}
              </span>
              <Button onClick={logout} size="sm" variant="destructive">
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
