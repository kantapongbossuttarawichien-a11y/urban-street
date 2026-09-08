"use client";

import { createContext, useContext } from "react";
import type { AppTab } from "@/components/AppNavigation";

interface NativeNavigationContextValue {
  activeTab: AppTab;
  selectTab: (tab: AppTab) => void;
}

export const NativeNavigationContext = createContext<NativeNavigationContextValue | null>(null);

export function useNativeNavigation() {
  const navigation = useContext(NativeNavigationContext);

  if (!navigation) {
    throw new Error("useNativeNavigation must be used inside NativeAppShell");
  }

  return navigation;
}
