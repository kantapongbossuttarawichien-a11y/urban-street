"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { ModalPortal } from "@/components/common/ModalPortal";

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
    <ModalPortal isOpen={isOpen}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="app-modal-layer flex items-center justify-center"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close confirmation"
          className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
        />
          
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-white w-full max-w-sm max-h-full rounded-3xl sm:rounded-[3rem] p-6 sm:p-8 shadow-2xl relative z-10 overflow-hidden text-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-modal-title"
        >
            <div className="flex justify-center mb-5 sm:mb-6">
              <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center ${
                variant === "danger" ? "bg-red-50 text-red-500" : "bg-amber-50 text-amber-500"
              }`}>
                <AlertCircle size={28} strokeWidth={2.5} className="sm:hidden" />
                <AlertCircle size={32} strokeWidth={2.5} className="hidden sm:block" />
              </div>
            </div>

            <div className="space-y-2 mb-6 sm:mb-8">
              <h2 id="confirm-modal-title" className="text-xl sm:text-2xl font-black tracking-tight">{title}</h2>
              <p className="text-stone-400 font-bold text-sm leading-relaxed">{message}</p>
            </div>

            <div className="flex flex-col gap-2">
              <button 
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`w-full py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-[11px] uppercase tracking-wide sm:tracking-widest transition-all active:scale-95 shadow-xl ${
                  variant === "danger" 
                    ? "bg-red-500 text-white shadow-red-500/20 hover:bg-red-600" 
                    : "bg-black text-white shadow-black/10 hover:bg-stone-900"
                }`}
              >
                {confirmText}
              </button>
              <button 
                onClick={onClose}
                className="w-full py-3.5 sm:py-4 font-black text-[10px] sm:text-[11px] uppercase tracking-wide sm:tracking-widest text-stone-400 hover:text-black transition-colors"
              >
                {cancelText}
              </button>
            </div>
        </motion.div>
      </motion.div>
    </ModalPortal>
  );
}
