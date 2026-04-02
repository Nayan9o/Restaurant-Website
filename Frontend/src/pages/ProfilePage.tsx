import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Package, CalendarDays } from "lucide-react";
import { mockOrders, mockReservations } from "@/data/menuData";

const ProfilePage = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  if (!isLoggedIn || !user) {
    navigate("/login");
    return null;
  }

  const userOrders = mockOrders.filter((o) => o.userId === user.id);
  const userReservations = mockReservations.filter((r) => r.userId === user.id);

  const statusColor: Record<string, string> = {
    pending: "bg-primary/20 text-primary",
    preparing: "bg-primary/30 text-primary",
    ready: "bg-green-100 text-green-700",
    delivered: "bg-green-200 text-green-800",
    cancelled: "bg-destructive/20 text-destructive",
    confirmed: "bg-primary/20 text-primary",
    completed: "bg-green-200 text-green-800",
  };

  return (
    <main className="pt-24 pb-20 min-h-screen bg-background">
      <div className="container max-w-3xl">
        {/* Profile Header */}
        <div className="bg-card border border-border rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 mb-8">
          <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full bg-muted" />
          <div className="text-center md:text-left flex-1">
            <h1 className="font-display text-2xl font-bold">{user.name}</h1>
            <p className="font-body text-muted-foreground text-sm">{user.email}</p>
            <span className="inline-block mt-2 font-body text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold capitalize">{user.role}</span>
          </div>
          <Button variant="outline" onClick={() => { logout(); navigate("/"); }} className="font-body gap-2">
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </div>

        {/* Past Orders */}
        <section className="mb-10">
          <h2 className="font-display text-xl font-bold flex items-center gap-2 mb-4"><Package className="w-5 h-5 text-primary" /> My Orders</h2>
          {userOrders.length === 0 ? (
            <p className="font-body text-muted-foreground text-sm">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {userOrders.map((order) => (
                <div key={order.id} className="bg-card border border-border rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <p className="font-body text-sm font-semibold">{order.id}</p>
                    <p className="font-body text-xs text-muted-foreground">{order.items.map((i) => `${i.name} ×${i.qty}`).join(", ")}</p>
                    <p className="font-body text-xs text-muted-foreground mt-1">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-body text-sm font-bold text-primary">₹{order.totalPrice}</span>
                    <span className={`font-body text-xs px-2.5 py-1 rounded-full capitalize ${statusColor[order.status]}`}>{order.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Past Reservations */}
        <section>
          <h2 className="font-display text-xl font-bold flex items-center gap-2 mb-4"><CalendarDays className="w-5 h-5 text-primary" /> My Reservations</h2>
          {userReservations.length === 0 ? (
            <p className="font-body text-muted-foreground text-sm">No reservations yet.</p>
          ) : (
            <div className="space-y-3">
              {userReservations.map((res) => (
                <div key={res.id} className="bg-card border border-border rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <p className="font-body text-sm font-semibold">{res.id} — {res.guests} guests</p>
                    <p className="font-body text-xs text-muted-foreground">{res.date} at {res.time}</p>
                    {res.notes && <p className="font-body text-xs text-muted-foreground italic">"{res.notes}"</p>}
                  </div>
                  <span className={`font-body text-xs px-2.5 py-1 rounded-full capitalize ${statusColor[res.status]}`}>{res.status}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default ProfilePage;
