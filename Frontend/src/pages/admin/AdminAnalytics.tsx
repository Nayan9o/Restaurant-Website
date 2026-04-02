import { mockOrders, menuItems } from "@/data/menuData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// Revenue by day (in ₹)
const revenueData = [
  { day: "Mon", revenue: 12400 },
  { day: "Tue", revenue: 15100 },
  { day: "Wed", revenue: 13800 },
  { day: "Thu", revenue: 17500 },
  { day: "Fri", revenue: 21200 },
  { day: "Sat", revenue: 25100 },
  { day: "Sun", revenue: 23700 },
];

// Top dishes
const dishCounts: Record<string, number> = {};
mockOrders.forEach((o) => o.items.forEach((i) => { dishCounts[i.name] = (dishCounts[i.name] || 0) + i.qty; }));
const topDishes = Object.entries(dishCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, count]) => ({ name, count }));

const COLORS = ["hsl(36, 80%, 50%)", "hsl(30, 10%, 35%)", "hsl(36, 80%, 65%)", "hsl(30, 10%, 55%)", "hsl(36, 60%, 45%)"];

// Order status breakdown
const statusData = ["pending", "preparing", "ready", "delivered", "cancelled"].map((s) => ({
  name: s,
  value: mockOrders.filter((o) => o.status === s).length,
})).filter((d) => d.value > 0);

const AdminAnalytics = () => (
  <div>
    <h1 className="font-display text-2xl md:text-3xl font-bold mb-6">Analytics</h1>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Revenue Chart */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="font-display text-lg font-semibold mb-4">Weekly Revenue (₹)</h2>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(35, 15%, 85%)" />
            <XAxis dataKey="day" className="font-body text-xs" />
            <YAxis className="font-body text-xs" tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{ backgroundColor: "hsl(40, 33%, 97%)", border: "1px solid hsl(35, 15%, 85%)", borderRadius: "8px", fontFamily: "DM Sans" }}
              formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, "Revenue"]}
            />
            <Bar dataKey="revenue" fill="hsl(36, 80%, 50%)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Order Status Pie */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="font-display text-lg font-semibold mb-4">Order Status</h2>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie data={statusData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value" label={({ name, value }) => `${name} (${value})`}>
              {statusData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ fontFamily: "DM Sans", borderRadius: "8px" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* Top Dishes */}
    <div className="bg-card border border-border rounded-xl p-5">
      <h2 className="font-display text-lg font-semibold mb-4">Top Selling Dishes</h2>
      <div className="space-y-3">
        {topDishes.map((dish, i) => (
          <div key={dish.name} className="flex items-center gap-4">
            <span className="font-display text-lg font-bold text-primary w-8">#{i + 1}</span>
            <div className="flex-1">
              <div className="flex justify-between font-body text-sm mb-1">
                <span className="font-medium">{dish.name}</span>
                <span className="text-muted-foreground">{dish.count} sold</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(dish.count / topDishes[0].count) * 100}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default AdminAnalytics;
