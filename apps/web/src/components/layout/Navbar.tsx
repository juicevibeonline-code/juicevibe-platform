"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useScrollPosition } from "@/hooks/use-scroll-position";
import { useStorefrontSettings } from "@/hooks/use-storefront-settings";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const { isScrolled } = useScrollPosition();
  const { settings } = useStorefrontSettings();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const isAnnouncementActive = settings.announcement_enabled === "true" && Boolean(settings.announcement_text);

  return (
    <>
      {isAnnouncementActive && !isScrolled && (
        <div className="fixed inset-x-0 top-0 z-50 bg-[#0F2A1E] text-white text-xs font-semibold py-2 px-4 border-b border-primary/20 flex items-center justify-center gap-2 shadow-sm transition-all duration-300">
          <Sparkles className="h-3.5 w-3.5 text-primary shrink-0 animate-pulse" />
          <span>{settings.announcement_text}</span>
          {settings.announcement_link && (
            <Link
              href={settings.announcement_link}
              className="inline-flex items-center gap-0.5 text-primary hover:underline font-bold ml-1 transition-all"
            >
              Check it out <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>
      )}

      <header className={cn(
        "fixed inset-x-0 z-50 transition-all duration-500",
        isAnnouncementActive && !isScrolled ? "top-8" : "top-0"
      )}>
        <nav
          className={cn(
            "mx-auto flex items-center justify-between transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
            isScrolled
              ? "mt-4 w-[92%] md:w-[85%] max-w-5xl h-16 rounded-full px-8 bg-white/75 backdrop-blur-xl border border-white/40 shadow-[0_10px_30px_rgba(0,0,0,0.04)]"
              : "w-full max-w-7xl h-24 px-6 md:px-12 bg-transparent border-transparent"
          )}
        >
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative overflow-hidden rounded-xl transition-all duration-300 group-hover:scale-105">
              <Image
                src="/images/Logo.jpeg"
                alt="Juice Vibe"
                width={isScrolled ? 36 : 42}
                height={isScrolled ? 36 : 42}
                className="rounded-xl object-cover transition-all duration-500"
                priority
              />
            </div>
            <span
              className={cn(
                "font-heading font-extrabold tracking-tight transition-all duration-500",
                isScrolled ? "text-lg text-dark-green" : "text-xl md:text-2xl text-dark-green"
              )}
            >
              Juice <span className="text-primary text-glow-green">Vibe</span>
            </span>
          </Link>

          {/* Centered Navigation Links */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link, idx) => (
              <Link
                key={link.href}
                href={link.href}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="relative rounded-full px-4 py-2 text-sm font-semibold text-dark-green/80 transition-colors duration-300 hover:text-dark-green"
              >
                {hoveredIndex === idx && (
                  <motion.span
                    layoutId="nav-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute inset-0 z-0 rounded-full bg-primary/10"
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            ))}
          </div>

          {/* CTA on the Right */}
          <div className="hidden items-center gap-4 md:flex">
            <Link href="/menu">
              <Button
                variant="primary"
                size={isScrolled ? "sm" : "md"}
                className={cn(
                  "shadow-md transition-all duration-500",
                  isScrolled ? "h-10 px-6 text-sm" : "h-12 px-8 text-base"
                )}
              >
                Order Now
              </Button>
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMobileOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 border border-black/5 shadow-sm md:hidden hover:bg-gray-50 active:scale-95 transition-all"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5 text-dark-green" />
          </button>
        </nav>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] md:hidden"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/20 backdrop-blur-md"
              onClick={() => setIsMobileOpen(false)}
            />

            {/* Sidebar drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="absolute inset-y-0 right-0 w-[300px] max-w-[85vw] bg-white/90 backdrop-blur-2xl shadow-2xl border-l border-white/20"
            >
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b border-gray-100/50 p-6">
                  <Link href="/" className="flex items-center gap-2.5" onClick={() => setIsMobileOpen(false)}>
                    <Image
                      src="/images/Logo.jpeg"
                      alt="Juice Vibe"
                      width={32}
                      height={32}
                      className="rounded-lg object-cover"
                    />
                    <span className="font-heading text-lg font-extrabold text-dark-green">
                      Juice <span className="text-primary">Vibe</span>
                    </span>
                  </Link>
                  <button
                    onClick={() => setIsMobileOpen(false)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="h-5 w-5 text-dark-green" />
                  </button>
                </div>

                <div className="flex-1 space-y-1 p-6">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsMobileOpen(false)}
                        className="flex items-center rounded-2xl px-4 py-3 text-lg font-semibold text-gray-700 hover:bg-primary/10 hover:text-primary transition-all duration-300"
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <div className="border-t border-gray-100/50 p-6">
                  <Link href="/menu" onClick={() => setIsMobileOpen(false)}>
                    <Button variant="primary" className="w-full h-12 shadow-lg shadow-primary/20">
                      Order Now
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
