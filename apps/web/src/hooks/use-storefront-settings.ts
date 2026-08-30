"use client";

import { useState, useEffect } from "react";
import { settingsService, type StorefrontSettings } from "@juice-vibe/services";

export const FALLBACK_SETTINGS: StorefrontSettings = {
  business_name: "Juice Vibe",
  business_tagline: "Sip the Good Vibes",
  business_description:
    "Premium tropical juice café offering fresh, organic, and handcrafted beverages. Experience the finest juices and healthy drinks in Waskaduwa.",
  business_phone: "+94 71 843 5876",
  business_email: "hello@juicevibe.com",
  business_address: "No. 89 Bandaragama Road, Waskaduwa, Sri Lanka, 12580",
  business_city: "Waskaduwa",
  business_country: "Sri Lanka",
  business_postal_code: "12580",
  google_maps_link: "https://maps.google.com/?q=Juice+Vibe+Waskaduwa",

  opening_hours_weekdays: "08:00 AM - 10:00 PM",
  opening_hours_saturday: "09:00 AM - 11:00 PM",
  opening_hours_sunday: "10:00 AM - 09:00 PM",

  social_facebook: "https://www.facebook.com/share/1L9JR6DXL9/?mibextid=wwXIfr",
  social_tiktok: "https://www.tiktok.com/@juice.vibe0",
  social_instagram: "https://instagram.com/juicevibe.lk",
  social_whatsapp: "94718435876",

  announcement_enabled: "false",
  announcement_text: "🎉 Special Promo: Fresh tropical blends handcrafted daily!",
  announcement_link: "/menu",

  delivery_fee: "250",
  free_delivery_min: "3000",
  tax_rate: "0",
  currency_symbol: "LKR",
  is_store_open: "true",
  estimated_delivery_time: "30-45 mins",
  estimated_prep_time: "15-20 mins",

  footer_copyright_text: "Juice Vibe. All rights reserved.",
  footer_tagline: "Sip the good vibes, crafted with 💚 in Sri Lanka.",
};

// In-memory cache to prevent multiple roundtrips across components
let cachedSettings: StorefrontSettings | null = null;
const listeners = new Set<(settings: StorefrontSettings) => void>();

export function useStorefrontSettings() {
  const [settings, setSettings] = useState<StorefrontSettings>(cachedSettings || FALLBACK_SETTINGS);
  const [isLoading, setIsLoading] = useState(!cachedSettings);

  useEffect(() => {
    const handleUpdate = (updated: StorefrontSettings) => {
      setSettings(updated);
    };

    listeners.add(handleUpdate);

    if (!cachedSettings) {
      settingsService
        .getPublicSettings()
        .then((data) => {
          if (data && typeof data === "object") {
            const merged = { ...FALLBACK_SETTINGS, ...data };
            cachedSettings = merged;
            listeners.forEach((l) => l(merged));
          }
        })
        .catch((err) => {
          console.warn("Using fallback settings due to API connection:", err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }

    return () => {
      listeners.delete(handleUpdate);
    };
  }, []);

  return { settings, isLoading };
}
