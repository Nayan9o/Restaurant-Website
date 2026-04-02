import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export interface Order {
  id: string;
  userId: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    qty: number;
    image: string;
  }>;
  totalPrice: number;
  contact: {
    name: string;
    phone: string;
    address: string;
  };
  payment: string;
  status: "pending" | "preparing" | "ready" | "delivered" | "cancelled";
  cancellationReason?: string;
  createdAt: string;
}

export interface Reservation {
  id: string;
  userId: string;
  name: string;
  email?: string;
  phone: string;
  guests: number;
  date: string;
  startTime?: string;
  endTime?: string;
  time: string;
  notes: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  assignedTable?: number;
  createdAt: string;
}

interface TableRange {
  start: number;
  end: number;
}

interface OrderContextType {
  orders: Order[];
  reservations: Reservation[];
  addOrder: (order: Omit<Order, "id" | "createdAt">) => Order;
  addReservation: (reservation: Omit<Reservation, "id" | "createdAt" | "assignedTable">) => Reservation;
  updateOrderStatus: (orderId: string, status: Order["status"], cancellationReason?: string) => void;
  updateReservationStatus: (reservationId: string, status: Reservation["status"]) => void;
  assignTableToReservation: (reservationId: string, tableNumber: number) => void;
  getTableRangeForGuests: (guests: number) => TableRange;
  getAvailableTables: (date: string, startTime: string, endTime: string, guests: number) => number[];
  getUserOrders: (userId: string) => Order[];
  getUserReservations: (userId: string) => Reservation[];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const minutesToTime = (minutes: number) => {
  const safe = ((minutes % 1440) + 1440) % 1440;
  const hours = Math.floor(safe / 60);
  const mins = safe % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
};

const addMinutesToTime = (time: string, minutesToAdd: number) => {
  return minutesToTime(timeToMinutes(time) + minutesToAdd);
};

const intervalsOverlap = (
  startA: string,
  endA: string,
  startB: string,
  endB: string
) => {
  const aStart = timeToMinutes(startA);
  const aEnd = timeToMinutes(endA);
  const bStart = timeToMinutes(startB);
  const bEnd = timeToMinutes(endB);
  return aStart < bEnd && bStart < aEnd;
};

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const getTableRangeForGuests = useCallback((guests: number): TableRange => {
    const safeGuests = Number.isFinite(guests) && guests > 0 ? Math.floor(guests) : 1;

    // Requested rule base:
    // 1 guest => tables 1-5
    // 2 guests => tables 6-20
    // Continue in the same pattern (15-table blocks for each next guest count).
    if (safeGuests === 1) {
      return { start: 1, end: 5 };
    }

    const start = 6 + (safeGuests - 2) * 15;
    return { start, end: start + 14 };
  }, []);

  const getAvailableTables = useCallback(
    (date: string, startTime: string, endTime: string, guests: number) => {
      const range = getTableRangeForGuests(guests);
      const reservedTableSet = new Set(
        reservations
          .filter(
            (reservation) =>
              reservation.date === date &&
              reservation.status !== "cancelled" &&
              intervalsOverlap(
                reservation.startTime || reservation.time,
                reservation.endTime || addMinutesToTime(reservation.startTime || reservation.time, 60),
                startTime,
                endTime
              ) &&
              reservation.assignedTable !== undefined
          )
          .map((reservation) => reservation.assignedTable as number)
      );

      const available: number[] = [];
      for (let table = range.start; table <= range.end; table += 1) {
        if (!reservedTableSet.has(table)) {
          available.push(table);
        }
      }

      return available;
    },
    [getTableRangeForGuests, reservations]
  );

  // Load from localStorage on mount
  useEffect(() => {
    const savedOrders = localStorage.getItem("orders");
    const savedReservations = localStorage.getItem("reservations");
    
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
    if (savedReservations) {
      setReservations(JSON.parse(savedReservations));
    }
  }, []);

  // Save to localStorage whenever orders change
  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem("orders", JSON.stringify(orders));
    }
  }, [orders]);

  // Save to localStorage whenever reservations change
  useEffect(() => {
    if (reservations.length > 0) {
      localStorage.setItem("reservations", JSON.stringify(reservations));
    }
  }, [reservations]);

  const addOrder = useCallback((orderData: Omit<Order, "id" | "createdAt">) => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  }, []);

  const addReservation = useCallback(
    (reservationData: Omit<Reservation, "id" | "createdAt" | "assignedTable">) => {
      const normalizedStartTime = reservationData.startTime || reservationData.time;
      const normalizedEndTime = reservationData.endTime || addMinutesToTime(normalizedStartTime, 60);

      if (timeToMinutes(normalizedStartTime) >= timeToMinutes(normalizedEndTime)) {
        throw new Error("End time must be later than start time.");
      }

      const availableTables = getAvailableTables(
        reservationData.date,
        normalizedStartTime,
        normalizedEndTime,
        reservationData.guests
      );

      if (availableTables.length === 0) {
        throw new Error("No tables available for the selected date/time slot.");
      }

      const newReservation: Reservation = {
        ...reservationData,
        time: normalizedStartTime,
        startTime: normalizedStartTime,
        endTime: normalizedEndTime,
        id: `RES${Date.now()}`,
        createdAt: new Date().toISOString(),
        assignedTable: availableTables[0],
      };

      setReservations((prev) => [newReservation, ...prev]);
      window.dispatchEvent(new Event("reservationsUpdated"));
      return newReservation;
    },
    [getAvailableTables]
  );

  const updateOrderStatus = useCallback((orderId: string, status: Order["status"], cancellationReason?: string) => {
    setOrders((prev) =>
      prev.map((order) => 
        order.id === orderId 
          ? { ...order, status, ...(cancellationReason && { cancellationReason }) } 
          : order
      )
    );
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new Event('ordersUpdated'));
  }, []);

  const updateReservationStatus = useCallback((reservationId: string, status: Reservation["status"]) => {
    setReservations((prev) =>
      prev.map((reservation) =>
        reservation.id === reservationId ? { ...reservation, status } : reservation
      )
    );
    window.dispatchEvent(new Event('reservationsUpdated'));
  }, []);

  const assignTableToReservation = useCallback((reservationId: string, tableNumber: number) => {
    setReservations((prev) =>
      prev.map((reservation) =>
        reservation.id === reservationId ? { ...reservation, assignedTable: tableNumber } : reservation
      )
    );
    window.dispatchEvent(new Event('reservationsUpdated'));
  }, []);

  const getUserOrders = useCallback(
    (userId: string) => {
      return orders.filter((order) => order.userId === userId);
    },
    [orders]
  );

  const getUserReservations = useCallback(
    (userId: string) => {
      return reservations.filter((reservation) => reservation.userId === userId);
    },
    [reservations]
  );

  return (
    <OrderContext.Provider
      value={{
        orders,
        reservations,
        addOrder,
        addReservation,
        updateOrderStatus,
        updateReservationStatus,
        assignTableToReservation,
        getTableRangeForGuests,
        getAvailableTables,
        getUserOrders,
        getUserReservations,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within OrderProvider");
  }
  return context;
};
