"use client";

const orders = [
  { id: "#JV-001", customer: "Priya Sharma", items: 3, total: "LKR 1,200", status: "completed", time: "2 min ago" },
  { id: "#JV-002", customer: "Rahul Verma", items: 2, total: "LKR 850", status: "preparing", time: "15 min ago" },
  { id: "#JV-003", customer: "Ananya Patel", items: 1, total: "LKR 350", status: "pending", time: "28 min ago" },
  { id: "#JV-004", customer: "Arjun Nair", items: 4, total: "LKR 2,100", status: "ready", time: "45 min ago" },
  { id: "#JV-005", customer: "Neha Gupta", items: 2, total: "LKR 950", status: "completed", time: "1 hr ago" },
];

const statusColors: Record<string, string> = {
  completed: "bg-primary/10 text-primary",
  preparing: "bg-orange/10 text-orange",
  pending: "bg-yellow/10 text-yellow",
  ready: "bg-blue-100 text-blue-600",
  cancelled: "bg-pink/10 text-pink",
};

export function RecentOrders() {
  return (
    <div className="bg-white rounded-xl border border-border p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
      <div className="space-y-3">
        {orders.map((order) => (
          <div key={order.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-sm font-bold text-gray-600">{order.customer[0]}</span>
              </div>
              <div>
                <p className="text-sm font-medium">{order.customer}</p>
                <p className="text-xs text-muted">{order.id} · {order.items} items · {order.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold">{order.total}</span>
              <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${statusColors[order.status]}`}>
                {order.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
