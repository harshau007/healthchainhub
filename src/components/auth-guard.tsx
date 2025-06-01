"use client";

import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { loggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loggedIn) {
      router.push("/");
    }
  }, [loggedIn, router]);

  if (!loggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="text-gray-700 dark:text-gray-300">
          Please connect your wallet and log in to view this content.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
