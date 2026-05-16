"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  isLoading?: boolean;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className,
  isLoading
}: MetricCardProps) {
  return (
    <div className={cn(
      "relative overflow-hidden rounded-[3rem] p-8 bg-white border border-stone-100 shadow-sm transition-all hover:shadow-md group",
      className
    )}>
      <div className="flex justify-between items-start mb-6">
        <div className={cn(
          "p-4 rounded-[1.5rem] transition-colors",
          title === "ยอดขายรวม" ? "bg-[#fdf2d8] text-[#856404]" :
          title === "จำนวนแก้ว" ? "bg-[#fce4ec] text-[#d81b60]" :
          title === "จำนวนออเดอร์" ? "bg-[#e3f2fd] text-[#1565c0]" :
          "bg-[#f1f8e9] text-[#33691e]"
        )}>
          <Icon size={24} strokeWidth={2.5} />
        </div>
        {trend && !isLoading && (
          <div className={cn(
            "text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest",
            trend.isPositive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
          )}>
            {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
          </div>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.15em]">{title}</p>
        {isLoading ? (
          <div className="h-10 w-24 bg-stone-100 animate-pulse rounded-2xl" />
        ) : (
          <h3 className="text-4xl font-black tracking-tighter text-black">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </h3>
        )}
        {subtitle && !isLoading && (
          <p className="text-[10px] font-bold text-stone-300 uppercase tracking-tighter mt-1">{subtitle}</p>
        )}
      </div>
      
      {/* Subtle hover effect */}
      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
}
