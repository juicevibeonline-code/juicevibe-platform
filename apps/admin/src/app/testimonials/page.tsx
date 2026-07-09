"use client";

import { useState } from "react";
import { Star, Check, X } from "lucide-react";
import { Table } from "@/components/table";

const initialTestimonials = [
  { id: "1", name: "Priya Sharma", rating: 5, text: "The fresh juices here are absolutely incredible!", status: "approved", date: "Jan 15, 2024" },
  { id: "2", name: "Rahul Verma", rating: 5, text: "As a food blogger, I've been to countless cafes...", status: "approved", date: "Feb 3, 2024" },
  { id: "3", name: "New Customer", rating: 4, text: "Great ambiance and delicious drinks!", status: "pending", date: "Mar 12, 2024" },
  { id: "4", name: "Walk-in Guest", rating: 5, text: "Best milkshakes in town!", status: "pending", date: "Mar 14, 2024" },
];

const columns = [
  { key: "name", label: "Name" },
  {
    key: "rating",
    label: "Rating",
    render: (item: any) => (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className={`w-3.5 h-3.5 ${i < item.rating ? "text-yellow fill-yellow" : "text-gray-200"}`} />
        ))}
      </div>
    ),
  },
  { key: "text", label: "Review" },
  {
    key: "status",
    label: "Status",
    render: (item: any) => (
      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
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
            <button className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors"><Check className="w-4 h-4" /></button>
            <button className="p-1.5 rounded-lg hover:bg-pink/10 text-pink transition-colors"><X className="w-4 h-4" /></button>
          </>
        )}
      </div>
    ),
  },
];

export default function TestimonialsPage() {
  const [testimonials] = useState(initialTestimonials);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-2 animate-fade-in pb-12">
      <div className="relative p-8 rounded-[2rem] glass-panel overflow-hidden mb-8">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-orange/20 rounded-full blur-[80px]" />
        <div className="relative z-10">
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">Testimonials</h1>
          <p className="text-gray-500 font-medium mt-2">Manage customer reviews and feedback</p>
        </div>
      </div>
      <div className="px-2">
        <Table columns={columns} data={testimonials} searchable />
      </div>
    </div>
  );
}
