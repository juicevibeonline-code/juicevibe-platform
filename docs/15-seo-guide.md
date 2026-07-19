# 15. SEO & Google Business Ranking Specification
**Target Domain:** `https://juicevibe.lk`  
**Document Version:** 3.0.0-PROD  
**Author:** Dulanjaya Lakruwan  
**Date:** July 19, 2026  

---

## 1. Local SEO Strategy for Waskaduwa & Bentota

To capture high-intent search queries from Sri Lankan locals and foreign tourists (such as *"juice bar waskaduwa"*, *"fresh fruit juice bentota"*, *"best burgers near me"*), follow this 5-step SEO checklist:

---

## 2. Step-by-Step Optimization Roadmap

### Step 1: Google Business Profile (Google Maps #1 Pack)
1. Register profile at **[business.google.com](https://business.google.com)**.
2. Title: `Juice Vibe - Waskaduwa`
3. Primary Category: `Juice Shop` | Secondary: `Cafe`, `Restaurant`
4. Add Website URL: `https://juicevibe.lk` | Menu URL: `https://juicevibe.lk/menu`
5. Address: `No.89 Bandaragama Road, Waskaduwa, Sri Lanka, 12580`

### Step 2: Google Search Console Indexing
1. Register property `https://juicevibe.lk` at **[search.google.com/search-console](https://search.google.com/search-console)**.
2. Submit dynamic sitemap: `https://juicevibe.lk/sitemap.xml`.
3. Click **Request Indexing** via URL Inspection tool.

### Step 3: Structured LocalBusiness Schema.org Integration
The codebase (`apps/web/src/app/layout.tsx`) contains built-in JSON-LD structured data rendering directly into document headers:
```json
{
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "name": "Juice Vibe",
  "url": "https://juicevibe.lk",
  "telephone": "+94718435876",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "No.89 Bandaragama Road",
    "addressLocality": "Waskaduwa",
    "addressCountry": "LK"
  }
}
```

### Step 4: 5-Star Google Review QR Strategy
Place QR standees on café tables encouraging customers to leave 5-star Google Reviews mentioning specific menu items (e.g. *"Best fresh mango juice and avocado dates smoothie in Waskaduwa!"*).
