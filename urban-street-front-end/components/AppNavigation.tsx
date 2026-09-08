'use client';

import { Coffee, BarChart3, Settings } from 'lucide-react';

export type AppTab = 'pos' | 'dashboard' | 'menu';

const tabs = [
  { id: 'pos', label: 'ขายสินค้า', icon: Coffee },
  { id: 'dashboard', label: 'รายงาน', icon: BarChart3 },
  { id: 'menu', label: 'จัดการเมนู', icon: Settings },
] satisfies { id: AppTab; label: string; icon: typeof Coffee }[];

interface AppNavigationProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

export function AppNavigation({ activeTab, onTabChange }: AppNavigationProps) {
  return (
    <nav className="app-navigation" aria-label="เมนูหลัก">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          id={`${id}-tab`}
          type="button"
          aria-pressed={activeTab === id}
          className="app-tab"
          onClick={() => onTabChange(id)}
        >
          <span className="app-tab-icon"><Icon size={23} strokeWidth={activeTab === id ? 2.3 : 1.7} /></span>
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
