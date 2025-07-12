"use client";

import { SessionProvider } from "next-auth/react";
import { SiteProvider } from "@/contexts/site-context";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <SiteProvider>
          {children}
        </SiteProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
