"use client";

import React, { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { MenuItem } from "@/types";
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
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableMenuCard } from "@/components/pos/SortableMenuCard";

const INITIAL_MENUS: MenuItem[] = [
  { id: 1, name: "Americano", price: 55, color: "bg-stone-200", isActive: true },
  { id: 2, name: "Latte", price: 65, color: "bg-stone-300", isActive: true },
  { id: 3, name: "Mocha", price: 70, color: "bg-stone-400", isActive: true },
  { id: 4, name: "Matcha Latte", price: 75, color: "bg-green-100", isActive: true },
  { id: 5, name: "Thai Tea", price: 50, color: "bg-orange-100", isActive: true },
  { id: 6, name: "Espresso", price: 45, color: "bg-stone-500 text-white", isActive: true },
];

export default function POSPage() {
  const [menus, setMenus] = useState<MenuItem[]>(INITIAL_MENUS);
  const [cart, setCart] = useState<MenuItem[]>([]);
  const [dailyRevenue] = useState(3420);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // ให้ลากไปนิดนึงก่อนถึงจะเริ่มทำงาน เพื่อไม่ให้ทับกับ Click ปกติ
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const total = useMemo(() => cart.reduce((acc, item) => acc + item.price, 0), [cart]);

  const addToCart = (item: MenuItem) => {
    setCart((prev) => [...prev, item]);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setMenus((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSaveOrder = () => {
    alert(`บันทึกออเดอร์ยอดรวม ฿${total} สำเร็จ!`);
    setCart([]);
  };

  return (
    <main className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      <Header dailyRevenue={dailyRevenue} />

      {/* Menu Grid with Drag & Drop */}
      <section className="flex-1 p-6 pb-40">
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={menus.map(m => m.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {menus.map((item) => (
                <SortableMenuCard key={item.id} item={item} onAdd={addToCart} />
              ))}
              
              {/* Add New Menu Placeholder */}
              <button className="flex flex-col items-center justify-center p-5 rounded-[2rem] h-48 border-2 border-dashed border-stone-200 text-stone-400 active:bg-stone-50 transition-colors">
                <Plus size={40} strokeWidth={1.5} />
                <span className="text-sm font-bold mt-2 uppercase tracking-widest">Add Menu</span>
              </button>
            </div>
          </SortableContext>
        </DndContext>
      </section>

      <CheckoutBar 
        total={total} 
        itemCount={cart.length} 
        onSave={handleSaveOrder} 
      />
    </main>
  );
}
