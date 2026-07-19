import { apiClient } from "./api-client";
import type { AuthResponse, LoginRequest, RegisterRequest, User } from "@juice-vibe/types";

export const authService = {
  async login(input: LoginRequest): Promise<AuthResponse> {
    const { data } = await apiClient.post("/auth/login", input);
    return data.data;
  },

  async register(input: RegisterRequest): Promise<AuthResponse> {
    const { data } = await apiClient.post("/auth/register", input);
    return data.data;
  },

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const { data } = await apiClient.post("/auth/refresh", { refreshToken });
    return data.data;
  },

  async getMe(): Promise<User> {
    const { data } = await apiClient.get("/auth/me");
    return data.data;
  },

  async getCustomers(): Promise<any[]> {
    const { data } = await apiClient.get("/auth/customers");
    return data.data;
  },

  async logout(): Promise<void> {
    await apiClient.post("/auth/logout");
  },

  async forgotPassword(email: string): Promise<void> {
    await apiClient.post("/auth/forgot-password", { email });
  },

  async resetPassword(token: string, password: string): Promise<void> {
    await apiClient.post("/auth/reset-password", { token, password });
  },

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await apiClient.patch("/auth/change-password", { oldPassword, newPassword });
  },
};
