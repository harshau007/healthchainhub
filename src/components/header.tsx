"use client";

import { useState } from "react";
import { ConnectionStatus } from "@/components/connection-status";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { useDataContext } from "@/providers/data-provider";
import {
  Activity,
  Menu,
  X,
  Upload,
  FileText,
  Shield,
  LogOut,
  User,
  ChevronDown,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import type { JSX } from "react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderAuthSection = () => {
    if (!address) {
      return (
        <Button onClick={connectWallet} size="sm" className="gap-2">
          <Wallet className="h-4 w-4" />
          Connect Wallet
        </Button>
      );
    }

    if (!isRegistered) {
      return (
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="hidden sm:flex">
            {`${address.slice(0, 6)}...${address.slice(-4)}`}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="gap-2">
                Sign Up <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Register as</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signup("Patient")}>
                <User className="mr-2 h-4 w-4" />
                Patient
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => signup("Doctor")}>
                <Shield className="mr-2 h-4 w-4" />
                Doctor
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    }

    if (!loggedIn) {
      return (
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="hidden sm:flex">
            {`${address.slice(0, 6)}...${address.slice(-4)}`}
          </Badge>
          <Button onClick={login} size="sm">
            Login
          </Button>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2">
          <ConnectionStatus
            isConnected={isConnected}
            lastUpdated={lastUpdated}
          />
          <ModeToggle />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Badge variant="secondary" className="gap-1 px-1">
                <User className="h-3 w-3" />
                {role}
              </Badge>
              {`${address.slice(0, 6)}...${address.slice(-4)}`}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex justify-between">
              Role <Badge>{role}</Badge>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex justify-between">
              Status{" "}
              <Badge
                variant="outline"
                className={isConnected ? "text-green-500" : "text-red-500"}
              >
                {isConnected ? "Connected" : "Disconnected"}
              </Badge>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={logout}
              className="text-red-500 focus:text-red-500"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  };

  const renderNavLinks = () => {
    if (!loggedIn || !isRegistered) return null;

    return (
      <div className="hidden md:flex items-center gap-2">
        <Link href="/records">
          <Button variant="ghost" size="sm" className="gap-2">
            <FileText className="h-4 w-4" />
            Records
          </Button>
        </Link>

        {role === "Doctor" && (
          <Link href="/upload">
            <Button variant="ghost" size="sm" className="gap-2">
              <Upload className="h-4 w-4" />
              Upload
            </Button>
          </Link>
        )}

        {role === "Patient" && (
          <Link href="/consent">
            <Button variant="ghost" size="sm" className="gap-2">
              <Shield className="h-4 w-4" />
              Consent
            </Button>
          </Link>
        )}
      </div>
    );
  };

  const renderMobileMenu = () => {
    if (!loggedIn || !isRegistered) return null;

    return (
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[250px] sm:w-[300px]">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                <span className="font-bold">HealthChain</span>
              </div>
              {/* <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button> */}
            </div>

            <div className="flex flex-col gap-1">
              <Link href="/records" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <FileText className="h-4 w-4" />
                  View Records
                </Button>
              </Link>

              {role === "Doctor" && (
                <Link href="/upload" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Health Record
                  </Button>
                </Link>
              )}

              {role === "Patient" && (
                <Link href="/consent" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2"
                  >
                    <Shield className="h-4 w-4" />
                    Manage Consent
                  </Button>
                </Link>
              )}
            </div>

            <div className="flex flex-col gap-2 mt-auto">
              <div className="flex items-center justify-between">
                <ConnectionStatus
                  isConnected={isConnected}
                  lastUpdated={lastUpdated}
                />
                <ModeToggle />
              </div>

              <Button
                onClick={logout}
                variant="destructive"
                size="sm"
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-tight">
              HealthChain
            </span>
          </Link>

          {renderNavLinks()}
        </div>

        <div className="flex items-center gap-2">
          {renderAuthSection()}
          {renderMobileMenu()}
        </div>
      </div>
    </header>
  );
}
