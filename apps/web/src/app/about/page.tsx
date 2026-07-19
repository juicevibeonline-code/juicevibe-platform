"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Leaf, Heart, Sparkles, Award, Apple, Sun, MapPin, Coffee, Utensils } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/shared/ScrollProgress";
import { BackToTop } from "@/components/shared/BackToTop";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";

const values = [
  {
    icon: Apple,
    title: "100% Fresh Ingredients",
    description: "We handpick fresh tropical fruits daily from local Sri Lankan orchards for pure flavor.",
    color: "#22C55E",
  },
  {
    icon: Heart,
    title: "Crafted with Passion",
    description: "Every juice, smoothie, and dish is handcrafted with care, quality, and passion.",
    color: "#F43F5E",
  },
  {
    icon: Sparkles,
    title: "Uncompromising Quality",
    description: "Pure, natural goodness without artificial additives or unnecessary preservatives.",
    color: "#FB923C",
  },
  {
    icon: Sun,
    title: "Tropical Vibe & Energy",
    description: "Step into a refreshing atmosphere designed to uplift your day and energize your body.",
    color: "#FBBF24",
  },
];

const highlights = [
  {
    icon: Coffee,
    title: "Fresh Juices & Smoothies",
    description: "Cold-pressed juices, thick milkshakes, and nutritious smoothie bowls.",
  },
  {
    icon: Utensils,
    title: "Gourmet Eats",
    description: "Handcrafted burgers, toasted sandwiches, fresh salads, and delicious sides.",
  },
  {
    icon: MapPin,
    title: "Waskaduwa Coastal Spot",
    description: "Located conveniently along Galle Road in Waskaduwa for locals and travelers.",
  },
];

export default function AboutPage() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main>
        {/* Hero Banner */}
        <section className="relative overflow-hidden bg-light-bg pt-28 pb-16 md:pt-36 md:pb-20">
          <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-orange/5 blur-3xl pointer-events-none" />

          <div className="container relative">
            <div className="mx-auto max-w-3xl text-center space-y-4">
              <span className="inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                About Juice Vibe
              </span>
              <h1 className="font-heading text-4xl font-extrabold text-dark-green md:text-5xl lg:text-6xl">
                Our Story of <span className="text-gradient">Tropical Freshness</span>
              </h1>
              <p className="text-lg text-gray-600 font-medium leading-relaxed max-w-2xl mx-auto">
                Welcome to Juice Vibe Waskaduwa — your ultimate destination for cold-pressed tropical juices, nutritious smoothies, and gourmet foods.
              </p>
            </div>

            <div className="mt-16 grid items-center gap-12 lg:grid-cols-2">
              <div>
                <div className="relative overflow-hidden rounded-3xl shadow-xl border border-gray-100">
                  <Image
                    src="/images/Opening/Opening.png"
                    alt="Juice Vibe Grand Opening Waskaduwa"
                    width={700}
                    height={500}
                    className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105"
                    priority
                  />
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="font-heading text-3xl font-extrabold text-dark-green leading-tight">
                  Bringing Freshness to <span className="text-gradient-warm">Waskaduwa</span>
                </h2>
                <div className="space-y-4 text-gray-600 leading-relaxed font-medium">
                  <p>
                    Juice Vibe was founded with a clear passion: to serve genuine, 100% natural, and deliciously crafted fruit juices and wholesome foods along Sri Lanka&apos;s beautiful coast.
                  </p>
                  <p>
                    Whether you are taking a break from travelling along Galle Road or relaxing by Waskaduwa beach, our menu offers a refreshing blend of cold-pressed juices, signature smoothies, gourmet burgers, and artisan coffee.
                  </p>
                  <p>
                    Every drink is prepared fresh to order using hand-selected local fruits and premium ingredients. We believe good health and incredible taste go hand in hand!
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  {highlights.map((item) => (
                    <div key={item.title} className="rounded-2xl bg-white p-4 border border-gray-100 shadow-sm space-y-1.5">
                      <item.icon className="h-5 w-5 text-primary" />
                      <h3 className="text-xs font-bold text-dark-green leading-tight">{item.title}</h3>
                      <p className="text-[11px] text-gray-500 leading-snug">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Grand Opening Banner */}
        <section className="relative overflow-hidden bg-gradient-to-br from-dark-green via-primary-dark to-primary py-20 text-white">
          <div className="absolute inset-0 bg-[url('/images/Opening/Opening.png')] bg-cover bg-center opacity-15 mix-blend-overlay" />
          <div className="container relative text-center max-w-3xl space-y-4">
            <span className="inline-block rounded-full bg-white/20 px-5 py-2 text-sm font-bold text-white backdrop-blur-sm">
              ✨ Grand Opening
            </span>
            <h2 className="font-heading text-3xl font-extrabold md:text-5xl leading-tight">
              We&apos;re Open & Serving Daily!
            </h2>
            <p className="text-lg text-white/90 leading-relaxed max-w-2xl mx-auto font-medium">
              Join us at Juice Vibe Waskaduwa to experience our full menu of handcrafted beverages, fresh smoothie bowls, and delicious meals.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="section-padding bg-white">
          <div className="container">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-3xl bg-gradient-to-br from-primary/5 to-primary/10 p-8 sm:p-10 border border-primary/10 shadow-sm space-y-3">
                <Award className="h-10 w-10 text-primary" />
                <h3 className="font-heading text-2xl font-bold text-dark-green">Our Mission</h3>
                <p className="text-gray-600 leading-relaxed font-medium">
                  To inspire a healthier, vibrant lifestyle by serving pure, delicious, and nutrient-rich juices and foods made with genuine local ingredients and warm hospitality.
                </p>
              </div>

              <div className="rounded-3xl bg-gradient-to-br from-orange/5 to-orange/10 p-8 sm:p-10 border border-orange/10 shadow-sm space-y-3">
                <Leaf className="h-10 w-10 text-orange" />
                <h3 className="font-heading text-2xl font-bold text-dark-green">Our Vision</h3>
                <p className="text-gray-600 leading-relaxed font-medium">
                  To be Waskaduwa&apos;s most loved tropical juice bar, recognized for uncompromising freshness, creative flavor recipes, and an inviting coastal vibe.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="section-padding bg-light-bg">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-primary">Our Values</span>
              <h2 className="font-heading text-3xl font-extrabold text-dark-green md:text-4xl">
                What We <span className="text-gradient">Stand For</span>
              </h2>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="rounded-2xl bg-white p-7 border border-gray-100 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
                >
                  <value.icon className="h-9 w-9" style={{ color: value.color }} />
                  <h3 className="mt-4 font-heading text-lg font-bold text-dark-green">{value.title}</h3>
                  <p className="mt-2 text-xs text-gray-600 leading-relaxed font-medium">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />
      <WhatsAppButton />
    </>
  );
}
