"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TopItemsChartProps {
  data: { name: string; count: number }[];
  isLoading?: boolean;
}

export function TopItemsChart({ data, isLoading }: TopItemsChartProps) {
  const maxCount = Math.max(...data.map(d => d.count), 1);

  return (
    <div className="bg-white p-10 rounded-[3rem] border border-stone-100 shadow-sm relative overflow-hidden h-full">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h4 className="text-sm font-black uppercase tracking-[0.1em] text-black">เมนูขายดี</h4>
          <p className="text-[10px] font-bold text-stone-300 uppercase tracking-tighter mt-1">5 อันดับที่ลูกค้าเลือกมากที่สุด</p>
        </div>
      </div>

      <div className="space-y-6">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="h-3 bg-stone-50 animate-pulse rounded-full w-24" />
              <div className="h-6 bg-stone-50 animate-pulse rounded-full w-full" />
            </div>
          ))
        ) : (
          data.slice(0, 5).map((item, i) => (
            <div key={item.name} className="space-y-2 group/row">
              <div className="flex justify-between items-center px-1">
                <span className="text-[10px] font-black text-black uppercase tracking-tight truncate max-w-[70%]">
                  {item.name}
                </span>
                <span className="text-[10px] font-black text-stone-400 tabular-nums uppercase">
                  {item.count} แก้ว
                </span>
              </div>
              <div className="relative h-4 w-full bg-stone-50 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.count / maxCount) * 100}%` }}
                  transition={{ delay: i * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className={cn(
                    "absolute top-0 left-0 h-full rounded-full transition-all duration-300",
                    i === 0 ? "bg-[#b08d7d]" :
                    i === 1 ? "bg-[#fdf2d8]" :
                    i === 2 ? "bg-[#fff9c4]" :
                    i === 3 ? "bg-[#fce4ec]" :
                    "bg-stone-200"
                  )}
                />
              </div>
            </div>
          ))
        )}
        
        {data.length === 0 && !isLoading && (
          <div className="h-40 flex items-center justify-center text-stone-300 text-[10px] font-bold uppercase tracking-widest">
            ไม่มีข้อมูลการขาย
          </div>
        )}
      </div>
    </div>
  );
}
