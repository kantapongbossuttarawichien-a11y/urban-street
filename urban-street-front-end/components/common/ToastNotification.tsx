"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ToastNotificationProps {
  show: boolean;
  type: "success" | "error";
  title: string;
  subtitle?: string;
}

export function ToastNotification({
  show,
  type,
  title,
  subtitle
}: ToastNotificationProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className={cn(
            "fixed top-4 sm:top-10 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-md bg-black text-white px-5 sm:px-14 py-4 sm:py-5 rounded-2xl sm:rounded-[3rem] shadow-2xl flex items-center gap-3 sm:gap-5 border justify-center",
            type === "success" ? "border-stone-800" : "border-red-900/50"
          )}
        >
          <div
            className={cn(
              "w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0",
              type === "success" ? "bg-[#e4ff00] text-black" : "bg-red-500 text-white"
            )}
            >
            {type === "success" ? (
              <>
                <CheckCircle2 size={20} strokeWidth={3} className="sm:hidden" />
                <CheckCircle2 size={24} strokeWidth={3} className="hidden sm:block" />
              </>
            ) : (
              <>
                <AlertCircle size={20} strokeWidth={3} className="sm:hidden" />
                <AlertCircle size={24} strokeWidth={3} className="hidden sm:block" />
              </>
            )}
          </div>
          <div>
              <p className="font-black uppercase tracking-tight text-sm">
              {type === "success" ? title : title || "เกิดข้อผิดพลาด!"}
            </p>
            {subtitle && (
              <p className="text-[9px] sm:text-[10px] font-bold text-stone-400 uppercase tracking-wide sm:tracking-widest mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
