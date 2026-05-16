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
      className={cn(
        "flex flex-col justify-between p-5 rounded-[2rem] h-48 w-full text-left transition-all active:scale-95 shadow-sm border border-stone-100 overflow-hidden",
        item.color || "bg-stone-100"
      )}
    >
      <div className="flex justify-between items-start w-full mb-2">
        <div className="bg-white/40 p-2 rounded-2xl shrink-0">
          <Coffee size={24} className="opacity-80" />
        </div>
        <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-xl text-sm font-black text-black shadow-sm shrink-0">
          ฿{item.price}
        </span>
      </div>
      
      <div className="flex-1 flex flex-col justify-end">
        <h3 className="text-xl font-black leading-tight mb-1 line-clamp-2 min-h-[3.5rem] flex items-end">
          {item.name}
        </h3>
        <p className="text-[10px] uppercase tracking-widest font-bold opacity-40">Tap to Add</p>
      </div>
    </button>
  );
}
