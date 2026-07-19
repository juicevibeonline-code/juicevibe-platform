"use client";

import { Suspense, useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useCartStore } from "@/store/cart";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Plus, CheckCircle, X } from "lucide-react";
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
import { formatPrice } from "@juice-vibe/utils";
import { cn } from "@/lib/utils";

function PopularHighlightCard({ item }: { item: MenuItem }) {
  const addItem = useCartStore((state) => state.addItem);
  const [isAdded, setIsAdded] = useState(false);
  const itemImage = item.thumbnail || (item.images && item.images[0]) || (item as any).image;
  const [imgSrc, setImgSrc] = useState<string | null>(itemImage || null);

  const handleAdd = () => {
    addItem(item);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-3xl border border-white/80 bg-white/80 backdrop-blur-xl p-4 shadow-sm hover:shadow-xl hover:bg-white transition-all duration-500 text-left overflow-hidden">
      <div>
        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100/60 mb-3 border border-slate-100 flex items-center justify-center">
          <span className="absolute top-2 left-2 z-20 inline-flex items-center gap-0.5 rounded-full bg-amber-500 text-white px-2.5 py-0.75 text-[9px] font-black uppercase tracking-wider shadow-sm">
            <Star className="h-2.5 w-2.5 fill-current" /> Popular
          </span>
          {imgSrc ? (
            <Image
              src={encodeURI(imgSrc)}
              alt={item.name}
              fill
              sizes="(max-width: 768px) 100vw, 300px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImgSrc(null)}
            />
          ) : (
            <span className="text-4xl select-none">🍹</span>
          )}
        </div>

        <h3 className="text-sm font-black text-dark-green leading-snug group-hover:text-primary transition-colors">
          {item.name}
        </h3>
        <p className="mt-1 text-xs text-gray-500 font-medium leading-relaxed line-clamp-2">
          {item.description}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="font-mono text-sm font-extrabold text-dark-green">
          {formatPrice(item.price)}
        </span>
        <button
          onClick={handleAdd}
          className={cn(
            "flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-white transition-all shadow-sm cursor-pointer outline-none",
            isAdded ? "bg-emerald-600" : "bg-primary hover:bg-primary-dark hover:scale-105 active:scale-95"
          )}
        >
          {isAdded ? (
            <>
              <CheckCircle className="h-3.5 w-3.5 stroke-[2.5]" /> Added!
            </>
          ) : (
            <>
              <Plus className="h-3.5 w-3.5 stroke-[2.5]" /> Add
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function MenuContent() {
  const searchParams = useSearchParams();
  const setTableId = useCartStore((state) => state.setTableId);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const tableId = searchParams.get("tableId");
    if (tableId) {
      setTableId(tableId);
    }
  }, [searchParams, setTableId]);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      const [itemsData, catsData] = await Promise.all([
        menuService.getMenuItems(),
        menuService.getCategories(),
      ]);
      setMenuItems(itemsData);
      setCategories(catsData);
    } catch (err) {
      console.error("Failed to load menu data:", err);
      setError("Unable to connect to the server. Please check if the API is running or try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
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
              className="mx-auto max-w-4xl text-center"
            >
              <span className="inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                Our Menu Catalog
              </span>
              <h1 className="mt-4 font-heading text-4xl font-extrabold text-dark-green md:text-5xl lg:text-6xl">
                Explore Our <span className="text-gradient">Flavors</span>
              </h1>
              <p className="mt-4 text-lg text-gray-600 font-medium leading-relaxed max-w-2xl mx-auto">
                From fresh juices to gourmet burgers, discover your new favorite drinks and food.
              </p>

              {/* Popular Highlights Grid */}
              {popularItems.length > 0 && (
                <div className="mt-10">
                  <div className="flex items-center justify-center gap-2 mb-6">
                    <Star className="h-4 w-4 text-amber-500 fill-current" />
                    <span className="text-xs font-black uppercase tracking-widest text-dark-green">
                      Popular Customer Highlights
                    </span>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {popularItems.map((item) => (
                      <PopularHighlightCard key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            <div className="mt-14 space-y-6">
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

            <div className="mt-4 flex items-center justify-between text-sm text-gray-500 font-medium">
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
                  className="flex items-center gap-1 text-primary font-bold transition-colors hover:text-primary-dark outline-none cursor-pointer"
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
                className="mt-4 rounded-2xl bg-orange/5 border border-orange/20 p-4 text-sm text-gray-600 font-medium"
              >
                <span className="font-semibold text-orange">Add BOBA</span> — Add bubble boba to any milkshake for just{" "}
                <span className="font-semibold text-orange">LKR 100</span>
              </motion.div>
            )}
            {activeCategory === "mocktails" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 rounded-2xl bg-pink/5 border border-pink/20 p-4 text-sm text-gray-600 font-medium"
              >
                <span className="font-semibold text-pink">Available Flavours:</span> Mango, Mandarin, Passion Fruit, Blackcurrant
              </motion.div>
            )}
            {activeCategory === "ice-cream" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 rounded-2xl bg-pink/5 border border-pink/20 p-4 text-sm text-gray-600 font-medium"
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
              ) : error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-16 text-center animate-fade-in"
                >
                  <div className="text-4xl">⚠️</div>
                  <h3 className="mt-4 font-heading text-xl font-bold text-red-500">
                    Failed to Load Menu
                  </h3>
                  <p className="mt-2 text-gray-500 max-w-md mx-auto font-medium">{error}</p>
                  <button
                    onClick={loadData}
                    className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:bg-primary-dark hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
                  >
                    Retry Connection
                  </button>
                </motion.div>
              ) : filteredItems.length > 0 ? (
                <motion.div
                  key={`${activeCategory}-${search}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 grid gap-4 sm:gap-5 lg:gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
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
