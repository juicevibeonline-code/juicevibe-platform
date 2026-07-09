"use client";

import { useState } from "react";
import { Save } from "lucide-react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto animate-fade-in pb-12">
      <div className="relative p-8 rounded-[2rem] glass-panel overflow-hidden mb-8">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-orange/20 rounded-full blur-[80px]" />
        <div className="relative z-10">
          <h1 className="text-3xl font-black text-foreground tracking-tight">Settings</h1>
          <p className="text-muted font-medium mt-2">Manage your business configuration and preferences</p>
        </div>
      </div>

      {/* General Settings */}
      <SettingsSection title="General Information">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Business Name" defaultValue="Juice Vibe" />
          <FormField label="Tagline" defaultValue="Sip the Good Vibes" />
          <FormField label="Phone" defaultValue="+94 71 843 5876" />
          <FormField label="Email" defaultValue="hello@juicevibe.com" />
          <FormField label="Address" defaultValue="Galle Road, Bentota" className="col-span-2" />
        </div>
      </SettingsSection>

      {/* Business Hours */}
      <SettingsSection title="Business Hours">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Weekdays" defaultValue="8:00 AM - 10:00 PM" />
          <FormField label="Saturday" defaultValue="9:00 AM - 11:00 PM" />
          <FormField label="Sunday" defaultValue="10:00 AM - 9:00 PM" />
        </div>
      </SettingsSection>

      {/* Pricing */}
      <SettingsSection title="Pricing & Delivery">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Tax Rate (%)" defaultValue="5" type="number" />
          <FormField label="Currency" defaultValue="LKR" />
          <FormField label="Delivery Fee" defaultValue="150" type="number" />
          <FormField label="Free Delivery Min." defaultValue="1000" type="number" />
        </div>
      </SettingsSection>

      {/* Social Media */}
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
        className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl hover:scale-105 transition-all duration-300 font-bold shadow-[0_4px_15px_rgba(34,197,94,0.3)] mt-8 cursor-pointer"
      >
        <Save className="w-5 h-5" />
        {saved ? "Changes Saved!" : "Save Configuration"}
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
