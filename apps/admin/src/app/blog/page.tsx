"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Eye, AlertCircle, CheckCircle } from "lucide-react";
import { Table } from "@/components/table";
import { PageHeader } from "@/components/PageHeader";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { blogService } from "@juice-vibe/services";
import { useToast } from "@/hooks/useToast";
import type { BlogPost } from "@juice-vibe/types";

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleEditPostClick = (post: BlogPost) => {
    setEditingPost(post);
    setIsEditModalOpen(true);
  };

  const handleUpdatePost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingPost) return;
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const excerpt = formData.get("excerpt") as string;
    const content = formData.get("content") as string;
    const status = formData.get("status") as string;

    try {
      setSubmitting(true);
      await blogService.updatePost(editingPost.id, {
        title,
        excerpt,
        content,
        category: category || "general",
        isPublished: status === "published",
      });

      toast({ type: "success", title: "Updated", message: "Blog post updated successfully." });
      await fetchPosts();
      setIsEditModalOpen(false);
      setEditingPost(null);
    } catch (err: any) {
      console.error(err);
      toast({ type: "error", title: "Update failed", message: err.message || "Failed to update blog post." });
    } finally {
      setSubmitting(false);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await blogService.getAllPosts({ limit: 100 });
      setPosts(response.posts);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load blog posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: string) => {
    const prevPosts = [...posts];
    setPosts((prev) => prev.filter((p) => p.id !== id));
    try {
      await blogService.deletePost(id);
    } catch (err) {
      console.error("Failed to delete post:", err);
      setPosts(prevPosts);
      toast({ type: "error", title: "Delete failed", message: "Failed to delete blog post from server." });
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await blogService.publishPost(id);
      await fetchPosts();
    } catch (err) {
      console.error("Failed to publish post:", err);
      toast({ type: "error", title: "Publish failed", message: "Failed to publish post." });
    }
  };

  const handleCreatePost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const excerpt = formData.get("excerpt") as string;
    const content = formData.get("content") as string;
    const status = formData.get("status") as string;

    try {
      setSubmitting(true);
      await blogService.createPost({
        title,
        excerpt,
        content,
        category: category || "general",
        author: "Admin",
        tags: [],
        isPublished: status === "published",
      } as any);

      await fetchPosts();
      setIsAddModalOpen(false);
    } catch (err: any) {
      console.error(err);
      toast({ type: "error", title: "Create failed", message: err.message || "Failed to create blog post." });
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { key: "title", label: "Title" },
    { 
      key: "author", 
      label: "Author",
      render: (item: any) => <span>{item.author?.name || "Admin"}</span>
    },
    { key: "category", label: "Category" },
    {
      key: "status",
      label: "Status",
      render: (item: BlogPost) => (
        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
          item.isPublished ? "bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20" : "bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"
        }`}>
          {item.isPublished ? "Published" : "Draft"}
        </span>
      ),
    },
    { 
      key: "createdAt", 
      label: "Created Date",
      render: (item: BlogPost) => (
        <span>{new Date(item.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
      )
    },
    {
      key: "actions",
      label: "Actions",
      render: (item: BlogPost) => (
        <div className="flex items-center gap-1">
          {!item.isPublished && (
            <button 
              onClick={() => handlePublish(item.id)}
              className="p-1 rounded hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 cursor-pointer"
              title="Publish Post"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          )}
          <button onClick={() => handleEditPostClick(item)} className="p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-500/10 text-blue-600 dark:text-blue-400 cursor-pointer" title="Edit"><Edit className="w-4 h-4" /></button>
          <button onClick={() => handleDelete(item.id)} className="p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 cursor-pointer" title="Delete"><Trash2 className="w-4 h-4" /></button>
        </div>
      ),
    },
  ];

  const countFor = (f: string) => {
    if (f === "all") return posts.length;
    if (f === "published") return posts.filter((p) => p.isPublished).length;
    return posts.filter((p) => !p.isPublished).length;
  };

  const filtered = posts.filter((p) => {
    if (filter === "published") return p.isPublished;
    if (filter === "draft") return !p.isPublished;
    return true;
  });

  const filterOptions = ["all", "published", "draft"];

  const newPostBtn = (
    <button 
      onClick={() => setIsAddModalOpen(true)} 
      className="flex items-center gap-1.5 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors font-semibold text-xs shadow-sm cursor-pointer"
    >
      <Plus className="w-4 h-4" />
      New Post
    </button>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 pb-12">
      <PageHeader title="Blog Management" subtitle="Manage blog posts and articles" accentColor="yellow" action={newPostBtn} />

      {/* Filter tabs with count badges */}
      <div className="flex gap-1.5 flex-wrap">
        {filterOptions.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold capitalize border transition-colors cursor-pointer ${
              filter === f
                ? "bg-background border-border text-primary"
                : "bg-card hover:bg-background text-muted hover:text-foreground border-border"
            }`}
          >
            {f}
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${filter === f ? "bg-primary/10 text-primary-dark" : "bg-background text-muted"}`}>
              {countFor(f)}
            </span>
          </button>
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 rounded-lg text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 bg-card border border-border rounded-lg shadow-sm">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold text-muted uppercase tracking-wider animate-pulse">Loading posts...</span>
        </div>
      ) : (
        <div>
          <Table columns={columns} data={filtered} searchable />
        </div>
      )}

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Create Blog Post" size="md">
        <form className="space-y-4 text-xs" onSubmit={handleCreatePost}>
          <div className="space-y-3">
            <Input label="Post Title" name="title" placeholder="e.g. 5 Morning Juices For Infinite Energy" required />
            
            <div className="grid grid-cols-2 gap-4">
              <Input label="Category" name="category" placeholder="e.g. Health" required />
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-foreground mb-1">Status</label>
                <select name="status" className="flex h-11 w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary/50">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-foreground mb-1">Excerpt</label>
              <textarea 
                name="excerpt"
                required
                rows={2}
                className="flex w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary/50 resize-none"
                placeholder="Brief summary of the article..."
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-foreground mb-1">Content</label>
              <textarea 
                name="content"
                required
                rows={6}
                className="flex w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary/50 resize-none font-mono"
                placeholder="Write article details here..."
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t border-border">
            <Button type="button" variant="ghost" className="flex-1 text-xs" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" className="flex-1 text-xs" isLoading={submitting}>Save Post</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setEditingPost(null); }} title="Edit Blog Post" size="md">
        {editingPost && (
          <form className="space-y-4 text-xs" onSubmit={handleUpdatePost}>
            <div className="space-y-3">
              <Input label="Post Title" name="title" defaultValue={editingPost.title} placeholder="e.g. 5 Morning Juices For Infinite Energy" required />
              
              <div className="grid grid-cols-2 gap-4">
                <Input label="Category" name="category" defaultValue={editingPost.category} placeholder="e.g. Health" required />
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-foreground mb-1">Status</label>
                  <select name="status" defaultValue={editingPost.isPublished ? "published" : "draft"} className="flex h-11 w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary/50">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-foreground mb-1">Excerpt</label>
                <textarea 
                  name="excerpt"
                  required
                  defaultValue={editingPost.excerpt}
                  rows={2}
                  className="flex w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary/50 resize-none"
                  placeholder="Brief summary of the article..."
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-foreground mb-1">Content</label>
                <textarea 
                  name="content"
                  required
                  defaultValue={editingPost.content}
                  rows={6}
                  className="flex w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary/50 resize-none font-mono"
                  placeholder="Write article details here..."
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-border">
              <Button type="button" variant="ghost" className="flex-1 text-xs" onClick={() => { setIsEditModalOpen(false); setEditingPost(null); }}>Cancel</Button>
              <Button type="submit" variant="primary" className="flex-1 text-xs" isLoading={submitting}>Update Post</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
