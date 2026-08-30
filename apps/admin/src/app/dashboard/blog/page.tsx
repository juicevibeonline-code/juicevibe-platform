"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { blogService } from "@juice-vibe/services";
import { formatDate } from "@juice-vibe/utils";
import { BookOpen, Plus, Edit3, Trash2, Loader2, Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@juice-vibe/ui";
import { cn } from "@juice-vibe/utils";

export default function BlogManagement() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("general");
  const [coverImage, setCoverImage] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  // Fetch all posts (Admin/Editor)
  const { data, isLoading } = useQuery({
    queryKey: ["adminBlogs", page],
    queryFn: () => blogService.getAllPosts({ page, limit: 8 }),
    retry: 1,
  });

  const posts: any[] = Array.isArray(data) ? data : (data?.posts || []);
  const totalPages = data?.totalPages || 1;
  const totalCount = Array.isArray(data) ? data.length : (data?.total || posts.length);

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: (input: any) => blogService.createPost(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminBlogs"] });
      setIsModalOpen(false);
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || err.message || "Failed to create post");
    },
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: any }) => blogService.updatePost(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminBlogs"] });
      setIsModalOpen(false);
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || err.message || "Failed to update post");
    },
  });

  // Publish/Toggle Mutation
  const publishMutation = useMutation({
    mutationFn: (id: string) => blogService.publishPost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminBlogs"] });
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || err.message || "Failed to update publish state");
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => blogService.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminBlogs"] });
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || err.message || "Failed to delete post");
    },
  });

  const handleOpenCreate = () => {
    setEditingPost(null);
    setTitle("");
    setSlug("");
    setExcerpt("");
    setContent("");
    setCategory("general");
    setCoverImage("");
    setTagsInput("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (post: any) => {
    setEditingPost(post);
    setTitle(post.title);
    setSlug(post.slug);
    setExcerpt(post.excerpt);
    setContent(post.content);
    setCategory(post.category);
    setCoverImage(post.coverImage || "");
    setTagsInput((post.tags || []).join(", "));
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalSlug = (slug.trim() || title.trim())
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || ("article-" + Date.now());

    if (!title.trim()) {
      alert("Please enter an Article Title");
      return;
    }
    if (!excerpt.trim()) {
      alert("Please enter a Short Excerpt");
      return;
    }
    if (!content.trim()) {
      alert("Please enter the Article Body Content");
      return;
    }

    const payload = {
      title: title.trim(),
      slug: finalSlug,
      excerpt: excerpt.trim(),
      content: content.trim(),
      category,
      coverImage: coverImage.trim() || undefined,
      tags: tagsInput.split(",").map(t => t.trim()).filter(Boolean),
    };

    if (editingPost) {
      updateMutation.mutate({ id: editingPost.id, input: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (id: string, postTitle: string) => {
    if (confirm(`Are you sure you want to permanently delete the blog post "${postTitle}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingPost) {
      // Auto generate slug for new posts
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground font-heading">
            Blog Posts Catalog
          </h1>
          <p className="text-xs text-muted-foreground font-mono mt-1">
            MANAGE PROMOTIONAL ARTICLES, TROPICAL NUTRITION NEWS, AND CAFE BLOG CONTENT
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-3 py-2 bg-primary hover:bg-primary-dark text-ink-dark text-xs font-mono font-bold rounded-lg uppercase tracking-wider cursor-pointer"
          >
            <Plus className="h-4 w-4 text-ink-dark" />
            <span>Create Article</span>
          </button>
          <div className="font-mono text-xs bg-ink-light border border-border px-3 py-1.5 rounded-lg text-primary select-none">
            TOTAL ARTICLES: <span className="font-numeral font-bold">{totalCount}</span>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 font-mono text-xs text-muted-foreground uppercase tracking-widest gap-3">
          <Loader2 className="h-7 w-7 text-primary animate-spin" />
          <span>Compiling editorial publication indices...</span>
        </div>
      ) : posts.length === 0 ? (
        <div className="terminal-card p-12 text-center border border-border bg-card">
          <BookOpen className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-sm font-bold text-foreground font-heading">No Blog Articles Published</h3>
          <p className="text-xs text-muted-foreground font-mono mt-1">
            Write and publish health & tropical recipe stories to engage guests.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post: any) => {
              const isDeleting = deleteMutation.isPending && (deleteMutation.variables as string) === post.id;
              const isPublishing = publishMutation.isPending && (publishMutation.variables as string) === post.id;

              return (
                <div 
                  key={post.id} 
                  className="terminal-card bg-card border border-border p-5 relative hover:border-primary/40 transition-colors flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-ink-dark border border-border text-primary">
                        {post.category}
                      </span>
                      <button
                        onClick={() => publishMutation.mutate(post.id)}
                        disabled={isPublishing}
                        className={cn(
                          "inline-flex items-center gap-1.5 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded border font-mono select-none cursor-pointer transition-colors disabled:opacity-50",
                          post.isPublished
                            ? "bg-primary/15 border-primary/30 text-primary hover:bg-pink/10 hover:text-pink hover:border-pink/20"
                            : "bg-ink-dark border-border text-muted-foreground hover:bg-primary/20 hover:text-primary hover:border-primary/30"
                        )}
                      >
                        {isPublishing ? (
                          <Loader2 className="h-3 w-3 animate-spin text-current" />
                        ) : post.isPublished ? (
                          <>
                            <Eye className="h-3 w-3" />
                            <span>Published</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3 w-3" />
                            <span>Draft</span>
                          </>
                        )}
                      </button>
                    </div>

                    <h3 className="text-sm font-bold text-foreground font-heading line-clamp-1" title={post.title}>
                      {post.title}
                    </h3>
                    <p className="text-xs text-muted-foreground font-sans line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                    
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1.5">
                        {post.tags.map((tag: string) => (
                          <span key={tag} className="text-[9px] font-mono text-muted-foreground/80 bg-ink-dark/50 px-1.5 py-0.2 rounded border border-border/20">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between border-t border-border/40 pt-3.5 mt-4 text-[10px] font-mono">
                    <span className="text-muted-foreground/80">
                      Created: <span className="font-numeral">{formatDate(post.createdAt)}</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(post)}
                        className="p-1 border border-border hover:border-primary/40 text-muted-foreground hover:text-foreground rounded cursor-pointer transition-colors"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        disabled={isDeleting}
                        className="p-1 border border-border hover:border-pink/40 text-muted-foreground hover:text-pink rounded cursor-pointer transition-colors disabled:opacity-50"
                      >
                        {isDeleting ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-pink" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between font-mono text-xs border-t border-border pt-4">
              <span className="text-muted-foreground">
                Page <span className="font-numeral font-bold text-foreground">{page}</span> of <span className="font-numeral">{totalPages}</span>
              </span>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((prev) => prev - 1)}
                  className="font-mono text-[10px] uppercase border-border h-8"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage((prev) => prev + 1)}
                  className="font-mono text-[10px] uppercase border-border h-8"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CREATE & EDIT OVERLAY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-2xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="h-14 flex items-center justify-between px-5 border-b border-border bg-ink-dark/30 shrink-0">
              <h2 className="text-sm font-bold text-foreground font-heading uppercase tracking-wider">
                {editingPost ? `Edit Article // ${editingPost.title}` : "Author New Blog Article"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-xs font-mono text-muted-foreground hover:text-foreground cursor-pointer"
              >
                Close [Esc]
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1 flex flex-col scrollbar-hide">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Article Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. 5 Reasons to Start Your Day with Green Celery Juice"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2.5 rounded-lg focus:outline-none focus:border-primary/50"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">URL Slug (Auto-generated)</label>
                  <input
                    type="text"
                    placeholder="5-reasons-green-celery-juice"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2.5 rounded-lg focus:outline-none focus:border-primary/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Category Map</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2.5 rounded-lg focus:outline-none focus:border-primary/50"
                  >
                    <option value="general">General Lifestyle</option>
                    <option value="health">Health & Nutrition</option>
                    <option value="recipes">Raw Recipes & Mixology</option>
                    <option value="sustainability">Eco & Sustainability</option>
                    <option value="promotions">Cafe Promotions</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Tags (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="avocado, superfood, raw-shake"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2.5 rounded-lg focus:outline-none focus:border-primary/50"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Cover Image URL</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/... or local server link"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2.5 rounded-lg focus:outline-none focus:border-primary/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Short Excerpt *</label>
                <input
                  type="text"
                  placeholder="Brief summary sentence..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2.5 rounded-lg focus:outline-none focus:border-primary/50"
                  required
                />
              </div>

              <div className="space-y-1 flex-1 flex flex-col min-h-[200px]">
                <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground shrink-0">Article Body Content *</label>
                <textarea
                  placeholder="Write the full body content here (markdown/HTML support)..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full flex-1 bg-ink-dark border border-border text-foreground font-mono text-xs p-3 rounded-lg focus:outline-none focus:border-primary/50 resize-none min-h-[200px]"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-border hover:bg-ink-dark/30 text-muted-foreground text-xs font-mono rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed text-ink-dark text-xs font-mono font-bold rounded-lg uppercase tracking-wider cursor-pointer shadow-lg shadow-primary/20 transition-all active:scale-[0.98] min-w-[130px]"
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="h-4 w-4 animate-spin text-ink-dark shrink-0" />
                  )}
                  <span>
                    {createMutation.isPending
                      ? "Publishing Article..."
                      : updateMutation.isPending
                      ? "Updating Article..."
                      : editingPost
                      ? "Save Changes"
                      : "Save Article"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
