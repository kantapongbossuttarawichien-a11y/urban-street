"use client";

import React from "react";
import { LogOut, Settings, BarChart3 } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

interface HeaderProps {
  dailyRevenue: number;
  isLoading?: boolean;
}

export function Header({ dailyRevenue, isLoading }: HeaderProps) {
  const { data: session } = useSession();

  return (
    <header className="p-6 border-b border-stone-50 flex justify-between items-center bg-white sticky top-0 z-30">
      <div>
        <h1 className="text-2xl font-black tracking-tighter text-black uppercase leading-none">
          Urban <span className="text-stone-400 font-medium">Street</span>
        </h1>
        <div className="text-[11px] text-stone-400 flex items-center gap-2 mt-1 font-bold uppercase tracking-widest">
          <span>ยอดขายวันนี้:</span>
          {isLoading ? (
            <div className="h-4 w-16 bg-stone-100 rounded-md animate-pulse" />
          ) : (
            <span className="text-black">฿ {dailyRevenue.toLocaleString()}</span>
          )}
        </div>
      </div>
      <div className="flex gap-4 items-center">
        {session?.user?.image && (
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-stone-100 shadow-sm">
            <Image 
              src={session.user.image} 
              alt={session.user.name || "User profile"} 
              fill
              className="object-cover"
            />
          </div>
        )}
        <nav className="flex items-center gap-1" aria-label="Main Navigation">
          <Link 
            href="/dashboard" 
            className="p-2.5 rounded-2xl hover:bg-stone-50 transition-colors text-stone-600 hover:text-black" 
            aria-label="View Analytics Dashboard"
            title="Dashboard"
          >
            <BarChart3 size={22} strokeWidth={1.5} />
          </Link>
          <Link 
            href="/menu" 
            className="p-2.5 rounded-2xl hover:bg-stone-50 transition-colors text-stone-600 hover:text-black" 
            aria-label="Manage Menu Items"
            title="Manage Menu"
          >
            <Settings size={22} strokeWidth={1.5} />
          </Link>
          <button 
            onClick={() => signOut()}
            className="p-2.5 rounded-2xl hover:bg-red-50 text-stone-400 hover:text-red-600 transition-colors ml-1"
            aria-label="Sign out of the application"
            title="ออกจากระบบ"
          >
            <LogOut size={20} strokeWidth={1.5} />
          </button>
        </nav>
      </div>
    </header>
  );
}
