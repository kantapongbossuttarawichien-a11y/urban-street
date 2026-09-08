import { useCallback, useEffect, useMemo, useState } from "react";
import { MenuItem, OfflineOrder } from "@/types";
import { sheetyApi } from "@/lib/api";
import { useDataCache } from "@/components/DataCacheProvider";
import { useNativeNavigation } from "@/components/NativeNavigationContext";
import { useMenuOrderSync } from "./useMenuOrderSync";

const getOfflineQueue = (): OfflineOrder[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("offline_orders");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const setOfflineQueue = (queue: OfflineOrder[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("offline_orders", JSON.stringify(queue));
  } catch (error) {
    console.error("Failed to write to localStorage", error);
  }
};

export function usePOS() {
  const { activeTab } = useNativeNavigation();
  const {
    menus,
    dailyStats,
    isMenusInitialLoading,
    isDailyStatsInitialLoading,
    refreshMenus,
    refreshDailyStats,
    replaceMenus,
    replaceDailyStats,
    invalidateSales,
  } = useDataCache();
  const [cart, setCart] = useState<MenuItem[]>([]);
  const [cartReady, setCartReady] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const { reorderMenus } = useMenuOrderSync();

  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem("urban-cart") || "[]");
      if (Array.isArray(saved) && saved.every(item => item && typeof item.name === "string" && typeof item.price === "number")) {
        setCart(saved);
      }
    } catch {
      // Keep the POS usable when storage is unavailable or corrupt.
    }
    setCartReady(true);
  }, []);

  useEffect(() => {
    if (!cartReady) return;
    try {
      sessionStorage.setItem("urban-cart", JSON.stringify(cart));
    } catch {
      // The in-memory cart remains usable when storage is unavailable.
    }
  }, [cart, cartReady]);

  const total = useMemo(
    () => cart.reduce((accumulator, item) => accumulator + item.price, 0),
    [cart],
  );

  const fetchMenus = useCallback(
    () => refreshMenus({ force: true }),
    [refreshMenus],
  );

  const attemptSync = useCallback(async (queue: OfflineOrder[]) => {
    if (queue.length === 0) return;

    const remainingQueue: OfflineOrder[] = [];
    let successfulCount = 0;

    for (const order of queue) {
      try {
        await sheetyApi.createOrder(order.items);
        successfulCount++;
      } catch (error) {
        console.error("Sync failed", error);
        remainingQueue.push(order);
      }
    }

    setOfflineQueue(remainingQueue);
    setPendingSyncCount(remainingQueue.length);

    if (successfulCount > 0) {
      invalidateSales();
      await refreshDailyStats({ force: true });
    }
  }, [invalidateSales, refreshDailyStats]);

  useEffect(() => {
    if (activeTab !== "pos") return;

    let isCurrent = true;

    const loadActiveScreen = async () => {
      await Promise.all([refreshMenus(), refreshDailyStats()]);
      if (!isCurrent) return;

      const offlineQueue = getOfflineQueue();
      setPendingSyncCount(offlineQueue.length);

      if (offlineQueue.length > 0) {
        void attemptSync(offlineQueue);
      }
    };

    void loadActiveScreen();

    return () => {
      isCurrent = false;
    };
  }, [activeTab, attemptSync, refreshDailyStats, refreshMenus]);

  const addToCart = (item: MenuItem) => {
    setCart((currentCart) => [...currentCart, item]);
  };

  const removeFromCart = (index: number) => {
    setCart((currentCart) => currentCart.filter((_, itemIndex) => itemIndex !== index));
  };

  const handleDragEnd = (activeId: string | number, overId: string | number) => {
    if (activeId === overId) return;

    const reorderedMenus = reorderMenus(menus, activeId, overId);
    if (reorderedMenus !== menus) {
      replaceMenus(reorderedMenus);
    }
  };

  const saveOrder = async () => {
    if (cart.length === 0) return;

    setIsSaving(true);
    const orderData: OfflineOrder = { items: cart, total };

    try {
      await sheetyApi.createOrder(orderData.items);
      replaceDailyStats({
        total: dailyStats.total + total,
        count: dailyStats.count + cart.length,
      });
      setCart([]);
      invalidateSales();

      const offlineQueue = getOfflineQueue();
      if (offlineQueue.length > 0) {
        void attemptSync(offlineQueue);
      }

      void refreshDailyStats({ force: true });
      return { success: true, total };
    } catch (error) {
      console.error("Order save failed, saving to offline queue", error);
      const offlineQueue = getOfflineQueue();
      offlineQueue.push(orderData);
      setOfflineQueue(offlineQueue);
      setPendingSyncCount(offlineQueue.length);
      setCart([]);
      return { success: false, offline: true };
    } finally {
      setIsSaving(false);
    }
  };

  return {
    menus,
    cart,
    total,
    dailyRevenue: dailyStats.total,
    isLoading: isMenusInitialLoading || isDailyStatsInitialLoading,
    isSaving,
    pendingSyncCount,
    addToCart,
    removeFromCart,
    handleDragEnd,
    saveOrder,
    fetchMenus,
  };
}
