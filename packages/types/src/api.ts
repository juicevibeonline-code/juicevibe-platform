import type { ApiResponse } from "./common";

export interface ApiEndpoints {
  auth: {
    login: ApiResponse<import("./user").AuthResponse>;
    register: ApiResponse<import("./user").AuthResponse>;
    refresh: ApiResponse<import("./user").AuthTokens>;
    me: ApiResponse<import("./user").User>;
  };
  menu: {
    categories: ApiResponse<import("./menu").MenuCategory[]>;
    items: ApiResponse<import("./menu").MenuItem[]>;
    item: ApiResponse<import("./menu").MenuItem>;
  };
  orders: {
    create: ApiResponse<import("./order").Order>;
    list: ApiResponse<import("./order").Order[]>;
    single: ApiResponse<import("./order").Order>;
  };
  gallery: {
    list: ApiResponse<import("./gallery").GalleryImage[]>;
  };
  testimonials: {
    list: ApiResponse<import("./testimonial").Testimonial[]>;
  };
  contact: {
    submit: ApiResponse<{ message: string }>;
  };
}
