import { MenuItem, DailyStats, SalesRecord, GASResponse } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_SHEETY_API_URL || "";

/**
 * Service for interacting with the Google Apps Script backend.
 */
export const sheetyApi = {
  /**
   * Internal helper to handle proxy GET and POST requests cleanly.
   */
  async _fetchProxy<T>(params: {
    targetUrl?: string;
    method?: "GET" | "POST";
    body?: unknown;
  }): Promise<T | null> {
    if (!API_URL) {
      console.warn("SHEETY_API_URL environment variable is not configured.");
      return null;
    }

    const method = params.method || (params.body ? "POST" : "GET");

    if (method === "POST") {
      const response = await fetch("/api/proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: params.targetUrl || API_URL,
          method: "POST",
          body: params.body,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.details || errorData.error || response.statusText);
      }

      return (await response.json()) as T;
    } else {
      const targetUrl = params.targetUrl || API_URL;
      const response = await fetch(`/api/proxy?url=${encodeURIComponent(targetUrl)}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.details || errorData.error || response.statusText);
      }

      return (await response.json()) as T;
    }
  },

  /**
   * Fetches all menu items and sorts them by orderIndex.
   */
  async getMenus(): Promise<MenuItem[]> {
    try {
      const url = `${API_URL}?action=get&sheet=menu`;
      const data = await this._fetchProxy<GASResponse<MenuItem>>({ targetUrl: url, method: "GET" });
      
      const menuList = data?.menu;
      if (!menuList) return [];

      return (menuList as unknown as Record<string, unknown>[]).map((item, index) => {
        const rawId = item.id !== undefined && item.id !== "" ? item.id : (item.row || item.rowIndex || index + 1);
        const safeId = String(rawId);

        const parsedOrderIdx = Number(item.orderIndex);
        const orderIdx = item.orderIndex !== undefined && item.orderIndex !== "" && !isNaN(parsedOrderIdx)
          ? parsedOrderIdx
          : (index + 1);

        return {
          id: safeId,
          name: String(item.name || "Untitled"),
          price: Math.max(0, Number(item.price) || 0),
          color: String(item.color || "bg-stone-100"),
          isActive: item.isActive === undefined ? true : (
            typeof item.isActive === 'boolean' ? item.isActive : String(item.isActive).toUpperCase() === "TRUE"
          ),
          orderIndex: orderIdx,
        } as MenuItem;
      }).sort((a: MenuItem, b: MenuItem) => {
        if (a.orderIndex !== b.orderIndex) {
          return (a.orderIndex || 0) - (b.orderIndex || 0);
        }
        return String(a.id).localeCompare(String(b.id));
      });
    } catch (error) {
      console.error("sheetyApi.getMenus error:", error);
      return [];
    }
  },

  /**
   * Records a new order by sending items to the sales sheet.
   */
  async createOrder(items: MenuItem[]): Promise<unknown[]> {
    if (!API_URL || !items || items.length === 0) return [];
    const timestamp = new Date().toISOString();

    try {
      const results: unknown[] = [];
      for (const item of items) {
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

        const res = await this._fetchProxy({ method: "POST", body: payload });
        results.push(res);
      }

      return results;
    } catch (error) {
      console.error("sheetyApi.createOrder error:", error);
      throw error;
    }
  },

  /**
   * Fetches daily sales statistics.
   */
  async getDailyStats(): Promise<DailyStats> {
    try {
      const url = `${API_URL}?action=get&sheet=sales`;
      const data = await this._fetchProxy<GASResponse<SalesRecord>>({ targetUrl: url, method: "GET" });
      if (!data?.sales) return { total: 0, count: 0 };

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
    try {
      const url = `${API_URL}?action=get&sheet=sales`;
      const data = await this._fetchProxy<GASResponse<SalesRecord>>({ targetUrl: url, method: "GET" });
      if (!data?.sales) return [];

      const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' });
      return data.sales
        .filter((s: SalesRecord) => {
          if (!s.timestamp) return false;
          const saleDate = new Date(s.timestamp).toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' });
          return saleDate === today;
        })
        .sort((a: SalesRecord, b: SalesRecord) => String(b.id).localeCompare(String(a.id)));
    } catch (error) {
      console.error("sheetyApi.getTodaySales error:", error);
      return [];
    }
  },

  /**
   * Fetches all sales records.
   */
  async getAllSales(): Promise<SalesRecord[]> {
    try {
      const url = `${API_URL}?action=get&sheet=sales`;
      const data = await this._fetchProxy<GASResponse<SalesRecord>>({ targetUrl: url, method: "GET" });
      if (!data?.sales) return [];

      return data.sales.sort((a: SalesRecord, b: SalesRecord) => String(b.id).localeCompare(String(a.id)));
    } catch (error) {
      console.error("sheetyApi.getAllSales error:", error);
      return [];
    }
  },

  /**
   * Marks an order as voided.
   */
  async voidOrder(id: number | string): Promise<unknown> {
    try {
      const payload = {
        action: "update",
        sheet: "sales",
        id: id,
        payload: { status: "voided" }
      };

      return await this._fetchProxy({ method: "POST", body: payload });
    } catch (error) {
      console.error("sheetyApi.voidOrder error:", error);
      throw error;
    }
  },

  /**
   * Adds a new menu item.
   */
  async addMenuItem(item: Partial<MenuItem>): Promise<unknown> {
    try {
      const newItem = {
        ...item,
        id: item.id || Math.floor(Date.now() / 1000)
      };

      const payload = {
        action: "add",
        sheet: "menu",
        payload: newItem
      };

      return await this._fetchProxy({ method: "POST", body: payload });
    } catch (error) {
      console.error("sheetyApi.addMenuItem error:", error);
      throw error;
    }
  },

  /**
   * Sanitizes an updates payload for GAS compatibility.
   * Google Sheets stores booleans as "TRUE"/"FALSE" strings.
   */
  _sanitizeForGAS(updates: Record<string, unknown>): Record<string, unknown> {
    const sanitized: Record<string, unknown> = {};
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
  async updateMenuItem(id: number | string, updates: Partial<MenuItem>): Promise<unknown> {
    try {
      const sanitizedUpdates = this._sanitizeForGAS(updates as Record<string, unknown>);
      const payload = {
        action: "update",
        sheet: "menu",
        id: id,
        payload: sanitizedUpdates
      };

      return await this._fetchProxy({ method: "POST", body: payload });
    } catch (error) {
      console.error("sheetyApi.updateMenuItem error:", error);
      throw error;
    }
  },

  /**
   * Hard deletes a menu item by removing the row from Google Sheets.
   */
  async deleteMenuItem(id: number | string): Promise<unknown> {
    try {
      const payload = {
        action: "delete",
        sheet: "menu",
        id: id,
      };

      return await this._fetchProxy({ method: "POST", body: payload });
    } catch (error) {
      console.error("sheetyApi.deleteMenuItem error:", error);
      throw error;
    }
  }
};
