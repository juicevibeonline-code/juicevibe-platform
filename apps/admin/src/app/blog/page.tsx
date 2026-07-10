"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { Table } from "@/components/table";
import { PageHeader } from "@/components/PageHeader";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const initialPosts = [
  { id: "1", title: "5 Health Benefits of Fresh Juice", author: "Admin", category: "Health", status: "published", views: 234, comments: 12, date: "Jan 10, 2024" },
  { id: "2", title: "Behind the Scenes: Our New Menu", author: "Admin", category: "Behind the Scenes", status: "published", views: 189, comments: 8, date: "Jan 8, 2024" },
  { id: "3", title: "Top 10 Summer Drinks", author: "Admin", category: "Lifestyle", status: "draft", views: 0, comments: 0, date: "Jan 5, 2024" },
  { id: "4", title: "Why Organic Matters", author: "Admin", category: "Health", status: "published", views: 156, comments: 5, date: "Dec 28, 2023" },
];

const filterOptions = ["all", "published", "draft"];

export default function BlogPage() {
  const [posts, setPosts] = useState(initialPosts);
  const [filter, setFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleDelete = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleCreatePost = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const status = formData.get("status") as string;

    const newPost = {
      id: String(posts.length + 1),
      title,
      author: "Admin",
      category: category || "General",
      status,
      views: 0,
      comments: 0,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };

    setPosts([newPost, ...posts]);
    setIsAddModalOpen(false);
  };

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
      render: (item: any) => (
        <div className="flex items-center gap-2">
          <button className="p-1.5 rounded-lg hover:bg-blue-500/10 text-blue-600 transition-colors cursor-pointer" title="Preview"><Eye className="w-4 h-4" /></button>
          <button className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors cursor-pointer" title="Edit"><Edit className="w-4 h-4" /></button>
          <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg hover:bg-pink/10 text-pink transition-colors cursor-pointer" title="Delete"><Trash2 className="w-4 h-4" /></button>
        </div>
      ),
    },
  ];

  const countFor = (f: string) => f === "all" ? posts.length : posts.filter((p) => p.status === f).length;
  const filtered = filter === "all" ? posts : posts.filter((p) => p.status === filter);

  const newPostBtn = (
    <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl shadow-[0_4px_15px_rgba(34,197,94,0.3)] hover:scale-105 transition-all duration-300 font-bold cursor-pointer">
      <Plus className="w-5 h-5" />
      New Post
    </button>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-2 animate-fade-in pb-12">
      <PageHeader title="Blog Management" subtitle="Manage blog posts and articles" accentColor="yellow" action={newPostBtn} />

      {/* Filter tabs with count badges */}
      <div className="flex gap-2 flex-wrap px-2">
        {filterOptions.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all duration-300 hover:-translate-y-0.5 cursor-pointer ${
              filter === f
                ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-[0_4px_15px_rgba(34,197,94,0.3)]"
                : "bg-white/60 dark:bg-white/5 text-muted hover:bg-white dark:hover:bg-white/10 hover:text-foreground border border-white/80 dark:border-white/5 shadow-sm"
            }`}
          >
            {f}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-black ${filter === f ? "bg-white/20" : "bg-gray-100 dark:bg-white/10 text-muted"}`}>
              {countFor(f)}
            </span>
          </button>
        ))}
      </div>

      <div className="px-2">
        <Table columns={columns} data={filtered} searchable />
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Create Blog Post" size="md">
        <form className="space-y-6" onSubmit={handleCreatePost}>
          <div className="space-y-4">
            <Input label="Post Title" name="title" placeholder="e.g. 5 Morning Juices For Infinite Energy" required />
            
            <div className="grid grid-cols-2 gap-4">
              <Input label="Category" name="category" placeholder="e.g. Health" required />
              <div className="flex flex-col gap-1">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Status</label>
                <select name="status" className="flex h-12 w-full rounded-xl border border-transparent bg-white/60 dark:bg-white/5 px-4 py-2 text-sm text-foreground shadow-sm transition-all duration-300 focus:outline-none focus:bg-white dark:focus:bg-black/40 focus:border-primary/50 focus:shadow-[0_0_15px_rgba(34,197,94,0.15)]">
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-border/50">
            <Button type="button" variant="ghost" className="flex-1" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" className="flex-1">Publish Post</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
