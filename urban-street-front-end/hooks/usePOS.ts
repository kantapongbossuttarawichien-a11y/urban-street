import { useState, useEffect, useMemo, useRef } from "react";
import { MenuItem, DailyStats } from "@/types";
import { sheetyApi } from "@/lib/api";
import { arrayMove } from "@dnd-kit/sortable";

export function usePOS() {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<MenuItem[]>([]);
  const [dailyRevenue, setDailyRevenue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);

  // Refs for managing Sync Queue (prevent race conditions)
  const isSyncingOrder = useRef(false);
  const nextSyncItems = useRef<MenuItem[] | null>(null);

  const total = useMemo(() => cart.reduce((acc, item) => acc + item.price, 0), [cart]);

  const fetchMenus = async () => {
    try {
      const fetchedMenus = await sheetyApi.getMenus();
      if (fetchedMenus.length > 0) setMenus(fetchedMenus);
    } catch (e) {
      console.error("Fetch menus failed", e);
    }
  };

  const fetchStats = async () => {
    try {
      const stats = await sheetyApi.getDailyStats();
      setDailyRevenue(stats.total);
    } catch (e) {
      console.error("Fetch stats failed", e);
    }
  };

  const attemptSync = async (queue: any[]) => {
    if (queue.length === 0) return;
    
    console.log(`Attempting to sync ${queue.length} pending orders...`);
    let successfulCount = 0;
    const remainingQueue = [];

    for (const order of queue) {
      try {
        await sheetyApi.createOrder(order.items, order.total);
        successfulCount++;
      } catch (e) {
        remainingQueue.push(order);
      }
    }

    localStorage.setItem("offline_orders", JSON.stringify(remainingQueue));
    setPendingSyncCount(remainingQueue.length);
    
    if (successfulCount > 0) {
      await fetchStats();
    }
  };

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await Promise.all([fetchMenus(), fetchStats()]);

      const offlineQueue = JSON.parse(localStorage.getItem("offline_orders") || "[]");
      setPendingSyncCount(offlineQueue.length);
      
      if (offlineQueue.length > 0) {
        attemptSync(offlineQueue);
      }
      setIsLoading(false);
    };
    init();
  }, []);

  const addToCart = (item: MenuItem) => {
    setCart((prev) => [...prev, item]);
  };

  const syncMenuOrder = async (newItems: MenuItem[]) => {
    if (isSyncingOrder.current) {
      nextSyncItems.current = newItems;
      return;
    }

    isSyncingOrder.current = true;
    try {
      for (let i = 0; i < newItems.length; i++) {
        const item = newItems[i];
        const targetOrder = i + 1;
        
        if (item.orderIndex !== targetOrder) {
          await sheetyApi.updateMenuItem(Number(item.id), { orderIndex: targetOrder });
          item.orderIndex = targetOrder;
        }
      }
    } catch (e) {
      console.error("Order sync failed", e);
    } finally {
      isSyncingOrder.current = false;
      if (nextSyncItems.current) {
        const itemsToSync = nextSyncItems.current;
        nextSyncItems.current = null;
        syncMenuOrder(itemsToSync);
      }
    }
  };

  const handleDragEnd = (activeId: string | number, overId: string | number) => {
    if (activeId !== overId) {
      setMenus((items) => {
        const oldIndex = items.findIndex((i) => i.id === activeId);
        const newIndex = items.findIndex((i) => i.id === overId);
        const newItems = arrayMove(items, oldIndex, newIndex);
        syncMenuOrder(newItems);
        return newItems;
      });
    }
  };

  const saveOrder = async () => {
    if (cart.length === 0) return;
    
    setIsLoading(true);
    const orderData = { items: cart, total: total };

    try {
      await sheetyApi.createOrder(orderData.items, orderData.total);
      setDailyRevenue(prev => prev + total);
      setCart([]);
      
      const offlineQueue = JSON.parse(localStorage.getItem("offline_orders") || "[]");
      if (offlineQueue.length > 0) attemptSync(offlineQueue);
      
      return { success: true, total };
    } catch (error) {
      const offlineQueue = JSON.parse(localStorage.getItem("offline_orders") || "[]");
      offlineQueue.push(orderData);
      localStorage.setItem("offline_orders", JSON.stringify(offlineQueue));
      
      setPendingSyncCount(offlineQueue.length);
      setCart([]);
      return { success: false, offline: true };
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  return {
    menus,
    cart,
    total,
    dailyRevenue,
    isLoading,
    pendingSyncCount,
    addToCart,
    removeFromCart,
    handleDragEnd,
    saveOrder,
    fetchMenus,
  };
}
