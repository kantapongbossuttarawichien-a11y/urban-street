import { useRef, useCallback } from "react";
import { MenuItem } from "@/types";
import { sheetyApi } from "@/lib/api";
import { arrayMove } from "@dnd-kit/sortable";

/**
 * Custom hook to handle reordering menu items via drag-and-drop
 * and sequentially syncing new orderIndex values to Google Apps Script.
 */
export function useMenuOrderSync() {
  const isSyncingOrder = useRef(false);
  const nextSyncItems = useRef<MenuItem[] | null>(null);

  const syncMenuOrder = useCallback(async (newItems: MenuItem[]) => {
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
          await sheetyApi.updateMenuItem(item.id, { orderIndex: targetOrder });
        }
      }
    } catch (e) {
      console.error("Order sync failed", e);
    } finally {
      isSyncingOrder.current = false;
      if (nextSyncItems.current) {
        const itemsToSync = nextSyncItems.current;
        nextSyncItems.current = null;
        void syncMenuOrder(itemsToSync);
      }
    }
  }, []);

  const reorderMenus = useCallback((items: MenuItem[], activeId: string | number, overId: string | number): MenuItem[] => {
    const oldIndex = items.findIndex((i) => String(i.id) === String(activeId));
    const newIndex = items.findIndex((i) => String(i.id) === String(overId));

    if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
      return items;
    }

    const reordered = arrayMove(items, oldIndex, newIndex).map((item, index) => ({
      ...item,
      orderIndex: index + 1,
    }));

    syncMenuOrder(reordered);
    return reordered;
  }, [syncMenuOrder]);

  return {
    reorderMenus,
    syncMenuOrder,
  };
}
