'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Coffee, BarChart3, Settings } from 'lucide-react';

const tabs = [
  { href: '/', label: 'ขายสินค้า', icon: Coffee },
  { href: '/dashboard', label: 'รายงาน', icon: BarChart3 },
  { href: '/menu', label: 'จัดการเมนู', icon: Settings },
];

export function AppNavigation() {
  const pathname = usePathname();
  if (!tabs.some(tab => tab.href === pathname)) return null;
  return (
    <nav className="app-navigation" aria-label="เมนูหลัก">
      {tabs.map(({ href, label, icon: Icon }) => (
        <Link key={href} href={href} aria-current={pathname === href ? 'page' : undefined}
          className="app-tab">
          <span className="app-tab-icon"><Icon size={23} strokeWidth={pathname === href ? 2.3 : 1.7} /></span>
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}
