"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Share2,
  Check,
  BookOpen,
  Sparkles,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/shared/ScrollProgress";
import { BackToTop } from "@/components/shared/BackToTop";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { blogService } from "@juice-vibe/services";
import type { BlogPost } from "@juice-vibe/types";

export default function SingleBlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setIsLoading(true);
    blogService
      .getPostBySlug(slug)
      .then((data) => {
        setPost(data);
      })
      .catch((err) => {
        console.warn("Post not found:", err);
        setPost(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [slug]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main className="min-h-screen bg-light-bg text-dark-green pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="container max-w-4xl mx-auto px-4">
          {/* Back Button */}
          <div className="mb-6">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-primary transition-colors font-mono uppercase tracking-wider"
            >
              <ArrowLeft className="h-4 w-4" /> Back to All Stories
            </Link>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 text-gray-400 gap-3">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <span className="text-xs font-mono tracking-widest uppercase">Opening Story...</span>
            </div>
          ) : !post ? (
            <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 p-8 shadow-sm">
              <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h1 className="text-xl font-bold font-heading">Story Not Found</h1>
              <p className="text-xs text-gray-500 mt-2">
                The article you are looking for might have been moved or unpublished.
              </p>
              <Link
                href="/blog"
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-ink-dark rounded-full text-xs font-bold font-mono uppercase"
              >
                Browse All Stories
              </Link>
            </div>
          ) : (
            <article className="space-y-8">
              {/* Header Details */}
              <div className="space-y-4">
                <span className="inline-block px-3.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest bg-primary/10 text-primary border border-primary/20">
                  {post.category || "Wellness Story"}
                </span>

                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold font-heading text-dark-green dark:text-white leading-tight">
                  {post.title}
                </h1>

                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
                  {post.excerpt}
                </p>

                {/* Author Meta Row */}
                <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-200/80 dark:border-zinc-800 text-xs text-gray-500 font-mono">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-sm">
                      {(typeof post.author === "string" ? post.author : post.author?.name || "J")[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-dark-green dark:text-white font-sans text-xs">
                        {typeof post.author === "string" ? post.author : post.author?.name || "Juice Vibe Editorial"}
                      </div>
                      <div className="text-[10px] text-gray-400">
                        {new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {Math.max(2, Math.ceil((post.content?.length || 500) / 400))} min read
                    </span>
                    <button
                      onClick={handleShare}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-zinc-800 hover:bg-primary hover:text-ink-dark transition-all text-xs font-bold font-sans cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Link Copied!</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="h-3.5 w-3.5" />
                          <span>Share</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Cover Image */}
              {post.coverImage && (
                <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden shadow-md border border-slate-100 dark:border-zinc-800 bg-slate-100">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 900px"
                  />
                </div>
              )}

              {/* Article Content Body */}
              <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-10 border border-slate-100 dark:border-zinc-800 shadow-sm leading-relaxed text-sm sm:text-base text-gray-700 dark:text-gray-200 font-sans space-y-4 whitespace-pre-line">
                {post.content}
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap pt-2">
                  <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mr-1">
                    Related Tags:
                  </span>
                  {post.tags.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 rounded-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs text-gray-600 dark:text-gray-300 font-medium"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              {/* Promotional CTA Footer Card */}
              <div className="rounded-3xl bg-[#0F2A1E] text-white p-8 sm:p-10 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
                <div className="space-y-2 text-center sm:text-left z-10">
                  <h3 className="text-xl sm:text-2xl font-bold font-heading">
                    Craving Fresh Tropical Goodness?
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-300 max-w-md">
                    Explore our 100% natural cold-pressed juices, energizing smoothies, and artisan shakes handcrafted daily.
                  </p>
                </div>
                <Link
                  href="/menu"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary hover:bg-primary-dark text-ink-dark text-xs font-mono font-bold uppercase tracking-wider shadow-lg shadow-primary/20 shrink-0 transition-all active:scale-95 z-10"
                >
                  <span>Order from Menu</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          )}
        </div>
      </main>
      <WhatsAppButton />
      <BackToTop />
      <Footer />
    </>
  );
}
