# Master Client Delivery & Hosting Handbook
**Client:** Juice Vibe Waskaduwa, Bentota, Sri Lanka  
**Developer:** Dulanjaya Lakruwan (Full Stack Developer)  
**Date:** July 19, 2026  
**Document Version:** 2.0 — Final Release & Production Handoff  

---

## 1. System Audit & Verification Summary

The **Juice Vibe Digital Ecosystem** has been thoroughly audited, built, and verified across all components:

| Component | Architecture / Tech | Status | Verification Detail |
| :--- | :--- | :--- | :--- |
| **Customer Storefront (`apps/web`)** | Next.js 16 (Turbopack), Framer Motion, Tailwind CSS v4 | 🟢 VERIFIED | Dynamic menu, QR Table scan detection, live search, shopping cart, Cash & Bank Transfer checkout. |
| **Admin Operations (`apps/admin`)** | Next.js 16, React Query, Zustand, Lucide Icons | 🟢 VERIFIED | Emerald brand design system (`AGENTS.md`), IBM Plex Mono numerals, real-time shared state for Kanban, Grid List, and Table Map dispatch. |
| **Backend API (`apps/api`)** | NestJS 11, Passport JWT, Swagger UI, WebSocket Gateway | 🟢 VERIFIED | Full CRUD APIs, CORS protection, request throttling, JWT Auth, and real-time WebSocket order notifications. |
| **Database & ORM (`packages/database`)** | PostgreSQL + Prisma ORM | 🟢 VERIFIED | Seeded with 35 menu items, categories, add-ons, test reviews, business settings, and admin user. |
| **Product Photography Asset Catalog** | High-Res PNGs Studio Product Photography | 🟢 VERIFIED | **100% of the 35 menu items** contain dedicated, high-resolution product photography (no missing images). |
| **Monorepo Build Integrity** | Turborepo + pnpm workspaces | 🟢 PASSED | `npx turbo typecheck` passed (0 errors); `npx turbo build` succeeded across 10 packages. |

---

## 2. Production Hosting Options & Cost Analysis

To provide Juice Vibe Waskaduwa with maximum reliability, flexibility, and cost-efficiency, we have detailed **three hosting deployment tiers**:

### 📊 Hosting Tiers Comparison Matrix

| Feature / Resource | Option 1: Managed Cloud (Recommended for Start) | Option 2: Dedicated VPS (Full Control) | Option 3: Enterprise Managed Cloud |
| :--- | :--- | :--- | :--- |
| **Web + Admin Host** | Vercel Serverless | DigitalOcean / Hetzner VPS (Docker) | Vercel Pro |
| **Backend API Host** | Vercel Serverless / Render Free | DigitalOcean / Hetzner VPS (Docker) | Render Web Service ($7/mo) |
| **Database Host** | Neon.tech / Supabase (Free Tier) | PostgreSQL in Docker (Local volume) | Supabase Pro ($25/mo) |
| **Media Storage** | Cloudinary Free Tier (25 GB) | Cloudinary / Local MinIO | Cloudinary Starter |
| **Domain Name** | `.lk` Domain (LK Domain Registry) | `.lk` Domain (LK Domain Registry) | `.lk` Domain (LK Domain Registry) |
| **Maintenance Effort** | Zero Server Management | Requires Linux/Docker Updates | Zero Server Management |
| **Uptime & SLA** | 99.9% Cloud Availability | User-managed Uptime | 99.99% Enterprise SLA |
| **Monthly Cost (USD)** | **$0.00 / month** | **~$12.00 / month** | **~$32.00 / month** |
| **Monthly Cost (LKR)** | **LKR 0.00 / month** | **~LKR 3,600 / month** | **~LKR 9,600 / month** |
| **Annual Domain (.lk)** | **LKR 3,500 - 4,500 / year** | **LKR 3,500 - 4,500 / year** | **LKR 3,500 - 4,500 / year** |

---

### Option Details & Recommendations

#### Option 1: Managed Cloud (Starter Plan — **$0 / month**) — *RECOMMENDED FOR LAUNCH*
- **Storefront & Admin**: Deployed on Vercel Hobby ($0/mo). Free SSL certificate included.
- **Backend API**: Deployed on Vercel Serverless or Render Web Service ($0/mo).
- **PostgreSQL Database**: Deployed on Neon.tech Free Tier ($0/mo up to 0.5 GB database storage).
- **Media Storage**: Cloudinary Free Tier ($0/mo up to 25 GB net media & 25,000 monthly transformations).
- **Domain**: `juicevibe.lk` (~LKR 3,800/year via LK Domain Registry).
- **Why Choose This**: Zero monthly recurring server fee. Handles up to 10,000 monthly website visits seamlessly without technical overhead.

#### Option 2: Dedicated Single VPS (Docker Containerized — **~LKR 3,600 / month**)
- **Server**: Hetzner Cloud (CX22) or DigitalOcean Droplet (2 vCPU, 4 GB RAM, 40 GB NVMe SSD) at ~$12/month.
- **Environment**: Docker Compose orchestration running NestJS API, Web Next.js, Admin Next.js, PostgreSQL 16, Redis, and NGINX Reverse Proxy with Let's Encrypt SSL.
- **Why Choose This**: Complete ownership of data, unlimited requests, no third-party serverless request caps.

#### Option 3: Enterprise Cloud (Scale Plan — **~LKR 9,600 / month**)
- **Frontend & Admin**: Vercel Pro ($20/month) with team collaboration and custom analytics.
- **Backend API**: Render Paid Service ($7/month) for non-sleeping 24/7 background worker threads.
- **Database**: Supabase Pro ($25/month) with point-in-time automated backups.
- **Why Choose This**: High-volume throughput, automated daily database snapshots, zero cold-start latency.

---

## 3. Financial & Development Fee Summary

| Service Item | Original Value (LKR) | Final Agreed Cost (LKR) |
| :--- | ---: | ---: |
| UI/UX Design System & Custom Brand Palette | 20,000.00 | Included |
| Next.js Customer Website Development | 35,000.00 | Included |
| Admin Operations Portal & Dispatch Board | 35,000.00 | Included |
| NestJS REST API & WebSocket Real-time Gateway | 30,000.00 | Included |
| PostgreSQL Database & Prisma ORM Schema | 15,000.00 | Included |
| Auth, Throttling & Role Security Implementation | 10,000.00 | Included |
| Product Photography Generation (100% Catalog) | 15,000.00 | Included |
| Cloud Deployment & Environment Setup | 10,000.00 | Included |
| Testing, Quality Assurance & Bug Fixes | 10,000.00 | Included |
| **Total Value** | **180,000.00** | |
| **Special Project Discount** | **(150,000.00)** | |
| **FINAL AGREED DEVELOPMENT FEE** | | **LKR 30,000.00** |

### Payment Schedule Status
- **Advance Payment Received**: **LKR 10,000.00**
- **Balance Final Payment Due**: **LKR 20,000.00** (payable upon handover)

---

## 4. Platform Access & Operating Manual

### 🔐 System Access Credentials

| Application | Production URL | Default Credentials |
| :--- | :--- | :--- |
| **Customer Storefront** | `https://juice-vibe-waskaduwa-web.vercel.app` | Open Access |
| **Admin Operations** | `https://juice-vibe-waskaduwa-admin.vercel.app` | **Email**: `admin@juicevibe.com`<br>**Password**: `Admin@123` |
| **Backend API & Swagger** | `https://juice-vibe-waskaduwa-api.vercel.app/api/docs` | Interactive Swagger Docs |

---

### 📖 Store Staff Operating Instructions

#### A. Managing Orders on the Order Desk (`apps/admin`)
1. Log into `http://localhost:3001` or your live admin domain using `admin@juicevibe.com`.
2. Navigate to **Order Desk** in the left sidebar menu.
3. Choose your preferred viewing mode:
   - **KANBAN**: Visual drag/click columns (`Pending` ➔ `Confirmed` ➔ `Preparing` ➔ `Ready` ➔ `Completed`).
   - **GRID LIST**: Tabular operational layout for fast sorting, batch review, and CSV data export.
   - **TABLE MAP**: Live visual map showing active dine-in table numbers and pending orders.
4. When a new order arrives:
   - An audible alert banner flashes with order total and table/delivery details.
   - Click **Advance** to move the order status to `Preparing` and `Ready`.
   - For **Online Bank Transfer** orders awaiting customer payment verification, click **Mark Paid** once the WhatsApp receipt is verified.

#### B. Managing Menu Catalog & Pricing
1. Navigate to **Menu Management** in the admin sidebar.
2. Add new menu items or update prices, descriptions, popular badges, and image links.
3. Any changes made in Admin reflect instantly on the Customer Web Storefront.

---

## 5. Client Handover & Delivery Sign-Off

By signing below, the client acknowledges the full receipt and operational verification of the Juice Vibe Digital Platform deliverables, including source code, database seed files, administration documentation, and deployment configurations.

| | For Juice Vibe Waskaduwa (Client) | Prepared By (Developer) |
| :--- | :--- | :--- |
| **Name** | _______________________________ | **Dulanjaya Lakruwan** |
| **Title / Role** | _______________________________ | Full Stack Developer |
| **Signature** | _______________________________ | _______________________________ |
| **Date** | _______________________________ | July 19, 2026 |

---

*Thank you for partnering with us to build the digital future of Juice Vibe Waskaduwa! 🧃🥭*
