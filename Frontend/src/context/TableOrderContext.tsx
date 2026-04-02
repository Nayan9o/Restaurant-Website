import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export interface TableOrderItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  image: string;
}

export interface TableOrder {
  id: string;
  tableNumber: number;
  customerName: string;
  items: TableOrderItem[];
  totalPrice: number;
  notes: string;
  status: "active" | "preparing" | "served" | "completed" | "cancelled";
  createdAt: string;
}

interface TableOrderContextType {
  tableOrders: TableOrder[];
  addTableOrder: (order: Omit<TableOrder, "id" | "createdAt">) => TableOrder;
  updateTableOrderStatus: (orderId: string, status: TableOrder["status"]) => void;
  updateTableOrder: (orderId: string, data: Partial<Pick<TableOrder, "tableNumber" | "items" | "totalPrice" | "notes">>) => void;
  deleteTableOrder: (orderId: string) => void;
  getActiveTableOrders: () => TableOrder[];
}

const TableOrderContext = createContext<TableOrderContextType | undefined>(undefined);

export const TableOrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tableOrders, setTableOrders] = useState<TableOrder[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("tableOrders");
    if (saved) setTableOrders(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (tableOrders.length > 0) localStorage.setItem("tableOrders", JSON.stringify(tableOrders));
  }, [tableOrders]);

  const addTableOrder = useCallback((data: Omit<TableOrder, "id" | "createdAt">) => {
    const newOrder: TableOrder = {
      ...data,
      id: `TBL${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTableOrders((prev) => [newOrder, ...prev]);
    window.dispatchEvent(new Event("tableOrdersUpdated"));
    return newOrder;
  }, []);

  const updateTableOrderStatus = useCallback((orderId: string, status: TableOrder["status"]) => {
    setTableOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status } : order))
    );
    window.dispatchEvent(new Event("tableOrdersUpdated"));
  }, []);

  const updateTableOrder = useCallback((orderId: string, data: Partial<Pick<TableOrder, "tableNumber" | "items" | "totalPrice" | "notes">>) => {
    setTableOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, ...data } : order))
    );
    window.dispatchEvent(new Event("tableOrdersUpdated"));
  }, []);

  const deleteTableOrder = useCallback((orderId: string) => {
    setTableOrders((prev) => {
      const updated = prev.filter((order) => order.id !== orderId);
      localStorage.setItem("tableOrders", JSON.stringify(updated));
      return updated;
    });
    window.dispatchEvent(new Event("tableOrdersUpdated"));
  }, []);

  const getActiveTableOrders = useCallback(
    () => tableOrders.filter((o) => o.status !== "completed" && o.status !== "cancelled"),
    [tableOrders]
  );

  return (
    <TableOrderContext.Provider value={{ tableOrders, addTableOrder, updateTableOrderStatus, updateTableOrder, deleteTableOrder, getActiveTableOrders }}>
      {children}
    </TableOrderContext.Provider>
  );
};

export const useTableOrders = () => {
  const ctx = useContext(TableOrderContext);
  if (!ctx) throw new Error("useTableOrders must be used within TableOrderProvider");
  return ctx;
};
