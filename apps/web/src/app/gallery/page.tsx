"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/shared/ScrollProgress";
import { BackToTop } from "@/components/shared/BackToTop";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { GalleryCard } from "@/components/gallery/GalleryCard";
import { Lightbox } from "@/components/gallery/Lightbox";
import { galleryService, menuService, type GalleryImage } from "@juice-vibe/services";
import { formatPrice } from "@juice-vibe/utils";

const categories = [
  { id: "all", label: "All" },
  { id: "fresh-juices", label: "Juices" },
  { id: "smoothies", label: "Smoothies" },
  { id: "mocktails", label: "Mocktails" },
  { id: "ice-cream", label: "Ice Cream" },
  { id: "milkshakes", label: "Milkshakes" },
  { id: "coffee", label: "Coffee" },
  { id: "burgers", label: "Burgers" },
  { id: "sandwiches", label: "Sandwiches" },
  { id: "tea", label: "Tea" },
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);

      const [rawGallery, menuItems] = await Promise.all([
        galleryService.getImages().catch(() => []),
        menuService.getMenuItems().catch(() => []),
      ]);

      // Transform all menu items that have an image into GalleryImage items
      const productImages: GalleryImage[] = menuItems
        .filter((item) => item.thumbnail || item.images?.[0] || (item as any).image)
        .map((item) => {
          const src = item.thumbnail || item.images?.[0] || (item as any).image || "";
          const categorySlug =
            typeof item.category === "string"
              ? item.category
              : item.category?.slug || "general";

          return {
            id: `menu-${item.id}`,
            src,
            alt: `${item.name} — LKR ${formatPrice(item.price)}`,
            width: 800,
            height: 600,
            category: categorySlug,
            isVideo: false,
          };
        });

      // Combine menu product images + standalone gallery images (excluding team and interior photos)
      const combined = [...productImages, ...rawGallery].filter(
        (img) =>
          img.category !== "team" &&
          img.category !== "interior" &&
          !img.alt?.toLowerCase().includes("team") &&
          !img.alt?.toLowerCase().includes("interior")
      );
      setGalleryImages(combined);
    } catch (err) {
      console.error("Failed to load gallery images:", err);
      setError("Unable to connect to the server. Please check if the API is running or try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const filteredImages = useMemo(() => {
    if (activeCategory === "all") return galleryImages;
    const target = activeCategory.toLowerCase();

    return galleryImages.filter((img) => {
      const cat = (img.category || "").toLowerCase();
      if (cat === target) return true;
      if (target === "fresh-juices" && (cat.includes("juice") || cat === "fresh-juices")) return true;
      if (target === "smoothies" && cat.includes("smoothie")) return true;
      if (target === "milkshakes" && cat.includes("shake")) return true;
      if (target === "burgers" && cat.includes("burger")) return true;
      if (target === "sandwiches" && cat.includes("sandwich")) return true;
      if (target === "ice-cream" && (cat.includes("ice") || cat.includes("cream"))) return true;
      if (target === "coffee" && cat.includes("coffee")) return true;
      if (target === "tea" && cat.includes("tea")) return true;
      return false;
    });
  }, [activeCategory, galleryImages]);

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
                Gallery & Menu Catalog
              </span>
              <h1 className="mt-4 font-heading text-4xl font-extrabold text-dark-green md:text-5xl lg:text-6xl">
                A Visual{" "}
                <span className="text-gradient-warm">Journey</span>
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                Explore our vibrant world of tropical juices, smoothies, meals, and cafe moments.
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

            {loading ? (
              <div className="mt-16 text-center">
                <div className="text-4xl animate-bounce">📸</div>
                <p className="mt-4 font-mono text-sm text-dark-green uppercase tracking-wider animate-pulse">
                  Compiling Tropical Moments & Menu Catalog...
                </p>
              </div>
            ) : error ? (
              <div className="mt-16 text-center">
                <div className="text-4xl">⚠️</div>
                <h3 className="mt-4 font-heading text-xl font-bold text-red-500">Failed to Load Gallery</h3>
                <p className="mt-2 text-gray-500 max-w-md mx-auto font-medium">{error}</p>
                <button
                  onClick={loadData}
                  className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:bg-primary-dark hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
                >
                  Retry Connection
                </button>
              </div>
            ) : (
              <>
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
                    <p className="text-gray-500 font-medium">No product images found in this category.</p>
                  </div>
                )}
              </>
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
