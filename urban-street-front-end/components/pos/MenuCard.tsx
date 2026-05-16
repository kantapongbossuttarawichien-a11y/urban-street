"use client";

import React from "react";
import { Coffee } from "lucide-react";
import { MenuItem } from "@/types";
import { cn } from "@/lib/utils";

interface MenuCardProps {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
}

export function MenuCard({ item, onAdd }: MenuCardProps) {
  return (
    <button
      onClick={() => onAdd(item)}
      aria-label={`Add ${item.name} to cart. Price: ${item.price} Baht`}
      style={{ willChange: "transform" }}
      className={cn(
        "flex flex-col justify-between p-6 rounded-[2.5rem] h-48 w-full text-left",
        "transition-[transform,box-shadow] duration-150 ease-out",
        "hover:shadow-md active:scale-95",
        "border border-stone-100 overflow-hidden group relative",
        item.color || "bg-stone-100"
      )}
    >
      <div className="flex justify-between items-start w-full relative z-10">
        {/* ลบ backdrop-blur ออก — ประหยัด GPU มาก */}
        <div className="bg-white/60 p-3 rounded-2xl shrink-0 group-hover:scale-110 transition-transform duration-200 ease-out">
          <Coffee size={24} className="text-black opacity-70" />
        </div>
        <div className="bg-black/90 px-4 py-1.5 rounded-2xl shadow-sm shrink-0">
          <span className="text-sm font-black text-white tabular-nums">
            ฿{item.price}
          </span>
        </div>
      </div>
      
      <div className="relative z-10 flex flex-col justify-end mt-4">
        <h3 className="text-lg font-black leading-tight mb-1 line-clamp-2 min-h-[3rem] text-black">
          {item.name}
        </h3>
        <p className="text-[9px] uppercase tracking-[0.2em] font-black text-black/30 group-hover:text-black/50 transition-colors duration-150">Tap to Add</p>
      </div>

      {/* Subtle overlay on hover */}
      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
    </button>
  );
}
