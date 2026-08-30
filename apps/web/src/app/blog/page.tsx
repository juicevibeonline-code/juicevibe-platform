"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  User, 
  Tag, 
  ArrowRight, 
  Sparkles, 
  Search, 
  Filter, 
  Loader2,
  Share2
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/shared/ScrollProgress";
import { BackToTop } from "@/components/shared/BackToTop";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { blogService } from "@juice-vibe/services";
import type { BlogPost } from "@juice-vibe/types";

const CATEGORIES = [
  { id: "all", label: "All Stories" },
  { id: "health", label: "Health & Nutrition" },
  { id: "recipes", label: "Recipes & Mixology" },
  { id: "sustainability", label: "Eco & Green" },
  { id: "promotions", label: "Cafe Specials" },
  { id: "general", label: "Lifestyle" },
];

export default function BlogCatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    blogService
      .getPublishedPosts({
        category: selectedCategory === "all" ? undefined : selectedCategory,
        limit: 20,
      })
      .then((res) => {
        setPosts(res.posts || []);
      })
      .catch((err) => {
        console.warn("Failed to load blog posts:", err);
        setPosts([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [selectedCategory]);

  const filteredPosts = posts.filter((post) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      (post.tags && post.tags.some((t) => t.toLowerCase().includes(q)))
    );
  });

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main className="min-h-screen bg-light-bg text-dark-green">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-[#0F2A1E] text-white pt-32 pb-20 md:pt-40 md:pb-28">
          {/* Radial Ambient Glows */}
          <div className="pointer-events-none absolute inset-0 opacity-15">
            <div className="absolute top-0 left-1/4 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-primary blur-[140px]" />
            <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] translate-y-1/2 rounded-full bg-orange blur-[140px]" />
          </div>

          <div className="container relative text-center max-w-3xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Stories & Tropical Wellness</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-heading leading-tight"
            >
              The Juice Vibe <span className="text-primary">Journal</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 text-gray-300 text-sm sm:text-base leading-relaxed font-medium"
            >
              Discover wellness insights, superfood benefits, mixology secrets, and the vibrant stories behind our handcrafted tropical blends.
            </motion.p>
          </div>
        </section>

        {/* Filter & Search Bar */}
        <section className="container py-8 md:py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-200/80 dark:border-zinc-800 pb-6">
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat.id
                      ? "bg-primary text-ink-dark shadow-md shadow-primary/20 scale-105"
                      : "bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-zinc-700 border border-slate-200/60 dark:border-zinc-700/60"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles & ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs text-foreground placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Articles Grid */}
          <div className="py-8">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-3">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <span className="text-xs font-mono tracking-widest uppercase">Brewing fresh stories...</span>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200/80 dark:border-zinc-800 p-8 max-w-md mx-auto shadow-sm">
                <BookOpen className="h-12 w-12 text-gray-300 dark:text-zinc-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-dark-green dark:text-white font-heading">No Published Articles Yet</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">
                  We are preparing fresh stories, health tips, and tropical recipes. Check back soon!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post, idx) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    className="group flex flex-col justify-between bg-white dark:bg-zinc-900 rounded-3xl border border-slate-100 dark:border-zinc-800 overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-500"
                  >
                    <div>
                      {/* Cover Image Container */}
                      <div className="relative w-full aspect-[16/10] bg-slate-100 dark:bg-zinc-800 overflow-hidden">
                        {post.coverImage ? (
                          <Image
                            src={post.coverImage}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0F2A1E] to-[#1F2E24] text-white/40">
                            <BookOpen className="h-12 w-12 text-primary/40" />
                          </div>
                        )}
                        <div className="absolute top-3 left-3">
                          <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-white/90 dark:bg-zinc-900/90 text-primary border border-primary/20 backdrop-blur-md shadow-sm">
                            {post.category || "Story"}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-center gap-3 text-[11px] text-gray-400 font-mono mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {Math.max(2, Math.ceil((post.content?.length || 500) / 400))} min read
                          </span>
                        </div>

                        <h2 className="font-heading text-lg font-bold text-dark-green dark:text-white leading-snug group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h2>

                        <p className="mt-2.5 text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3 font-medium">
                          {post.excerpt}
                        </p>

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-4">
                            {post.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="px-2.5 py-0.5 rounded-md bg-slate-50 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 text-[10px] font-medium"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Footer Action */}
                    <div className="px-6 pb-6 pt-2 border-t border-slate-50 dark:border-zinc-800/50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                          {(typeof post.author === "string" ? post.author : post.author?.name || "J")[0].toUpperCase()}
                        </div>
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                          {typeof post.author === "string" ? post.author : post.author?.name || "Juice Vibe Team"}
                        </span>
                      </div>

                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:translate-x-1 transition-all"
                      >
                        Read Story <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <WhatsAppButton />
      <BackToTop />
      <Footer />
    </>
  );
}
