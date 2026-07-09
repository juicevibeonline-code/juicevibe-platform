"use client";

import { motion } from "framer-motion";
import { Send, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Newsletter() {
  return (
    <section className="section-padding relative overflow-hidden bg-white">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-dark-green to-primary-dark p-10 md:p-16"
        >
          <div className="pointer-events-none absolute -top-20 -right-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-orange/20 blur-3xl" />

          <div className="relative grid items-center gap-8 md:grid-cols-2">
            <div>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <h2 className="font-heading text-3xl font-extrabold text-white md:text-4xl">
                Stay Fresh
              </h2>
              <p className="mt-3 text-white/70">
                Subscribe for exclusive offers, new flavors, and juice bar updates.
              </p>
            </div>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <Input
                type="email"
                placeholder="Enter your email"
                className="h-14 border-white/20 bg-white/10 text-white placeholder:text-white/50"
              />
              <Button variant="primary" size="lg" className="h-14 shrink-0 gap-2">
                <Send className="h-4 w-4" />
                Subscribe
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
