"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingFruits } from "@/components/shared/FloatingFruits";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen hero-gradient flex items-center overflow-hidden"
    >
      <div className="absolute inset-0">
        <Image
          src="/images/MenuItems/hero.png"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-light-bg/90 via-light-bg/70 to-light-bg/30" />
      </div>
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-orange/10 blur-3xl" />
        <div className="absolute top-1/3 right-1/3 h-64 w-64 rounded-full bg-yellow/10 blur-3xl" />
      </div>

      <FloatingFruits />

      <div className="container relative z-10 pt-28 pb-16 md:pt-36 md:pb-20">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
            >
              <Sparkles className="h-4 w-4" />
              Fresh & Organic Since 2024
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-heading text-5xl font-extrabold leading-[1.1] tracking-tight text-dark-green md:text-6xl lg:text-7xl xl:text-8xl"
            >
              Sip the
              <br />
              <span className="text-gradient">Good Vibes</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-gray-600 lg:mx-0"
            >
              Fresh juices, smoothies, burgers, coffee and tropical flavors crafted with love. Nature&apos;s best, served daily.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:items-start"
            >
              <Link href="/menu">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  View Menu
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Order Now
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-12 flex items-center justify-center gap-8 lg:justify-start"
            >
              {[
                { value: "50+", label: "Fresh Items" },
                { value: "1000+", label: "Happy Customers" },
                { value: "4.9", label: "Avg. Rating" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-heading text-2xl font-extrabold text-dark-green md:text-3xl">
                    {stat.value}
                  </div>
                  <div className="text-xs font-medium text-gray-500 md:text-sm">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative mx-auto aspect-square max-w-lg">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 via-orange/10 to-yellow/10 blur-3xl" />

              <div className="relative flex h-full w-full items-center justify-center">
                <div className="relative h-[400px] w-[400px]">
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/20" />
                  <div className="absolute inset-4 rounded-full border-2 border-dashed border-orange/20" />
                  <div className="absolute inset-8 rounded-full border-2 border-dashed border-yellow/20" />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-56 w-56 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-dark shadow-2xl shadow-primary/30">
                      <div className="text-center text-white">
                        <div className="font-heading text-5xl font-extrabold">JV</div>
                        <div className="mt-1 text-sm font-medium text-white/80">Premium</div>
                      </div>
                    </div>
                  </div>

                  {[
                    { icon: "🍊", x: "0%", y: "20%", delay: 0.2 },
                    { icon: "🥭", x: "80%", y: "10%", delay: 0.4 },
                    { icon: "🍓", x: "85%", y: "65%", delay: 0.6 },
                    { icon: "🍍", x: "5%", y: "70%", delay: 0.3 },
                    { icon: "🍋", x: "45%", y: "0%", delay: 0.5 },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      className="absolute text-3xl"
                      style={{ left: item.x, top: item.y }}
                      animate={{
                        y: [0, -10, 0],
                        rotate: [0, 10, -10, 0],
                      }}
                      transition={{
                        duration: 4,
                        delay: item.delay,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      {item.icon}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
