"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger"
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white w-full max-w-sm rounded-[3rem] p-8 shadow-2xl relative z-[120] overflow-hidden text-center"
          >
            <div className="flex justify-center mb-6">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                variant === "danger" ? "bg-red-50 text-red-500" : "bg-amber-50 text-amber-500"
              }`}>
                <AlertCircle size={32} strokeWidth={2.5} />
              </div>
            </div>

            <div className="space-y-2 mb-8">
              <h2 className="text-2xl font-black tracking-tight">{title}</h2>
              <p className="text-stone-400 font-bold text-sm leading-relaxed">{message}</p>
            </div>

            <div className="flex flex-col gap-2">
              <button 
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`w-full py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all active:scale-95 shadow-xl ${
                  variant === "danger" 
                    ? "bg-red-500 text-white shadow-red-500/20 hover:bg-red-600" 
                    : "bg-black text-white shadow-black/10 hover:bg-stone-900"
                }`}
              >
                {confirmText}
              </button>
              <button 
                onClick={onClose}
                className="w-full py-4 font-black text-[11px] uppercase tracking-widest text-stone-400 hover:text-black transition-colors"
              >
                {cancelText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
