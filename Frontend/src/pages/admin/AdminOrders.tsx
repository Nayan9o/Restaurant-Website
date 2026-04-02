import { useState, useEffect } from "react";
import { useOrders } from "@/context/OrderContext";
import type { Order } from "@/context/OrderContext";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const cancellationReasons = [
  "Customer requested cancellation",
  "Items out of stock",
  "Unable to deliver to location",
  "Payment issue",
  "Duplicate order",
  "Other reason",
];

const statusOptions = ["pending", "preparing", "ready", "delivered", "cancelled"] as const;

const statusColor: Record<string, string> = {
  pending: "bg-primary/20 text-primary",
  preparing: "bg-yellow-100 text-yellow-700",
  ready: "bg-green-100 text-green-700",
  delivered: "bg-green-200 text-green-800",
  cancelled: "bg-destructive/20 text-destructive",
};

const AdminOrders = () => {
  const { orders: allOrders, updateOrderStatus } = useOrders();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("all");
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [cancellationReason, setCancellationReason] = useState("");

  useEffect(() => {
    setOrders(allOrders);
  }, [allOrders]);

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const updateStatus = (id: string, status: Order["status"]) => {
    if (status === "cancelled") {
      setSelectedOrderId(id);
      setCancelDialogOpen(true);
    } else {
      updateOrderStatus(id, status);
      setOrders(allOrders);
    }
  };

  const handleCancelOrder = () => {
    if (!selectedOrderId || !cancellationReason) {
      toast.error("Please select a cancellation reason");
      return;
    }
    updateOrderStatus(selectedOrderId, "cancelled", cancellationReason);
    setOrders(allOrders);
    toast.success("Order cancelled successfully");
    setCancelDialogOpen(false);
    setSelectedOrderId(null);
    setCancellationReason("");
  };

  return (
    <div>
      <h1 className="font-display text-2xl md:text-3xl font-bold mb-6">Orders Management</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {["all", ...statusOptions].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`font-body text-xs font-medium px-3 py-1.5 rounded-full border transition-colors capitalize ${
              filter === s ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:border-primary"
            }`}
          >
            {s} {s !== "all" && `(${orders.filter((o) => o.status === s).length})`}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((order) => (
          <div key={order.id} className="bg-card border border-border rounded-xl p-4 md:p-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-body text-sm font-bold">{order.id}</h3>
                  <span className={`font-body text-xs px-2.5 py-1 rounded-full capitalize ${statusColor[order.status]}`}>{order.status}</span>
                </div>
                <p className="font-body text-xs text-muted-foreground">{order.contact.name} · {order.contact.phone}</p>
                <p className="font-body text-xs text-muted-foreground">{order.contact.address}</p>
                <p className="font-body text-xs text-muted-foreground mt-1">{new Date(order.createdAt).toLocaleString()} · {order.payment}</p>
              </div>
              <div className="text-right">
                <p className="font-body text-lg font-bold text-primary">₹{order.totalPrice.toFixed(0)}</p>
              </div>
            </div>

            <div className="border-t border-border pt-3 mb-3">
              <div className="flex flex-wrap gap-2">
                {order.items.map((item, i) => (
                  <span key={i} className="font-body text-xs bg-muted px-2.5 py-1 rounded-full">{item.name} ×{item.qty} (₹{(item.price * item.qty).toFixed(0)})</span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {statusOptions.map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(order.id, s)}
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
            
            {order.cancellationReason && (
              <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="font-body text-xs text-destructive">
                  <strong>Cancellation Reason:</strong> {order.cancellationReason}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Cancel Order Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">Cancel Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="font-body text-sm text-muted-foreground">
              Please select a reason for cancelling this order:
            </p>
            <div className="space-y-2">
              {cancellationReasons.map((reason) => (
                <label
                  key={reason}
                  className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                    cancellationReason === reason
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="cancellationReason"
                    value={reason}
                    checked={cancellationReason === reason}
                    onChange={(e) => setCancellationReason(e.target.value)}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="font-body text-sm">{reason}</span>
                </label>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCancelDialogOpen(false);
                setSelectedOrderId(null);
                setCancellationReason("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCancelOrder}
              disabled={!cancellationReason}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Confirm Cancellation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;
