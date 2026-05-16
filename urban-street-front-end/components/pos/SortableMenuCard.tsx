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
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-none">
      <MenuCard item={item} onAdd={onAdd} />
    </div>
  );
}
