"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsService, authService } from "@juice-vibe/services";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Settings, 
  Save, 
  MapPin, 
  Clock, 
  CreditCard,
  ShieldCheck,
  Loader2,
  Megaphone,
  Share2,
  Building2,
  Sparkles,
  Power,
  Store,
  CheckCircle2
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Badge } from "@juice-vibe/ui";

const settingsFormSchema = z.object({
  // Brand & Identity
  business_name: z.string().min(2, "Business name required"),
  business_tagline: z.string().optional(),
  business_description: z.string().optional(),
  footer_copyright_text: z.string().optional(),
  footer_tagline: z.string().optional(),

  // Contact & Location
  business_phone: z.string().min(6, "Phone format invalid"),
  business_email: z.string().email("Email format invalid"),
  business_address: z.string().min(5, "Address description too short"),
  google_maps_link: z.string().optional(),
  social_whatsapp: z.string().optional(),

  // Operating Hours
  opening_hours_weekdays: z.string().optional(),
  opening_hours_saturday: z.string().optional(),
  opening_hours_sunday: z.string().optional(),

  // Social Links
  social_facebook: z.string().optional(),
  social_tiktok: z.string().optional(),
  social_instagram: z.string().optional(),

  // Announcement Banner
  announcement_enabled: z.enum(["true", "false"]),
  announcement_text: z.string().optional(),
  announcement_link: z.string().optional(),

  // Commerce & Delivery Bounds
  is_store_open: z.enum(["true", "false"]),
  tax_rate: z.number().min(0, "Tax rate cannot be negative"),
  delivery_fee: z.number().min(0, "Delivery fee cannot be negative"),
  free_delivery_min: z.number().min(0, "Free delivery target cannot be negative"),
  currency_symbol: z.string().optional(),
  estimated_delivery_time: z.string().optional(),
  estimated_prep_time: z.string().optional(),
});

type SettingsFormSchema = z.infer<typeof settingsFormSchema>;

type TabKey = "brand" | "contact" | "hours" | "social" | "announcement" | "commerce" | "security";

export default function SystemSettings() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TabKey>("brand");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Security tab state
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
    watch,
    setValue,
    formState: { errors },
  } = useForm<SettingsFormSchema>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      announcement_enabled: "false",
      is_store_open: "true",
      currency_symbol: "LKR",
      tax_rate: 0,
      delivery_fee: 250,
      free_delivery_min: 3000,
    },
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
        business_tagline: settingsData.business_tagline || "Sip the Good Vibes",
        business_description: settingsData.business_description || "Premium tropical juice café offering fresh, organic, and handcrafted beverages.",
        footer_copyright_text: settingsData.footer_copyright_text || "Juice Vibe. All rights reserved.",
        footer_tagline: settingsData.footer_tagline || "Sip the good vibes, crafted with 💚 in Sri Lanka.",

        business_phone: settingsData.business_phone || "+94 71 843 5876",
        business_email: settingsData.business_email || "hello@juicevibe.com",
        business_address: settingsData.business_address || "No. 89 Bandaragama Road, Waskaduwa, Sri Lanka, 12580",
        google_maps_link: settingsData.google_maps_link || "https://maps.google.com/?q=Juice+Vibe+Waskaduwa",
        social_whatsapp: settingsData.social_whatsapp || "94718435876",

        opening_hours_weekdays: settingsData.opening_hours_weekdays || "08:00 AM - 10:00 PM",
        opening_hours_saturday: settingsData.opening_hours_saturday || "09:00 AM - 11:00 PM",
        opening_hours_sunday: settingsData.opening_hours_sunday || "10:00 AM - 09:00 PM",

        social_facebook: settingsData.social_facebook || "https://www.facebook.com/share/1L9JR6DXL9/?mibextid=wwXIfr",
        social_tiktok: settingsData.social_tiktok || "https://www.tiktok.com/@juice.vibe0",
        social_instagram: settingsData.social_instagram || "https://instagram.com/juicevibe.lk",

        announcement_enabled: (settingsData.announcement_enabled === "true" ? "true" : "false") as any,
        announcement_text: settingsData.announcement_text || "🎉 Special Promo: Fresh tropical blends handcrafted daily!",
        announcement_link: settingsData.announcement_link || "/menu",

        is_store_open: (settingsData.is_store_open === "false" ? "false" : "true") as any,
        tax_rate: Number(settingsData.tax_rate) || 0,
        delivery_fee: Number(settingsData.delivery_fee) || 250,
        free_delivery_min: Number(settingsData.free_delivery_min) || 3000,
        currency_symbol: settingsData.currency_symbol || "LKR",
        estimated_delivery_time: settingsData.estimated_delivery_time || "30-45 mins",
        estimated_prep_time: settingsData.estimated_prep_time || "15-20 mins",
      });
    }
  }, [settingsData, reset]);

  const updateSettingsMutation = useMutation({
    mutationFn: (values: SettingsFormSchema) => settingsService.updateSettings(values as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminSettings"] });
      setSuccessMsg("Platform variables successfully deployed and synced across storefront.");
      setTimeout(() => setSuccessMsg(null), 5000);
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || err.message || "Settings update failed");
    },
  });

  const onSubmit = (data: SettingsFormSchema) => {
    updateSettingsMutation.mutate(data);
  };

  const isStoreOpen = watch("is_store_open");
  const isAnnouncementActive = watch("announcement_enabled");

  const tabs: { key: TabKey; label: string; icon: any }[] = [
    { key: "brand", label: "Brand & Identity", icon: Building2 },
    { key: "contact", label: "Contact & Location", icon: MapPin },
    { key: "hours", label: "Opening Hours", icon: Clock },
    { key: "social", label: "Social Media", icon: Share2 },
    { key: "announcement", label: "Announcement Banner", icon: Megaphone },
    { key: "commerce", label: "Commerce & Delivery", icon: CreditCard },
    { key: "security", label: "Admin Security", icon: ShieldCheck },
  ];

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground font-heading">
            System & Storefront Environment
          </h1>
          <p className="text-xs text-muted-foreground font-mono mt-1">
            RUNTIME PLATFORM PARAMETERS, LIVE STOREFRONT CONTENT & COMMERCE BOUNDS
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="primary" className="font-mono text-[10px]">
            STORE STATUS: {isStoreOpen === "true" ? "ONLINE & ACCEPTING ORDERS" : "STOREFRONT PAUSED"}
          </Badge>
        </div>
      </div>

      {successMsg && (
        <div className="rounded-lg border border-primary/30 bg-primary/10 p-3 text-xs text-primary font-mono flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Segmented Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-border text-xs font-mono">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-primary text-ink-dark font-bold shadow-md shadow-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-card border border-transparent hover:border-border"
              }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 font-mono text-xs text-muted-foreground uppercase tracking-widest gap-3">
          <Loader2 className="h-7 w-7 text-primary animate-spin" />
          <span>Synchronizing environmental variables...</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
          
          {/* TAB 1: Brand & Identity */}
          {activeTab === "brand" && (
            <div className="terminal-card bg-card border border-border p-6 space-y-5 animate-in fade-in">
              <h2 className="text-xs font-bold text-foreground uppercase tracking-widest font-mono flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                <span>Storefront Brand Identity & Content</span>
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

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">About / Footer Business Description</label>
                <textarea
                  rows={3}
                  className="w-full bg-ink-dark border border-border text-foreground text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-primary/50 leading-relaxed font-sans"
                  {...register("business_description")}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Footer Copyright Notice</label>
                  <input
                    type="text"
                    className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-primary/50"
                    {...register("footer_copyright_text")}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Footer Slogan / Tagline</label>
                  <input
                    type="text"
                    className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-primary/50"
                    {...register("footer_tagline")}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Contact & Location */}
          {activeTab === "contact" && (
            <div className="terminal-card bg-card border border-border p-6 space-y-5 animate-in fade-in">
              <h2 className="text-xs font-bold text-foreground uppercase tracking-widest font-mono flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Contact Channels & Physical Address</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Customer Support Phone</label>
                  <input
                    type="text"
                    className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-primary/50 font-numeral"
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
                <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Physical Storefront Address</label>
                <input
                  type="text"
                  className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-primary/50"
                  {...register("business_address")}
                />
                {errors.business_address && <span className="text-[10px] text-pink font-mono">{errors.business_address.message}</span>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Google Maps URL / Location Link</label>
                  <input
                    type="text"
                    className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-primary/50"
                    {...register("google_maps_link")}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">WhatsApp Order / Support Number (digits only)</label>
                  <input
                    type="text"
                    placeholder="94718435876"
                    className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-primary/50 font-numeral"
                    {...register("social_whatsapp")}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Opening Hours */}
          {activeTab === "hours" && (
            <div className="terminal-card bg-card border border-border p-6 space-y-5 animate-in fade-in">
              <h2 className="text-xs font-bold text-foreground uppercase tracking-widest font-mono flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>Weekly Operational Schedule</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Monday – Friday</label>
                  <input
                    type="text"
                    placeholder="08:00 AM - 10:00 PM"
                    className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-primary/50"
                    {...register("opening_hours_weekdays")}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Saturday</label>
                  <input
                    type="text"
                    placeholder="09:00 AM - 11:00 PM"
                    className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-primary/50"
                    {...register("opening_hours_saturday")}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Sunday</label>
                  <input
                    type="text"
                    placeholder="10:00 AM - 09:00 PM"
                    className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-primary/50"
                    {...register("opening_hours_sunday")}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Social Media */}
          {activeTab === "social" && (
            <div className="terminal-card bg-card border border-border p-6 space-y-5 animate-in fade-in">
              <h2 className="text-xs font-bold text-foreground uppercase tracking-widest font-mono flex items-center gap-2">
                <Share2 className="h-4 w-4 text-primary" />
                <span>Social Media Profiles & Channels</span>
              </h2>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Facebook Page URL</label>
                  <input
                    type="text"
                    placeholder="https://facebook.com/..."
                    className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-primary/50"
                    {...register("social_facebook")}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">TikTok Profile URL</label>
                  <input
                    type="text"
                    placeholder="https://tiktok.com/@..."
                    className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-primary/50"
                    {...register("social_tiktok")}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Instagram Profile URL</label>
                  <input
                    type="text"
                    placeholder="https://instagram.com/..."
                    className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-primary/50"
                    {...register("social_instagram")}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Announcement Banner */}
          {activeTab === "announcement" && (
            <div className="terminal-card bg-card border border-border p-6 space-y-5 animate-in fade-in">
              <h2 className="text-xs font-bold text-foreground uppercase tracking-widest font-mono flex items-center gap-2">
                <Megaphone className="h-4 w-4 text-primary" />
                <span>Top Website Announcement Banner</span>
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-ink-dark border border-border">
                  <div>
                    <div className="font-mono text-xs font-bold text-foreground uppercase">Enable Announcement Banner</div>
                    <div className="text-[10px] text-muted-foreground font-mono mt-0.5">Show a prominent alert bar on top of the storefront</div>
                  </div>
                  <select
                    className="bg-card border border-border text-foreground font-mono text-xs px-3 py-1.5 rounded-lg focus:outline-none focus:border-primary/50"
                    {...register("announcement_enabled")}
                  >
                    <option value="true">ENABLED</option>
                    <option value="false">DISABLED</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Banner Message / Text</label>
                  <input
                    type="text"
                    placeholder="🎉 Grand Opening Special: Get 15% off with code VIBE15!"
                    className="w-full bg-ink-dark border border-border text-foreground text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-primary/50 font-sans"
                    {...register("announcement_text")}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Call-To-Action Link (Optional)</label>
                  <input
                    type="text"
                    placeholder="/menu"
                    className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-primary/50"
                    {...register("announcement_link")}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: Commerce & Delivery */}
          {activeTab === "commerce" && (
            <div className="terminal-card bg-card border border-border p-6 space-y-5 animate-in fade-in">
              <h2 className="text-xs font-bold text-foreground uppercase tracking-widest font-mono flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" />
                <span>Commerce, Taxes & Delivery Parameters</span>
              </h2>

              <div className="flex items-center justify-between p-4 rounded-xl bg-ink-dark border border-border">
                <div>
                  <div className="font-mono text-xs font-bold text-foreground uppercase">Storefront Ordering Status</div>
                  <div className="text-[10px] text-muted-foreground font-mono mt-0.5">Master toggle to allow or temporarily pause online orders</div>
                </div>
                <select
                  className="bg-card border border-border text-foreground font-mono text-xs px-3 py-1.5 rounded-lg focus:outline-none focus:border-primary/50"
                  {...register("is_store_open")}
                >
                  <option value="true">OPEN (ACCEPTING ORDERS)</option>
                  <option value="false">PAUSED (STORE CLOSED)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Currency Symbol</label>
                  <input
                    type="text"
                    className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-primary/50 font-numeral"
                    {...register("currency_symbol")}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Standard Delivery Fee (LKR)</label>
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Tax Rate (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-primary/50 font-numeral"
                    {...register("tax_rate", { valueAsNumber: true })}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Estimated Delivery Time</label>
                  <input
                    type="text"
                    placeholder="30-45 mins"
                    className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-primary/50"
                    {...register("estimated_delivery_time")}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Estimated Prep Time</label>
                  <input
                    type="text"
                    placeholder="15-20 mins"
                    className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-primary/50"
                    {...register("estimated_prep_time")}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Button for Form */}
          {activeTab !== "security" && (
            <div className="flex items-center justify-end pt-2">
              <button
                type="submit"
                disabled={updateSettingsMutation.isPending}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed text-ink-dark text-xs font-mono font-bold rounded-xl uppercase tracking-wider cursor-pointer shadow-lg shadow-primary/20 transition-all active:scale-[0.98] min-w-[180px]"
              >
                {updateSettingsMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin text-ink-dark shrink-0" />
                ) : (
                  <Save className="h-4 w-4 shrink-0" />
                )}
                <span>{updateSettingsMutation.isPending ? "Deploying Settings..." : "Save & Deploy Variables"}</span>
              </button>
            </div>
          )}
        </form>
      )}

      {/* TAB 7: Security Credentials Card */}
      {activeTab === "security" && (
        <form onSubmit={handlePasswordChange} className="terminal-card bg-card border border-border p-6 space-y-4 max-w-4xl animate-in fade-in">
          <h2 className="text-xs font-bold text-foreground uppercase tracking-widest font-mono flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-pink" />
            <span>Administrator Credentials / Password Change</span>
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

          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              disabled={passwordUpdating}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-pink hover:bg-pink/90 disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-mono font-bold rounded-xl uppercase tracking-wider cursor-pointer shadow-lg shadow-pink/20 transition-all active:scale-[0.98] min-w-[180px]"
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
