"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Star, Leaf, Droplets, Sparkles, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

// Theme configuration representing the three core beverage selections
const themes = {
  mango: {
    id: "mango",
    name: "Tropical Mango",
    badge: "🌿 Fresh & Organic Since 2024",
    badgeText: "🔥 Bestseller",
    line1: "Nature's",
    line2: "Freshest",
    line3: "Flavors.",
    desc: "Sun-ripened organic mangoes blended with rich tropical coconut milk and fresh garden mint. The ultimate summer vibe, served cold daily.",
    accentColor: "from-orange-500 via-amber-500 to-yellow-400",
    glowColor: "rgba(251, 146, 60, 0.45)",
    glowBg: "rgba(251, 191, 36, 0.12)",
    bgGradient: "linear-gradient(135deg, #F8FFF8 0%, #FFF9F2 35%, #FFF2E0 75%, #FFFDF0 100%)",
    image: "/images/heromongo.png",
    rating: "4.9",
    reviews: "250+ Reviews",
    sugar: "No Added Sugar",
    fresh: "100% Organic",
    cardBg: "from-orange-500/10 via-white/50 to-orange-100/10",
    particleColor: "bg-orange-400/40",
    buttonBg: "bg-orange-500 hover:bg-orange-600 shadow-orange-500/20 text-white",
    selectorColor: "bg-orange-400",
    selectorRing: "ring-orange-300",
    fruits: [
      { emoji: "🥭", delay: 0.1, size: "text-4xl", top: "15%", left: "12%", driftX: 18, driftY: -12 },
      { emoji: "🍊", delay: 0.3, size: "text-3xl", top: "10%", left: "75%", driftX: -15, driftY: 10 },
      { emoji: "🍃", delay: 0.2, size: "text-2xl", top: "42%", left: "8%", driftX: 12, driftY: -14 },
      { emoji: "🧊", delay: 0.5, size: "text-2xl", top: "58%", left: "82%", driftX: -10, driftY: 12 },
      { emoji: "🥭", delay: 0.6, size: "text-2xl", top: "72%", left: "15%", driftX: 15, driftY: 16 },
      { emoji: "🍃", delay: 0.4, size: "text-3xl", top: "30%", left: "85%", driftX: -12, driftY: -10 },
      { emoji: "🍊", delay: 0.7, size: "text-2xl", top: "80%", left: "75%", driftX: -8, driftY: -15 },
    ]
  },
  lime: {
    id: "lime",
    name: "Fresh Lime",
    badge: "🍋 Zesty & Refreshing",
    badgeText: "🌿 Healthy Choice",
    line1: "Crafted By",
    line2: "Raw & Pure",
    line3: "Nature.",
    desc: "Freshly squeezed lime blended with crisp mint leaves and a hint of organic honey. Pure refreshment for your mind and body.",
    accentColor: "from-lime-500 via-green-500 to-emerald-400",
    glowColor: "rgba(132, 204, 22, 0.45)",
    glowBg: "rgba(132, 204, 22, 0.12)",
    bgGradient: "linear-gradient(135deg, #F8FFF8 0%, #F0FDF4 35%, #E6FDF5 75%, #F0FFF0 100%)",
    image: "/images/herolime.png",
    rating: "4.8",
    reviews: "180+ Reviews",
    sugar: "No Added Sugar",
    fresh: "100% Fresh Lime",
    cardBg: "from-lime-500/10 via-white/50 to-lime-100/10",
    particleColor: "bg-lime-400/40",
    buttonBg: "bg-lime-500 hover:bg-lime-600 shadow-lime-500/20 text-white",
    selectorColor: "bg-lime-500",
    selectorRing: "ring-lime-300",
    fruits: [
      { emoji: "🍋", delay: 0.1, size: "text-4xl", top: "15%", left: "12%", driftX: 12, driftY: -10 },
      { emoji: "🌿", delay: 0.3, size: "text-3xl", top: "10%", left: "75%", driftX: -14, driftY: 12 },
      { emoji: "🍃", delay: 0.2, size: "text-2xl", top: "42%", left: "8%", driftX: 10, driftY: -12 },
      { emoji: "🧊", delay: 0.5, size: "text-2xl", top: "58%", left: "82%", driftX: -8, driftY: 10 },
      { emoji: "🍋", delay: 0.6, size: "text-2xl", top: "72%", left: "15%", driftX: 14, driftY: 14 },
      { emoji: "🍃", delay: 0.4, size: "text-3xl", top: "30%", left: "85%", driftX: -10, driftY: -8 },
      { emoji: "🌿", delay: 0.7, size: "text-2xl", top: "80%", left: "75%", driftX: -12, driftY: -12 },
    ]
  },
  strawberry: {
    id: "strawberry",
    name: "Strawberry Bliss",
    badge: "🍓 Sweet & Natural",
    badgeText: "🍓 Sweet Treat",
    line1: "Sip The",
    line2: "Beautiful",
    line3: "Vibes.",
    desc: "Hand-picked ripe strawberries blended with creamy yogurt and a touch of natural sweetness. Pure berry bliss in every sip.",
    accentColor: "from-pink-500 via-rose-500 to-fuchsia-400",
    glowColor: "rgba(244, 63, 94, 0.45)",
    glowBg: "rgba(236, 72, 153, 0.12)",
    bgGradient: "linear-gradient(135deg, #F8FFF8 0%, #FFF5F6 35%, #FFF0F2 75%, #FFFDFD 100%)",
    image: "/images/herostrow.png",
    rating: "5.0",
    reviews: "310+ Reviews",
    sugar: "Natural Sweetness",
    fresh: "100% Fresh Berry",
    cardBg: "from-pink-500/10 via-white/50 to-pink-100/10",
    particleColor: "bg-pink-400/40",
    buttonBg: "bg-pink-500 hover:bg-pink-600 shadow-pink-500/20 text-white",
    selectorColor: "bg-pink-500",
    selectorRing: "ring-pink-300",
    fruits: [
      { emoji: "🍓", delay: 0.1, size: "text-4xl", top: "15%", left: "12%", driftX: 16, driftY: -14 },
      { emoji: "🫐", delay: 0.3, size: "text-3xl", top: "10%", left: "75%", driftX: -12, driftY: 12 },
      { emoji: "🍃", delay: 0.2, size: "text-2xl", top: "42%", left: "8%", driftX: 8, driftY: -10 },
      { emoji: "🧊", delay: 0.5, size: "text-2xl", top: "58%", left: "82%", driftX: -10, driftY: 8 },
      { emoji: "🍓", delay: 0.6, size: "text-2xl", top: "72%", left: "15%", driftX: 12, driftY: 15 },
      { emoji: "🍃", delay: 0.4, size: "text-3xl", top: "30%", left: "85%", driftX: -8, driftY: -12 },
      { emoji: "🍒", delay: 0.7, size: "text-2xl", top: "80%", left: "75%", driftX: -10, driftY: -10 },
    ]
  }
} as const;

type ThemeKey = keyof typeof themes;

const themeLabels: Record<ThemeKey, string> = {
  mango: "Mango",
  lime: "Lime",
  strawberry: "Strawberry",
};

const trustStats = [
  { value: "40+", label: "Menu Items", desc: "Unique tropical mixtures", icon: Droplets, color: "text-orange-500", bg: "bg-orange-500/10" },
  { value: "200+", label: "Happy Customers", desc: "Sipping good vibes daily", icon: Sparkles, color: "text-pink-500", bg: "bg-pink-500/10" },
  { value: "4.9★", label: "Rating", desc: "Reviewed on Google & Yelp", icon: Star, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  { value: "3+", label: "Years of Service", desc: "Serving fresh since 2024", icon: ShieldCheck, color: "text-green-500", bg: "bg-green-500/10" },
];

export function Hero() {
  const [activeThemeKey, setActiveThemeKey] = useState<ThemeKey>("mango");
  const activeTheme = themes[activeThemeKey];

  // Mouse Parallax Values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 25 });

  const bgTranslateX = useTransform(springX, [-0.5, 0.5], [-20, 20]);
  const bgTranslateY = useTransform(springY, [-0.5, 0.5], [-20, 20]);

  const drinkTranslateX = useTransform(springX, [-0.5, 0.5], [-12, 12]);
  const drinkTranslateY = useTransform(springY, [-0.5, 0.5], [-12, 12]);

  const cardTranslateX = useTransform(springX, [-0.5, 0.5], [15, -15]);
  const cardTranslateY = useTransform(springY, [-0.5, 0.5], [15, -15]);

  const [hasHover, setHasHover] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover)");
    setHasHover(mediaQuery.matches);

    if (!mediaQuery.matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section
      className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden pt-28 pb-10 transition-all duration-700 select-none"
      style={{ background: "#F8FAFC" }}
    >
      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
        aria-hidden="true"
      />

      {/* Single radial glow behind product */}
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{
          top: "30%",
          left: "50%",
          width: 700,
          height: 700,
          x: hasHover ? bgTranslateX : 0,
          y: hasHover ? bgTranslateY : 0,
          translateX: "-50%",
          translateY: "-50%",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${activeTheme.glowBg} 0%, transparent 70%)`,
          filter: "blur(60px)",
        }}
      />

      {/* Main Layout Container */}
      <div className="container relative z-10 my-auto w-full">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-8 items-center">

          {/* Left Side Info Section */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1, delayChildren: 0.2 }
              }
            }}
            className="flex flex-col text-left max-w-2xl lg:max-w-none"
          >
            {/* Premium Badge */}
            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.9, y: 10 },
                visible: { opacity: 1, scale: 1, y: 0 }
              }}
              className="inline-flex mr-auto items-center gap-2 rounded-full glass px-4 py-2 text-xs md:text-sm font-semibold text-dark-green border border-white/40 shadow-sm"
            >
              <span>{activeTheme.badge}</span>
            </motion.div>

            {/* Dominating Headline */}
            <div className="mt-6 font-heading font-black text-dark-green" style={{ fontSize: "clamp(3.5rem, 8vw, 7.5rem)", lineHeight: 0.95 }}>
              <div className="overflow-hidden py-1">
                <motion.h1
                  key={`${activeThemeKey}-line1`}
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ type: "spring", stiffness: 100, damping: 18 }}
                  className="block"
                >
                  {activeTheme.line1}
                </motion.h1>
              </div>
              <div className="overflow-hidden py-1">
                <motion.h1
                  key={`${activeThemeKey}-line2`}
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ type: "spring", stiffness: 100, damping: 18, delay: 0.05 }}
                  className="block"
                >
                  {activeTheme.line2}
                </motion.h1>
              </div>
              <div className="overflow-hidden py-1">
                <motion.span
                  key={`${activeThemeKey}-line3`}
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ type: "spring", stiffness: 100, damping: 18, delay: 0.1 }}
                  className={cn(
                    "block bg-gradient-to-r bg-clip-text text-transparent filter drop-shadow-sm font-black",
                    activeTheme.accentColor
                  )}
                >
                  {activeTheme.line3}
                </motion.span>
              </div>
            </div>

            {/* Supporting Paragraph */}
            <motion.p
              key={`${activeThemeKey}-desc`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-gray-600 font-medium text-base md:text-lg leading-relaxed max-w-lg"
            >
              {activeTheme.desc}
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { delay: 0.4 } }
              }}
              className="mt-8 flex flex-wrap gap-4 items-center"
            >
              <Link href="/menu">
                <button
                  className={cn(
                    "group min-w-[160px] h-14 px-8 rounded-full text-base font-bold transition-all duration-300 shadow-lg inline-flex items-center justify-center gap-2",
                    activeTheme.buttonBg
                  )}
                >
                  Order Now
                  <ArrowRight className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </Link>

              <Link href="/menu">
                <button
                  className="h-14 min-w-[140px] px-8 rounded-full border border-gray-200 bg-white text-base font-bold text-dark-green shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 inline-flex items-center justify-center"
                >
                  Explore Menu
                </button>
              </Link>
            </motion.div>

            {/* Inline Trust Indicators */}
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { delay: 0.5 } }
              }}
              className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 py-4 border-t border-gray-100"
            >
              <div className="flex items-center gap-2">
                <div className="flex text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm font-bold text-dark-green">4.9 Rating</span>
              </div>
              <div className="h-1.5 w-1.5 rounded-full bg-gray-300" />
              <span className="text-sm font-semibold text-gray-500">200+ Customers</span>
              <div className="h-1.5 w-1.5 rounded-full bg-gray-300" />
              <span className="text-sm font-semibold text-gray-500">40+ Menu Items</span>
            </motion.div>
          </motion.div>

          {/* Right Side Product Showcase */}
          <div className="relative w-full flex items-center justify-center min-h-[460px] md:min-h-[620px]">

            {/* Massive Hero Product Drink */}
            <motion.div
              className="relative z-10 w-[320px] h-[420px] sm:w-[380px] sm:h-[500px] md:w-[420px] md:h-[560px] lg:w-[460px] lg:h-[620px]"
              style={{
                x: hasHover ? drinkTranslateX : 0,
                y: hasHover ? drinkTranslateY : 0,
              }}
            >
              {/* Dynamic Image Swapping */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTheme.id}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={activeTheme.image}
                    alt={activeTheme.name}
                    fill
                    sizes="(max-width: 768px) 320px, (max-width: 1024px) 420px, 460px"
                    className="object-contain"
                    style={{ filter: "drop-shadow(0 60px 90px rgba(0,0,0,0.18))" }}
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {/* Subtle cup shadow */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/5 h-6 bg-black/10 rounded-full blur-xl -z-10" />
            </motion.div>

            {/* Floating Card 1: Bestseller */}
            <motion.div
              className="absolute -bottom-4 left-0 z-20 w-[190px] sm:w-[220px]"
              style={{
                x: hasHover ? cardTranslateX : 0,
                y: hasHover ? cardTranslateY : 0,
              }}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="p-4 rounded-3xl bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-600 text-[10px] font-extrabold uppercase tracking-wider">
                    {activeTheme.badgeText}
                  </span>
                </div>
                <h4 className="font-heading font-extrabold text-sm sm:text-base text-dark-green leading-tight">
                  Best Seller
                </h4>
                <p className="text-[11px] text-gray-500 mt-1 font-medium">Most loved drink this month</p>
              </div>
            </motion.div>

            {/* Floating Card 2: 100% Organic */}
            <motion.div
              className="absolute top-12 right-0 z-20 w-[160px] sm:w-[180px]"
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <div className="p-4 rounded-3xl bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl text-center">
                <div className="text-2xl font-black bg-gradient-to-br from-primary to-primary-dark bg-clip-text text-transparent">
                  Organic
                </div>
                <div className="text-[11px] font-extrabold text-dark-green mt-0.5">100% Fresh</div>
                <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">Made daily from organic fruits</div>
              </div>
            </motion.div>

            {/* Minimal Circular Theme Selectors */}
            <div className="absolute right-0 bottom-4 z-30 flex flex-col gap-3 p-2 bg-white/40 backdrop-blur-lg border border-white/30 rounded-2xl shadow-lg">
              {(Object.keys(themes) as ThemeKey[]).map((themeKey) => {
                const t = themes[themeKey];
                const isActive = activeThemeKey === themeKey;
                return (
                  <button
                    key={themeKey}
                    onClick={() => setActiveThemeKey(themeKey)}
                    aria-label={`Switch to ${t.name}`}
                    className={cn(
                      "relative w-10 h-10 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center",
                      t.selectorColor,
                      isActive
                        ? cn("ring-2 shadow-md", t.selectorRing, "scale-110")
                        : "ring-0 opacity-60 hover:opacity-100"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="theme-selector"
                        className="absolute inset-0 rounded-full ring-2 ring-white shadow-md"
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      />
                    )}
                    <span className="text-[10px] font-bold text-white relative z-10">
                      {themeLabels[themeKey].charAt(0)}
                    </span>
                  </button>
                );
              })}
            </div>

          </div>

        </div>
      </div>

      {/* Trust Section Cards */}
      <div className="container relative z-20 mt-16 lg:mt-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.0 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {trustStats.map((stat) => (
            <div
              key={stat.label}
              className="group relative rounded-3xl border border-white/40 bg-white/30 backdrop-blur-xl p-5 lg:p-6 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-4">
                <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-inner", stat.bg)}>
                  <stat.icon className={cn("h-6 w-6", stat.color)} />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-extrabold text-dark-green">
                    {stat.value}
                  </h3>
                  <p className="text-sm font-bold text-dark-green mt-0.5">
                    {stat.label}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 font-medium leading-relaxed hidden sm:block">
                    {stat.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

    </section>
  );
}
