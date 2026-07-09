"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { FeaturedSection } from "@/components/sections/FeaturedSection";
import { Testimonials } from "@/components/sections/Testimonials";
import { Celebrations } from "@/components/sections/Celebrations";
import { Newsletter } from "@/components/sections/Newsletter";
import { ScrollProgress } from "@/components/shared/ScrollProgress";
import { BackToTop } from "@/components/shared/BackToTop";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { LoadingScreen } from "@/components/shared/LoadingScreen";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <LoadingScreen isLoading={isLoading} />
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <FeaturedSection />
        <Testimonials />
        <Celebrations />
        <Newsletter />
      </main>
      <Footer />
      <BackToTop />
      <WhatsAppButton />
    </>
  );
}
