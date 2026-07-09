"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Play, Star, CheckCircle, Leaf, Droplets, Sparkles, Zap, ShieldCheck, X, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    image: "/images/MenuItems/hero.png",
    rating: "4.9",
    reviews: "250+ Reviews",
    sugar: "No Added Sugar",
    fresh: "100% Organic",
    cardBg: "from-orange-500/10 via-white/50 to-orange-100/10",
    particleColor: "bg-orange-400/40",
    buttonBg: "bg-orange-500 hover:bg-orange-600 shadow-orange-500/20 text-white",
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
  detox: {
    id: "detox",
    name: "Avocado Detox",
    badge: "🥑 Raw & Cold-Pressed",
    badgeText: "🌱 Healthy Choice",
    line1: "Crafted By",
    line2: "Raw & Pure",
    line3: "Nature.",
    desc: "Organic premium avocado, crisp green apples, refreshing cucumber, and a splash of lime. Pure nourishment for your mind and body.",
    accentColor: "from-green-500 via-emerald-500 to-teal-400",
    glowColor: "rgba(34, 197, 94, 0.45)",
    glowBg: "rgba(16, 185, 129, 0.12)",
    bgGradient: "linear-gradient(135deg, #F8FFF8 0%, #F0FDF4 35%, #E6FDF5 75%, #F0FFF0 100%)",
    image: "/images/MenuItems/FJAvocado.png",
    rating: "4.8",
    reviews: "180+ Reviews",
    sugar: "No Added Sugar",
    fresh: "100% Superfood",
    cardBg: "from-green-500/10 via-white/50 to-green-100/10",
    particleColor: "bg-green-400/40",
    buttonBg: "bg-primary hover:bg-primary-dark shadow-primary/20 text-white",
    fruits: [
      { emoji: "🥑", delay: 0.1, size: "text-4xl", top: "15%", left: "12%", driftX: 12, driftY: -10 },
      { emoji: "🍏", delay: 0.3, size: "text-3xl", top: "10%", left: "75%", driftX: -14, driftY: 12 },
      { emoji: "🍃", delay: 0.2, size: "text-2xl", top: "42%", left: "8%", driftX: 10, driftY: -12 },
      { emoji: "🧊", delay: 0.5, size: "text-2xl", top: "58%", left: "82%", driftX: -8, driftY: 10 },
      { emoji: "🥑", delay: 0.6, size: "text-2xl", top: "72%", left: "15%", driftX: 14, driftY: 14 },
      { emoji: "🍃", delay: 0.4, size: "text-3xl", top: "30%", left: "85%", driftX: -10, driftY: -8 },
      { emoji: "🍋", delay: 0.7, size: "text-2xl", top: "80%", left: "75%", driftX: -12, driftY: -12 },
    ]
  },
  berry: {
    id: "berry",
    name: "Berry Dream",
    badge: "🫐 Antioxidant Rich",
    badgeText: "🍓 Sweet Treat",
    line1: "Sip The",
    line2: "Beautiful",
    line3: "Vibes.",
    desc: "Antioxidant-rich wild strawberries, ripe organic blueberries, and natural honey. Creamy textures meet refreshing bursts of pure berry energy.",
    accentColor: "from-pink-500 via-rose-500 to-fuchsia-400",
    glowColor: "rgba(244, 63, 94, 0.45)",
    glowBg: "rgba(236, 72, 153, 0.12)",
    bgGradient: "linear-gradient(135deg, #F8FFF8 0%, #FFF5F6 35%, #FFF0F2 75%, #FFFDFD 100%)",
    image: "/images/MenuItems/Milkshakes-Strawberry.png",
    rating: "5.0",
    reviews: "310+ Reviews",
    sugar: "Natural Honey",
    fresh: "100% Wild Berry",
    cardBg: "from-pink-500/10 via-white/50 to-pink-100/10",
    particleColor: "bg-pink-400/40",
    buttonBg: "bg-pink-500 hover:bg-pink-600 shadow-pink-500/20 text-white",
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

const trustStats = [
  { value: "100%", label: "Fresh Fruit", desc: "Sourced locally & organic", icon: Leaf, color: "text-green-500", bg: "bg-green-500/10" },
  { value: "50+", label: "Premium Drinks", desc: "Unique tropical mixtures", icon: Droplets, color: "text-orange-500", bg: "bg-orange-500/10" },
  { value: "10K+", label: "Happy Customers", desc: "Sipping good vibes daily", icon: Sparkles, color: "text-pink-500", bg: "bg-pink-500/10" },
  { value: "4.9★", label: "Average Rating", desc: "Reviewed on Google & Yelp", icon: Star, color: "text-yellow-500", bg: "bg-yellow-500/10" },
];

export function Hero() {
  const [activeThemeKey, setActiveThemeKey] = useState<ThemeKey>("mango");
  const [isVideoOpen, setIsVideoOpen] = useState(false);
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

  const foregroundTranslateX = useTransform(springX, [-0.5, 0.5], [25, -25]);
  const foregroundTranslateY = useTransform(springY, [-0.5, 0.5], [25, -25]);

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

  // Dynamic particle items (persists on render)
  const particlesRef = useRef(
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      size: Math.random() * 5 + 3,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 8 + 8,
      delay: Math.random() * 3,
    }))
  );

  return (
    <>
      <section
        className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden pt-28 pb-10 transition-all duration-700 select-none"
        style={{ background: activeTheme.bgGradient }}
      >
        {/* Background Particles Layer */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          {particlesRef.current.map((p) => (
            <motion.div
              key={p.id}
              className={cn("absolute rounded-full opacity-30", activeTheme.particleColor)}
              style={{
                width: p.size,
                height: p.size,
                left: `${p.x}%`,
                top: `${p.y}%`,
              }}
              animate={{
                y: [0, -80, 0],
                x: [0, Math.random() * 30 - 15, 0],
                opacity: [0.15, 0.4, 0.15],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Ambient background glows */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-0"
          style={{ x: hasHover ? bgTranslateX : 0, y: hasHover ? bgTranslateY : 0 }}
        >
          <div
            className="absolute top-1/4 left-1/3 h-96 w-96 rounded-full blur-[120px] opacity-40 transition-colors duration-700"
            style={{ backgroundColor: activeTheme.glowColor }}
          />
          <div
            className="absolute bottom-1/3 right-1/4 h-[450px] w-[450px] rounded-full blur-[140px] opacity-30 transition-colors duration-700"
            style={{ backgroundColor: activeTheme.glowColor }}
          />
        </motion.div>

        {/* Interactive Main Layout Container */}
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
              <div className="mt-6 font-heading font-extrabold leading-[1.05] tracking-tight text-dark-green text-5xl sm:text-6xl md:text-7xl xl:text-8xl">
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
                  <Button
                    className={cn(
                      "group min-w-[160px] h-14 rounded-full text-base font-bold transition-all duration-300 shadow-lg",
                      activeTheme.buttonBg
                    )}
                  >
                    Order Now
                    <ArrowRight className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </Link>

                <Link href="/menu">
                  <Button
                    variant="ghost"
                    className="h-14 min-w-[140px] rounded-full border border-white/60 bg-white/35 backdrop-blur-md text-base font-bold text-dark-green shadow-sm hover:bg-white/60"
                  >
                    View Menu
                  </Button>
                </Link>

                <button
                  onClick={() => setIsVideoOpen(true)}
                  className="group flex items-center gap-3 text-dark-green font-bold text-base hover:opacity-80 transition-all outline-none"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md border border-white/40 group-hover:scale-105 transition-transform duration-300">
                    <Play className="h-4 w-4 ml-0.5 text-primary fill-primary group-hover:scale-110 transition-transform" />
                  </div>
                  Watch Story
                </button>
              </motion.div>

              {/* Stats Inline Trust Indicators */}
              <motion.div
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { delay: 0.5 } }
                }}
                className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 py-4 border-t border-dark-green/5"
              >
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-dark-green">4.9/5 Rating</span>
                </div>
                <div className="h-1.5 w-1.5 rounded-full bg-dark-green/20" />
                <span className="text-sm font-semibold text-gray-500">10K+ Happy Customers</span>
                <div className="h-1.5 w-1.5 rounded-full bg-dark-green/20" />
                <span className="text-sm font-semibold text-gray-500">100% Fresh Every day</span>
              </motion.div>
            </motion.div>

            {/* Right Side Immersive Composition */}
            <div className="relative w-full flex items-center justify-center min-h-[460px] md:min-h-[560px]">
              
              {/* Radial gradient background behind drink */}
              <motion.div
                key={`${activeThemeKey}-glowBg`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="absolute w-80 h-80 rounded-full blur-3xl z-0 pointer-events-none"
                style={{ backgroundColor: activeTheme.glowBg }}
              />

              {/* Floating Leaf Shadows & Particles */}
              <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                {activeTheme.fruits.map((f, i) => (
                  <motion.div
                    key={`${activeThemeKey}-fruit-${i}`}
                    className={cn("absolute select-none pointer-events-none opacity-85 text-shadow-lg", f.size)}
                    style={{ top: f.top, left: f.left }}
                    initial={{ opacity: 0, scale: 0, y: 50, rotate: -30 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      y: [0, f.driftY, -f.driftY, 0],
                      x: [0, f.driftX, -f.driftX, 0],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{
                      duration: 6 + i,
                      delay: f.delay,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut"
                    }}
                  >
                    {f.emoji}
                  </motion.div>
                ))}
              </div>

              {/* Massive Hero Product Drink */}
              <motion.div
                className="relative z-10 w-[280px] h-[360px] sm:w-[320px] sm:h-[420px] md:w-[350px] md:h-[460px] cursor-grab active:cursor-grabbing"
                style={{
                  x: hasHover ? drinkTranslateX : 0,
                  y: hasHover ? drinkTranslateY : 0,
                  perspective: 1000
                }}
              >
                {/* Dynamic Image Swapping */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTheme.id}
                    initial={{ opacity: 0, scale: 0.85, x: 60, rotate: 5 }}
                    animate={{ opacity: 1, scale: 1, x: 0, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: -60, rotate: -5 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src={activeTheme.image}
                      alt={activeTheme.name}
                      fill
                      className="object-contain filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.12)] hover:scale-[1.03] transition-transform duration-500"
                      priority
                    />
                    
                    {/* Orange splash overlay effect behind cup */}
                    <div className="absolute inset-0 -z-10 bg-radial from-white/30 to-transparent opacity-80 rounded-full scale-75 animate-pulse" />
                  </motion.div>
                </AnimatePresence>

                {/* Cup Shadow */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-4/5 h-8 bg-black/10 rounded-full blur-xl -z-10" />
              </motion.div>

              {/* Floating Premium Card 1: Bestseller Info */}
              <motion.div
                className="absolute -bottom-8 left-0 z-20 w-[180px] sm:w-[210px] pointer-events-auto"
                style={{
                  x: hasHover ? cardTranslateX : 0,
                  y: hasHover ? cardTranslateY : 0,
                }}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <div className={cn(
                  "p-4 rounded-3xl backdrop-blur-xl border border-white/40 shadow-xl bg-gradient-to-br",
                  activeTheme.cardBg
                )}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 text-[10px] font-extrabold uppercase tracking-wider">
                      {activeTheme.badgeText}
                    </span>
                  </div>
                  <h4 className="font-heading font-extrabold text-sm sm:text-base text-dark-green leading-tight">
                    {activeTheme.name}
                  </h4>
                  <div className="flex items-center gap-1 mt-1 text-[11px] font-semibold text-gray-500">
                    <Star className="h-3.5 w-3.5 fill-current text-orange-500" />
                    <span className="font-bold text-dark-green">{activeTheme.rating}</span>
                    <span>• {activeTheme.sugar}</span>
                  </div>
                </div>
              </motion.div>

              {/* Floating Premium Card 2: 100% Fresh */}
              <motion.div
                className="absolute top-12 right-0 z-20 w-[140px] sm:w-[160px] pointer-events-auto"
                style={{
                  x: hasHover ? foregroundTranslateX : 0,
                  y: hasHover ? foregroundTranslateY : 0,
                }}
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
              >
                <div className="p-4 rounded-3xl bg-white/40 backdrop-blur-xl border border-white/40 shadow-xl text-center">
                  <div className="text-2xl font-black bg-gradient-to-br from-primary to-primary-dark bg-clip-text text-transparent">
                    100%
                  </div>
                  <div className="text-[11px] font-extrabold text-dark-green mt-0.5">Fresh Fruits</div>
                  <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">Made Daily</div>
                </div>
              </motion.div>

              {/* Interactive Thumbnail Theme Selectors */}
              <div className="absolute right-0 bottom-0 z-30 flex flex-col gap-3 p-2 bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-lg">
                {(Object.keys(themes) as ThemeKey[]).map((themeKey) => {
                  const t = themes[themeKey];
                  const isActive = activeThemeKey === themeKey;
                  return (
                    <button
                      key={themeKey}
                      onClick={() => setActiveThemeKey(themeKey)}
                      aria-label={`Switch to ${t.name}`}
                      className={cn(
                        "relative w-12 h-16 rounded-xl overflow-hidden border transition-all duration-300 hover:scale-105 active:scale-95",
                        isActive
                          ? "border-primary/80 ring-2 ring-primary/20 shadow-md shadow-primary/10 bg-white"
                          : "border-white/50 bg-white/40 hover:bg-white/60"
                      )}
                    >
                      <Image
                        src={t.image}
                        alt={t.name}
                        fill
                        sizes="48px"
                        className="object-contain p-1"
                      />
                    </button>
                  );
                })}
              </div>

            </div>

          </div>
        </div>

        {/* Floating Trust Section cards under the Hero */}
        <div className="container relative z-20 mt-16 lg:mt-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.0 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {trustStats.map((stat, i) => (
              <div
                key={stat.label}
                className="group relative rounded-3xl border border-white/40 bg-white/30 backdrop-blur-lg p-5 lg:p-6 shadow-md transition-all duration-500 hover:shadow-xl hover:-translate-y-1.5 overflow-hidden"
              >
                {/* Light reflection effect inside card on hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                
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

      {/* Video Modal Screen */}
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center p-4"
          >
            {/* Dark glass backdrop overlay */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setIsVideoOpen(false)}
            />

            {/* Video container card */}
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-4xl aspect-video rounded-3xl bg-black border border-white/10 overflow-hidden shadow-2xl z-10"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsVideoOpen(false)}
                className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white/80 border border-white/10 hover:bg-black/90 hover:text-white transition-all z-20"
                aria-label="Close video"
              >
                <X className="h-5 w-5" />
              </button>

              {/* YouTube Iframe Player */}
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="Juice Vibe Story"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}