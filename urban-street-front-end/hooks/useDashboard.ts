import { useCallback, useEffect, useMemo, useState } from "react";
import { sheetyApi } from "@/lib/api";
import { useDataCache } from "@/components/DataCacheProvider";
import { useNativeNavigation } from "@/components/NativeNavigationContext";

export type TimePeriod = "today" | "yesterday" | "7d" | "month";

export function useDashboard() {
  const { activeTab } = useNativeNavigation();
  const {
    sales,
    isSalesInitialLoading,
    refreshSales,
    invalidateDailyStats,
  } = useDataCache();
  const [period, setPeriod] = useState<TimePeriod>("today");

  const fetchSales = useCallback(
    () => refreshSales({ force: true }),
    [refreshSales],
  );

  useEffect(() => {
    if (activeTab !== "dashboard") return;
    void refreshSales();
  }, [activeTab, refreshSales]);

  const handleVoid = async (id: number | string) => {
    if (!confirm("Are you sure you want to void this transaction?")) return;

    try {
      await sheetyApi.voidOrder(id);
      invalidateDailyStats();
      await fetchSales();
    } catch (error) {
      console.error("Void failed", error);
      alert("Failed to void order");
    }
  };

  const filteredSales = useMemo(() => {
    const now = new Date();
    const todayStr = now.toLocaleDateString("en-CA", { timeZone: "Asia/Bangkok" });

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toLocaleDateString("en-CA", { timeZone: "Asia/Bangkok" });

    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    const sevenDaysAgoStr = sevenDaysAgo.toLocaleDateString("en-CA", { timeZone: "Asia/Bangkok" });

    const [currentYear, currentMonthStr] = todayStr.split("-");
    const currentMonth = Number(currentMonthStr);

    return sales.filter((sale) => {
      if (!sale.timestamp) return false;
      const saleDateObj = new Date(sale.timestamp);
      if (isNaN(saleDateObj.getTime())) return false;

      const saleDateBangkokStr = saleDateObj.toLocaleDateString("en-CA", { timeZone: "Asia/Bangkok" });

      switch (period) {
        case "today":
          return saleDateBangkokStr === todayStr;
        case "yesterday":
          return saleDateBangkokStr === yesterdayStr;
        case "7d":
          return saleDateBangkokStr >= sevenDaysAgoStr && saleDateBangkokStr <= todayStr;
        case "month": {
          const [saleYear, saleMonthStr] = saleDateBangkokStr.split("-");
          return Number(saleMonthStr) === currentMonth && saleYear === currentYear;
        }
      }
    });
  }, [period, sales]);

  const metrics = useMemo(() => {
    const completed = filteredSales.filter((sale) => sale.status !== "voided");
    const revenue = completed.reduce((accumulator, sale) => accumulator + (Number(sale.total) || 0), 0);
    const cupCount = completed.length;
    const orderCount = new Set(completed.map((sale) => sale.timestamp)).size;
    const aov = orderCount > 0 ? revenue / orderCount : 0;

    return { revenue, cupCount, orderCount, aov, completed, allFiltered: filteredSales };
  }, [filteredSales]);

  const rushHourData = useMemo(() => {
    const hours = ["06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00+"];
    const counts: Record<string, number> = {
      "06:00": 0, "07:00": 0, "08:00": 0, "09:00": 0, "10:00": 0, "11:00": 0, "12:00+": 0,
    };

    metrics.completed.forEach((sale) => {
      if (!sale.timestamp) return;
      const dateObj = new Date(sale.timestamp);
      if (isNaN(dateObj.getTime())) return;

      const hourStr = dateObj.toLocaleTimeString("en-US", {
        timeZone: "Asia/Bangkok",
        hour12: false,
        hour: "2-digit",
      });
      const hour = parseInt(hourStr, 10);

      if (!isNaN(hour)) {
        if (hour >= 6 && hour <= 11) {
          const key = `${hour.toString().padStart(2, "0")}:00`;
          if (counts[key] !== undefined) counts[key]++;
        } else if (hour >= 12) {
          counts["12:00+"]++;
        }
      }
    });

    return hours.map((hour) => ({ hour, count: counts[hour] }));
  }, [metrics.completed]);

  const topItemsData = useMemo(() => {
    const counts: Record<string, number> = {};
    metrics.completed.forEach((sale) => {
      if (!sale.items) return;
      counts[sale.items] = (counts[sale.items] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((first, second) => second.count - first.count)
      .slice(0, 5);
  }, [metrics.completed]);

  return {
    period,
    setPeriod,
    isLoading: isSalesInitialLoading,
    metrics,
    rushHourData,
    topItemsData,
    fastestItem: topItemsData[0],
    handleVoid,
    fetchSales,
  };
}
