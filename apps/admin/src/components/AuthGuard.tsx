"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@juice-vibe/services";
import { AuthSpinner } from "@/components/shared";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, tokens } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const redirected = useRef(false);

  useEffect(() => {
    if (pathname === "/login") return;

    if (!isAuthenticated || !tokens?.accessToken) {
      if (!redirected.current) {
        redirected.current = true;
        router.replace("/login");
      }
    }
  }, [isAuthenticated, tokens, router, pathname]);

  if (pathname === "/login") {
    return <>{children}</>;
  }

  if (!isAuthenticated || !tokens?.accessToken) {
    return <AuthSpinner />;
  }

  return <>{children}</>;
}
