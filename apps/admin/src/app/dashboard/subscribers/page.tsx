"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { contactService } from "@juice-vibe/services";
import { formatDate } from "@juice-vibe/utils";
import { Mail, Trash2, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@juice-vibe/ui";

export default function SubscribersManagement() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  // Fetch Subscribers
  const { data, isLoading } = useQuery({
    queryKey: ["subscribers", page],
    queryFn: () => contactService.getSubscribers({ page, limit: 50 }),
    retry: 1,
  });

  const subscribersList = data?.items || [];
  const total = data?.total || 0;

  // Unsubscribe Mutation
  const unsubscribeMutation = useMutation({
    mutationFn: (id: string) => contactService.deleteSubscriber(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscribers"] });
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || err.message || "Failed to remove subscriber");
    },
  });

  const handleDelete = (id: string, email: string) => {
    if (confirm(`Permanently remove subscriber ${email}?`)) {
      unsubscribeMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground font-heading">
            Newsletter Subscribers
          </h1>
          <p className="text-xs text-muted-foreground font-mono mt-1">
            CAMPAIGN AUDIENCE INDEX & NEWSLETTER SUBSCRIBER LISTS
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 font-mono text-xs text-muted-foreground uppercase tracking-widest gap-3">
            <Loader2 className="h-7 w-7 text-primary animate-spin" />
            <span>Compiling subscriber audience indices...</span>
          </div>
        ) : subscribersList.length === 0 ? (
          <div className="terminal-card p-12 text-center border border-border bg-card">
            <Mail className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-sm font-bold text-foreground font-heading">No Subscribers Found</h3>
            <p className="text-xs text-muted-foreground font-mono mt-1">
              Newsletter signup submissions will accumulate here.
            </p>
          </div>
        ) : (
          <div className="terminal-card bg-card border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-border/80 text-[10px] text-muted-foreground uppercase tracking-wider bg-ink-dark/30">
                    <th className="py-3 px-4 font-semibold">Subscriber Email</th>
                    <th className="py-3 px-4 font-semibold">Joined Timestamp</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {subscribersList.map((sub: any) => {
                    const isDeleting = unsubscribeMutation.isPending && (unsubscribeMutation.variables as string) === sub.id;
                    return (
                      <tr key={sub.id} className="hover:bg-ink-dark/20 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-foreground text-sm font-mono select-all">
                          {sub.email}
                        </td>
                        <td className="py-3.5 px-4 text-muted-foreground text-[11px]">
                          {formatDate(sub.createdAt)}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`text-[8px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${
                            sub.isActive 
                              ? "text-primary bg-primary/5 border-primary/20" 
                              : "text-muted-foreground bg-ink-dark border-border"
                          }`}>
                            {sub.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(sub.id, sub.email)}
                            disabled={isDeleting}
                            className="h-8 px-2 text-pink hover:bg-pink/10 hover:text-pink font-mono text-[10px] disabled:opacity-50"
                          >
                            {isDeleting ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin text-pink" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
