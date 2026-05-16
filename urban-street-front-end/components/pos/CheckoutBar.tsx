"use client";

import React, { useState, useEffect } from "react";
import { ShoppingCart, ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import { MenuItem } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CheckoutBarProps {
  cart: MenuItem[];
  total: number;
  onSave: () => void;
  onRemoveItem: (index: number) => void;
  isLoading?: boolean;
}

export function CheckoutBar({ cart, total, onSave, onRemoveItem, isLoading }: CheckoutBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const itemCount = cart.length;

  // Reset expanded state when cart is empty
  useEffect(() => {
    if (itemCount === 0) {
      setIsExpanded(false);
    }
  }, [itemCount]);

  if (itemCount === 0) return null;

  return (
    <>
      {/* Backdrop when expanded */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsExpanded(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: isExpanded ? 0 : "calc(100% - 130px)" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className={cn(
          "fixed bottom-0 left-0 right-0 bg-white shadow-[0_-8px_30px_rgb(0,0,0,0.12)] z-50 rounded-t-[3rem] flex flex-col overflow-hidden",
          isExpanded ? "h-[75vh]" : "h-auto"
        )}
      >
        {/* Pull Handle / Toggle Header */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex flex-col items-center py-2 cursor-pointer group"
        >
          <div className="w-12 h-1.5 bg-stone-100 rounded-full group-hover:bg-stone-200 transition-colors mb-2" />
          {!isExpanded && (
            <div className="flex items-center gap-1 text-[10px] font-black text-stone-200 uppercase tracking-[0.2em]">
              <ChevronUp size={12} />
              ดูรายการ
              <ChevronUp size={12} />
            </div>
          )}
        </div>

        <div className="px-10 pb-10 flex flex-col h-full">
          {/* Main Info Bar */}
          <div className="flex gap-6 items-center mb-6">
            <div className="flex-1">
              <p className="text-[10px] text-stone-400 font-black uppercase tracking-widest mb-1">ยอดรวม ({itemCount} แก้ว)</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-black tracking-tighter">฿ {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(false);
                onSave();
              }}
              disabled={isLoading}
              className="bg-[#e4ff00] hover:bg-[#d4ee00] text-black flex items-center gap-3 px-8 h-16 rounded-2xl disabled:opacity-50 transition-all active:scale-95 shadow-lg shadow-[#e4ff00]/20 group"
            >
              <span className="text-base font-black uppercase tracking-tight">
                {isLoading ? "กำลังบันทึก..." : "บันทึกการขาย"}
              </span>
              {!isLoading && <ShoppingCart size={22} strokeWidth={2.5} className="group-hover:rotate-12 transition-transform" />}
              {isLoading && <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />}
            </button>
          </div>

          {/* Expanded Content: Item List */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="flex-1 flex flex-col overflow-hidden"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-black uppercase tracking-tight">รายละเอียดออเดอร์</h3>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-3 pb-20">
                  {cart.map((item, index) => (
                    <div
                      key={`${item.id}-${index}`}
                      className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-100"
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-black/40", item.color || "bg-stone-200")}>
                          <span className="text-xs font-black">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-black text-sm uppercase tracking-tight">{item.name}</p>
                          <p className="text-[10px] font-bold text-stone-400">฿ {item.price.toLocaleString()}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => onRemoveItem(index)}
                        className="p-2 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}
