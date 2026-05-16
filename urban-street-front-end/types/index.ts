export interface MenuItem {
  id: number | string;
  name: string;
  price: number;
  category?: string;
  color?: string;
  isActive: boolean;
  orderIndex: number;
}

export interface Order {
  id: string;
  createdAt: string;
  total: number;
  status: "completed" | "voided";
}

export interface OrderItem {
  id: string;
  orderId: string;
  menuId: string | number;
  qty: number;
  price: number;
}

export interface Transaction {
  id: number;
  timestamp: string;
  items: string;
  total: number;
  status: "completed" | "voided";
}

export interface DailyStats {
  total: number;
  count: number;
}

export interface GASResponse<T> {
  error?: string;
  details?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: T[] | any;
}

export interface SalesRecord {
  id: number;
  timestamp: string;
  items: string;
  total: number | string;
  status: "completed" | "voided";
}
