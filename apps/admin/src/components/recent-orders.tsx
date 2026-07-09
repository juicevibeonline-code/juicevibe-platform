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
    <div className="bg-transparent">
      <h3 className="text-xl font-bold mb-6 tracking-tight text-gray-800">Recent Orders</h3>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/40 hover:bg-white/80 border border-white/60 hover:shadow-md transition-all duration-300 group cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-inner">
                <span className="text-sm font-black text-gray-600">{order.customer[0]}</span>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800 group-hover:text-primary transition-colors">{order.customer}</p>
                <p className="text-xs font-medium text-gray-500 mt-0.5">{order.id} · {order.items} items · {order.time}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="text-sm font-black text-gray-800">{order.total}</span>
              <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md capitalize tracking-wider ${statusColors[order.status]}`}>
                {order.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
