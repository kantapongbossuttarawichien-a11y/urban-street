import { MenuItem, DailyStats, Transaction, SalesRecord, GASResponse } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_SHEETY_API_URL || "";

/**
 * Service for interacting with the Google Apps Script backend.
 */
export const sheetyApi = {
  /**
   * Fetches all menu items and sorts them by orderIndex.
   */
  async getMenus(): Promise<MenuItem[]> {
    if (!API_URL) return [];
    
    try {
      const url = `${API_URL}?action=get&sheet=menu`;
      const response = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Menus fetch failed:", errorData);
        return [];
      }
      
      const data: GASResponse<MenuItem> = await response.json();
      const menuList = data.menu;
      
      if (!menuList) return [];
      
      return (menuList || []).map((item: any, index: number) => {
        // Fallback: Use item.id if exists, otherwise try item.row or rowIndex, finally index
        const rawId = item.id !== undefined && item.id !== "" ? item.id : (item.row || item.rowIndex || index + 1);
        const safeId = isNaN(Number(rawId)) ? String(rawId) : Number(rawId);
        
        return {
          id: safeId,
          name: item.name || "Untitled",
          price: Number(item.price) || 0,
          color: item.color || "bg-stone-100",
          isActive: item.isActive === undefined ? true : (
            typeof item.isActive === 'boolean' ? item.isActive : String(item.isActive).toUpperCase() === "TRUE"
          ),
          orderIndex: Number(item.orderIndex) || (index + 1),
        };
      }).sort((a: MenuItem, b: MenuItem) => {
        if (a.orderIndex !== b.orderIndex) {
          return (a.orderIndex || 0) - (b.orderIndex || 0);
        }
        const idA = typeof a.id === 'number' ? a.id : 0;
        const idB = typeof b.id === 'number' ? b.id : 0;
        return idA - idB;
      });
    } catch (error) {
      console.error("sheetyApi.getMenus error:", error);
      return [];
    }
  },

  /**
   * Records a new order. Currently sends individual requests for each item.
   */
  async createOrder(items: MenuItem[], total: number): Promise<any[]> {
    if (!API_URL) return [];
    const timestamp = new Date().toISOString();
    
    try {
      const promises = items.map(item => {
        const payload = {
          action: "add",
          sheet: "sales",
          payload: {
            timestamp: timestamp,
            items: item.name,
            total: item.price,
            status: "completed"
          }
        };

        return fetch("/api/proxy", {
          method: "POST",
          body: JSON.stringify({
            url: API_URL,
            method: "POST",
            body: payload
          }),
        }).then(res => {
          if (!res.ok) throw new Error(`Failed to create order item: ${item.name}`);
          return res.json();
        });
      });

      return await Promise.all(promises);
    } catch (error) {
      console.error("sheetyApi.createOrder error:", error);
      throw error; // Re-throw to allow component level handling
    }
  },

  /**
   * Fetches daily sales statistics.
   */
  async getDailyStats(): Promise<DailyStats> {
    if (!API_URL) return { total: 0, count: 0 };

    try {
      const url = `${API_URL}?action=get&sheet=sales`;
      const response = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Sales stats fetch failed:", errorData);
        return { total: 0, count: 0 };
      }
      
      const data: GASResponse<SalesRecord> = await response.json();
      if (!data.sales) return { total: 0, count: 0 };

      const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' });
      const todaySales = data.sales.filter((s: SalesRecord) => {
        if (!s.timestamp) return false;
        const saleDate = new Date(s.timestamp).toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' });
        return saleDate === today && s.status !== "voided";
      });

      return {
        total: todaySales.reduce((acc: number, s: SalesRecord) => acc + (Number(s.total) || 0), 0),
        count: todaySales.length
      };
    } catch (error) {
      console.error("sheetyApi.getDailyStats error:", error);
      return { total: 0, count: 0 };
    }
  },

  /**
   * Fetches today's sales transactions.
   */
  async getTodaySales(): Promise<SalesRecord[]> {
    if (!API_URL) return [];

    try {
      const url = `${API_URL}?action=get&sheet=sales`;
      const response = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Today sales fetch failed:", errorData);
        return [];
      }
      
      const data: GASResponse<SalesRecord> = await response.json();
      if (!data.sales) return [];

      const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' });
      return data.sales
        .filter((s: SalesRecord) => {
          if (!s.timestamp) return false;
          const saleDate = new Date(s.timestamp).toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' });
          return saleDate === today;
        })
        .sort((a: SalesRecord, b: SalesRecord) => b.id - a.id);
    } catch (error) {
      console.error("sheetyApi.getTodaySales error:", error);
      return [];
    }
  },

  /**
   * Fetches all sales records.
   */
  async getAllSales(): Promise<SalesRecord[]> {
    if (!API_URL) return [];

    try {
      const url = `${API_URL}?action=get&sheet=sales`;
      const response = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("All sales fetch failed:", errorData);
        return [];
      }
      
      const data: GASResponse<SalesRecord> = await response.json();
      if (!data.sales) return [];

      return data.sales.sort((a: SalesRecord, b: SalesRecord) => b.id - a.id);
    } catch (error) {
      console.error("sheetyApi.getAllSales error:", error);
      return [];
    }
  },

  /**
   * Marks an order as voided.
   */
  async voidOrder(id: number | string): Promise<any> {
    if (!API_URL) return null;

    try {
      const payload = {
        action: "update",
        sheet: "sales",
        id: id,
        payload: { status: "voided" }
      };

      const response = await fetch("/api/proxy", {
        method: "POST",
        body: JSON.stringify({
          url: API_URL,
          method: "POST",
          body: payload
        }),
      });
      
      if (!response.ok) throw new Error(`Failed to void order ${id}`);
      return await response.json();
    } catch (error) {
      console.error("sheetyApi.voidOrder error:", error);
      throw error;
    }
  },

  /**
   * Adds a new menu item.
   */
  async addMenuItem(item: Partial<MenuItem>): Promise<any> {
    if (!API_URL) return null;

    try {
      // Use a shorter unique ID (Unix timestamp in seconds)
      const newItem = {
        ...item,
        id: item.id || Math.floor(Date.now() / 1000)
      };

      const payload = {
        action: "add",
        sheet: "menu",
        payload: newItem
      };

      const response = await fetch("/api/proxy", {
        method: "POST",
        body: JSON.stringify({
          url: API_URL,
          method: "POST",
          body: payload
        }),
      });
      
      if (!response.ok) throw new Error("Failed to add menu item");
      return await response.json();
    } catch (error) {
      console.error("sheetyApi.addMenuItem error:", error);
      throw error;
    }
  },

  /**
   * Sanitizes an updates payload for GAS compatibility.
   * Google Sheets stores booleans as "TRUE"/"FALSE" strings, not JS booleans.
   */
  _sanitizeForGAS(updates: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};
    for (const [key, value] of Object.entries(updates)) {
      if (typeof value === "boolean") {
        sanitized[key] = value ? "TRUE" : "FALSE";
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  },

  /**
   * Updates an existing menu item.
   */
  async updateMenuItem(id: number | string, updates: Partial<MenuItem>): Promise<any> {
    if (!API_URL) return null;

    try {
      // GAS/Sheets requires boolean values as "TRUE"/"FALSE" strings
      const sanitizedUpdates = this._sanitizeForGAS(updates as Record<string, any>);

      const payload = {
        action: "update",
        sheet: "menu",
        id: id,
        payload: sanitizedUpdates
      };

      const response = await fetch("/api/proxy", {
        method: "POST",
        body: JSON.stringify({
          url: API_URL,
          method: "POST",
          body: payload
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Failed to update menu item ${id}: ${errorData.details || response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("sheetyApi.updateMenuItem error:", error);
      throw error;
    }
  },

  /**
   * Hard deletes a menu item by removing the row from Google Sheets via GAS.
   * Requires the GAS script to support action: "delete".
   */
  async deleteMenuItem(id: number | string): Promise<any> {
    if (!API_URL) return null;

    try {
      const payload = {
        action: "delete",
        sheet: "menu",
        id: id,
      };

      const response = await fetch("/api/proxy", {
        method: "POST",
        body: JSON.stringify({
          url: API_URL,
          method: "POST",
          body: payload,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Failed to delete menu item ${id}: ${errorData.details || response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("sheetyApi.deleteMenuItem error:", error);
      throw error;
    }
  }
};
