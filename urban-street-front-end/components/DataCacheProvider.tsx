"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { sheetyApi } from "@/lib/api";
import type { DailyStats, MenuItem, SalesRecord } from "@/types";

const CACHE_TTL_MS = 60_000;

type RefreshOptions = {
  force?: boolean;
};

interface CachedResource<T> {
  data: T;
  isInitialLoading: boolean;
  isRefreshing: boolean;
  refresh: (options?: RefreshOptions) => Promise<T>;
  replace: (data: T) => void;
  invalidate: () => void;
}

interface DataCacheContextValue {
  menus: MenuItem[];
  sales: SalesRecord[];
  dailyStats: DailyStats;
  isMenusInitialLoading: boolean;
  isSalesInitialLoading: boolean;
  isDailyStatsInitialLoading: boolean;
  isMenusRefreshing: boolean;
  isSalesRefreshing: boolean;
  isDailyStatsRefreshing: boolean;
  refreshMenus: (options?: RefreshOptions) => Promise<MenuItem[]>;
  refreshSales: (options?: RefreshOptions) => Promise<SalesRecord[]>;
  refreshDailyStats: (options?: RefreshOptions) => Promise<DailyStats>;
  replaceMenus: (menus: MenuItem[]) => void;
  replaceDailyStats: (stats: DailyStats) => void;
  invalidateSales: () => void;
  invalidateDailyStats: () => void;
}

const DataCacheContext = createContext<DataCacheContextValue | null>(null);

function useCachedResource<T>(loader: () => Promise<T>, initialData: T): CachedResource<T> {
  const [data, setData] = useState<T>(initialData);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const dataRef = useRef(data);
  const updatedAtRef = useRef<number | null>(null);
  const hasLoadedRef = useRef(false);
  const requestRef = useRef<Promise<T> | null>(null);
  const loaderRef = useRef(loader);

  loaderRef.current = loader;

  const refresh = useCallback(async (options: RefreshOptions = {}) => {
    const isFresh = updatedAtRef.current !== null
      && Date.now() - updatedAtRef.current < CACHE_TTL_MS;

    if (!options.force && isFresh) {
      return dataRef.current;
    }

    if (requestRef.current) {
      return requestRef.current;
    }

    const isFirstLoad = !hasLoadedRef.current;
    if (isFirstLoad) {
      setIsInitialLoading(true);
    } else {
      setIsRefreshing(true);
    }

    const request = loaderRef.current();
    requestRef.current = request;

    try {
      const nextData = await request;
      const updatedAt = Date.now();
      dataRef.current = nextData;
      updatedAtRef.current = updatedAt;
      hasLoadedRef.current = true;
      setData(nextData);
      return nextData;
    } finally {
      if (requestRef.current === request) {
        requestRef.current = null;
      }
      setIsInitialLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  const replace = useCallback((nextData: T) => {
    dataRef.current = nextData;
    updatedAtRef.current = Date.now();
    hasLoadedRef.current = true;
    setData(nextData);
    setIsInitialLoading(false);
    setIsRefreshing(false);
  }, []);

  const invalidate = useCallback(() => {
    updatedAtRef.current = null;
  }, []);

  return { data, isInitialLoading, isRefreshing, refresh, replace, invalidate };
}

export function DataCacheProvider({ children }: { children: ReactNode }) {
  const menusCache = useCachedResource(() => sheetyApi.getMenus(), [] as MenuItem[]);
  const salesCache = useCachedResource(() => sheetyApi.getAllSales(), [] as SalesRecord[]);
  const dailyStatsCache = useCachedResource(
    () => sheetyApi.getDailyStats(),
    { total: 0, count: 0 } as DailyStats,
  );

  const value = useMemo<DataCacheContextValue>(() => ({
    menus: menusCache.data,
    sales: salesCache.data,
    dailyStats: dailyStatsCache.data,
    isMenusInitialLoading: menusCache.isInitialLoading,
    isSalesInitialLoading: salesCache.isInitialLoading,
    isDailyStatsInitialLoading: dailyStatsCache.isInitialLoading,
    isMenusRefreshing: menusCache.isRefreshing,
    isSalesRefreshing: salesCache.isRefreshing,
    isDailyStatsRefreshing: dailyStatsCache.isRefreshing,
    refreshMenus: menusCache.refresh,
    refreshSales: salesCache.refresh,
    refreshDailyStats: dailyStatsCache.refresh,
    replaceMenus: menusCache.replace,
    replaceDailyStats: dailyStatsCache.replace,
    invalidateSales: salesCache.invalidate,
    invalidateDailyStats: dailyStatsCache.invalidate,
  }), [
    dailyStatsCache.data,
    dailyStatsCache.isInitialLoading,
    dailyStatsCache.isRefreshing,
    dailyStatsCache.refresh,
    dailyStatsCache.replace,
    dailyStatsCache.invalidate,
    menusCache.data,
    menusCache.isInitialLoading,
    menusCache.isRefreshing,
    menusCache.refresh,
    menusCache.replace,
    salesCache.data,
    salesCache.isInitialLoading,
    salesCache.isRefreshing,
    salesCache.refresh,
    salesCache.invalidate,
  ]);

  return <DataCacheContext.Provider value={value}>{children}</DataCacheContext.Provider>;
}

export function useDataCache() {
  const dataCache = useContext(DataCacheContext);

  if (!dataCache) {
    throw new Error("useDataCache must be used inside DataCacheProvider");
  }

  return dataCache;
}
