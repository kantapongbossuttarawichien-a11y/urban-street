import { useState, useEffect, useMemo } from "react";
import { sheetyApi } from "@/lib/api";
import { Transaction, SalesRecord } from "@/types";

export type TimePeriod = "today" | "yesterday" | "7d" | "month";

export function useDashboard() {
  const [period, setPeriod] = useState<TimePeriod>("today");
  const [sales, setSales] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSales = async () => {
    setIsLoading(true);
    try {
      const allSales = await sheetyApi.getAllSales();
      setSales(allSales as unknown as Transaction[]);
    } catch (error) {
      console.error("Failed to fetch sales", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const handleVoid = async (id: number) => {
    if (!confirm("Are you sure you want to void this transaction?")) return;
    
    try {
      await sheetyApi.voidOrder(id);
      await fetchSales();
    } catch (error) {
      console.error("Void failed", error);
      alert("Failed to void order");
    }
  };

  const filteredSales = useMemo(() => {
    const now = new Date();
    const todayStr = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' });
    const today = new Date(todayStr);
    
    return sales.filter((s) => {
      if (!s.timestamp) return false;
      const saleDate = new Date(s.timestamp);
      const saleDateBangkokStr = saleDate.toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' });
      const saleDateBangkok = new Date(saleDateBangkokStr);
      
      switch (period) {
        case "today":
          return saleDateBangkok.getTime() === today.getTime();
        case "yesterday": {
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          return saleDateBangkok.getTime() === yesterday.getTime();
        }
        case "7d": {
          const sevenDaysAgo = new Date(today);
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
          return saleDateBangkok >= sevenDaysAgo && saleDateBangkok <= today;
        }
        case "month": {
          return saleDateBangkok.getMonth() === today.getMonth() && 
                 saleDateBangkok.getFullYear() === today.getFullYear();
        }
        default:
          return false;
      }
    });
  }, [sales, period]);

  const metrics = useMemo(() => {
    const completed = filteredSales.filter(s => s.status !== 'voided');
    const revenue = completed.reduce((acc, s) => acc + (Number(s.total) || 0), 0);
    const cupCount = completed.length;
    
    const orderGroups = new Set(completed.map(s => s.timestamp));
    const orderCount = orderGroups.size;
    
    const aov = orderCount > 0 ? revenue / orderCount : 0;

    return {
      revenue,
      cupCount,
      orderCount,
      aov,
      completed,
      allFiltered: filteredSales
    };
  }, [filteredSales]);

  const rushHourData = useMemo(() => {
    const hours = ["06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00+"];
    const counts = hours.reduce((acc, h) => ({ ...acc, [h]: 0 }), {} as Record<string, number>);

    metrics.completed.forEach((s) => {
      const date = new Date(s.timestamp);
      const hour = parseInt(date.toLocaleTimeString('en-US', { timeZone: 'Asia/Bangkok', hour12: false, hour: '2-digit' }));
      
      if (hour === 6) counts["06:00"]++;
      else if (hour === 7) counts["07:00"]++;
      else if (hour === 8) counts["08:00"]++;
      else if (hour === 9) counts["09:00"]++;
      else if (hour === 10) counts["10:00"]++;
      else if (hour === 11) counts["11:00"]++;
      else if (hour >= 12) counts["12:00+"]++;
    });

    return hours.map(h => ({ hour: h, count: counts[h] }));
  }, [metrics.completed]);

  const topItemsData = useMemo(() => {
    const counts: Record<string, number> = {};
    metrics.completed.forEach((s) => {
      if (!s.items) return;
      counts[s.items] = (counts[s.items] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [metrics.completed]);

  const fastestItem = topItemsData[0];

  return {
    period,
    setPeriod,
    isLoading,
    metrics,
    rushHourData,
    topItemsData,
    fastestItem,
    handleVoid,
    fetchSales,
  };
}
