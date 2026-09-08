"use client";

import React, { useState, useRef, useEffect } from "react";
import { Plus, WifiOff } from "lucide-react";
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
import { ToastNotification } from "@/components/common/ToastNotification";
import { useNativeNavigation } from "@/components/NativeNavigationContext";
import { usePOS } from "@/hooks/usePOS";

export default function POSPage() {
  const { selectTab } = useNativeNavigation();
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
  const [toast, setToast] = useState<{
    show: boolean;
    type: "success" | "error";
    title: string;
    subtitle: string;
  }>({
    show: false,
    type: "success",
    title: "",
    subtitle: "",
  });

  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (type: "success" | "error", title: string, subtitle: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ show: true, type, title, subtitle });
    toastTimerRef.current = setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

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
      showToast("success", "บันทึกสำเร็จ!", "ORDER HAS BEEN SAVED");
    } else if (result?.offline) {
      showToast("error", "เน็ตขัดข้อง!", "ระบบบันทึกข้อมูลลงเครื่องให้แล้ว");
    }
  };

  return (
    <main className="flex flex-col min-h-screen bg-background text-foreground font-sans selection:bg-stone-200">
      <Header dailyRevenue={dailyRevenue} isLoading={isLoading} onNavigate={selectTab} />

      <section className="flex-1 p-4 pb-56 sm:p-6 sm:pb-64">
        {pendingSyncCount > 0 && (
          <div className="mb-4 sm:mb-6 bg-amber-50 border border-amber-200 p-3 sm:p-4 rounded-2xl flex justify-between items-center animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                <WifiOff size={18} className="sm:hidden" />
                <WifiOff size={20} className="hidden sm:block" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-amber-800 flex items-center gap-2">
                  มี {pendingSyncCount} ออเดอร์ค้างในเครื่อง (ออฟไลน์)
                </p>
                <p className="text-[9px] sm:text-[10px] font-medium text-amber-600 uppercase tracking-wide sm:tracking-widest">
                  เปิดหน้าขายอีกครั้งเมื่อเน็ตกลับมาเพื่อส่งรายการ
                </p>
              </div>
            </div>
          </div>
        )}

        {isLoading && menus.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-40 sm:h-48 rounded-3xl sm:rounded-[3rem] bg-white border border-stone-100 p-4 sm:p-6 animate-pulse flex flex-col justify-between">
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6">
                {menus
                  .filter(item => item.isActive !== false)
                  .map((item) => (
                    <SortableMenuCard key={item.id} item={item} onAdd={addToCart} />
                  ))
                }
                
                <button 
                  onClick={() => setShowAddModal(true)}
                  aria-label="Add new menu item"
                  className="flex flex-col items-center justify-center p-4 sm:p-5 rounded-3xl sm:rounded-[2rem] h-40 sm:h-48 border-2 border-dashed border-stone-200 text-stone-400 hover:border-stone-300 hover:text-stone-500 hover:bg-stone-50 active:scale-95 transition-all duration-200 group"
                >
                  <Plus size={30} strokeWidth={1.5} className="sm:hidden group-hover:scale-110 transition-transform" />
                  <Plus size={40} strokeWidth={1.5} className="hidden sm:block group-hover:scale-110 transition-transform" />
                  <span className="text-xs sm:text-sm font-bold mt-2 uppercase tracking-wide sm:tracking-widest">Add Menu</span>
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
          showToast("success", "เพิ่มเมนูสำเร็จ!", "MENU HAS BEEN ADDED");
        }}
        onError={(msg) => {
          showToast("error", "เกิดข้อผิดพลาด!", msg || "Something went wrong");
        }}
        maxOrderIndex={Math.max(0, ...menus.map(m => Number(m.orderIndex) || 0))}
      />

      <ToastNotification 
        show={toast.show}
        type={toast.type}
        title={toast.title}
        subtitle={toast.subtitle}
      />
    </main>
  );
}
