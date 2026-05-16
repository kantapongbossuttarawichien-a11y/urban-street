"use client";

import React from "react";
import { Transaction } from "@/types";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";

interface TransactionListProps {
  transactions: Transaction[];
  onVoid: (id: number) => Promise<void>;
  isLoading?: boolean;
  showDate?: boolean;
}

export function TransactionList({ transactions, onVoid, isLoading, showDate }: TransactionListProps) {
  return (
    <div className="bg-white rounded-[3rem] border border-stone-100 shadow-sm overflow-hidden">
      <div className="p-10 border-b border-stone-50 flex justify-between items-center bg-stone-50/30">
        <div>
          <h4 className="text-sm font-black uppercase tracking-[0.1em] text-black">รายการขายล่าสุด</h4>
          <p className="text-[10px] font-bold text-stone-300 uppercase tracking-tighter mt-1">ประวัติการขายในช่วงเวลาที่เลือก</p>
        </div>
        <div className="px-4 py-2 rounded-full bg-white border border-stone-100 text-[10px] font-black text-black uppercase tracking-widest shadow-sm">
          {transactions.length} รายการ
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-stone-50">
              <th className="px-10 py-6 text-[10px] font-black text-stone-300 uppercase tracking-widest">
                {showDate ? "วันที่/เวลา" : "เวลา"}
              </th>
              <th className="px-10 py-6 text-[10px] font-black text-stone-300 uppercase tracking-widest">รายการ</th>
              <th className="px-10 py-6 text-[10px] font-black text-stone-300 uppercase tracking-widest text-right">ราคา</th>
              <th className="px-10 py-6 text-[10px] font-black text-stone-300 uppercase tracking-widest text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-10 py-6"><div className="h-4 bg-stone-50 rounded-full w-16" /></td>
                  <td className="px-10 py-6"><div className="h-4 bg-stone-50 rounded-full w-32" /></td>
                  <td className="px-10 py-6"><div className="h-4 bg-stone-50 rounded-full w-12 ml-auto" /></td>
                  <td className="px-10 py-6 text-right"><div className="h-10 bg-stone-50 rounded-full w-10 ml-auto" /></td>
                </tr>
              ))
            ) : (
              transactions.map((tx, index) => (
                <tr key={tx.id ?? index} className={cn(
                  "group hover:bg-stone-50/50 transition-all",
                  tx.status === 'voided' && "opacity-40"
                )}>
                  <td className="px-10 py-6">
                    <div className="flex flex-col">
                      {showDate && (
                        <span className="text-[10px] font-black text-stone-300 uppercase tracking-widest mb-0.5">
                          {new Date(tx.timestamp).toLocaleDateString('th-TH', {
                            day: '2-digit',
                            month: '2-digit'
                          })}
                        </span>
                      )}
                      <span className="text-xs font-bold text-stone-400 tabular-nums">
                        {new Date(tx.timestamp).toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit',
                          hour12: false
                        })}
                      </span>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className={cn(
                      "text-xs font-black uppercase tracking-tight",
                      tx.status === 'voided' ? "line-through text-stone-300" : "text-black"
                    )}>
                      {tx.items}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <span className="text-xs font-black text-black tabular-nums">฿{tx.total}</span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex justify-end items-center gap-2">
                      {tx.status !== 'voided' ? (
                        <button 
                          onClick={() => onVoid(tx.id)}
                          className="p-2.5 rounded-full bg-white border border-stone-100 text-stone-300 hover:text-red-500 hover:border-red-100 hover:shadow-md transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      ) : (
                        <span className="text-[10px] font-black text-red-400 uppercase tracking-widest bg-red-50 px-2 py-1 rounded-md">ยกเลิก</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
            
            {!isLoading && transactions.length === 0 && (
              <tr key="empty">
                <td colSpan={4} className="px-10 py-32 text-center">
                  <p className="text-[10px] font-black text-stone-200 uppercase tracking-[0.3em]">ไม่มีรายการขาย</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
