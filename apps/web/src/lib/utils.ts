import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/**
 * Safely resolves the public site URL, guaranteeing a valid protocol and domain.
 * Normalizes inputs like "juicevibe.lk" -> "https://juicevibe.lk" and handles
 * missing, quoted, or protocol-less environment variables without throwing ERR_INVALID_URL.
 */
export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL;

  if (!raw || typeof raw !== "string") {
    return "https://juicevibe.lk";
  }

  let trimmed = raw.trim().replace(/^['"]|['"]$/g, "");
  if (!trimmed) {
    return "https://juicevibe.lk";
  }

  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = `https://${trimmed}`;
  }

  try {
    const parsed = new URL(trimmed);
    return parsed.origin;
  } catch {
    return "https://juicevibe.lk";
  }
}
