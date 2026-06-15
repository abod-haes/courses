"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import type { Locale, ThemeMode } from "@/shared/lib/types";
import { PreferencesProvider } from "./preferences-provider";

type ProvidersProps = Readonly<{
  children: React.ReactNode;
  initialLocale: Locale;
  initialTheme: ThemeMode;
}>;

export function Providers({ children, initialLocale, initialTheme }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 30_000,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <PreferencesProvider initialLocale={initialLocale} initialTheme={initialTheme}>
        {children}
      </PreferencesProvider>
    </QueryClientProvider>
  );
}
