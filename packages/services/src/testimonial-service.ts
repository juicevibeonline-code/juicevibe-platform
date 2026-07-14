import { apiClient } from "./api-client";
import type { Testimonial, CreateTestimonialInput } from "@juice-vibe/types";

export const testimonialService = {
  async getApprovedTestimonials(params?: { featured?: boolean }): Promise<Testimonial[]> {
    const { data } = await apiClient.get("/testimonials", { params });
    return data.data;
  },

  async getAllTestimonials(params?: { page?: number; limit?: number }): Promise<{ testimonials: Testimonial[]; total: number; totalPages: number }> {
    const { data } = await apiClient.get("/testimonials/all", { params });
    return data.data;
  },

  async createTestimonial(input: CreateTestimonialInput): Promise<Testimonial> {
    const { data } = await apiClient.post("/testimonials", input);
    return data.data;
  },

  async approveTestimonial(id: string): Promise<void> {
    await apiClient.patch(`/testimonials/${id}/approve`);
  },

  async updateTestimonial(id: string, input: { isApproved?: boolean; isFeatured?: boolean }): Promise<Testimonial> {
    const { data } = await apiClient.patch(`/testimonials/${id}`, input);
    return data.data;
  },

  async deleteTestimonial(id: string): Promise<void> {
    await apiClient.delete(`/testimonials/${id}`);
  },
};
