"use client";

import React from "react";
import { LogOut, Settings, BarChart3 } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

interface HeaderProps {
  dailyRevenue: number;
}

export function Header({ dailyRevenue }: HeaderProps) {
  const { data: session } = useSession();

  return (
    <header className="p-6 border-b border-surface flex justify-between items-center bg-white sticky top-0 z-10">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-black">
          Coffee <span className="text-stone-400 font-medium">Tracker</span>
        </h1>
        <p className="text-sm text-stone-500">
          ยอดขายวันนี้: <span className="font-bold text-black">฿ {dailyRevenue.toLocaleString()}</span>
        </p>
      </div>
      <div className="flex gap-3 items-center">
        {session?.user?.image && (
          <img 
            src={session.user.image} 
            alt={session.user.name || "User"} 
            className="w-8 h-8 rounded-full border border-surface"
          />
        )}
        <div className="flex gap-1">
          <button className="p-2 rounded-full hover:bg-surface transition-colors">
            <BarChart3 size={20} />
          </button>
          <button className="p-2 rounded-full hover:bg-surface transition-colors">
            <Settings size={20} />
          </button>
          <button 
            onClick={() => signOut()}
            className="p-2 rounded-full hover:bg-red-50 hover:text-red-600 transition-colors"
            title="ออกจากระบบ"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
