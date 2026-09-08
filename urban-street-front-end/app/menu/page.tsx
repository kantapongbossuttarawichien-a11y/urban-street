"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Plus, Trash2, Power, GripVertical } from "lucide-react";
import { MenuItem } from "@/types";
import { sheetyApi } from "@/lib/api";
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
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AddMenuModal } from "@/components/pos/AddMenuModal";
import { ConfirmModal } from "@/components/pos/ConfirmModal";
import { ToastNotification } from "@/components/common/ToastNotification";
import { useMenuOrderSync } from "@/hooks/useMenuOrderSync";
import { useDataCache } from "@/components/DataCacheProvider";
import { useNativeNavigation } from "@/components/NativeNavigationContext";

export default function MenuManagementPage() {
  const { activeTab } = useNativeNavigation();
  const {
    menus,
    isMenusInitialLoading: isLoading,
    refreshMenus,
    replaceMenus,
  } = useDataCache();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | string | null>(null);

  const { reorderMenus } = useMenuOrderSync();

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

  const fetchMenus = useCallback(
    () => refreshMenus({ force: true }),
    [refreshMenus],
  );

  useEffect(() => {
    if (activeTab !== "menu") return;
    void refreshMenus();
  }, [activeTab, refreshMenus]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const reorderedMenus = reorderMenus(menus, active.id, over.id);
      if (reorderedMenus !== menus) {
        replaceMenus(reorderedMenus);
      }
    }
  };

  const toggleActive = async (item: MenuItem) => {
    try {
      replaceMenus(menus.map(m =>
        String(m.id) === String(item.id) ? { ...m, isActive: !m.isActive } : m
      ));

      await sheetyApi.updateMenuItem(item.id, { isActive: !item.isActive });
    } catch {
      showToast("error", "เกิดข้อผิดพลาด", "ไม่สามารถอัปเดตสถานะได้");
      fetchMenus();
    }
  };

  const handleDelete = (id: number | string) => {
    setItemToDelete(id);
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete === null) return;
    
    try {
      const id = itemToDelete;
      replaceMenus(menus.filter(m => String(m.id) !== String(id)));
      await sheetyApi.deleteMenuItem(id);
      
      showToast("success", "ลบสำเร็จ!", "MENU HAS BEEN REMOVED");
    } catch {
      showToast("error", "เกิดข้อผิดพลาด", "ไม่สามารถลบเมนูได้");
      fetchMenus();
    } finally {
      setItemToDelete(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8F9FA] pb-20">
      {/* Header */}
      <header className="p-4 sm:p-6 bg-white border-b border-stone-100 sticky top-0 z-20 flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-black tracking-tight">จัดการเมนู</h1>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-black text-white px-3.5 sm:px-5 py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 active:scale-95 transition-transform"
        >
          <Plus size={16} className="sm:hidden" />
          <Plus size={18} className="hidden sm:block" />
          เพิ่มเมนู
        </button>
      </header>

      <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-3 sm:space-y-4">
        {isLoading && menus.length === 0 ? (
          <div className="grid gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white p-4 sm:p-5 rounded-3xl sm:rounded-[2rem] border border-stone-100 flex items-center justify-between animate-pulse">
                <div className="flex items-center gap-3 sm:gap-4 flex-1">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-stone-100 shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 sm:h-5 bg-stone-100 rounded-md w-28 sm:w-32" />
                    <div className="h-4 bg-stone-50 rounded-md w-16" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 bg-stone-50 rounded-xl sm:rounded-2xl" />
                  <div className="w-10 h-10 sm:w-11 sm:h-11 bg-stone-50 rounded-xl sm:rounded-2xl" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between ml-1">
              <p className="text-xs font-black text-stone-400 uppercase tracking-widest">
                รายการเมนูทั้งหมด ({menus.length})
              </p>
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={menus.map(m => m.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="grid gap-3">
                  {menus.map((item) => (
                    <SortableMenuListItem
                      key={item.id}
                      item={item}
                      onToggle={toggleActive}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </>
        )}
      </div>

      <AddMenuModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          fetchMenus();
          showToast("success", "เพิ่มเมนูสำเร็จ!", "MENU HAS BEEN ADDED");
        }}
        onError={(msg) => {
          showToast("error", "เกิดข้อผิดพลาด", msg || "PLEASE TRY AGAIN");
        }}
        maxOrderIndex={Math.max(0, ...menus.map(m => Number(m.orderIndex) || 0))}
      />

      <ConfirmModal
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={confirmDelete}
        title="ยืนยันการลบเมนู"
        message="คุณแน่ใจหรือไม่ที่จะลบเมนูนี้? ข้อมูลที่ลบแล้วไม่สามารถกู้คืนได้"
        confirmText="ลบรายการ"
        cancelText="ยกเลิก"
        variant="danger"
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

function SortableMenuListItem({ item, onToggle, onDelete }: {
  item: MenuItem,
  onToggle: (item: MenuItem) => void,
  onDelete: (id: number | string) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white p-4 sm:p-5 rounded-3xl sm:rounded-[2rem] border border-stone-100 shadow-sm flex items-center justify-between transition-all ${!item.isActive ? 'opacity-60 grayscale-[0.5]' : ''} ${isDragging ? 'shadow-2xl ring-2 ring-black/5 z-50' : ''}`}
    >
      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
        <div {...attributes} {...listeners} className="flex items-center gap-2 sm:gap-4 cursor-grab active:cursor-grabbing flex-1 touch-none min-w-0">
          <div className="p-1 text-stone-300 hover:text-stone-500 transition-colors">
            <GripVertical size={20} />
          </div>

          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl ${item.color} flex items-center justify-center shadow-inner shrink-0`}>
            <div className="w-2 h-2 rounded-full bg-white/50" />
          </div>
          <div className="min-w-0">
            <h3 className="font-black text-base sm:text-lg leading-tight truncate">{item.name}</h3>
            <p className="text-stone-400 font-bold text-xs sm:text-sm">฿ {item.price}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 relative z-10">
        <button
          onClick={() => onToggle(item)}
          className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-colors ${item.isActive ? 'bg-green-50 text-green-600' : 'bg-stone-100 text-stone-400'}`}
        >
          <Power size={18} className="sm:hidden" />
          <Power size={20} className="hidden sm:block" />
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="p-2.5 sm:p-3 bg-stone-50 text-stone-400 rounded-xl sm:rounded-2xl hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <Trash2 size={18} className="sm:hidden" />
          <Trash2 size={20} className="hidden sm:block" />
        </button>
      </div>
    </div>
  );
}
