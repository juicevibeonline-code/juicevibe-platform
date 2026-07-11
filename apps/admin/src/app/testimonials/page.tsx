"use client";

import { useEffect, useState } from "react";
import { Star, Check, X } from "lucide-react";
import { Table } from "@/components/table";
import { PageHeader } from "@/components/PageHeader";
import { testimonialService } from "@juice-vibe/services";
import type { Testimonial } from "@juice-vibe/types";

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await testimonialService.getAllTestimonials({ limit: 100 });
      setTestimonials(response.testimonials);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load testimonials.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleApprove = async (id: string) => {
    setTestimonials((prev) => 
      prev.map((t) => (t.id === id ? { ...t, isApproved: true } : t))
    );
    try {
      await testimonialService.approveTestimonial(id);
    } catch (err) {
      console.error("Failed to approve testimonial:", err);
      fetchTestimonials();
    }
  };

  const handleReject = async (id: string) => {
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
    try {
      await testimonialService.deleteTestimonial(id);
    } catch (err) {
      console.error("Failed to reject/delete testimonial:", err);
      fetchTestimonials();
    }
  };

  const columns = [
    { key: "name", label: "Name" },
    {
      key: "rating",
      label: "Rating",
      render: (item: Testimonial) => (
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`w-3 h-3 ${i < item.rating ? "text-amber-500 fill-amber-500" : "text-border"}`} />
          ))}
        </div>
      ),
    },
    { key: "text", label: "Review" },
    {
      key: "status",
      label: "Status",
      render: (item: Testimonial) => (
        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
          item.isApproved ? "bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20" : "bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"
        }`}>
          {item.isApproved ? <Check className="w-3 h-3" /> : null}
          {item.isApproved ? "Approved" : "Pending"}
        </span>
      ),
    },
    { 
      key: "createdAt", 
      label: "Date",
      render: (item: Testimonial) => (
        <span>{new Date(item.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
      )
    },
    {
      key: "actions",
      label: "Actions",
      render: (item: Testimonial) => (
        <div className="flex items-center gap-1">
          {!item.isApproved && (
            <>
              <button 
                onClick={() => handleApprove(item.id)}
                className="p-1 rounded hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 cursor-pointer"
                title="Approve"
              >
                <Check className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleReject(item.id)}
                className="p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 cursor-pointer"
                title="Reject"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          )}
          {item.isApproved && (
            <button 
              onClick={() => handleReject(item.id)}
              className="p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 cursor-pointer"
              title="Delete"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  const pendingCount = testimonials.filter((t) => !t.isApproved).length;
  const approvedCount = testimonials.filter((t) => t.isApproved).length;

  const filtered = testimonials.filter((t) => {
    if (activeTab === "pending") return !t.isApproved;
    if (activeTab === "approved") return t.isApproved;
    return true;
  });

  const tabs = [
    { id: "all", label: "All Reviews", count: testimonials.length },
    { id: "pending", label: "Pending", count: pendingCount },
    { id: "approved", label: "Approved", count: approvedCount },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 pb-12">
      <PageHeader
        title="Testimonials"
        subtitle={`Manage customer reviews — ${pendingCount} pending approval`}
        accentColor="orange"
      />

      {/* Tabs list with count badges */}
      <div className="flex gap-1.5 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-colors border cursor-pointer ${
              activeTab === tab.id
                ? "bg-background border-border text-primary"
                : "bg-card hover:bg-background text-muted hover:text-foreground border-border"
            }`}
          >
            {tab.label}
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
              activeTab === tab.id ? "bg-primary/10 text-primary-dark" : "bg-background text-muted"
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>



      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 bg-card border border-border rounded-lg shadow-sm">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold text-muted uppercase tracking-wider animate-pulse">Loading testimonials...</span>
        </div>
      ) : (
        <div>
          <Table columns={columns} data={filtered} searchable />
        </div>
      )}
    </div>
  );
}
