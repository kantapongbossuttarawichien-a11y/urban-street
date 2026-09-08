"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { AppNavigation, type AppTab } from "@/components/AppNavigation";
import { NativeNavigationContext } from "@/components/NativeNavigationContext";

const LAST_TAB_STORAGE_KEY = "urban-active-tab";

const POSScreen = dynamic(() => import("@/app/page"));
const DashboardScreen = dynamic(() => import("@/app/dashboard/page"));
const MenuManagementScreen = dynamic(() => import("@/app/menu/page"));

export function NativeAppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const routeTab = tabFromPathname(pathname);
  const initialTab = routeTab ?? "pos";
  const [activeTab, setActiveTab] = useState<AppTab>(initialTab);
  const [visitedTabs, setVisitedTabs] = useState<Set<AppTab>>(
    () => new Set([initialTab])
  );

  useEffect(() => {
    if (!routeTab) return;

    setActiveTab(routeTab);
    setVisitedTabs((currentTabs) => new Set([...currentTabs, routeTab]));
  }, [routeTab]);

  useEffect(() => {
    if (initialTab !== "pos") return;

    const savedTab = window.sessionStorage.getItem(LAST_TAB_STORAGE_KEY);
    if (savedTab !== "pos" && savedTab !== "dashboard" && savedTab !== "menu") {
      return;
    }

    setActiveTab(savedTab);
    setVisitedTabs((currentTabs) => new Set([...currentTabs, savedTab]));
  }, [initialTab]);

  useEffect(() => {
    window.sessionStorage.setItem(LAST_TAB_STORAGE_KEY, activeTab);
  }, [activeTab]);

  const selectTab = useCallback((tab: AppTab) => {
    setActiveTab(tab);
    setVisitedTabs((currentTabs) => {
      if (currentTabs.has(tab)) return currentTabs;
      return new Set([...currentTabs, tab]);
    });
  }, []);

  const navigation = useMemo(
    () => ({ activeTab, selectTab }),
    [activeTab, selectTab],
  );

  if (!routeTab) return <>{children}</>;

  return (
    <NativeNavigationContext.Provider value={navigation}>
      <div className="native-app-shell">
        {visitedTabs.has("pos") && (
          <ScreenPanel tab="pos" activeTab={activeTab}>
            {routeTab === "pos" ? children : <POSScreen />}
          </ScreenPanel>
        )}
        {visitedTabs.has("dashboard") && (
          <ScreenPanel tab="dashboard" activeTab={activeTab}>
            {routeTab === "dashboard" ? children : <DashboardScreen />}
          </ScreenPanel>
        )}
        {visitedTabs.has("menu") && (
          <ScreenPanel tab="menu" activeTab={activeTab}>
            {routeTab === "menu" ? children : <MenuManagementScreen />}
          </ScreenPanel>
        )}

        <AppNavigation activeTab={activeTab} onTabChange={selectTab} />
      </div>
    </NativeNavigationContext.Provider>
  );
}

function tabFromPathname(pathname: string): AppTab | null {
  if (pathname === "/") return "pos";
  if (pathname === "/dashboard") return "dashboard";
  if (pathname === "/menu") return "menu";
  return null;
}

function ScreenPanel({
  tab,
  activeTab,
  children,
}: {
  tab: AppTab;
  activeTab: AppTab;
  children: ReactNode;
}) {
  const isActive = activeTab === tab;

  return (
    <div
      aria-hidden={!isActive}
      hidden={!isActive}
    >
      {children}
    </div>
  );
}
