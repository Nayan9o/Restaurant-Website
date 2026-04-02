import { mockUsers } from "@/data/menuData";

const AdminUsers = () => (
  <div>
    <h1 className="font-display text-2xl md:text-3xl font-bold mb-6">Users</h1>

    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {["Avatar", "Name", "Email", "Role", "Joined", "Last Login", "Orders"].map((h) => (
                <th key={h} className="text-left font-body text-xs font-semibold text-muted-foreground p-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mockUsers.map((user) => (
              <tr key={user.id} className="border-b border-border last:border-0">
                <td className="p-3"><img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full bg-muted" /></td>
                <td className="font-body text-sm p-3 font-medium">{user.name}</td>
                <td className="font-body text-xs p-3 text-muted-foreground">{user.email}</td>
                <td className="p-3">
                  <span className={`font-body text-xs px-2.5 py-1 rounded-full capitalize ${user.role === "admin" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>{user.role}</span>
                </td>
                <td className="font-body text-xs p-3 text-muted-foreground">{user.createdAt}</td>
                <td className="font-body text-xs p-3 text-muted-foreground">{user.lastLogin}</td>
                <td className="font-body text-sm p-3 font-semibold">{user.totalOrders}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default AdminUsers;
