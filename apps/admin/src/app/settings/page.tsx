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
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted mt-1">Manage your business configuration</p>
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
        className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors font-medium"
      >
        <Save className="w-4 h-4" />
        {saved ? "Saved!" : "Save Changes"}
      </button>
    </div>
  );
}

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-border p-6">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}

function FormField({ label, defaultValue, type = "text", className }: { label: string; defaultValue?: string; type?: string; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        className="w-full px-3 py-2 rounded-lg border border-border bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
      />
    </div>
  );
}
