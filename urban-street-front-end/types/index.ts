export interface MenuItem {
  id: number | string;
  name: string;
  price: number;
  category?: string;
  color?: string;
  isActive: boolean;
}

export interface Order {
  id: string;
  createdAt: string;
  total: number;
  status: 'completed' | 'voided';
}

export interface OrderItem {
  id: string;
  orderId: string;
  menuId: string | number;
  qty: number;
  price: number;
}
