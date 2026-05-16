"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MenuCard } from "./MenuCard";
import { MenuItem } from "@/types";

interface Props {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
}

export function SortableMenuCard({ item, onAdd }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    // CSS.Translate ใช้เฉพาะ translate ไม่มี scale/skew — เบากว่า CSS.Transform
    transform: CSS.Translate.toString(transform),
    transition: isDragging ? "none" : transition,
    zIndex: isDragging ? 50 : 0,
    opacity: isDragging ? 0.6 : 1,
    willChange: isDragging ? "transform" : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="touch-none cursor-grab active:cursor-grabbing"
    >
      <MenuCard item={item} onAdd={onAdd} />
    </div>
  );
}
