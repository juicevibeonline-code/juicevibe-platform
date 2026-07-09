"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/shared/ScrollProgress";
import { BackToTop } from "@/components/shared/BackToTop";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

const contactInfo = [
  {
    icon: MapPin,
    title: "Visit Us",
    details: ["Galle Road", "Bentota, Sri Lanka"],
  },
  {
    icon: Phone,
    title: "Call Us",
    details: ["+94 71 843 5876"],
    href: "tel:+94718435876",
  },
  {
    icon: Mail,
    title: "Email Us",
    details: ["hello@juicevibe.com", "orders@juicevibe.com"],
    href: "mailto:hello@juicevibe.com",
  },
  {
    icon: Clock,
    title: "Opening Hours",
    details: ["Mon - Fri: 8 AM - 10 PM", "Sat: 9 AM - 11 PM", "Sun: 10 AM - 9 PM"],
  },
];

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormState({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main>
        <section className="relative overflow-hidden bg-light-bg pt-28 pb-16 md:pt-36 md:pb-20">
          <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-orange/5 blur-3xl" />

          <div className="container relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mx-auto max-w-2xl text-center"
            >
              <span className="inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                Get in Touch
              </span>
              <h1 className="mt-4 font-heading text-4xl font-extrabold text-dark-green md:text-5xl lg:text-6xl">
                Let&apos;s{" "}
                <span className="text-gradient">Connect</span>
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                We&apos;d love to hear from you. Drop us a message or visit us.
              </p>
            </motion.div>

            <div className="mt-16 grid gap-8 lg:grid-cols-5">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-4 lg:col-span-3"
              >
                <Card className="p-8">
                  <h2 className="font-heading text-2xl font-bold text-dark-green">Send a Message</h2>
                  <p className="mt-2 text-sm text-gray-500">
                    We&apos;ll get back to you within 24 hours.
                  </p>

                  {submitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-8 flex flex-col items-center justify-center rounded-2xl bg-primary/5 py-16"
                    >
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                        <Send className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="mt-4 font-heading text-xl font-bold text-dark-green">
                        Message Sent!
                      </h3>
                      <p className="mt-2 text-gray-500">Thank you for reaching out. We&apos;ll be in touch soon.</p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                      <div className="grid gap-5 sm:grid-cols-2">
                        <Input
                          id="name"
                          label="Full Name"
                          placeholder="John Doe"
                          value={formState.name}
                          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                          required
                        />
                        <Input
                          id="email"
                          label="Email Address"
                          type="email"
                          placeholder="john@example.com"
                          value={formState.email}
                          onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                          required
                        />
                      </div>
                      <Input
                        id="subject"
                        label="Subject"
                        placeholder="How can we help?"
                        value={formState.subject}
                        onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                      />
                      <Textarea
                        id="message"
                        label="Message"
                        placeholder="Tell us more about your inquiry..."
                        value={formState.message}
                        onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                        required
                      />
                      <Button variant="primary" size="lg" className="w-full" type="submit">
                        <Send className="h-4 w-4" />
                        Send Message
                      </Button>
                    </form>
                  )}
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="space-y-4 lg:col-span-2"
              >
                {contactInfo.map((info) => (
                  <Card key={info.title} className="group transition-all hover:shadow-lg">
                    <CardContent className="flex items-start gap-4 p-5">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-all group-hover:bg-primary group-hover:text-white">
                        <info.icon className="h-5 w-5 text-primary transition-all group-hover:text-white" />
                      </div>
                      <div>
                        <h3 className="font-heading text-base font-bold text-dark-green">{info.title}</h3>
                        {info.details.map((detail, i) => (
                          <p key={i} className="text-sm text-gray-500">
                            {info.href ? (
                              <a href={info.href} className="hover:text-primary transition-colors">
                                {detail}
                              </a>
                            ) : (
                              detail
                            )}
                          </p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <a
                  href="https://wa.me/94718435876"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-2xl bg-[#25D366]/10 p-5 transition-all hover:bg-[#25D366]/20"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#25D366]">
                    <MessageCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-heading text-base font-bold text-dark-green">Chat on WhatsApp</div>
                    <div className="text-sm text-gray-500">Quick replies, usually within 5 min</div>
                  </div>
                </a>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 overflow-hidden rounded-3xl"
            >
              <div className="aspect-[21/9] w-full bg-gray-200">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2000!2d79.94654846191406!3d6.631149768829346!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMzcnNTIuMSJOIDc5wrA1Nic0Ny42IkU!5e0!3m2!1sen!2sin!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: "300px" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Juice Vibe Location"
                />
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />
      <WhatsAppButton />
    </>
  );
}
