import { apiClient } from "./api-client";

export interface StorefrontSettings {
  business_name?: string;
  business_tagline?: string;
  business_description?: string;
  business_phone?: string;
  business_email?: string;
  business_address?: string;
  business_city?: string;
  business_country?: string;
  business_postal_code?: string;
  google_maps_link?: string;

  opening_hours_weekdays?: string;
  opening_hours_saturday?: string;
  opening_hours_sunday?: string;

  social_facebook?: string;
  social_tiktok?: string;
  social_instagram?: string;
  social_whatsapp?: string;

  announcement_enabled?: string;
  announcement_text?: string;
  announcement_link?: string;

  delivery_fee?: string;
  free_delivery_min?: string;
  tax_rate?: string;
  currency_symbol?: string;
  is_store_open?: string;
  estimated_delivery_time?: string;
  estimated_prep_time?: string;

  footer_copyright_text?: string;
  footer_tagline?: string;
  [key: string]: string | undefined;
}

export const settingsService = {
  async getPublicSettings(): Promise<StorefrontSettings> {
    const { data } = await apiClient.get("/settings/public");
    return data.data;
  },

  async getSettings(): Promise<Record<string, string>> {
    const { data } = await apiClient.get("/settings");
    return data.data;
  },

  async updateSettings(settings: Record<string, string>): Promise<Record<string, string>> {
    const { data } = await apiClient.patch("/settings", settings);
    return data.data;
  },
};
