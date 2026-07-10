"use client";

import { useState } from "react";
import { Save, CheckCircle } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { useToast } from "@/hooks/useToast";

export default function SettingsPage() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    toast({ title: "Settings saved!", message: "Your configuration has been updated successfully.", type: "success" });
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto animate-fade-in pb-12">
      <PageHeader
        title="Settings"
        subtitle="Manage your business configuration and preferences"
        accentColor="orange"
      />

      <SettingsSection title="General Information">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Business Name" defaultValue="Juice Vibe" />
          <FormField label="Tagline" defaultValue="Sip the Good Vibes" />
          <FormField label="Phone" defaultValue="+94 71 843 5876" />
          <FormField label="Email" defaultValue="hello@juicevibe.com" />
          <FormField label="Address" defaultValue="Galle Road, Bentota" className="col-span-2" />
        </div>
      </SettingsSection>

      <SettingsSection title="Business Hours">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Weekdays" defaultValue="8:00 AM - 10:00 PM" />
          <FormField label="Saturday" defaultValue="9:00 AM - 11:00 PM" />
          <FormField label="Sunday" defaultValue="10:00 AM - 9:00 PM" />
        </div>
      </SettingsSection>

      <SettingsSection title="Pricing & Delivery">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Tax Rate (%)" defaultValue="5" type="number" />
          <FormField label="Currency" defaultValue="LKR" />
          <FormField label="Delivery Fee" defaultValue="150" type="number" />
          <FormField label="Free Delivery Min." defaultValue="1000" type="number" />
        </div>
      </SettingsSection>

      <SettingsSection title="Social Media">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Instagram URL" defaultValue="https://instagram.com/juicevibe" />
          <FormField label="Facebook URL" defaultValue="https://facebook.com/juicevibe" />
          <FormField label="TikTok URL" defaultValue="https://tiktok.com/@juicevibe" />
          <FormField label="WhatsApp Number" defaultValue="94718435876" />
        </div>
      </SettingsSection>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl hover:scale-105 transition-all duration-300 font-bold shadow-[0_4px_15px_rgba(34,197,94,0.3)] mt-8 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100"
      >
        {saving ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="w-5 h-5" />
            Save Configuration
          </>
        )}
      </button>
    </div>
  );
}

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-panel rounded-3xl p-6 md:p-8 hover:shadow-lg transition-shadow duration-300">
      <h2 className="text-xl font-bold mb-6 text-foreground tracking-tight">{title}</h2>
      {children}
    </div>
  );
}

function FormField({ label, defaultValue, type = "text", className }: { label: string; defaultValue?: string; type?: string; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        className="w-full px-4 py-2.5 rounded-xl border border-transparent bg-white/60 dark:bg-white/5 text-sm focus:outline-none focus:bg-white dark:focus:bg-black/20 focus:border-primary/30 focus:shadow-[0_0_15px_rgba(34,197,94,0.1)] transition-all duration-300 font-medium text-foreground"
      />
    </div>
  );
}
