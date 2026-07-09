"use client";

import { motion } from "framer-motion";
import { Apple, CupSoda, Sandwich, Sparkles } from "lucide-react";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import Link from "next/link";

const features = [
  {
    icon: Apple,
    title: "100% Fresh",
    description: "Handpicked fruits, cold-pressed daily for maximum nutrition and flavor.",
    color: "#22C55E",
    bgColor: "bg-primary/10",
  },
  {
    icon: CupSoda,
    title: "Premium Taste",
    description: "Expertly crafted recipes that blend tradition with tropical innovation.",
    color: "#FB923C",
    bgColor: "bg-orange/10",
  },
  {
    icon: Sandwich,
    title: "Quality Food",
    description: "Gourmet burgers, sandwiches and sides made from the finest ingredients.",
    color: "#F43F5E",
    bgColor: "bg-pink/10",
  },
  {
    icon: Sparkles,
    title: "Healthy Living",
    description: "Every sip and bite is designed to nourish your body and uplift your spirit.",
    color: "#FBBF24",
    bgColor: "bg-yellow/10",
  },
];

const stats = [
  { end: 50, suffix: "+", label: "Menu Items" },
  { end: 1000, suffix: "+", label: "Happy Customers" },
  { end: 4, suffix: ".9★", label: "Rating" },
  { end: 3, suffix: "+", label: "Locations" },
];

export function FeaturedSection() {
  return (
    <section className="section-padding relative overflow-hidden bg-white">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            Why Juice Vibe
          </span>
          <h2 className="mt-4 font-heading text-3xl font-extrabold text-dark-green md:text-4xl lg:text-5xl">
            Crafted with{" "}
            <span className="text-gradient">Passion</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            We believe in the power of fresh, natural ingredients to transform your day.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="group rounded-2xl bg-white p-8 card-shadow transition-all hover:shadow-xl"
            >
              <div
                className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${feature.bgColor} transition-all group-hover:scale-110`}
              >
                <feature.icon className="h-7 w-7" style={{ color: feature.color }} />
              </div>
              <h3 className="mb-3 font-heading text-xl font-bold text-dark-green">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 rounded-3xl bg-gradient-to-br from-dark-green to-primary-dark p-10 md:p-16">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="font-heading text-4xl font-extrabold text-white md:text-5xl">
                  <AnimatedCounter end={stat.end} suffix={stat.suffix} />
                </div>
                <div className="mt-2 text-sm font-medium text-white/70">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 font-semibold text-primary transition-all hover:gap-3"
          >
            Explore Full Menu
            <span className="text-lg">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
