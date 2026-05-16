"use client";

import React from "react";
import { ShoppingCart } from "lucide-react";

interface CheckoutBarProps {
  total: number;
  itemCount: number;
  onSave: () => void;
}

export function CheckoutBar({ total, itemCount, onSave }: CheckoutBarProps) {
  if (itemCount === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-2xl border-t border-surface flex gap-4 items-center z-20 animate-in slide-in-from-bottom duration-300">
      <div className="flex-1">
        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Total ({itemCount} cups)</p>
        <p className="text-3xl font-black text-black tracking-tighter">฿ {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
      </div>
      <button 
        onClick={onSave}
        className="btn-primary flex items-center gap-3 px-10 h-16 rounded-[1.5rem]"
      >
        <span className="text-lg font-black">บันทึกการขาย</span>
        <ShoppingCart size={22} strokeWidth={2.5} />
      </button>
    </div>
  );
}
