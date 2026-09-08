"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";
import { DataCacheProvider } from "@/components/DataCacheProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider><DataCacheProvider>{children}</DataCacheProvider></SessionProvider>;
}
