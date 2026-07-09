"use client";

import { motion } from "framer-motion";
import { Cake, Sparkles, Music, Gift, Camera, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const packages = [
  {
    icon: Cake,
    title: "Custom Cakes",
    description: "Personalized birthday cakes made fresh with premium ingredients.",
    color: "#F43F5E",
  },
  {
    icon: Music,
    title: "Party Setup",
    description: "Decorations, balloons, and music to set the perfect vibe.",
    color: "#FB923C",
  },
  {
    icon: Gift,
    title: "Party Platters",
    description: "Customized menu platters for groups of all sizes.",
    color: "#22C55E",
  },
  {
    icon: Camera,
    title: "Photo Moments",
    description: "Dedicated photo spots and instant print memories.",
    color: "#FBBF24",
  },
];

export function Celebrations() {
  return (
    <section className="section-padding relative overflow-hidden bg-white">
      <div className="absolute top-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-pink/5 blur-3xl" />

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-block rounded-full bg-pink/10 px-4 py-2 text-sm font-medium text-pink">
            Celebrate With Us
          </span>
          <h2 className="mt-4 font-heading text-3xl font-extrabold text-dark-green md:text-4xl lg:text-5xl">
            Make Your{" "}
            <span className="text-gradient-warm">Celebration</span> Special
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            From birthdays to special occasions, we make every moment memorable with premium packages.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="group rounded-2xl bg-white p-8 card-shadow transition-all hover:shadow-xl text-center"
            >
              <div
                className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl transition-all group-hover:scale-110"
                style={{ backgroundColor: `${pkg.color}15` }}
              >
                <pkg.icon className="h-7 w-7" style={{ color: pkg.color }} />
              </div>
              <h3 className="mb-3 font-heading text-xl font-bold text-dark-green">{pkg.title}</h3>
              <p className="text-sm leading-relaxed text-gray-600">{pkg.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 overflow-hidden rounded-3xl bg-gradient-to-br from-pink/10 via-orange/5 to-primary/5 p-10 md:p-16"
        >
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-pink">
                <PartyPopper className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-dark-green md:text-3xl">
                Birthday Party Package
              </h3>
              <p className="mt-3 text-gray-600 leading-relaxed">
                Let us handle the celebration while you enjoy the moments. Custom decorations, 
                personalized cake, party platters, and a dedicated host for your event.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Customized birthday cake",
                  "Party decorations & balloons",
                  "Special menu for guests",
                  "Dedicated celebration area",
                  "Photo memories included",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                    <Sparkles className="h-4 w-4 shrink-0 text-pink" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link href="/contact">
                  <Button variant="primary" size="lg">
                    <PartyPopper className="h-5 w-5" />
                    Book Your Celebration
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative aspect-square rounded-3xl bg-gradient-to-br from-pink/20 via-orange/10 to-primary/10">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-8xl">🎂</div>
                    <div className="mt-4 font-heading text-3xl font-extrabold text-dark-green">
                      Celebrate at Juice Vibe
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
