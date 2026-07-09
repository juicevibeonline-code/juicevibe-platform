"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Leaf, Heart, Sparkles, Award, Apple, Sun } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/shared/ScrollProgress";
import { BackToTop } from "@/components/shared/BackToTop";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";

const values = [
  {
    icon: Apple,
    title: "Fresh Ingredients",
    description: "We source the freshest fruits and vegetables daily from local organic farms.",
    color: "#22C55E",
  },
  {
    icon: Heart,
    title: "Made with Love",
    description: "Every drink and dish is handcrafted with passion and attention to detail.",
    color: "#F43F5E",
  },
  {
    icon: Sparkles,
    title: "Premium Quality",
    description: "We never compromise on quality. Only the best ingredients make the cut.",
    color: "#FB923C",
  },
  {
    icon: Sun,
    title: "Healthy Lifestyle",
    description: "We believe great taste and nutrition go hand in hand. Feel good inside out.",
    color: "#FBBF24",
  },
];

const team = [
  { name: "Arjun Mehta", role: "Founder & Head Mixologist", initial: "AM" },
  { name: "Sofia D'Souza", role: "Head Chef", initial: "SD" },
  { name: "Vikram Raj", role: "Operations Manager", initial: "VR" },
  { name: "Maya Krishnan", role: "Creative Director", initial: "MK" },
];

export default function AboutPage() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main>
        <section className="relative overflow-hidden bg-light-bg pt-28 pb-16 md:pt-36 md:pb-20">
          <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-orange/5 blur-3xl" />

          <div className="container relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mx-auto max-w-3xl text-center"
            >
              <span className="inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                About Us
              </span>
              <h1 className="mt-4 font-heading text-4xl font-extrabold text-dark-green md:text-5xl lg:text-6xl">
                Our Story of{" "}
                <span className="text-gradient">Freshness</span>
              </h1>
            </motion.div>

            <div className="mt-16 grid items-center gap-12 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="relative">
                  <Image
                    src="/images/sampleui.jpeg"
                    alt="Juice Vibe Store"
                    width={600}
                    height={450}
                    className="aspect-[4/3] rounded-3xl object-cover"
                  />
                  <div className="absolute -bottom-4 -right-4 rounded-2xl bg-white p-6 shadow-xl">
                    <div className="font-heading text-3xl font-extrabold text-dark-green">
                      <AnimatedCounter end={2024} />
                    </div>
                    <div className="text-sm text-gray-500">Founded</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="space-y-6"
              >
                <h2 className="font-heading text-3xl font-extrabold text-dark-green">
                  From a Dream to a{" "}
                  <span className="text-gradient-warm">Vibe</span>
                </h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    Juice Vibe was born from a simple belief: that what you drink should
                    make you feel amazing. Our founder, Arjun Mehta, traveled across
                    tropical regions discovering flavor combinations that would
                    redefine the juice bar experience.
                  </p>
                  <p>
                    We opened our doors in 2024 with a mission to bring premium,
                    freshly crafted beverages and food to everyone who values quality
                    and taste. Every ingredient is handpicked, every recipe tested to
                    perfection, and every drink served with a smile.
                  </p>
                  <p>
                    Today, Juice Vibe is more than a juice bar — it&apos;s a community of
                    health-conscious food lovers, a destination for flavor explorers,
                    and a place where every visit feels like a tropical escape.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="section-padding bg-white">
          <div className="container">
            <div className="grid gap-8 md:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="rounded-3xl bg-gradient-to-br from-primary/5 to-primary/10 p-10"
              >
                <Award className="h-10 w-10 text-primary" />
                <h3 className="mt-4 font-heading text-2xl font-bold text-dark-green">Our Mission</h3>
                <p className="mt-3 text-gray-600 leading-relaxed">
                  To inspire a healthier, happier lifestyle by making fresh, delicious,
                  and nutritious drinks and food accessible to everyone. We believe every
                  sip should be an experience.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="rounded-3xl bg-gradient-to-br from-orange/5 to-orange/10 p-10"
              >
                <Leaf className="h-10 w-10 text-orange" />
                <h3 className="mt-4 font-heading text-2xl font-bold text-dark-green">Our Vision</h3>
                <p className="mt-3 text-gray-600 leading-relaxed">
                  To become the most loved juice bar brand worldwide, known for uncompromising
                  quality, innovative flavors, and a commitment to sustainable, healthy living.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="section-padding bg-light-bg">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h2 className="font-heading text-3xl font-extrabold text-dark-green md:text-4xl">
                What We <span className="text-gradient">Stand For</span>
              </h2>
            </motion.div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value, i) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="rounded-2xl bg-white p-8 card-shadow transition-all hover:shadow-xl"
                >
                  <value.icon className="h-10 w-10" style={{ color: value.color }} />
                  <h3 className="mt-5 font-heading text-xl font-bold text-dark-green">{value.title}</h3>
                  <p className="mt-3 text-sm text-gray-600 leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-white">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h2 className="font-heading text-3xl font-extrabold text-dark-green md:text-4xl">
                Meet the <span className="text-gradient-warm">Team</span>
              </h2>
              <p className="mt-3 text-gray-600">
                The passionate people behind every great flavor.
              </p>
            </motion.div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {team.map((member, i) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="group text-center"
                >
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-dark text-2xl font-bold text-white shadow-lg transition-all group-hover:scale-110 group-hover:shadow-xl">
                    {member.initial}
                  </div>
                  <h3 className="mt-4 font-heading text-lg font-bold text-dark-green">{member.name}</h3>
                  <p className="text-sm text-gray-500">{member.role}</p>
                </motion.div>
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
