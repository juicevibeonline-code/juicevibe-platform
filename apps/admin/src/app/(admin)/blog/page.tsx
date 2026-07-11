"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Eye, AlertCircle, CheckCircle } from "lucide-react";
import { Table } from "@/components/table";
import { PageHeader } from "@/components/PageHeader";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { TextArea } from "@/components/ui/TextArea";
import { Badge } from "@/components/ui/Badge";
import { ActionMenu } from "@/components/ui";
import { LoadingState, ErrorAlert, FilterBar, FilterTab, FormFooter } from "@/components/shared";
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
    { key: "title", label: "Title", sortable: true },
    { 
      key: "author", 
      label: "Author",
      sortable: true,
      render: (item: any) => <span>{typeof item.author === 'string' ? item.author : item.author?.name || "Admin"}</span>
    },
    { key: "category", label: "Category", sortable: true },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (item: BlogPost) => (
        <Badge variant={item.isPublished ? "success" : "warning"} className="capitalize">
          {item.isPublished ? "Published" : "Draft"}
        </Badge>
      ),
    },
    { 
      key: "createdAt", 
      label: "Created Date",
      sortable: true,
      render: (item: BlogPost) => (
        <span>{new Date(item.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
      )
    },
    {
      key: "actions",
      label: "",
      render: (item: BlogPost) => {
        const actions = [];
        if (!item.isPublished) {
          actions.push({
            label: "Publish Post",
            onClick: () => handlePublish(item.id),
            icon: <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />,
          });
        }
        actions.push(
          {
            label: "Edit Post",
            onClick: () => handleEditPostClick(item),
            icon: <Edit className="w-3.5 h-3.5 text-blue-600" />,
          },
          {
            label: "Delete Post",
            onClick: () => handleDelete(item.id),
            icon: <Trash2 className="w-3.5 h-3.5 text-rose-600" />,
            destructive: true,
          }
        );
        return <ActionMenu items={actions} />;
      },
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
    <Button variant="primary" className="text-xs" onClick={() => setIsAddModalOpen(true)}>
      <Plus className="w-4 h-4" />
      New Post
    </Button>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <PageHeader title="Blog Management" subtitle="Manage blog posts and articles" action={newPostBtn} />

      {/* Filter tabs with count badges Control Bar */}
      <FilterBar>
        {filterOptions.map((f) => (
          <FilterTab key={f} active={filter === f} onClick={() => setFilter(f)} count={countFor(f)}>
            {f}
          </FilterTab>
        ))}
      </FilterBar>

      {error && <ErrorAlert message={error} />}

      {loading ? (
        <LoadingState label="Loading posts..." />
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
              <Select 
                label="Status"
                name="status"
                options={[
                  { value: "draft", label: "Draft" },
                  { value: "published", label: "Published" },
                ]}
              />
            </div>

            <TextArea label="Excerpt" name="excerpt" required rows={2} placeholder="Brief summary of the article..." />
            <TextArea label="Content" name="content" required rows={6} placeholder="Write article details here..." className="font-mono" />
          </div>

            <FormFooter onCancel={() => setIsAddModalOpen(false)} onSubmitLabel="Save Post" isLoading={submitting} />
        </form>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setEditingPost(null); }} title="Edit Blog Post" size="md">
        {editingPost && (
          <form className="space-y-4 text-xs" onSubmit={handleUpdatePost}>
            <div className="space-y-3">
              <Input label="Post Title" name="title" defaultValue={editingPost.title} placeholder="e.g. 5 Morning Juices For Infinite Energy" required />
              
              <div className="grid grid-cols-2 gap-4">
                <Input label="Category" name="category" defaultValue={editingPost.category} placeholder="e.g. Health" required />
                <Select 
                  label="Status"
                  name="status"
                  defaultValue={editingPost.isPublished ? "published" : "draft"}
                  options={[
                    { value: "draft", label: "Draft" },
                    { value: "published", label: "Published" },
                  ]}
                />
              </div>

              <TextArea label="Excerpt" name="excerpt" required defaultValue={editingPost.excerpt} rows={2} placeholder="Brief summary of the article..." />
              <TextArea label="Content" name="content" required defaultValue={editingPost.content} rows={6} placeholder="Write article details here..." className="font-mono" />
            </div>

              <FormFooter onCancel={() => { setIsEditModalOpen(false); setEditingPost(null); }} onSubmitLabel="Update Post" isLoading={submitting} />
          </form>
        )}
      </Modal>
    </div>
  );
}
