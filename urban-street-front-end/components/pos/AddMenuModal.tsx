"use client";

import React, { useState } from "react";
import { Coffee, Tag, Palette, X, Check, Save } from "lucide-react";
import { sheetyApi } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

interface AddMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onError?: (message: string) => void;
  currentMenuCount: number;
  maxOrderIndex: number;
}

const COLOR_OPTIONS = [
  { name: "Cream", value: "bg-[#F8F5F2]" },
  { name: "Matcha", value: "bg-[#E7F0DC]" },
  { name: "Thai Tea", value: "bg-[#FFEDD5]" },
  { name: "Latte", value: "bg-[#F5E6D3]" },
  { name: "Cocoa", value: "bg-[#A68A7D] text-white" },
  { name: "Espresso", value: "bg-[#2D2424] text-white" },
  { name: "Berry", value: "bg-[#FDE2E4]" },
  { name: "Lemon", value: "bg-[#FEF9C3]" },
  { name: "Mint", value: "bg-[#D1FAE5]" },
  { name: "Sky", value: "bg-[#E0F2FE]" },
  { name: "Lavender", value: "bg-[#EDE9FE]" },
  { name: "Honey", value: "bg-[#FEF3C7]" },
  { name: "Rose", value: "bg-[#FFE4E6]" },
  { name: "Charcoal", value: "bg-[#4B5563] text-white" },
  { name: "Midnight", value: "bg-[#111827] text-white" },
];

export function AddMenuModal({ isOpen, onClose, onSuccess, onError, maxOrderIndex }: AddMenuModalProps) {
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newColor, setNewColor] = useState("bg-[#F8F5F2]");
  const [isLoading, setIsLoading] = useState(false);

  const handleAddMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPrice) return;

    setIsLoading(true);
    try {
      await sheetyApi.addMenuItem({
        name: newName,
        price: Number(newPrice),
        color: newColor,
        isActive: true,
        orderIndex: maxOrderIndex + 1
      });
      setNewName("");
      setNewPrice("");
      onSuccess();
      onClose();
    } catch (err) {
      if (onError) onError("ไม่สามารถเพิ่มเมนูได้");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
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
            className="bg-white w-full max-w-md rounded-[3rem] p-8 shadow-2xl relative z-10 overflow-hidden"
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-black tracking-tight">เพิ่มเมนูใหม่</h2>
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] mt-1">Create new item</p>
              </div>
              <button 
                onClick={onClose}
                aria-label="Close modal"
                className="p-3 bg-stone-50 rounded-2xl hover:bg-stone-100 transition-colors text-stone-400 hover:text-black"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddMenu} className="space-y-6">
              {/* Menu Name */}
              <div className="space-y-2">
                <label 
                  htmlFor="menu-name"
                  className="text-[10px] font-black text-black uppercase tracking-[0.2em] ml-1 flex items-center gap-2"
                >
                  <Coffee size={14} strokeWidth={2.5} />
                  ชื่อรายการ
                </label>
                <div className="relative group">
                  <input 
                    id="menu-name"
                    type="text" 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="เช่น Espresso, Latte"
                    className="w-full bg-stone-50 border-2 border-transparent rounded-2xl p-5 pl-14 text-sm font-bold outline-none focus:bg-white focus:border-black transition-all group-hover:bg-stone-100/50"
                    required
                    autoFocus
                  />
                  <Coffee className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-black transition-colors" size={20} />
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <label 
                  htmlFor="menu-price"
                  className="text-[10px] font-black text-black uppercase tracking-[0.2em] ml-1 flex items-center gap-2"
                >
                  <Tag size={14} strokeWidth={2.5} />
                  ราคาจำหน่าย
                </label>
                <div className="relative group">
                  <input 
                    id="menu-price"
                    type="number" 
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="55"
                    className="w-full bg-stone-50 border-2 border-transparent rounded-2xl p-5 pl-14 text-sm font-bold outline-none focus:bg-white focus:border-black transition-all group-hover:bg-stone-100/50"
                    required
                  />
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-300 font-black text-xl group-focus-within:text-black transition-colors">฿</span>
                </div>
              </div>

              {/* Color Selection */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-black uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                  <Palette size={14} strokeWidth={2.5} />
                  เลือกธีมสี
                </label>
                <div className="flex overflow-x-auto py-2 gap-3 no-scrollbar -mx-1 px-1">
                  {COLOR_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setNewColor(option.value)}
                      aria-label={`Select color ${option.name}`}
                      aria-pressed={newColor === option.value}
                      className={`w-12 h-12 rounded-2xl transition-all flex items-center justify-center shrink-0 border-2 ${
                        newColor === option.value 
                          ? 'border-black scale-110 shadow-lg ring-4 ring-black/5' 
                          : 'border-stone-50 scale-100 hover:scale-105 hover:border-stone-200'
                      } ${option.value.split(' ')[0]}`}
                      title={option.name}
                    >
                      {newColor === option.value && (
                        <Check size={20} strokeWidth={3} className={option.value.includes('text-white') ? 'text-white' : 'text-black'} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button 
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-5 font-black text-[11px] uppercase tracking-widest text-stone-400 hover:text-black transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="flex-[2] bg-black text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50 shadow-xl shadow-black/10 hover:bg-stone-900"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save size={18} strokeWidth={2.5} />
                      Save Item
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
