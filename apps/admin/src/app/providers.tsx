"useClient";
"use strict";

// Wait! React 19 / Next 16 requires client components to declare 'use client' at the top. Let's make sure it has "use client" as a directive.
// Wait, the correct directive is "use client", not "useClient". Let's write:
// "use client";

"use client";

import React, { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore, injectAuthStore } from "@juice-vibe/services";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  // Inject auth store on component mount (client-side only)
  useEffect(() => {
    // Pass the zustand store to the service api client
    injectAuthStore(useAuthStore as any);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
