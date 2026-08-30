"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
import { useState } from "react";
import { subscribeToNewsletter } from "@/lib/api";
import { useStorefrontSettings } from "@/hooks/use-storefront-settings";

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const quickLinks = [
  { href: "/menu", label: "Our Menu" },
  { href: "/about", label: "About Us" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Blog & Stories" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  const { settings } = useStorefrontSettings();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subscribeError, setSubscribeError] = useState<string | null>(null);
  const [isSubscribing, setIsSubscribing] = useState(false);

  const socialLinks = [
    ...(settings.social_facebook ? [{ href: settings.social_facebook, icon: FacebookIcon, label: "Facebook" }] : []),
    ...(settings.social_tiktok ? [{ href: settings.social_tiktok, icon: TikTokIcon, label: "TikTok" }] : []),
    ...(settings.social_instagram ? [{ href: settings.social_instagram, icon: InstagramIcon, label: "Instagram" }] : []),
  ];

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubscribing(true);
    setSubscribeError(null);
    try {
      await subscribeToNewsletter(email);
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    } catch (err) {
      setSubscribeError(err instanceof Error ? err.message : "Failed to subscribe");
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="relative overflow-hidden bg-[#0F2A1E] text-white border-t border-white/5">
      {/* Decorative Radial Background Glows */}
      <div className="pointer-events-none absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 h-[350px] w-[350px] -translate-y-1/2 rounded-full bg-primary blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-[350px] w-[350px] translate-y-1/2 rounded-full bg-orange blur-[120px]" />
      </div>

      {/* Top Thin Glow Bar */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="container relative py-16 md:py-24">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Brand Info */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative h-12 w-12 items-center justify-center rounded-xl overflow-hidden shadow-md border border-white/10 bg-[#1F2E24] flex transition duration-300 group-hover:scale-105">
                <Image
                  src="/images/Logo.jpeg"
                  alt="Juice Vibe Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="font-heading text-2xl font-extrabold tracking-tight text-white group-hover:text-primary transition-colors duration-300">
                {settings.business_name?.split(" ")[0] || "Juice"}{" "}
                <span className="text-primary">{settings.business_name?.split(" ").slice(1).join(" ") || "Vibe"}</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400 font-medium">
              {settings.business_description}
            </p>
            {socialLinks.length > 0 && (
              <div className="flex gap-3 pt-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-gray-400 transition-all duration-300 hover:bg-primary hover:text-[#0F2A1E] hover:border-primary hover:-translate-y-0.5"
                    aria-label={social.label}
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 font-heading text-xs font-bold tracking-widest text-primary/80 uppercase">Quick Links</h3>
            <ul className="space-y-3.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1.5 text-sm text-gray-400 font-medium transition-all duration-300 hover:text-primary hover:translate-x-1"
                  >
                    <ArrowRight className="h-3 w-3 stroke-[2.5] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Opening Hours & Contact */}
          <div>
            <h3 className="mb-6 font-heading text-xs font-bold tracking-widest text-primary/80 uppercase">Opening Hours</h3>
            <ul className="space-y-3 text-sm text-gray-400 font-medium">
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span>Mon - Fri</span>
                <span className="font-mono text-xs font-semibold text-white">{settings.opening_hours_weekdays}</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span>Saturday</span>
                <span className="font-mono text-xs font-semibold text-white">{settings.opening_hours_saturday}</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span>Sunday</span>
                <span className="font-mono text-xs font-semibold text-white">{settings.opening_hours_sunday}</span>
              </li>
            </ul>
            <div className="mt-6 space-y-3 text-sm text-gray-400 font-medium">
              {settings.business_phone && (
                <a href={`tel:${settings.business_phone.replace(/\s+/g, "")}`} className="flex items-center gap-2.5 transition-colors duration-300 hover:text-primary">
                  <Phone className="h-4 w-4 text-primary" />
                  <span className="font-mono text-xs">{settings.business_phone}</span>
                </a>
              )}
              {settings.business_email && (
                <a href={`mailto:${settings.business_email}`} className="flex items-center gap-2.5 transition-colors duration-300 hover:text-primary">
                  <Mail className="h-4 w-4 text-primary" />
                  {settings.business_email}
                </a>
              )}
              {settings.business_address && (
                <a
                  href={settings.google_maps_link || `https://maps.google.com/?q=${encodeURIComponent(settings.business_address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 transition-colors duration-300 hover:text-primary group"
                >
                  <MapPin className="mt-0.5 h-4 w-4 text-primary shrink-0" />
                  <span className="text-xs leading-relaxed">{settings.business_address}</span>
                </a>
              )}
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-heading text-xs font-bold tracking-widest text-primary/80 uppercase">Newsletter</h3>
            <p className="text-sm text-gray-400 font-medium leading-relaxed">
              Subscribe for exclusive tropical updates, seasonal menu offers, and new flavors.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 w-full px-4 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-300 font-medium"
                required
              />
              <button
                type="submit"
                disabled={isSubscribing}
                aria-label="Subscribe"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-[#0F2A1E] font-bold shadow-lg shadow-primary/10 transition-all duration-300 hover:bg-primary-dark hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
            {subscribed && (
              <div className="mt-3 flex items-center gap-2 text-xs text-green-400">
                <CheckCircle className="h-4 w-4" />
                Subscribed successfully!
              </div>
            )}
            {subscribeError && (
              <div className="mt-3 flex items-center gap-2 text-xs text-red-400">
                <AlertCircle className="h-4 w-4" />
                {subscribeError}
              </div>
            )}
          </div>

        </div>

        {/* Footer Bottom bar */}
        <div className="mt-16 border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-medium">
          <p>
            &copy; <span className="font-mono text-xs">{new Date().getFullYear()}</span> {settings.footer_copyright_text || "Juice Vibe. All rights reserved."}
          </p>
          <p className="flex items-center gap-1 text-gray-400">
            {settings.footer_tagline || "Sip the good vibes, crafted with 💚 in Sri Lanka."}
          </p>
        </div>
      </div>
    </footer>
  );
}

