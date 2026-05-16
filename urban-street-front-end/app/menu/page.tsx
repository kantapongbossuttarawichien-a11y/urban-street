"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, Plus, Save, Trash2, Power, Coffee, Tag, Palette, X, Check, GripVertical, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { MenuItem } from "@/types";
import { sheetyApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
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
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AddMenuModal } from "@/components/pos/AddMenuModal";
import { ConfirmModal } from "@/components/pos/ConfirmModal";

// Remove mock data - using empty array as initial state
const INITIAL_MENUS: MenuItem[] = [];

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

export default function MenuManagementPage() {
  const [menus, setMenus] = useState<MenuItem[]>(INITIAL_MENUS);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<"success" | "error">("success");
  const [successMessage, setSuccessMessage] = useState({ th: "", en: "" });
  const [errorMessage, setErrorMessage] = useState("");

  // Refs สำหรับจัดการคิวการ Sync ลำดับ (ป้องกันการทับซ้อนเมื่อลากไวๆ)
  const isSyncingOrder = React.useRef(false);
  const nextSyncItems = React.useRef<MenuItem[] | null>(null);

  // State สำหรับเมนูใหม่
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newColor, setNewColor] = useState("bg-stone-200");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 250, // กดค้าง 250ms เพื่อเริ่มลาก (ช่วยให้ใช้งานบนมือถือได้ดีขึ้น)
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setMenus((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);

        // Sync ตำแหน่งใหม่
        syncMenuOrder(newItems);

        return newItems;
      });
    }
  };

  const syncMenuOrder = async (newItems: MenuItem[]) => {
    // ถ้ากำลัง Sync อยู่ ให้เก็บค่าล่าสุดไว้ในคิว
    if (isSyncingOrder.current) {
      nextSyncItems.current = newItems;
      return;
    }

    isSyncingOrder.current = true;
    try {
      // อัปเดตทีละรายการแบบ Sequential
      for (let i = 0; i < newItems.length; i++) {
        const item = newItems[i];
        const targetOrder = i + 1;

        if (item.orderIndex !== targetOrder) {
          await sheetyApi.updateMenuItem(Number(item.id), { orderIndex: targetOrder });
          item.orderIndex = targetOrder;
        }
      }
      console.log("Sort order synced sequentially");
    } catch (e) {
      console.error("Order sync failed", e);
    } finally {
      isSyncingOrder.current = false;
      // ถ้ามีคิวค้างอยู่ ให้เอาคิวล่าสุดมาทำงานต่อ
      if (nextSyncItems.current) {
        const itemsToSync = nextSyncItems.current;
        nextSyncItems.current = null;
        syncMenuOrder(itemsToSync);
      }
    }
  };

  const fetchMenus = async () => {
    setIsLoading(true);
    try {
      const data = await sheetyApi.getMenus();
      // แสดงทุก item ในหน้า manage (ทั้งที่เปิดและปิด)
      setMenus(data);
      
      // Diagnosis: Check if items have valid IDs
      const missingIds = data.filter((m: MenuItem) => !m.id || isNaN(Number(m.id)));
      if (missingIds.length > 0) {
        console.warn("Some menu items are missing IDs. This will break delete/toggle functions.", missingIds);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const toggleActive = async (item: MenuItem) => {
    try {
      // อัปเดต UI ทันที (Optimistic Update)
      setMenus(prev => prev.map(m =>
        m.id === item.id ? { ...m, isActive: !m.isActive } : m
      ));

      await sheetyApi.updateMenuItem(item.id, { isActive: !item.isActive });
    } catch (err) {
      setErrorMessage("ไม่สามารถอัปเดตสถานะได้");
      setNotificationType("error");
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      fetchMenus(); // Rollback ถ้าพลาด
    }
  };

  const handleDelete = async (id: number | string) => {
    setItemToDelete(id);
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete === null) return;
    
    try {
      const id = itemToDelete;
      // Compare as strings to handle both number and string IDs from GAS
      setMenus(prev => prev.filter(m => String(m.id) !== String(id)));
      await sheetyApi.deleteMenuItem(id);
      
      setNotificationType("success");
      setSuccessMessage({ th: "ลบสำเร็จ!", en: "MENU HAS BEEN REMOVED" });
      setErrorMessage(""); 
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } catch (err) {
      setErrorMessage("ไม่สามารถลบเมนูได้");
      setNotificationType("error");
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      fetchMenus();
    } finally {
      setItemToDelete(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8F9FA] pb-20">
      {/* Header */}
      <header className="p-6 bg-white border-b border-stone-100 sticky top-0 z-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-stone-50 rounded-full transition-colors">
            <ChevronLeft size={24} />
          </Link>
          <h1 className="text-xl font-black tracking-tight">จัดการเมนู</h1>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-black text-white px-5 py-2.5 rounded-2xl text-sm font-bold flex items-center gap-2 active:scale-95 transition-transform"
        >
          <Plus size={18} />
          เพิ่มเมนู
        </button>
      </header>

      <div className="p-6 max-w-2xl mx-auto space-y-4">
        {isLoading && menus.length === 0 ? (
          <div className="grid gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white p-5 rounded-[2rem] border border-stone-100 flex items-center justify-between animate-pulse">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-2xl bg-stone-100 shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="h-5 bg-stone-100 rounded-md w-32" />
                    <div className="h-4 bg-stone-50 rounded-md w-16" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-11 h-11 bg-stone-50 rounded-2xl" />
                  <div className="w-11 h-11 bg-stone-50 rounded-2xl" />
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
          setNotificationType("success");
          setSuccessMessage({ th: "เพิ่มเมนูสำเร็จ!", en: "MENU HAS BEEN ADDED" });
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
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight">
                  {notificationType === "success" ? successMessage.th : "เกิดข้อผิดพลาด"}
                </span>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em]">
                  {notificationType === "success" ? successMessage.en : errorMessage || "PLEASE TRY AGAIN"}
                </span>
              </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

// ... rest of the file ...


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
      className={`bg-white p-5 rounded-[2rem] border border-stone-100 shadow-sm flex items-center justify-between transition-all ${!item.isActive ? 'opacity-60 grayscale-[0.5]' : ''} ${isDragging ? 'shadow-2xl ring-2 ring-black/5 z-50' : ''}`}
    >
      <div className="flex items-center gap-4 flex-1">
        {/* Drag Handle area */}
        <div {...attributes} {...listeners} className="flex items-center gap-4 cursor-grab active:cursor-grabbing flex-1 touch-none">
          <div className="p-1 text-stone-300 hover:text-stone-500 transition-colors">
            <GripVertical size={20} />
          </div>

          <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center shadow-inner shrink-0`}>
            <div className="w-2 h-2 rounded-full bg-white/50" />
          </div>
          <div>
            <h3 className="font-black text-lg leading-tight">{item.name}</h3>
            <p className="text-stone-400 font-bold text-sm">฿ {item.price}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 relative z-10">
        <button
          onClick={() => onToggle(item)}
          className={`p-3 rounded-2xl transition-colors ${item.isActive ? 'bg-green-50 text-green-600' : 'bg-stone-100 text-stone-400'}`}
        >
          <Power size={20} />
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="p-3 bg-stone-50 text-stone-400 rounded-2xl hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
}
