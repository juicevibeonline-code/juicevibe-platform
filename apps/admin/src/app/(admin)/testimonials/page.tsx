"use client";

import { useEffect, useState } from "react";
import { Star, Check, X } from "lucide-react";
import { Table } from "@/components/table";
import { PageHeader } from "@/components/PageHeader";
import { ActionMenu } from "@/components/ui";
import { Badge } from "@/components/ui/Badge";
import { LoadingState, FilterBar, FilterTab } from "@/components/shared";
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
      setTestimonials(response.testimonials ?? []);
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
    { key: "name", label: "Name", sortable: true },
    {
      key: "rating",
      label: "Rating",
      sortable: true,
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
      sortable: true,
      render: (item: Testimonial) => (
        <Badge variant={item.isApproved ? "success" : "warning"} className="capitalize">
          {item.isApproved ? <Check className="w-3.5 h-3.5 mr-1" /> : null}
          {item.isApproved ? "Approved" : "Pending"}
        </Badge>
      ),
    },
    { 
      key: "createdAt", 
      label: "Date",
      sortable: true,
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
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <PageHeader
        title="Testimonials"
        subtitle={`Manage customer reviews — ${pendingCount} pending approval`}
      />

      {/* Tabs list with count badges Control Bar */}
      <FilterBar>
        {tabs.map((tab) => (
          <FilterTab key={tab.id} active={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} count={tab.count}>
            {tab.label}
          </FilterTab>
        ))}
      </FilterBar>



      {loading ? (
        <LoadingState label="Loading testimonials..." />
      ) : (
        <div>
          <Table columns={columns} data={filtered} searchable />
        </div>
      )}
    </div>
  );
}
