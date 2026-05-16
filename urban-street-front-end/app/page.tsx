"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, WifiOff, CheckCircle2, AlertCircle } from "lucide-react";
import { Header } from "@/components/pos/Header";
import { CheckoutBar } from "@/components/pos/CheckoutBar";
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableMenuCard } from "@/components/pos/SortableMenuCard";
import { AddMenuModal } from "@/components/pos/AddMenuModal";
import { usePOS } from "@/hooks/usePOS";
import { cn } from "@/lib/utils";

export default function POSPage() {
  const {
    menus,
    cart,
    total,
    dailyRevenue,
    isLoading,
    pendingSyncCount,
    addToCart,
    removeFromCart,
    handleDragEnd,
    saveOrder,
    fetchMenus,
  } = usePOS();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<"success" | "error">("success");
  const [successMessage, setSuccessMessage] = useState({ th: "", en: "" });
  const [errorMessage, setErrorMessage] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over) {
      handleDragEnd(active.id, over.id);
    }
  };

  const onSaveOrder = async () => {
    const result = await saveOrder();
    if (result?.success) {
      setSuccessMessage({ th: "บันทึกสำเร็จ!", en: "ORDER HAS BEEN SAVED" });
      setNotificationType("success");
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      console.log(`Order saved: ฿${result.total}`);
    } else if (result?.offline) {
      setErrorMessage("เน็ตขัดข้อง! ระบบบันทึกข้อมูลลงเครื่องให้แล้ว");
      setNotificationType("error");
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  return (
    <main className="flex flex-col min-h-screen bg-background text-foreground font-sans selection:bg-stone-200">
      <Header dailyRevenue={dailyRevenue} isLoading={isLoading} />

      <section className="flex-1 p-6 pb-40">
        {pendingSyncCount > 0 && (
          <div className="mb-6 bg-amber-50 border border-amber-200 p-4 rounded-2xl flex justify-between items-center animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                <WifiOff size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-amber-800 flex items-center gap-2">
                  มี {pendingSyncCount} ออเดอร์ค้างในเครื่อง (ออฟไลน์)
                </p>
                <p className="text-[10px] font-medium text-amber-600 uppercase tracking-widest">
                  จะ Sync ทันทีที่เน็ตกลับมา
                </p>
              </div>
            </div>
          </div>
        )}

        {isLoading && menus.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-48 rounded-[3rem] bg-white border border-stone-100 p-6 animate-pulse flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="w-14 h-14 rounded-2xl bg-stone-50" />
                  <div className="w-16 h-8 rounded-xl bg-stone-50" />
                </div>
                <div className="space-y-2">
                  <div className="h-6 bg-stone-50 rounded-md w-24" />
                  <div className="h-4 bg-stone-50 rounded-md w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
          >
            <SortableContext 
              items={menus.map(m => m.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {menus
                  .filter(item => item.isActive !== false)
                  .map((item) => (
                    <SortableMenuCard key={item.id} item={item} onAdd={addToCart} />
                  ))
                }
                
                <button 
                  onClick={() => setShowAddModal(true)}
                  aria-label="Add new menu item"
                  className="flex flex-col items-center justify-center p-5 rounded-[2rem] h-48 border-2 border-dashed border-stone-200 text-stone-400 hover:border-stone-300 hover:text-stone-500 hover:bg-stone-50 active:scale-95 transition-all duration-200 group"
                >
                  <Plus size={40} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-bold mt-2 uppercase tracking-widest">Add Menu</span>
                </button>
              </div>
            </SortableContext>
          </DndContext>
        )}
      </section>

      <CheckoutBar 
        cart={cart}
        total={total} 
        onSave={onSaveOrder} 
        onRemoveItem={removeFromCart}
        isLoading={isLoading}
      />

      <AddMenuModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          fetchMenus();
          setSuccessMessage({ th: "เพิ่มเมนูสำเร็จ!", en: "MENU HAS BEEN ADDED" });
          setNotificationType("success");
          setShowNotification(true);
          setTimeout(() => setShowNotification(false), 3000);
        }}
        onError={(msg) => {
          setErrorMessage(msg);
          setNotificationType("error");
          setShowNotification(true);
          setTimeout(() => setShowNotification(false), 3000);
        }}
        currentMenuCount={menus.length}
        maxOrderIndex={Math.max(...menus.map(m => m.orderIndex || 0), 0)}
      />

      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={cn(
              "fixed top-10 left-1/2 -translate-x-1/2 z-[100] bg-black text-white px-16 py-6 rounded-[3rem] shadow-2xl flex items-center gap-6 border min-w-[340px] justify-center",
              notificationType === "success" ? "border-stone-800" : "border-red-900/50"
            )}
          >
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              notificationType === "success" ? "bg-[#e4ff00] text-black" : "bg-red-500 text-white"
            )}>
              {notificationType === "success" ? (
                <CheckCircle2 size={24} strokeWidth={3} />
              ) : (
                <AlertCircle size={24} strokeWidth={3} />
              )}
            </div>
            <div>
              <p className="font-black uppercase tracking-tight text-sm">
                {notificationType === "success" ? successMessage.th : "เกิดข้อผิดพลาด!"}
              </p>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                {notificationType === "success" ? successMessage.en : errorMessage || "Something went wrong"}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
