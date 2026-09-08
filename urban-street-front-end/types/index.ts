export interface MenuItem {
  id: number | string;
  name: string;
  price: number;
  category?: string;
  color?: string;
  isActive: boolean;
  orderIndex: number;
}

export interface SalesRecord {
  id: number | string;
  timestamp: string;
  items: string;
  total: number;
  status: "completed" | "voided";
}

export type Transaction = SalesRecord;
export type Order = SalesRecord;

export interface OrderItem {
  id: string;
  orderId: string;
  menuId: string | number;
  qty: number;
  price: number;
}

export interface DailyStats {
  total: number;
  count: number;
}

export interface GASResponse<T> {
  menu?: T[];
  sales?: T[];
  data?: T[];
  error?: string;
  details?: string;
}

export interface OfflineOrder {
  items: MenuItem[];
  total: number;
}

