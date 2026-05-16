"use client";

import React from "react";
import { 
  ChevronLeft, 
  TrendingUp, 
  Coffee, 
  ShoppingBag, 
  DollarSign
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion, Variants } from "framer-motion";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RushHourChart } from "@/components/dashboard/RushHourChart";
import { TopItemsChart } from "@/components/dashboard/TopItemsChart";
import { InsightCard } from "@/components/dashboard/InsightCard";
import { TransactionList } from "@/components/dashboard/TransactionList";
import { useDashboard, TimePeriod } from "@/hooks/useDashboard";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
      staggerChildren: 0.06,
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: [0.25, 0.46, 0.45, 0.94],
    }
  }
};

export default function DashboardPage() {
  const {
    period,
    setPeriod,
    isLoading,
    metrics,
    rushHourData,
    topItemsData,
    fastestItem,
    handleVoid
  } = useDashboard();

  return (
    <main className="min-h-screen bg-white text-black font-sans pb-20 selection:bg-stone-200">
      <header className="p-6 bg-white sticky top-0 z-20 border-b border-stone-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link 
              href="/" 
              aria-label="Back to POS"
              className="p-2 rounded-2xl hover:bg-stone-50 transition-colors"
            >
              <ChevronLeft size={24} />
            </Link>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black tracking-tight uppercase">URBAN</span>
                <span className="text-2xl font-medium tracking-tight uppercase text-stone-400">STREET</span>
              </div>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-0.5">Analytics & Dashboard</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-stone-50 p-1.5 rounded-full border border-stone-100">
             {(['today', 'yesterday', '7d', 'month'] as TimePeriod[]).map((p) => (
               <button
                 key={p}
                 onClick={() => setPeriod(p)}
                 className={cn(
                   "px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all relative",
                   period === p ? "text-white" : "text-stone-400 hover:text-stone-600"
                 )}
               >
                 {period === p && (
                   <motion.div 
                     layoutId="active-tab"
                     className="absolute inset-0 bg-black rounded-full"
                   />
                 )}
                 <span className="relative z-10">
                   {p === "today" ? "วันนี้" : p === "yesterday" ? "เมื่อวาน" : p === "7d" ? "7 วัน" : "เดือนนี้"}
                 </span>
               </button>
             ))}
          </div>
        </div>
      </header>

      <motion.section 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        key={period}
        className="p-6 max-w-5xl mx-auto space-y-8"
      >
        <div className="flex sm:hidden overflow-x-auto gap-3 pb-4 -mx-6 px-6 no-scrollbar">
          {(['today', 'yesterday', '7d', 'month'] as TimePeriod[]).map((p) => (
               <button
                 key={p}
                 onClick={() => setPeriod(p)}
                 className={cn(
                   "px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap shadow-sm",
                   period === p 
                    ? "bg-black text-white" 
                    : "bg-stone-50 text-stone-400 border border-stone-100"
                 )}
               >
                 {p === "today" ? "วันนี้" : p === "yesterday" ? "เมื่อวาน" : p === "7d" ? "7 วันล่าสุด" : "เดือนนี้"}
               </button>
             ))}
        </div>

        <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard 
            title="ยอดขายรวม"
            value={`฿${metrics.revenue.toLocaleString()}`}
            icon={DollarSign}
            isLoading={isLoading}
            subtitle="ยอดขายสุทธิทั้งหมด"
          />
          <MetricCard 
            title="จำนวนแก้ว"
            value={metrics.cupCount}
            icon={Coffee}
            isLoading={isLoading}
            subtitle="จำนวนที่ขายได้"
          />
          <MetricCard 
            title="จำนวนออเดอร์"
            value={metrics.orderCount}
            icon={ShoppingBag}
            isLoading={isLoading}
            subtitle="รายการสั่งซื้อ"
          />
          <MetricCard 
            title="เฉลี่ยต่อบิล"
            value={`฿${Math.round(metrics.aov)}`}
            icon={TrendingUp}
            isLoading={isLoading}
            subtitle="ยอดเฉลี่ยต่อออเดอร์"
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div 
            variants={itemVariants} 
            className={cn(
              "lg:col-span-2",
              (!isLoading && !fastestItem) && "lg:col-span-3"
            )}
          >
            <RushHourChart data={rushHourData} isLoading={isLoading} />
          </motion.div>
          {(!isLoading && fastestItem) && (
            <motion.div variants={itemVariants} className="lg:col-span-1">
              <InsightCard 
                title="ขายดีที่สุด"
                itemName={fastestItem?.name || "-"}
                metric={`${fastestItem?.count || 0} แก้ว`}
                description="ขายได้ในช่วงนี้"
                isLoading={isLoading}
              />
            </motion.div>
          )}
          {isLoading && (
            <motion.div variants={itemVariants} className="lg:col-span-1">
              <InsightCard 
                title="ขายดีที่สุด"
                itemName="-"
                metric="0 แก้ว"
                description="ขายได้ในช่วงนี้"
                isLoading={true}
              />
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <TopItemsChart data={topItemsData} isLoading={isLoading} />
          </motion.div>
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <TransactionList 
              transactions={metrics.allFiltered.slice(0, 10)} 
              onVoid={handleVoid}
              isLoading={isLoading}
              showDate={period === "7d" || period === "month"}
            />
          </motion.div>
        </div>
      </motion.section>
    </main>
  );
}
