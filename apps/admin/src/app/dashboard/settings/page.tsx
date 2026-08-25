"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { settingsService, authService } from "@juice-vibe/services";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Settings, 
  Save, 
  RotateCw, 
  Sliders, 
  MapPin, 
  Clock, 
  CreditCard,
  ShieldCheck,
  Loader2
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Badge } from "@juice-vibe/ui";

const settingsFormSchema = z.object({
  business_name: z.string().min(2, "Business name required"),
  business_tagline: z.string().optional(),
  business_phone: z.string().min(6, "Phone format invalid"),
  business_email: z.string().email("Email format invalid"),
  business_address: z.string().min(5, "Address description too short"),
  opening_hours_weekdays: z.string().optional(),
  tax_rate: z.number().min(0, "Tax rate cannot be negative"),
  delivery_fee: z.number().min(0, "Delivery fee cannot be negative"),
  free_delivery_min: z.number().min(0, "Free delivery target cannot be negative"),
});

type SettingsFormSchema = z.infer<typeof settingsFormSchema>;

export default function SystemSettings() {
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordUpdating, setPasswordUpdating] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }

    try {
      setPasswordUpdating(true);
      await authService.changePassword(oldPassword, newPassword);
      setPasswordSuccess("Password updated successfully");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || err.message || "Failed to update password");
    } finally {
      setPasswordUpdating(false);
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SettingsFormSchema>({
    resolver: zodResolver(settingsFormSchema),
  });

  const { data: settingsData, isLoading } = useQuery({
    queryKey: ["adminSettings"],
    queryFn: () => settingsService.getSettings(),
    retry: 1,
  });

  useEffect(() => {
    if (settingsData) {
      reset({
        business_name: settingsData.business_name || "Juice Vibe",
        business_tagline: settingsData.business_tagline || "Fresh Cold Pressed Juices",
        business_phone: settingsData.business_phone || "+94 11 234 5678",
        business_email: settingsData.business_email || "hello@juicevibe.lk",
        business_address: settingsData.business_address || "No. 42 Galle Road, Colombo 03",
        opening_hours_weekdays: settingsData.opening_hours_weekdays || "07:00 AM - 10:00 PM",
        tax_rate: Number(settingsData.tax_rate) || 0,
        delivery_fee: Number(settingsData.delivery_fee) || 250,
        free_delivery_min: Number(settingsData.free_delivery_min) || 3000,
      });
    }
  }, [settingsData, reset]);

  const updateSettingsMutation = useMutation({
    mutationFn: (values: SettingsFormSchema) => settingsService.updateSettings(values as any),
    onSuccess: () => {
      setSuccessMsg("System configuration variables successfully deployed.");
      setTimeout(() => setSuccessMsg(null), 4000);
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || err.message || "Settings update failed");
    },
  });

  const onSubmit = (data: SettingsFormSchema) => {
    updateSettingsMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground font-heading">
            System & Brand Environment
          </h1>
          <p className="text-xs text-muted-foreground font-mono mt-1">
            RUNTIME PLATFORM PARAMETERS, COMMERCE BOUNDS & OPERATIONAL CONSTANTS
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="primary" className="font-mono text-[10px]">
            NODE RUNTIME: PRODUCTION
          </Badge>
        </div>
      </div>

      {successMsg && (
        <div className="rounded-lg border border-primary/30 bg-primary/10 p-3 text-xs text-primary font-mono animate-in fade-in">
          {successMsg}
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 font-mono text-xs text-muted-foreground uppercase tracking-widest gap-3">
          <Loader2 className="h-7 w-7 text-primary animate-spin" />
          <span>Synchronizing environmental variables...</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
          {/* Section 1: Business Profile */}
          <div className="terminal-card bg-card border border-border p-6 space-y-4">
            <h2 className="text-xs font-bold text-foreground uppercase tracking-widest font-mono flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span>Identity & Physical Footprint</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Business Brand Name</label>
                <input
                  type="text"
                  className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-primary/50"
                  {...register("business_name")}
                />
                {errors.business_name && <span className="text-[10px] text-pink font-mono">{errors.business_name.message}</span>}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Brand Tagline</label>
                <input
                  type="text"
                  className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-primary/50"
                  {...register("business_tagline")}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Support Telephone</label>
                <input
                  type="text"
                  className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-primary/50"
                  {...register("business_phone")}
                />
                {errors.business_phone && <span className="text-[10px] text-pink font-mono">{errors.business_phone.message}</span>}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Public Email Address</label>
                <input
                  type="email"
                  className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-primary/50"
                  {...register("business_email")}
                />
                {errors.business_email && <span className="text-[10px] text-pink font-mono">{errors.business_email.message}</span>}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">HQ / Outlet Physical Address</label>
              <input
                type="text"
                className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-primary/50"
                {...register("business_address")}
              />
              {errors.business_address && <span className="text-[10px] text-pink font-mono">{errors.business_address.message}</span>}
            </div>
          </div>

          {/* Section 2: Commerce Bounds */}
          <div className="terminal-card bg-card border border-border p-6 space-y-4">
            <h2 className="text-xs font-bold text-foreground uppercase tracking-widest font-mono flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" />
              <span>Financial & Fulfillment Limits</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">System VAT / Tax Rate (%)</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-primary/50 font-numeral"
                  {...register("tax_rate", { valueAsNumber: true })}
                />
                {errors.tax_rate && <span className="text-[10px] text-pink font-mono">{errors.tax_rate.message}</span>}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Base Delivery Fee (LKR)</label>
                <input
                  type="number"
                  step="1"
                  className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-primary/50 font-numeral"
                  {...register("delivery_fee", { valueAsNumber: true })}
                />
                {errors.delivery_fee && <span className="text-[10px] text-pink font-mono">{errors.delivery_fee.message}</span>}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Free Delivery Minimum (LKR)</label>
                <input
                  type="number"
                  step="1"
                  className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-primary/50 font-numeral"
                  {...register("free_delivery_min", { valueAsNumber: true })}
                />
                {errors.free_delivery_min && <span className="text-[10px] text-pink font-mono">{errors.free_delivery_min.message}</span>}
              </div>
            </div>
          </div>

          {/* Section 3: Operational bounds */}
          <div className="terminal-card bg-card border border-border p-6 space-y-4">
            <h2 className="text-xs font-bold text-foreground uppercase tracking-widest font-mono flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span>Operational Hours Shift bounds</span>
            </h2>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Standard Weekdays Hours</label>
              <input
                type="text"
                className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-primary/50"
                {...register("opening_hours_weekdays")}
              />
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={updateSettingsMutation.isPending}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed text-ink-dark text-xs font-mono font-bold rounded-lg uppercase tracking-wider cursor-pointer shadow-lg shadow-primary/20 transition-all active:scale-[0.98] min-w-[150px]"
            >
              {updateSettingsMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin text-ink-dark shrink-0" />
              ) : (
                <Save className="h-4 w-4 shrink-0" />
              )}
              <span>{updateSettingsMutation.isPending ? "Committing Settings..." : "Commit Variables"}</span>
            </button>
          </div>
        </form>
      )}

      {/* Password Update Card */}
      {!isLoading && (
        <form onSubmit={handlePasswordChange} className="terminal-card bg-card border border-border p-6 space-y-4 max-w-4xl mt-6">
          <h2 className="text-xs font-bold text-foreground uppercase tracking-widest font-mono flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-pink" />
            <span>Security Credentials / Update Password</span>
          </h2>

          {passwordSuccess && (
            <div className="rounded-lg border border-primary/30 bg-primary/10 p-3 text-xs text-primary font-mono">
              {passwordSuccess}
            </div>
          )}

          {passwordError && (
            <div className="rounded-lg border border-pink/30 bg-pink/10 p-3 text-xs text-pink font-mono">
              {passwordError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Current Password</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-primary/50"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-primary/50"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-primary/50"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={passwordUpdating}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-pink hover:bg-pink/90 disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-mono font-bold rounded-lg uppercase tracking-wider cursor-pointer shadow-lg shadow-pink/20 transition-all active:scale-[0.98] min-w-[150px]"
            >
              {passwordUpdating && (
                <Loader2 className="h-4 w-4 animate-spin text-white shrink-0" />
              )}
              <span>{passwordUpdating ? "Updating Password..." : "Update Password"}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

