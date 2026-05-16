"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface RushHourChartProps {
  data: { hour: string; count: number }[];
  isLoading?: boolean;
}

export function RushHourChart({ data, isLoading }: RushHourChartProps) {
  const maxCount = Math.max(...data.map(d => d.count), 1);

  return (
    <div className="bg-white p-10 rounded-[3rem] border border-stone-100 shadow-sm relative overflow-hidden group h-full">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h4 className="text-sm font-black uppercase tracking-[0.1em] text-black">ช่วงเวลาขายดี</h4>
          <p className="text-[10px] font-bold text-stone-300 uppercase tracking-tighter mt-1">ความถี่ของออเดอร์ในแต่ละชั่วโมง</p>
        </div>
        <div className="flex gap-2 items-center">
           <div className="w-2.5 h-2.5 rounded-full bg-black" />
           <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">ปริมาณออเดอร์</span>
        </div>
      </div>

      <div className="flex items-end justify-between h-56 gap-3">
        {isLoading ? (
          Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex-1 bg-stone-50 animate-pulse rounded-full h-full" />
          ))
        ) : (
          data.map((d, i) => (
            <div key={d.hour} className="flex-1 flex flex-col items-center gap-4 h-full justify-end group/bar">
               <div className="relative flex-1 w-full flex flex-col justify-end px-1">
                {/* Tooltip on hover */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-black px-3 py-1.5 rounded-xl opacity-0 group-hover/bar:opacity-100 transition-all scale-75 group-hover/bar:scale-100 whitespace-nowrap z-10 shadow-lg">
                  {d.count} แก้ว
                </div>
                
                <motion.div 
                   initial={{ height: 0 }}
                   animate={{ height: `${(d.count / maxCount) * 100}%` }}
                   transition={{ delay: i * 0.05, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                   className={cn(
                     "w-full rounded-full transition-all duration-500",
                     d.count === maxCount 
                       ? "bg-black shadow-xl shadow-black/10" 
                       : "bg-stone-50 group-hover/bar:bg-stone-100"
                   )}
                />
              </div>
              <span className="text-[10px] font-black text-stone-300 uppercase tracking-tight">
                {d.hour}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Decorative background element */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-stone-50 rounded-full blur-3xl opacity-50 -z-0" />
    </div>
  );
}
