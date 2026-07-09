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
        <button className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"><Eye className="w-4 h-4" /></button>
        <button className="p-1.5 rounded-lg hover:bg-green-50 text-primary transition-colors"><Edit className="w-4 h-4" /></button>
        <button className="p-1.5 rounded-lg hover:bg-pink/10 text-pink transition-colors"><Trash2 className="w-4 h-4" /></button>
      </div>
    ),
  },
];

export default function BlogPage() {
  const [posts] = useState(initialPosts);
  const [filter, setFilter] = useState("all");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Blog</h1>
          <p className="text-muted mt-1">Manage blog posts and articles</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium">
          <Plus className="w-4 h-4" />
          New Post
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {["all", "published", "draft"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
              filter === f ? "bg-primary text-white" : "bg-white text-gray-600 hover:bg-gray-100 border border-border"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <Table columns={columns} data={filter === "all" ? posts : posts.filter((p) => p.status === filter)} searchable />
    </div>
  );
}
