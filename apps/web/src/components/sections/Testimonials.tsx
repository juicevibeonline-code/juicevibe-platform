"use client";

import { motion } from "framer-motion";
import { Star, Quote, Users, Utensils } from "lucide-react";
import { testimonials } from "@/data/testimonials";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stats = [
  { value: "4.9", label: "Rating", icon: Star, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  { value: "200+", label: "Happy Customers", icon: Users, color: "text-pink-500", bg: "bg-pink-500/10" },
  { value: "40+", label: "Menu Items", icon: Utensils, color: "text-orange-500", bg: "bg-orange-500/10" },
];

export function Testimonials() {
  return (
    <section className="section-padding relative overflow-hidden bg-light-bg">
      <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-orange/5 blur-3xl" />

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-block rounded-full bg-orange/10 px-4 py-2 text-sm font-medium text-orange">
            Testimonials
          </span>
          <h2 className="mt-4 font-heading text-3xl font-extrabold text-dark-green md:text-4xl lg:text-5xl">
            What Our{" "}
            <span className="text-gradient-warm">Community</span> Says
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Loved by hundreds of happy customers across Sri Lanka
          </p>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 flex flex-wrap justify-center gap-8 md:gap-12"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <div className="font-heading text-2xl font-extrabold text-dark-green">{stat.value}</div>
                <div className="text-xs font-semibold text-gray-500">{stat.label}</div>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="group relative rounded-2xl bg-white p-8 card-shadow transition-all hover:shadow-xl"
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-primary/10" />

              <div className="flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow text-yellow" />
                ))}
              </div>

              <p className="mt-4 text-sm leading-relaxed text-gray-600">&ldquo;{testimonial.text}&rdquo;</p>

              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-dark text-sm font-bold text-white">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-dark-green">{testimonial.name}</div>
                  <div className="text-xs text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
