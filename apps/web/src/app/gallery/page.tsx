"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/shared/ScrollProgress";
import { BackToTop } from "@/components/shared/BackToTop";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { GalleryCard } from "@/components/gallery/GalleryCard";
import { Lightbox } from "@/components/gallery/Lightbox";
import { galleryImages } from "@/data/gallery";

const categories = [
  { id: "all", label: "All" },
  { id: "juices", label: "Juices" },
  { id: "smoothies", label: "Smoothies" },
  { id: "signature", label: "Signature" },
  { id: "food", label: "Food" },
  { id: "milkshakes", label: "Milkshakes" },
  { id: "coffee", label: "Coffee" },
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredImages = useMemo(
    () =>
      activeCategory === "all"
        ? galleryImages
        : galleryImages.filter((img) => img.category === activeCategory),
    [activeCategory]
  );

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main>
        <section className="relative overflow-hidden bg-light-bg pt-28 pb-16 md:pt-36 md:pb-20">
          <div className="absolute top-0 left-0 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-orange/5 blur-3xl" />

          <div className="container relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mx-auto max-w-2xl text-center"
            >
              <span className="inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                Gallery
              </span>
              <h1 className="mt-4 font-heading text-4xl font-extrabold text-dark-green md:text-5xl lg:text-6xl">
                A Visual{" "}
                <span className="text-gradient-warm">Journey</span>
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                Explore our vibrant world of flavors, moments, and memories.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-12 flex flex-wrap justify-center gap-2"
            >
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                    activeCategory === cat.id
                      ? "bg-primary text-white shadow-lg shadow-primary/25"
                      : "bg-white text-gray-600 hover:bg-primary/5 hover:text-primary"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </motion.div>

            <motion.div
              layout
              className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4"
            >
              {filteredImages.map((image, i) => (
                <motion.div
                  key={image.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mb-4 break-inside-avoid"
                >
                  <GalleryCard
                    image={image}
                    index={i}
                    onOpen={() => setLightboxIndex(i)}
                  />
                </motion.div>
              ))}
            </motion.div>

            {filteredImages.length === 0 && (
              <div className="mt-16 text-center">
                <p className="text-gray-500">No images found in this category.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />
      <WhatsAppButton />

      {lightboxIndex !== null && (
        <Lightbox
          images={filteredImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex((prev) => (prev! > 0 ? prev! - 1 : prev!))}
          onNext={() =>
            setLightboxIndex((prev) =>
              prev! < filteredImages.length - 1 ? prev! + 1 : prev!
            )
          }
        />
      )}
    </>
  );
}
