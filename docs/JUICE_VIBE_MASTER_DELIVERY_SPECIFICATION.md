# JUICE VIBE WASKADUWA — MASTER PROJECT DELIVERY SPECIFICATION

---

## 1. COVER PAGE

**Project Title:** Juice Vibe Waskaduwa Digital Platform  
**System Name:** Juice Vibe Monorepo (Storefront Web, Admin Portal & REST API)  
**Client Name:** Juice Vibe Cafe Waskaduwa, Bentota, Sri Lanka  
**Lead Developer:** Dulanjaya Lakruwan (Full Stack Developer)  
**Contact:** devlakruwan@gmail.com | WhatsApp: +94 71 408 9493  
**Document Reference:** JV-DOC-2026-FINAL  
**Delivery Date:** July 19, 2026  
**Document Version:** 3.0 — Production Release Master Handover  

---

## 2. EXECUTIVE SUMMARY

The **Juice Vibe Digital Platform** is a full-stack, enterprise-grade web application monorepo engineered specifically for **Juice Vibe Waskaduwa**, a tropical juice café and eatery located in Sri Lanka. 

The ecosystem provides a high-converting customer storefront, an operations dispatch admin dashboard (featuring Kanban, Grid List, and Table Map order views), and a secure REST API with real-time WebSocket order notifications. 

Every single menu item (100% of the 35 products) features dedicated studio-quality product photography. The entire codebase passes TypeScript typechecks (`0 errors`) and production Turborepo builds with zero compilation warnings.

---

## 3. PROJECT OVERVIEW

### 3.1 Business Context & Goals
Juice Vibe Waskaduwa offers fresh organic juices, tropical smoothies, lassis, coffees, mocktails, burgers, sandwiches, and ice cream desserts. The digital platform was built to:
1. Enable online browsing, table QR-code ordering, and pickup/delivery orders.
2. Automate kitchen and dispatch operations through a real-time order desk.
3. Establish dominant local SEO ranking on Google Search and Google Maps for tourist and local discovery.

### 3.2 Deliverables Package
- **Customer Storefront Web App** (`apps/web`) — Next.js 16 (Turbopack) & React 19.
- **Admin Operations Dashboard** (`apps/admin`) — Next.js 16 & React Query with Emerald Theme.
- **Backend API & Real-time Server** (`apps/api`) — NestJS 11 & Passport JWT.
- **Shared Monorepo Libraries** (`packages/*`) — Services, UI, Database, Types, Utils, Config, Hooks.
- **Database & Asset Catalog** — PostgreSQL, Prisma ORM, 35 High-Res Product Photos.
- **Deployment Infrastructure** — Vercel Serverless & Docker support.

---

## 4. SYSTEM ARCHITECTURE

### 4.1 Monorepo Architecture Diagram

```mermaid
graph TD
    subgraph Applications [Apps]
        Web["@juice-vibe/web (Next.js 16 / React 19)"]
        Admin["@juice-vibe/admin (Next.js 16 / React Query)"]
        API["@juice-vibe/api (NestJS 11 / Swagger / WebSockets)"]
    end

    subgraph Packages [Shared Workspaces]
        Services["@juice-vibe/services (API Client & Stores)"]
        Database["@juice-vibe/database (Prisma Client Wrapper)"]
        UI["@juice-vibe/ui (Shared UI Components)"]
        Types["@juice-vibe/types (TypeScript Definitions)"]
        Config["@juice-vibe/config (SEO & App Settings)"]
        Utils["@juice-vibe/utils (Formatters & Helpers)"]
        Hooks["@juice-vibe/hooks (Shared Custom React Hooks)"]
    end

    subgraph Infrastructure [Production Cloud]
        DB[(Neon / Supabase PostgreSQL)]
        Cloudinary[(Cloudinary Media Storage)]
        Vercel[Vercel Serverless Hosting]
    end

    Web --> Services
    Web --> UI
    Web --> Types
    Admin --> Services
    Admin --> UI
    Admin --> Types
    API --> Database
    API --> Types
    API --> Utils
    Database --> DB
    API --> Cloudinary
    Web --> Vercel
    Admin --> Vercel
    API --> Vercel
```

### 4.2 Technology Stack Matrix

| Layer | Framework / Library | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Monorepo Orchestrator** | Turborepo + pnpm Workspaces | Turbo 2.10 / pnpm 10.3 | Monorepo caching, workspace building |
| **Frontend Storefront** | Next.js + React | 16.2.10 / 19.2.4 | Client-facing portal, cart, QR ordering |
| **Admin Portal** | Next.js + React Query | 16.2.10 / 5.62 | Dispatching, menu editing, analytics |
| **Backend API** | NestJS | 11.0.0 | REST API, Auth guards, WebSocket gateway |
| **Styling & Theme** | Tailwind CSS v4 + Framer Motion | v4.0 / v12.4 | Tropical UI design & smooth micro-interactions |
| **State Management** | Zustand | v5.0.0 | Cart store, persistent local storage |
| **Database ORM** | Prisma ORM | v6.19.3 | Type-safe PostgreSQL mapping |
| **Media Pipeline** | Cloudinary API | Cloudinary SDK | Cloud image uploads & optimization |

---

## 5. FEATURE OVERVIEW

### 5.1 Customer Storefront (`apps/web`)
- **Dynamic Menu & Filters**: Instant category filtering (Milkshakes, Juices, Smoothies, Lassi, Tea, Coffee, Mocktails, Ice Cream, Burgers, Sandwiches) and search query indexing.
- **Table QR-Code Detection**: Auto-detects table scan parameters (e.g., `?tableId=5`) for table delivery.
- **Cart & Storefront Drawer**: Client Zustand cart with quantity modifiers, add-on selections (e.g., Add BOBA), and total calculation.
- **Multi-Payment Checkout**: Supports Cash on Delivery and Online Bank Transfer with automatic WhatsApp receipt generation.

### 5.2 Admin Operations Dashboard (`apps/admin`)
- **Shared Dispatch Desk**: Real-time order dispatch with 3 operational view modes:
  - **KANBAN BOARD**: Visual status columns (`Pending` ➔ `Confirmed` ➔ `Preparing` ➔ `Ready` ➔ `Completed`).
  - **GRID LIST**: Tabular review for fast search, filter, and CSV data export.
  - **TABLE MAP**: Visual grid displaying active dine-in table numbers and pending items.
- **Live Alert Banner**: Real-time WebSocket push notifications for new incoming orders with sound/flash alerts.
- **Catalog & Pricing Manager**: Add/edit menu items, toggle popular badges, update prices and descriptions.

---

## 6. HOSTING GUIDE

### 6.1 Hosting Tier Comparison

| Feature / Resource | Option 1: Managed Cloud (Recommended) | Option 2: Dedicated VPS | Option 3: Enterprise Cloud |
| :--- | :--- | :--- | :--- |
| **Web & Admin Host** | Vercel Hobby ($0/mo) | Hetzner / DigitalOcean VPS (~$12/mo) | Vercel Pro ($20/mo) |
| **Backend API Host** | Vercel Serverless / Render ($0/mo) | Docker Compose on VPS | Render Web Service ($7/mo) |
| **PostgreSQL Database** | Neon.tech / Supabase Free ($0/mo) | PostgreSQL Container in Docker | Supabase Pro ($25/mo) |
| **Media Storage** | Cloudinary Free Tier (25 GB) | Cloudinary Free / MinIO | Cloudinary Starter |
| **Maintenance Level** | Zero Server Maintenance | Requires Linux OS / Security Updates | Zero Server Maintenance |
| **Total Monthly Cost** | **$0.00 / month (LKR 0)** | **~$12.00 / month (~LKR 3,600)** | **~$32.00 / month (~LKR 9,600)** |

---

## 7. DEPLOYMENT GUIDE

### 7.1 Vercel Environment Variables Configuration

Deploy `apps/web`, `apps/admin`, and `apps/api` as 3 separate Vercel projects:

#### Project 1: `juice-vibe-api` (`apps/api`)
```env
DATABASE_URL="postgresql://user:pass@ep-xxx.ap-southeast-1.aws.neon.tech/juice-vibe?sslmode=require"
JWT_SECRET="e9a8f237...64chars"
JWT_REFRESH_SECRET="a1b2c3d4...64chars"
JWT_ACCESS_EXPIRATION="15m"
JWT_REFRESH_EXPIRATION="7d"
PORT=4000
NODE_ENV="production"
FRONTEND_URL="https://juicevibe.lk"
ADMIN_URL="https://admin.juicevibe.lk"
CLOUDINARY_CLOUD_NAME="vf01cve6"
CLOUDINARY_API_KEY="552195961644341"
CLOUDINARY_API_SECRET="llP4exiSZfbS1DJELsGlO0vHad8"
ENABLE_EXPERIMENTAL_COREPACK=1
```

#### Project 2: `juice-vibe-web` (`apps/web`)
```env
NEXT_PUBLIC_API_URL="https://api.juicevibe.lk"
NODE_ENV="production"
ENABLE_EXPERIMENTAL_COREPACK=1
```

#### Project 3: `juice-vibe-admin` (`apps/admin`)
```env
NEXT_PUBLIC_API_URL="https://api.juicevibe.lk"
NODE_ENV="production"
ENABLE_EXPERIMENTAL_COREPACK=1
```

---

## 8. ADMINISTRATOR MANUAL

### 8.1 Access Credentials
- **Admin Portal URL**: `https://admin.juicevibe.lk` (or local `http://localhost:3001`)
- **Default Email**: `admin@juicevibe.com`
- **Default Password**: `Admin@123` *(Change immediately upon first login)*

### 8.2 Dispatching Orders
1. Log in to Admin ➔ Click **Order Desk**.
2. Click **Advance** on any card to move order status forward.
3. For Online Bank Transfer orders, verify payment receipt on WhatsApp ➔ Click **Mark Paid**.

---

## 9. CLIENT USER MANUAL

### 9.1 Placing Orders
1. Visit `https://juicevibe.lk`.
2. Browse products or scan Table QR code at the café.
3. Add items to cart ➔ Click **Checkout**.
4. Fill customer name, phone number, select payment method (**Cash on Delivery** or **Online Bank Transfer**), and confirm order.

---

## 10. PRODUCTION CHECKLIST

- [x] All 10 TypeScript packages typecheck with `0 errors`.
- [x] Turborepo production build completes with `0 compilation errors`.
- [x] Database seeded with 35 menu items containing valid thumbnail image URLs.
- [x] Admin panel brand styled in Emerald theme (`AGENTS.md` compliance).
- [x] CORS security rules configured for production URLs.

---

## 11. SEO & GOOGLE BUSINESS GUIDE

1. **Google Business Profile**: Claim profile at `business.google.com` ➔ Add website `https://juicevibe.lk` and menu `https://juicevibe.lk/menu`.
2. **Google Search Console**: Register `https://juicevibe.lk` ➔ Submit `sitemap.xml`.
3. **Structured Data**: `LocalBusiness` JSON-LD schema is active on every page.

---

## 12. BACKUP & RECOVERY PLAN

- **Automated Database Backups**: Managed via Neon.tech / Supabase daily automated snapshots.
- **Disaster Recovery**: To restore full database state from empty server:
  ```bash
  pnpm db:push
  pnpm db:seed
  ```

---

## 13. MAINTENANCE & SLA

- **Complimentary Warranty**: 30 days of free bug-fix support following delivery date.
- **Optional Monthly Maintenance**: LKR 8,000.00 / month for security updates, server monitoring, and minor content updates.

---

## 14. WARRANTY TERMS

The developer warrants that the delivered codebase operates free of reproducible defects for **30 calendar days** from the handover date. Warranty excludes new feature development, third-party hosting outages, or client password loss.

---

## 15. FINANCIAL SUMMARY

| Service | Original Value (LKR) | Final Cost (LKR) |
| :--- | ---: | ---: |
| Complete Monorepo System (Web + Admin + API + DB) | 180,000.00 | 180,000.00 |
| **Special Project Discount** | | **(150,000.00)** |
| **AGREED DEVELOPMENT FEE** | | **LKR 30,000.00** |
| **CLOUD DEPLOYMENT & DOMAIN SETUP FEE** | | **LKR 10,000.00** |
| **TOTAL COMMERCIAL PROJECT VALUE** | | **LKR 40,000.00** |
| *Advance Payment Paid* | | *(LKR 10,000.00)* |
| **FINAL BALANCE DUE UPON HANDOVER** | | **LKR 30,000.00** |

---

## 16. QUOTATION REFERENCE

**Quotation Ref:** JV-Q-2026-001  
**Developer:** Dulanjaya Lakruwan (WhatsApp: +94 71 408 9493)  
**Client:** Juice Vibe Waskaduwa  

---

## 17. SOURCE CODE HANDOVER CHECKLIST

- [x] Complete Git repository transfer.
- [x] Vercel project administrative access transfer.
- [x] Database connection credentials & Cloudinary API keys transfer.
- [x] Full technical documentation delivered.

---

## 18. PRODUCTION READINESS CERTIFICATE

This certifies that the **Juice Vibe Waskaduwa Digital Platform** has been subjected to complete functional, security, build, and asset audits, and is hereby certified **100% READY FOR PRODUCTION DISPATCH**.

---

## 19. ACCEPTANCE TEST REPORT

| Test Suite | Test Scope | Status | Result |
| :--- | :--- | :--- | :--- |
| **Web Storefront** | Menu filter, cart state, checkout form | 🟢 PASSED | 100% functional |
| **Admin Desk** | Order status advance, CSV export, table map | 🟢 PASSED | 100% functional |
| **NestJS API** | Auth JWT, Swagger UI, WebSocket alerts | 🟢 PASSED | 100% functional |
| **Database** | Seed integrity, relations, add-ons | 🟢 PASSED | 100% functional |

---

## 20. SIGN-OFF PAGES

| | For Juice Vibe Waskaduwa (Client) | Prepared By (Developer) |
| :--- | :--- | :--- |
| **Name** | _______________________________ | **Dulanjaya Lakruwan** |
| **Title / Role** | _______________________________ | Full Stack Developer |
| **Signature** | _______________________________ | _______________________________ |
| **Date** | _______________________________ | July 19, 2026 |

---

## 21. APPENDIX

### Appendix A: Key API Endpoints
- `POST /api/auth/login` — Staff Authentication
- `GET /api/menu/items` — Fetch Menu Items Catalog
- `POST /api/orders` — Create Customer Order
- `GET /api/orders` — Admin Orders List (with filters)
- `PATCH /api/orders/:id/status` — Advance Order Lifecycle

### Appendix B: Environment Variables Reference
See Section 7.1 for complete production environment variable keys.
