"use client";

import { useEffect, useState } from "react";
import { Star, Check, X } from "lucide-react";
import { Table } from "@/components/table";
import { PageHeader } from "@/components/PageHeader";
import { ActionMenu } from "@/components/ui";
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
      label: "",
      render: (item: Testimonial) => {
        const actions = [];
        if (!item.isApproved) {
          actions.push({
            label: "Approve",
            onClick: () => handleApprove(item.id),
            icon: <Check className="w-3.5 h-3.5 text-emerald-600" />,
          });
        }
        actions.push({
          label: item.isApproved ? "Delete" : "Reject",
          onClick: () => handleReject(item.id),
          icon: <X className="w-3.5 h-3.5 text-rose-600" />,
          destructive: true,
        });
        return <ActionMenu items={actions} />;
      },
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

      {/* Tabs list with count badges Control Bar */}
      <div className="bg-card border border-border/80 p-1.5 rounded-xl flex items-center gap-1 overflow-x-auto custom-scrollbar max-w-full shrink-0 shadow-sm">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted hover:text-foreground hover:bg-background/50"
              }`}
            >
              {tab.label}
              <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-extrabold ${
                isActive 
                  ? "bg-white/20 text-white" 
                  : "bg-muted/15 text-muted-foreground"
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
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
