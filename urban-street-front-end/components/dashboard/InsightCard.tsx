"use client";

import React from "react";
import { Zap } from "lucide-react";
import { motion } from "framer-motion";

interface InsightCardProps {
  title: string;
  itemName: string;
  metric: string;
  description: string;
  isLoading?: boolean;
}

export function InsightCard({
  title,
  itemName,
  metric,
  description,
  isLoading
}: InsightCardProps) {
  if (!isLoading && metric.startsWith("0")) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#fdf2d8] p-10 rounded-[3rem] text-black shadow-sm relative overflow-hidden group border border-[#f5e7c1]"
    >
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform">
        <Zap size={140} strokeWidth={1} />
      </div>

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-2xl bg-white/50 text-[#856404] shadow-sm">
              <Zap size={20} fill="currentColor" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#856404]/80">{title}</span>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              <div className="h-10 bg-white/30 animate-pulse rounded-2xl w-48" />
              <div className="h-4 bg-white/30 animate-pulse rounded-xl w-full" />
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <h3 className="text-4xl font-black tracking-tighter leading-none mb-3 text-[#5d4037]">
                  {itemName}
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-black text-[#856404]">{metric}</span>
                  <span className="text-[10px] font-bold text-[#856404]/60 uppercase tracking-widest">{description}</span>
                </div>
              </div>
              
              <p className="text-xs text-[#856404]/70 leading-relaxed font-medium max-w-[90%]">
                รายการนี้มีอัตราการขายสูงสุดในช่วงเวลาที่เลือก ลองพิจารณาเตรียมวัตถุดิบเพิ่มสำหรับวันพรุ่งนี้
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
