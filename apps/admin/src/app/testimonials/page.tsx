"use client";

import { useState } from "react";
import { Star, Check, X } from "lucide-react";
import { Table } from "@/components/table";
import { PageHeader } from "@/components/PageHeader";

const initialTestimonials = [
  { id: "1", name: "Priya Sharma", rating: 5, text: "The fresh juices here are absolutely incredible!", status: "approved", date: "Jan 15, 2024" },
  { id: "2", name: "Rahul Verma", rating: 5, text: "As a food blogger, I've been to countless cafes...", status: "approved", date: "Feb 3, 2024" },
  { id: "3", name: "New Customer", rating: 4, text: "Great ambiance and delicious drinks!", status: "pending", date: "Mar 12, 2024" },
  { id: "4", name: "Walk-in Guest", rating: 5, text: "Best milkshakes in town!", status: "pending", date: "Mar 14, 2024" },
];

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [activeTab, setActiveTab] = useState("all");

  const handleApprove = (id: string) => {
    setTestimonials((prev) => 
      prev.map((t) => (t.id === id ? { ...t, status: "approved" } : t))
    );
  };

  const handleReject = (id: string) => {
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
  };

  const columns = [
    { key: "name", label: "Name" },
    {
      key: "rating",
      label: "Rating",
      render: (item: any) => (
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`w-3.5 h-3.5 ${i < item.rating ? "text-yellow fill-yellow" : "text-gray-200 dark:text-neutral-700"}`} />
          ))}
        </div>
      ),
    },
    { key: "text", label: "Review" },
    {
      key: "status",
      label: "Status",
      render: (item: any) => (
        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
          item.status === "approved" ? "bg-primary/10 text-primary" : "bg-yellow/10 text-yellow"
        }`}>
          {item.status === "approved" ? <Check className="w-3 h-3" /> : null}
          {item.status}
        </span>
      ),
    },
    { key: "date", label: "Date" },
    {
      key: "actions",
      label: "Actions",
      render: (item: any) => (
        <div className="flex items-center gap-2">
          {item.status === "pending" && (
            <>
              <button 
                onClick={() => handleApprove(item.id)}
                className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors cursor-pointer"
                title="Approve"
              >
                <Check className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleReject(item.id)}
                className="p-1.5 rounded-lg hover:bg-pink/10 text-pink transition-colors cursor-pointer"
                title="Reject"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          )}
          {item.status === "approved" && (
            <button 
              onClick={() => handleReject(item.id)}
              className="p-1.5 rounded-lg hover:bg-pink/10 text-pink transition-colors cursor-pointer"
              title="Delete"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  const pendingCount = testimonials.filter((t) => t.status === "pending").length;
  const approvedCount = testimonials.filter((t) => t.status === "approved").length;

  const filtered = testimonials.filter((t) => {
    if (activeTab === "pending") return t.status === "pending";
    if (activeTab === "approved") return t.status === "approved";
    return true;
  });

  const tabs = [
    { id: "all", label: "All Reviews", count: testimonials.length },
    { id: "pending", label: "Pending", count: pendingCount },
    { id: "approved", label: "Approved", count: approvedCount },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-2 animate-fade-in pb-12">
      <PageHeader
        title="Testimonials"
        subtitle={`Manage customer reviews — ${pendingCount} pending approval`}
        accentColor="orange"
      />

      {/* Tabs list with count badges */}
      <div className="flex gap-2 flex-wrap px-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 cursor-pointer ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-[0_4px_15px_rgba(34,197,94,0.3)]"
                : "bg-white/60 dark:bg-white/5 text-muted hover:bg-white dark:hover:bg-white/10 hover:text-foreground border border-transparent dark:border-white/10 shadow-sm"
            }`}
          >
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-black ${
              activeTab === tab.id ? "bg-white/20" : "bg-gray-100 dark:bg-white/10 text-muted-foreground"
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <div className="px-2">
        <Table columns={columns} data={filtered} searchable />
      </div>
    </div>
  );
}
