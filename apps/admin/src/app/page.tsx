"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@juice-vibe/services";
import { LoadingSpinner } from "@juice-vibe/ui";

export default function RootPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground">
      <div className="flex flex-col items-center gap-3">
        <LoadingSpinner className="h-8 w-8 text-primary" />
        <span className="font-mono text-xs text-muted-foreground tracking-widest uppercase">Initializing OS...</span>
      </div>
    </div>
  );
}
