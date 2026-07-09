"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, Eye, Calendar, Clock } from "lucide-react";
import { Table } from "@/components/table";

const initialPosts = [
  { id: "1", title: "5 Health Benefits of Fresh Juice", author: "Admin", category: "Health", status: "published", views: 234, comments: 12, date: "Jan 10, 2024" },
  { id: "2", title: "Behind the Scenes: Our New Menu", author: "Admin", category: "Behind the Scenes", status: "published", views: 189, comments: 8, date: "Jan 8, 2024" },
  { id: "3", title: "Top 10 Summer Drinks", author: "Admin", category: "Lifestyle", status: "draft", views: 0, comments: 0, date: "Jan 5, 2024" },
  { id: "4", title: "Why Organic Matters", author: "Admin", category: "Health", status: "published", views: 156, comments: 5, date: "Dec 28, 2023" },
];

const columns = [
  { key: "title", label: "Title" },
  { key: "author", label: "Author" },
  { key: "category", label: "Category" },
  {
    key: "status",
    label: "Status",
    render: (item: any) => (
      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full capitalize ${
        item.status === "published" ? "bg-primary/10 text-primary" : "bg-yellow/10 text-yellow"
      }`}>
        {item.status}
      </span>
    ),
  },
  { key: "views", label: "Views" },
  { key: "comments", label: "Comments" },
  { key: "date", label: "Date" },
  {
    key: "actions",
    label: "",
    render: () => (
      <div className="flex items-center gap-2">
        <button className="p-1.5 rounded-lg hover:bg-blue-500/10 text-blue-600 transition-colors cursor-pointer"><Eye className="w-4 h-4" /></button>
        <button className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors cursor-pointer"><Edit className="w-4 h-4" /></button>
        <button className="p-1.5 rounded-lg hover:bg-pink/10 text-pink transition-colors cursor-pointer"><Trash2 className="w-4 h-4" /></button>
      </div>
    ),
  },
];

export default function BlogPage() {
  const [posts] = useState(initialPosts);
  const [filter, setFilter] = useState("all");

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-2 animate-fade-in pb-12">
      <div className="relative p-8 rounded-[2rem] glass-panel overflow-hidden mb-8">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-yellow/20 rounded-full blur-[80px]" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-foreground tracking-tight">Blog Management</h1>
            <p className="text-muted font-medium mt-2">Manage blog posts and articles</p>
          </div>
          <button className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl shadow-[0_4px_15px_rgba(34,197,94,0.3)] hover:scale-105 transition-all duration-300 font-bold cursor-pointer">
            <Plus className="w-5 h-5" />
            New Post
          </button>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap px-2">
        {["all", "published", "draft"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2 rounded-xl text-sm font-bold capitalize transition-all duration-300 hover:-translate-y-0.5 cursor-pointer ${
              filter === f ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-[0_4px_15px_rgba(34,197,94,0.3)]" : "bg-white/60 dark:bg-white/5 text-muted hover:bg-white dark:hover:bg-white/10 hover:text-foreground border border-white/80 dark:border-white/5 shadow-sm"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="px-2">
        <Table columns={columns} data={filter === "all" ? posts : posts.filter((p) => p.status === filter)} searchable />
      </div>
    </div>
  );
}
