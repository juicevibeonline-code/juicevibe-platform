import { apiClient } from "./api-client";
import type { BlogPost, CreateBlogInput } from "@juice-vibe/types";

export const blogService = {
  async getPublishedPosts(params?: { category?: string; page?: number; limit?: number }): Promise<{ posts: BlogPost[]; total: number; totalPages: number }> {
    const { data } = await apiClient.get("/blog", { params });
    return data.data;
  },

  async getAllPosts(params?: { page?: number; limit?: number }): Promise<{ posts: BlogPost[]; total: number; totalPages: number }> {
    const { data } = await apiClient.get("/blog/all", { params });
    return data.data;
  },

  async getPostBySlug(slug: string): Promise<BlogPost> {
    const { data } = await apiClient.get(`/blog/${slug}`);
    return data.data;
  },

  async createPost(input: CreateBlogInput): Promise<BlogPost> {
    const { data } = await apiClient.post("/blog", input);
    return data.data;
  },

  async publishPost(id: string): Promise<BlogPost> {
    const { data } = await apiClient.patch(`/blog/${id}/publish`);
    return data.data;
  },

  async updatePost(id: string, input: Partial<CreateBlogInput>): Promise<BlogPost> {
    const { data } = await apiClient.patch(`/blog/${id}`, input);
    return data.data;
  },

  async deletePost(id: string): Promise<void> {
    await apiClient.delete(`/blog/${id}`);
  },
};
