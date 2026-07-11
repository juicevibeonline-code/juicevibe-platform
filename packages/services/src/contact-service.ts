import { apiClient } from "./api-client";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export const contactService = {
  async getMessages(params?: { isRead?: boolean; page?: number; limit?: number }): Promise<{ items: ContactMessage[]; total: number; page: number; limit: number }> {
    const { data } = await apiClient.get("/contact/messages", { params });
    return {
      items: data.data,
      total: data.meta?.total ?? data.data.length,
      page: data.meta?.page ?? 1,
      limit: data.meta?.limit ?? 20,
    };
  },

  async markAsRead(id: string): Promise<void> {
    await apiClient.patch(`/contact/messages/${id}/read`);
  },

  async deleteMessage(id: string): Promise<void> {
    await apiClient.delete(`/contact/messages/${id}`);
  },

  async subscribe(email: string): Promise<void> {
    await apiClient.post("/contact/subscribe", { email });
  },

  async submitMessage(input: { name: string; email: string; phone?: string; subject: string; message: string }): Promise<void> {
    await apiClient.post("/contact", input);
  },
};
