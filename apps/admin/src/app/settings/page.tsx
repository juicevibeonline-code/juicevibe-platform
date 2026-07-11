"use client";

import { useEffect, useState } from "react";
import { Save, Store, Clock, CreditCard, Share2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { useToast } from "@/hooks/useToast";
import { settingsService } from "@juice-vibe/services";

export default function SettingsPage() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<Record<string, string>>({
    businessName: "Juice Vibe",
    tagline: "Sip the Good Vibes",
    phone: "+94 71 843 5876",
    email: "hello@juicevibe.com",
    address: "Galle Road, Bentota",
    weekdays: "8:00 AM – 10:00 PM",
    saturday: "9:00 AM – 11:00 PM",
    sunday: "10:00 AM – 9:00 PM",
    taxRate: "5",
    currency: "LKR",
    deliveryFee: "150",
    freeDeliveryMin: "1000",
    instagramUrl: "https://instagram.com/juicevibe",
    facebookUrl: "https://facebook.com/juicevibe",
    tiktokUrl: "https://tiktok.com/@juicevibe",
    whatsappNumber: "94718435876",
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        const data = await settingsService.getSettings();
        if (data && Object.keys(data).length > 0) {
          setSettings((prev) => ({ ...prev, ...data }));
        }
      } catch (err: any) {
        console.error("Failed to load settings:", err);
        toast({
          title: "Failed to load settings",
          message: err.message || "Using local cached defaults instead.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, [toast]);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validation
    const tax = Number(settings.taxRate);
    if (isNaN(tax) || tax < 0 || tax > 100) {
      return toast({
        title: "Validation Error",
        message: "Tax Rate must be a number between 0 and 100.",
        type: "error",
      });
    }

    const fee = Number(settings.deliveryFee);
    if (isNaN(fee) || fee < 0) {
      return toast({
        title: "Validation Error",
        message: "Delivery Fee must be a positive number.",
        type: "error",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (settings.email && !emailRegex.test(settings.email)) {
      return toast({
        title: "Validation Error",
        message: "Please enter a valid email address.",
        type: "error",
      });
    }

    try {
      setSaving(true);
      await settingsService.updateSettings(settings);
      toast({
        title: "Settings saved!",
        message: "Your configuration has been updated successfully.",
        type: "success",
      });
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Failed to save settings",
        message: err.message || "An error occurred while saving.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto px-4 pb-12">
        <PageHeader title="Settings" subtitle="Loading configurations..." accentColor="orange" />
        <div className="space-y-6 animate-pulse">
          <div className="h-48 bg-card border border-border rounded-lg" />
          <div className="h-32 bg-card border border-border rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-3xl mx-auto px-4 pb-12">
      <PageHeader
        title="Settings"
        subtitle="Manage your business configuration and preferences"
        accentColor="orange"
      />

      <SettingsSection title="General Information" icon={Store}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Business Name" value={settings.businessName || ""} onChange={(v) => handleChange("businessName", v)} />
          <FormField label="Tagline" value={settings.tagline || ""} onChange={(v) => handleChange("tagline", v)} />
          <FormField label="Phone" value={settings.phone || ""} onChange={(v) => handleChange("phone", v)} />
          <FormField label="Email" value={settings.email || ""} onChange={(v) => handleChange("email", v)} type="email" />
          <FormField label="Address" value={settings.address || ""} onChange={(v) => handleChange("address", v)} className="sm:col-span-2" />
        </div>
      </SettingsSection>

      <SettingsSection title="Business Hours" icon={Clock}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Weekdays" value={settings.weekdays || ""} onChange={(v) => handleChange("weekdays", v)} />
          <FormField label="Saturday" value={settings.saturday || ""} onChange={(v) => handleChange("saturday", v)} />
          <FormField label="Sunday" value={settings.sunday || ""} onChange={(v) => handleChange("sunday", v)} />
        </div>
      </SettingsSection>

      <SettingsSection title="Pricing & Delivery" icon={CreditCard}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Tax Rate (%)" value={settings.taxRate || ""} onChange={(v) => handleChange("taxRate", v)} type="number" />
          <FormField label="Currency" value={settings.currency || ""} onChange={(v) => handleChange("currency", v)} />
          <FormField label="Delivery Fee (LKR)" value={settings.deliveryFee || ""} onChange={(v) => handleChange("deliveryFee", v)} type="number" />
          <FormField label="Free Delivery Min. (LKR)" value={settings.freeDeliveryMin || ""} onChange={(v) => handleChange("freeDeliveryMin", v)} type="number" />
        </div>
      </SettingsSection>

      <SettingsSection title="Social Media" icon={Share2}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Instagram URL" value={settings.instagramUrl || ""} onChange={(v) => handleChange("instagramUrl", v)} />
          <FormField label="Facebook URL" value={settings.facebookUrl || ""} onChange={(v) => handleChange("facebookUrl", v)} />
          <FormField label="TikTok URL" value={settings.tiktokUrl || ""} onChange={(v) => handleChange("tiktokUrl", v)} />
          <FormField label="WhatsApp Number" value={settings.whatsappNumber || ""} onChange={(v) => handleChange("whatsappNumber", v)} />
        </div>
      </SettingsSection>

      <button
        type="submit"
        disabled={saving}
        className="flex items-center justify-center gap-1.5 w-full sm:w-auto px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg font-bold text-xs shadow-sm shadow-primary/10 cursor-pointer transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {saving ? (
          <>
            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="w-3.5 h-3.5" />
            Save Configuration
          </>
        )}
      </button>
    </form>
  );
}

function SettingsSection({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card border border-border/80 rounded-xl shadow-sm p-6 space-y-4">
      <div className="flex items-center gap-2.5 pb-3.5 border-b border-border/60">
        <Icon className="w-4 h-4 text-primary shrink-0" />
        <h2 className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-zinc-300">{title}</h2>
      </div>
      <div>{children}</div>
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  type = "text",
  className,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-muted mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg border border-border/80 bg-slate-50/50 focus:bg-background text-xs text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-semibold placeholder:text-muted"
      />
    </div>
  );
}
