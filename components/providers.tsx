"use client";

import { SessionProvider } from "next-auth/react";
import { SiteProvider } from "@/contexts/site-context";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";

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
          <Toaster />
        </SiteProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
