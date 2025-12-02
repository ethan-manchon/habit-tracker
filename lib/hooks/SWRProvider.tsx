"use client";
import React, { createContext, useContext, ReactNode } from "react";
import { SWRConfig } from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function SWRProvider({ children }: { children: ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: false,
        revalidateIfStale: true,
        dedupingInterval: 10000,
      }}
    >
      {children}
    </SWRConfig>
  );
}
