export { cn, formatPrice, slugify } from "@juice-vibe/utils";

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
