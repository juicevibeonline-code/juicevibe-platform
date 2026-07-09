"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useScrollPosition } from "@/hooks/use-scroll-position";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const { isScrolled } = useScrollPosition();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          isScrolled
            ? "glass shadow-sm"
            : "bg-transparent"
        )}
      >
        <nav className="container flex h-20 items-center justify-between">
          <Link href="/" className="group flex items-center gap-3">
            <Image
              src="/images/Logo.jpeg"
              alt="Juice Vibe"
              width={40}
              height={40}
              className="rounded-xl object-cover transition-all group-hover:scale-110"
            />
            <span className="font-heading text-xl font-extrabold tracking-tight text-dark-green">
              Juice <span className="text-primary">Vibe</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative rounded-full px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-dark-green"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Link href="/menu">
              <Button variant="primary" size="sm">
                Order Now
              </Button>
            </Link>
          </div>

          <button
            onClick={() => setIsMobileOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5 text-dark-green" />
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] md:hidden"
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute inset-y-0 right-0 w-80 max-w-[85vw] bg-white shadow-2xl"
            >
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b border-gray-100 p-6">
                  <Link href="/" className="flex items-center gap-2.5">
                    <Image
                      src="/images/Logo.jpeg"
                      alt="Juice Vibe"
                      width={32}
                      height={32}
                      className="rounded-lg object-cover"
                    />
                    <span className="font-heading text-lg font-extrabold text-dark-green">
                      Juice Vibe
                    </span>
                  </Link>
                  <button
                    onClick={() => setIsMobileOpen(false)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100"
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
                        className="flex items-center rounded-xl px-4 py-3 text-lg font-medium text-gray-700 transition-colors hover:bg-primary/5 hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <div className="border-t border-gray-100 p-6">
                  <Link href="/menu" onClick={() => setIsMobileOpen(false)}>
                    <Button variant="primary" className="w-full">
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
