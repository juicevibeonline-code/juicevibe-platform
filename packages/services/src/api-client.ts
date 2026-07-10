import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosError } from "axios";
import { apiConfig } from "@juice-vibe/config";

export type ApiClient = AxiosInstance;

let store: { getState: () => { tokens?: { accessToken: string; refreshToken?: string } } } | undefined;

export function injectAuthStore(s: typeof store) {
  store = s;
}

export const apiClient: ApiClient = axios.create({
  baseURL: apiConfig.baseUrl,
  timeout: apiConfig.timeout,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = store?.getState()?.tokens?.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // try refresh
      const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const refreshToken = store?.getState()?.tokens?.refreshToken;
          if (refreshToken) {
            const { data } = await axios.post(`${apiConfig.baseUrl}/auth/refresh`, { refreshToken });
            // update store with new tokens
            return apiClient(originalRequest);
          }
        } catch {
          // refresh failed - redirect to login
        }
      }
    }
    return Promise.reject(error);
  }
);
