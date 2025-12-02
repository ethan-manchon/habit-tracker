"use client";

import {SessionProvider} from "next-auth/react";
import {ThemeProvider} from "next-themes";
import {SWRProvider} from "@/lib/hooks/SWRProvider";

export function Providers({children}: {children: React.ReactNode}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <SessionProvider>
        <SWRProvider>{children}</SWRProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
