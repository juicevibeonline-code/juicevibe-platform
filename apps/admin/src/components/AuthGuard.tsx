"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@juice-vibe/services";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, tokens } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (pathname === "/login") {
      setChecked(true);
      return;
    }

    if (!isAuthenticated || !tokens?.accessToken) {
      router.replace("/login");
    } else {
      setChecked(true);
    }
  }, [isAuthenticated, tokens, router, pathname]);

  if (!checked) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
