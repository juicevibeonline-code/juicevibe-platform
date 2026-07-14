"use client";

import { Suspense, useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useCartStore } from "@/store/cart";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/shared/ScrollProgress";
import { BackToTop } from "@/components/shared/BackToTop";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { MenuSearch } from "@/components/menu/MenuSearch";
import { MenuCategoryFilter } from "@/components/menu/MenuCategoryFilter";
import { MenuItemCard } from "@/components/menu/MenuItemCard";
import type { MenuItem, MenuCategory } from "@juice-vibe/types";
import { menuService } from "@juice-vibe/services";

function MenuContent() {
  const searchParams = useSearchParams();
  const setTableId = useCartStore((state) => state.setTableId);
  const tableIdFromStore = useCartStore((state) => state.tableId);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tableId = searchParams.get("tableId");
    if (tableId) {
      setTableId(tableId);
    }
  }, [searchParams, setTableId]);

  useEffect(() => {
    async function loadData() {
      try {
        const [itemsData, catsData] = await Promise.all([
          menuService.getMenuItems(),
          menuService.getCategories(),
        ]);
        setMenuItems(itemsData);
        setCategories(catsData);
      } catch (error) {
        console.error("Failed to load menu data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const popularItems = useMemo(
    () => menuItems.filter((item) => item.isPopular).slice(0, 3),
    [menuItems]
  );

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());
      
      const itemCategorySlug = typeof item.category === "string" 
        ? item.category 
        : item.category?.slug || "";

      const matchesCategory =
        activeCategory === "all" || itemCategorySlug === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory, menuItems]);

  const currentCategory = categories.find((c) => c.slug === activeCategory);

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main>
        <section 
          className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-24 transition-all duration-500"
          style={{ background: "linear-gradient(135deg, #F8FFF8 0%, #FFF9F2 35%, #F0FDF4 75%, #F8FFF8 100%)" }}
        >
          <div className="absolute inset-0">
            <Image
              src="/images/MenuItems/hero.png"
              alt="Fresh juices and flavors"
              fill
              className="object-cover opacity-8"
              priority
            />
          </div>
          <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 left-0 h-96 w-96 rounded-full bg-orange/10 blur-[120px] pointer-events-none" />

          <div className="container relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mx-auto max-w-2xl text-center"
            >
              <span className="inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                Our Menu
              </span>
              <h1 className="mt-4 font-heading text-4xl font-extrabold text-dark-green md:text-5xl lg:text-6xl">
                Explore Our{" "}
                <span className="text-gradient">Flavors</span>
              </h1>
              <p className="mt-4 text-lg text-gray-600 font-medium leading-relaxed">
                From fresh juices to gourmet burgers, discover your new favorite.
              </p>

              <div className="mt-10 grid gap-6 sm:grid-cols-3">
                {popularItems.map((item) => (
                  <div key={item.id} className="rounded-[2.5rem] border border-white/50 bg-white/40 backdrop-blur-xl p-6 shadow-sm transition duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:bg-white/60">
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-primary">
                        Popular
                      </span>
                      <span className="text-sm font-bold text-dark-green">
                        {new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", minimumFractionDigits: 0 }).format(item.price)}
                      </span>
                    </div>
                    <h3 className="mt-5 text-lg font-extrabold text-dark-green leading-tight">{item.name}</h3>
                    <p className="mt-2 text-sm text-gray-500/90 leading-relaxed font-medium line-clamp-3">{item.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="mt-12 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <MenuSearch value={search} onChange={setSearch} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <MenuCategoryFilter
                  categories={categories}
                  activeCategory={activeCategory}
                  onCategoryChange={setActiveCategory}
                />
              </motion.div>
            </div>

            <div className="mt-3 flex items-center justify-between text-sm text-gray-500 font-medium">
              <p>
                {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""}
                {currentCategory && activeCategory !== "all" && (
                  <span>
                    {" "}in <span className="font-bold text-dark-green">{currentCategory.name}</span>
                  </span>
                )}
              </p>
              {(search || activeCategory !== "all") && (
                <button
                  onClick={() => { setSearch(""); setActiveCategory("all"); }}
                  className="flex items-center gap-1 text-primary font-bold transition-colors hover:text-primary-dark outline-none"
                >
                  <X className="h-4 w-4 stroke-[2.5]" />
                  Clear Filters
                </button>
              )}
            </div>

            {activeCategory === "milkshakes" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 rounded-2xl bg-orange/5 border border-orange/20 p-4 text-sm text-gray-600"
              >
                <span className="font-semibold text-orange">Add BOBA</span> — Add bubble boba to any milkshake for just{" "}
                <span className="font-semibold text-orange">{new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", minimumFractionDigits: 0 }).format(100)}</span>
              </motion.div>
            )}
            {activeCategory === "mocktails" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 rounded-2xl bg-pink/5 border border-pink/20 p-4 text-sm text-gray-600"
              >
                <span className="font-semibold text-pink">Available Flavours:</span> Mango, Mandarin, Passion Fruit, Blackcurrant
              </motion.div>
            )}
            {activeCategory === "ice-cream" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 rounded-2xl bg-pink/5 border border-pink/20 p-4 text-sm text-gray-600"
              >
                <span className="font-semibold text-pink">Ice Cream Flavours:</span> Vanilla, Chocolate, Strawberry, Fruit & Nut, Mango
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-16 text-center"
                >
                  <div className="text-4xl animate-bounce">🍹</div>
                  <h3 className="mt-4 font-heading text-lg font-bold text-dark-green uppercase font-mono tracking-wider animate-pulse">
                    Compiling Fresh Juices Menu...
                  </h3>
                </motion.div>
              ) : filteredItems.length > 0 ? (
                <motion.div
                  key={`${activeCategory}-${search}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8"
                >
                  {filteredItems.map((item, i) => (
                    <MenuItemCard key={item.id} item={item} index={i} />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-16 text-center"
                >
                  <div className="text-6xl">🔍</div>
                  <h3 className="mt-4 font-heading text-xl font-bold text-dark-green">
                    No items found
                  </h3>
                  <p className="mt-2 text-gray-500">
                    Try adjusting your search or filter.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />
      <WhatsAppButton />
    </>
  );
}

export default function MenuPage() {
  return (
    <Suspense>
      <MenuContent />
    </Suspense>
  );
}
