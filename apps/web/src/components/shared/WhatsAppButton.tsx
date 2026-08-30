"use client";

import { MessageCircle } from "lucide-react";
import { useStorefrontSettings } from "@/hooks/use-storefront-settings";

export function WhatsAppButton() {
  const { settings } = useStorefrontSettings();
  const phone = settings.social_whatsapp?.replace(/\D/g, "") || "94718435876";

  return (
    <a
      href={`https://wa.me/${phone}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 transition-all hover:scale-110 hover:shadow-xl hover:shadow-[#25D366]/40 md:bottom-6"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
