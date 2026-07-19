"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { testimonialService } from "@juice-vibe/services";
import { formatDate } from "@juice-vibe/utils";
import { Heart, Star, Trash2, Award } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@juice-vibe/ui";
import { cn } from "@juice-vibe/utils";

export default function TestimonialsManagement() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  // Fetch Testimonials
  const { data, isLoading } = useQuery({
    queryKey: ["adminTestimonials", page],
    queryFn: () => testimonialService.getAllTestimonials({ page, limit: 10 }),
    retry: 1,
  });

  const testimonials = data?.testimonials || [];
  const totalPages = data?.totalPages || 1;
  const totalCount = data?.total || 0;

  // Toggle/Update Testimonial Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: any }) => testimonialService.updateTestimonial(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminTestimonials"] });
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || err.message || "Failed to update testimonial");
    },
  });

  // Delete Testimonial Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => testimonialService.deleteTestimonial(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminTestimonials"] });
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || err.message || "Failed to delete testimonial");
    },
  });

  const handleToggleApprove = (id: string, isApproved: boolean) => {
    updateMutation.mutate({ id, input: { isApproved } });
  };

  const handleToggleFeature = (id: string, isFeatured: boolean) => {
    updateMutation.mutate({ id, input: { isFeatured } });
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to permanently delete the testimonial submitted by ${name}?`)) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground font-heading">
            Testimonials Review
          </h1>
          <p className="text-xs text-muted-foreground font-mono mt-1">
            MODERATE AND SELECT FEATURED GUEST TESTIMONIAL FEEDBACK CAROUSEL ITEMS
          </p>
        </div>
        <div className="font-mono text-xs bg-ink-light border border-border px-3 py-1.5 rounded-lg text-primary">
          TOTAL DIRECTORY ITEMS: <span className="font-numeral font-bold">{totalCount}</span>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-20 font-mono text-xs text-muted-foreground uppercase">
          Querying testimonial directories...
        </div>
      ) : testimonials.length === 0 ? (
        <div className="terminal-card p-12 text-center border border-border bg-card">
          <Heart className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-sm font-bold text-foreground font-heading">No Testimonials Submitted</h3>
          <p className="text-xs text-muted-foreground font-mono mt-1">
            Guests haven't logged any testimonials yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="terminal-card bg-card border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-border/80 text-[10px] text-muted-foreground uppercase tracking-wider bg-ink-dark/30">
                    <th className="py-3 px-4 font-semibold">User Details</th>
                    <th className="py-3 px-4 font-semibold">Review Message</th>
                    <th className="py-3 px-4 font-semibold">Rating Metrics</th>
                    <th className="py-3 px-4 font-semibold">Approval Status</th>
                    <th className="py-3 px-4 font-semibold">Featured Rank</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {testimonials.map((t: any) => (
                    <tr key={t.id} className="hover:bg-ink-dark/20 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-xs uppercase shrink-0">
                            {t.avatar ? (
                              <img src={t.avatar} alt={t.name} className="h-full w-full rounded-full object-cover" />
                            ) : (
                              t.name.slice(0, 2)
                            )}
                          </div>
                          <div>
                            <span className="font-semibold text-foreground font-sans block">{t.name}</span>
                            {t.role && (
                              <span className="text-[9px] text-muted-foreground block font-sans">{t.role}</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-sans text-muted-foreground max-w-xs text-xs truncate" title={t.text}>
                        {t.text}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 font-numeral text-yellow">
                          <Star className="h-3.5 w-3.5 fill-yellow text-yellow shrink-0" />
                          <span className="font-bold text-foreground text-xs">{t.rating}</span>
                          <span className="text-muted-foreground/60 text-[10px]">/ 5</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleApprove(t.id, !t.isApproved)}
                          className={cn(
                            "px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded border font-mono select-none cursor-pointer transition-colors",
                            t.isApproved
                              ? "bg-primary/15 border-primary/30 text-primary hover:bg-pink/10 hover:text-pink hover:border-pink/20"
                              : "bg-ink-dark border-border text-muted-foreground hover:bg-primary/20 hover:text-primary hover:border-primary/30"
                          )}
                        >
                          {t.isApproved ? "Approved" : "Pending"}
                        </button>
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleFeature(t.id, !t.isFeatured)}
                          className={cn(
                            "inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded border font-mono select-none cursor-pointer transition-colors",
                            t.isFeatured
                              ? "bg-yellow/15 border-yellow/30 text-yellow hover:bg-ink-dark hover:text-muted-foreground hover:border-border"
                              : "bg-ink-dark border-border text-muted-foreground hover:bg-yellow/10 hover:text-yellow hover:border-yellow/20"
                          )}
                        >
                          <Award className="h-3 w-3 shrink-0" />
                          <span>{t.isFeatured ? "Featured" : "Standard"}</span>
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(t.id, t.name)}
                          className="h-8 px-2 text-pink hover:bg-pink/10 hover:text-pink font-mono text-[10px]"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between font-mono text-xs border-t border-border pt-4">
              <span className="text-muted-foreground">
                Page <span className="font-numeral font-bold text-foreground">{page}</span> of <span className="font-numeral">{totalPages}</span>
              </span>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((prev) => prev - 1)}
                  className="font-mono text-[10px] uppercase border-border h-8"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage((prev) => prev + 1)}
                  className="font-mono text-[10px] uppercase border-border h-8"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
