import { useState, useEffect } from "react";
import { useTableOrders } from "@/context/TableOrderContext";
import type { TableOrder } from "@/context/TableOrderContext";
import { UtensilsCrossed } from "lucide-react";

const statusOptions = ["active", "preparing", "served", "completed", "cancelled"] as const;

const statusColor: Record<string, string> = {
  active: "bg-primary/20 text-primary",
  preparing: "bg-yellow-100 text-yellow-700",
  served: "bg-blue-100 text-blue-700",
  completed: "bg-green-200 text-green-800",
  cancelled: "bg-destructive/20 text-destructive",
};

const AdminTableOrders = () => {
  const { tableOrders: allOrders, updateTableOrderStatus } = useTableOrders();
  const [orders, setOrders] = useState<TableOrder[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    setOrders(allOrders);
  }, [allOrders]);

  useEffect(() => {
    const handleUpdate = () => setOrders(allOrders);
    window.addEventListener("tableOrdersUpdated", handleUpdate);
    return () => window.removeEventListener("tableOrdersUpdated", handleUpdate);
  }, [allOrders]);

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const activeCount = orders.filter((o) => o.status === "active" || o.status === "preparing").length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold flex items-center gap-3">
            <UtensilsCrossed className="w-7 h-7 text-primary" />
            Table Orders
          </h1>
          <p className="font-body text-sm text-muted-foreground mt-1">
            Manage dine-in table orders in real time — no waiter needed.
          </p>
        </div>
        {activeCount > 0 && (
          <div className="bg-primary/10 text-primary font-body text-sm font-semibold px-4 py-2 rounded-full">
            {activeCount} Active Order{activeCount > 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* Status filter pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["all", ...statusOptions].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`font-body text-xs font-medium px-3 py-1.5 rounded-full border transition-colors capitalize ${
              filter === s
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:border-primary"
            }`}
          >
            {s}
            {s !== "all" && ` (${orders.filter((o) => o.status === s).length})`}
          </button>
        ))}
      </div>

      {/* Orders */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <UtensilsCrossed className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-display text-xl font-bold mb-2">No Table Orders</h2>
          <p className="font-body text-muted-foreground text-sm">
            Table orders will appear here when customers order from their tables.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <div
              key={order.id}
              className="bg-card border border-border rounded-xl p-4 md:p-5"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="bg-secondary text-secondary-foreground font-body text-sm font-bold px-3 py-1 rounded-lg">
                      Table #{order.tableNumber}
                    </span>
                    <span className="font-body text-xs text-muted-foreground">{order.id}</span>
                    <span
                      className={`font-body text-xs px-2.5 py-1 rounded-full capitalize ${
                        statusColor[order.status]
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="font-body text-sm text-foreground font-medium">
                    {order.customerName}
                  </p>
                  <p className="font-body text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                  {order.notes && (
                    <p className="font-body text-xs text-muted-foreground mt-1 italic">
                      Notes: {order.notes}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-body text-lg font-bold text-primary">
                    ₹{order.totalPrice}
                  </p>
                  <p className="font-body text-xs text-muted-foreground">
                    {order.items.reduce((s, i) => s + i.qty, 0)} items
                  </p>
                </div>
              </div>

              {/* Items list */}
              <div className="border-t border-border pt-3 mb-3">
                <div className="flex flex-wrap gap-2">
                  {order.items.map((item, i) => (
                    <span
                      key={i}
                      className="font-body text-xs bg-muted px-2.5 py-1 rounded-full"
                    >
                      {item.name} ×{item.qty} (₹{item.price * item.qty})
                    </span>
                  ))}
                </div>
              </div>

              {/* Status buttons */}
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((s) => (
                  <button
                    key={s}
                    onClick={() => updateTableOrderStatus(order.id, s)}
                    disabled={order.status === s}
                    className={`font-body text-xs px-3 py-1.5 rounded-lg border transition-colors capitalize ${
                      order.status === s
                        ? "bg-primary/10 text-primary border-primary cursor-default"
                        : "bg-card text-muted-foreground border-border hover:border-primary hover:text-primary"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminTableOrders;
