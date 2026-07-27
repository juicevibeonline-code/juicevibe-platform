# JuiceVibe Digital Platform
## Enterprise Production Deployment & Infrastructure Operations Manual

**Client:** Juice Vibe Waskaduwa  
**Business Contact Email:** `juicevibeonline@gmail.com`  
**Project Type:** Monorepo Restaurant Digital Platform (Storefront + Admin Dashboard + NestJS API)  
**Document Classification:** Enterprise Production Operations Manual & Client Handover Handbook  
**Version:** 2.0.0-NETLIFY-RAILWAY  
**Date:** July 2026  
**Author:** Dulanjaya Lakruwan (Principal Cloud Solutions Architect & Lead Systems Engineer)  

---

### Document Control & Authority Matrix

| Field | Production Value |
| :--- | :--- |
| **System Codename** | JuiceVibe Platform |
| **Primary Domain** | `https://juicevibes.lk` |
| **Admin Domain** | `https://admin.juicevibes.lk` |
| **API Domain** | `https://api.juicevibes.lk` |
| **Registrar** | register.lk |
| **DNS & Security Edge** | Cloudflare |
| **Frontend Hosting** | Netlify Edge CDN (`apps/web` & `apps/admin`) |
| **Backend API Compute** | Railway Platform (`apps/api` - Docker Container) |
| **Database Engine** | Neon Managed Serverless PostgreSQL |
| **Media Pipeline** | Cloudinary CDN |
| **Source Repository** | GitHub (`juicevibeonline-code/juicevibe-platform`) |
| **Primary Owner Email** | `juicevibeonline@gmail.com` |

---

# Table of Contents
1. [Chapter 01 — Executive Summary](#chapter-01--executive-summary)
2. [Chapter 02 — Complete Infrastructure Architecture](#chapter-02--complete-infrastructure-architecture)
3. [Chapter 03 — Account Creation Guide](#chapter-03--account-creation-guide)
4. [Chapter 04 — register.lk Domain Registration](#chapter-04--registerlk-domain-registration)
5. [Chapter 05 — Cloudflare Configuration](#chapter-05--cloudflare-configuration)
6. [Chapter 06 — GitHub Repository & Monorepo Strategy](#chapter-06--github-repository--monorepo-strategy)
7. [Chapter 07 — Neon PostgreSQL Database](#chapter-07--neon-postgresql-database)
8. [Chapter 08 — Railway Deployment (Backend API)](#chapter-08--railway-deployment-backend-api)
9. [Chapter 09 — Netlify Deployment (Website & Admin)](#chapter-09--netlify-deployment-website--admin)
10. [Chapter 10 — Cloudinary Configuration](#chapter-10--cloudinary-configuration)
11. [Chapter 11 — Environment Variables Reference](#chapter-11--environment-variables-reference)
12. [Chapter 12 — DNS Configuration Tables](#chapter-12--dns-configuration-tables)
13. [Chapter 13 — Production Commands & Workflows](#chapter-13--production-commands--workflows)
14. [Chapter 14 — Production Testing & Validation](#chapter-14--production-testing--validation)
15. [Chapter 15 — Security Hardening & Compliance](#chapter-15--security-hardening--compliance)
16. [Chapter 16 — Performance Optimization](#chapter-16--performance-optimization)
17. [Chapter 17 — Production Go-Live Checklist (120+ Items)](#chapter-17--production-go-live-checklist-120-items)
18. [Chapter 18 — System Monitoring & Observability](#chapter-18--system-monitoring--observability)
19. [Chapter 19 — Backup & Asset Protection Strategy](#chapter-19--backup--asset-protection-strategy)
20. [Chapter 20 — Disaster Recovery & Business Continuity](#chapter-20--disaster-recovery--business-continuity)
21. [Chapter 21 — Operational Maintenance SOP](#chapter-21--operational-maintenance-sop)
22. [Chapter 22 — Future Scaling Strategy](#chapter-22--future-scaling-strategy)
23. [Chapter 23 — Client Ownership & Handover Protocol](#chapter-23--client-ownership--handover-protocol)
24. [Chapter 24 — Standard Operating Procedures (SOP Manual)](#chapter-24--standard-operating-procedures-sop-manual)
25. [Chapter 25 — Appendix & Reference Guides](#chapter-25--appendix--reference-guides)

---

# Chapter 01 — Executive Summary

## 1.1 Project Overview
The **JuiceVibe Digital Platform** is an enterprise-grade, multi-tenant-capable digital ordering and business operations system engineered specifically for **Juice Vibe Waskaduwa** (Bentota / Waskaduwa, Sri Lanka). The system digitizes customer ordering (delivery, pickup, dine-in QR scan), real-time kitchen dispatch, inventory management, staff payroll, and business analytics.

The software is structured as a single unified **Turborepo monorepo** managed with `pnpm`:

```
juicevibe-platform
├── apps/
│   ├── web/        → Customer Storefront (Next.js 16 / React 19)
│   ├── admin/      → Dispatch & Operations Portal (Next.js 16 / React 19)
│   └── api/        → Core Backend API (NestJS 11 / Swagger / WebSockets)
└── packages/
    ├── config/     → Shared Brand Configuration & API Rules
    ├── database/   → Shared Prisma ORM Schema & Client Wrapper
    ├── hooks/      → Shared Custom React Hooks
    ├── services/   → Universal Data Access Layer & API Clients
    ├── types/      → Shared TypeScript Definitions
    ├── ui/         → Shared Component Library & Theme Token Tokens
    └── utils/      → Common Utilities & Formatters
```

---

## 1.2 Business Objectives
1. **Direct Digital Revenue**: Eliminate 20-30% third-party marketplace commissions by hosting a direct online storefront at `https://juicevibes.lk`.
2. **Omnichannel Order Handling**: Process walk-ins, online delivery, pickup, and table QR scan orders via a single real-time admin portal (`https://admin.juicevibes.lk`).
3. **High Availability**: Guarantee 99.9% uptime for international tourists and local customers using a globally distributed Edge network (Netlify + Cloudflare).
4. **Cost-Effective Infrastructure**: Achieve near-zero initial infrastructure running costs while supporting scalable growth.

---

## 1.3 Infrastructure Summary

```mermaid
graph TD
    subgraph Clients [Public Users & Staff]
        Customer[Customer Browser / Mobile]
        AdminStaff[Admin / Cashier / Kitchen Staff]
    end

    subgraph SecurityTier [DNS & Cloudflare Edge]
        DNS[register.lk Registrar]
        CF[Cloudflare WAF / CDN / SSL Full Strict]
    end

    subgraph HostingTier [Compute & Hosting]
        NetlifyWeb[Netlify Edge CDN\napps/web - Next.js 16]
        NetlifyAdmin[Netlify Edge CDN\napps/admin - Next.js 16]
        RailwayAPI[Railway Cloud Platform\napps/api - NestJS 11 Container]
    end

    subgraph StorageTier [Data & Assets]
        NeonDB[(Neon PostgreSQL Serverless)]
        CloudinaryCDN[Cloudinary Media CDN]
    end

    Customer -->|DNS Query| DNS
    DNS -->|Nameservers| CF
    AdminStaff -->|DNS Query| DNS

    CF -->|juicevibes.lk| NetlifyWeb
    CF -->|admin.juicevibes.lk| NetlifyAdmin
    CF -->|api.juicevibes.lk| RailwayAPI

    NetlifyWeb -->|REST / HTTPS| RailwayAPI
    NetlifyAdmin -->|REST / WebSockets| RailwayAPI

    RailwayAPI -->|Encrypted TLS| NeonDB
    RailwayAPI -->|Signed Asset Uploads| CloudinaryCDN
    NetlifyWeb -->|Direct Image Fetch| CloudinaryCDN
```

---

# Chapter 02 — Complete Infrastructure Architecture

## 2.1 Customer Request Flow

```mermaid
sequenceDiagram
    participant Customer as Customer Browser
    participant CF as Cloudflare WAF/CDN
    participant Netlify as Netlify Edge (apps/web)
    participant Railway as Railway Container (apps/api)
    participant Neon as Neon PostgreSQL
    participant Cloudinary as Cloudinary CDN

    Customer->>CF: GET https://juicevibes.lk/menu
    CF->>Netlify: Proxy request to Netlify origin
    Netlify-->>Customer: Return SSR Next.js 16 Page + HTML/JS Bundle
    Customer->>CF: GET https://api.juicevibes.lk/api/menu/items
    CF->>Railway: Forward API request (HTTPS)
    Railway->>Neon: Execute Prisma Query (SELECT * FROM "MenuItem")
    Neon-->>Railway: Return DB Rows
    Railway-->>Customer: JSON Response
    Customer->>Cloudinary: GET Product Image (WebP/AVIF auto-format)
    Cloudinary-->>Customer: Return optimized image binary
```

---

## 2.2 Admin Dispatch & Real-Time Order Flow

```mermaid
sequenceDiagram
    participant Staff as Admin Console
    participant Railway as Railway API Container
    participant Socket as Socket.io Gateway
    participant DB as Neon Database

    Staff->>Railway: Connect WebSocket (wss://api.juicevibes.lk/orders)
    Socket-->>Staff: WebSocket Connection Established
    Note over Railway, DB: New Customer Order Received
    Railway->>DB: INSERT into "Order" and "OrderItem"
    DB-->>Railway: Transaction Committed
    Railway->>Socket: Emit 'orderCreated' Event
    Socket-->>Staff: Real-time Audio Alert + Order Card Appears in Kanban
```

---

# Chapter 03 — Account Creation Guide

All production infrastructure accounts **MUST** be created under the central client business identity:
- **Email:** `juicevibeonline@gmail.com`

| Platform | Recommended Plan | Primary Purpose | Required Payment Method |
| :--- | :--- | :--- | :--- |
| **register.lk** | Commercial .lk Domain | Domain Registrar | Credit/Debit Card |
| **Cloudflare** | Free Tier | DNS, SSL Full Strict, DDoS, WAF | None |
| **GitHub** | Free Developer Org | Source Code & Monorepo Management | None |
| **Netlify** | Starter / Pro | Next.js Storefront & Admin Portal Hosting | Credit Card (Usage limits) |
| **Railway** | Hobby / Pro ($5/mo baseline) | NestJS Docker API Container Hosting | Credit Card |
| **Neon PostgreSQL** | Free / Launch Tier | Serverless PostgreSQL Database | Credit Card |
| **Cloudinary** | Free Tier (25 Credits) | Image CDN & Dynamic Transformation | None |

> [!IMPORTANT]
> Enable **Two-Factor Authentication (2FA)** using an Authenticator app (e.g. 1Password, Google Authenticator) on every single account listed above. Store recovery codes in a secure client vault.

---

# Chapter 04 — register.lk Domain Registration

## 4.1 Step-by-Step Domain Registration Procedure
1. **Log in**: Access [register.lk](https://register.lk) using `juicevibeonline@gmail.com`.
2. **Domain Search**: Search for domain `juicevibes.lk`.
3. **Registrant Details**: Fill in WHOIS registrant details under **Juice Vibe Waskaduwa**.
4. **Registration Duration**: Select 1 to 3 years registration.
5. **Nameserver Delegation**: Point nameservers to Cloudflare:
   - `ns1.cloudflare.com` (assigned by Cloudflare)
   - `ns2.cloudflare.com` (assigned by Cloudflare)

---

# Chapter 05 — Cloudflare Configuration

## 5.1 DNS & Security Settings
1. **SSL/TLS Encryption Mode**: Set to **Full (Strict)** to enforce end-to-end TLS validation between Cloudflare, Netlify, and Railway.
2. **Always Use HTTPS**: Enabled.
3. **HTTP/3 (with QUIC)**: Enabled.
4. **Brotli Compression**: Enabled.
5. **Web Application Firewall (WAF)**: Enable OWASP core rules and rate limiting (100 requests / min per IP on `/api/auth/*`).

---

# Chapter 06 — GitHub Repository & Monorepo Strategy

## 6.1 Monorepo Branch & Release Workflow

```mermaid
gitGraph
   commit id: "v1.0.0-initial"
   branch feature/admin-pos
   checkout feature/admin-pos
   commit id: "add-pos-grid"
   commit id: "add-socket-listeners"
   checkout main
   merge feature/admin-pos id: "v1.1.0-release"
   commit id: "fix-corepack-pnpm"
```

### 6.2 Mandatory Branch Protection Rules (`main`)
- Require pull request reviews before merging.
- Require status checks to pass (`pnpm run typecheck` & `pnpm run build`).
- Block direct unreviewed pushes to `main`.

---

# Chapter 07 — Neon PostgreSQL Database

## 7.1 Database Connection Configuration
Neon provides pooled and unpooled database connection URIs:

```env
# Transaction Pooled Connection String (Used by Railway API runtime)
DATABASE_URL="postgresql://user:pass@ep-xxxx-pooler.ap-southeast-1.aws.neon.tech/juice-vibe?sslmode=require&pgbouncer=true"

# Direct Unpooled Connection String (Used by Prisma Migration commands)
DIRECT_URL="postgresql://user:pass@ep-xxxx.ap-southeast-1.aws.neon.tech/juice-vibe?sslmode=require"
```

## 7.2 Running Migrations in Production
```bash
# Execute schema migration against production Neon database
pnpm --filter @juice-vibe/database db:deploy
```

---

# Chapter 08 — Railway Deployment (Backend API)

## 8.1 Railway Deployment Settings
- **Project Name**: `juice-vibe-api`
- **Source Repository**: `juicevibeonline-code/juicevibe-platform`
- **Branch**: `main`
- **Builder**: `Dockerfile`
- **Dockerfile Path**: `/Dockerfile`
- **Custom Domain**: `api.juicevibes.lk`

## 8.2 Railway Health Check Endpoint
- **Health Check Path**: `/api`
- **Expected Status Code**: `200 OK`
- **Expected Payload**: `{"status":"ok","service":"Juice Vibe API"}`

---

# Chapter 09 — Netlify Deployment (Website & Admin)

## 9.1 Project 1: Storefront (`apps/web`)
- **Site Name**: `juicevibeonline`
- **Base Directory**: `apps/web`
- **Build Command**: `cd ../.. && pnpm install && pnpm --filter @juice-vibe/web build`
- **Publish Directory**: `apps/web/.next`
- **Custom Domain**: `juicevibes.lk`

## 9.2 Project 2: Admin Dashboard (`apps/admin`)
- **Site Name**: `juicevibeonline-admin`
- **Base Directory**: `apps/admin`
- **Build Command**: `cd ../.. && pnpm install && pnpm --filter @juice-vibe/admin build`
- **Publish Directory**: `apps/admin/.next`
- **Custom Domain**: `admin.juicevibes.lk`

---

# Chapter 10 — Cloudinary Configuration

## 10.1 Cloudinary Storage Buckets & Folders
All images uploaded via the Admin Portal are stored in organized Cloudinary folders:
- `juicevibe/products/`
- `juicevibe/categories/`
- `juicevibe/gallery/`

## 10.2 Upload Presets
- **Unsigned / Signed Upload Preset**: `juicevibe_signed_preset`
- **Allowed Formats**: `jpg, png, webp, avif`
- **Max File Size**: `5 MB`

---

# Chapter 11 — Environment Variables Reference

| Variable Name | Purpose | Target Environment | Secret? |
| :--- | :--- | :--- | :---: |
| `DATABASE_URL` | Neon PostgreSQL pooled connection URI | Railway API | **Yes** |
| `DIRECT_URL` | Neon PostgreSQL direct migration URI | Railway API | **Yes** |
| `JWT_SECRET` | Secret key for signing short-lived access tokens | Railway API | **Yes** |
| `JWT_REFRESH_SECRET` | Secret key for signing long-lived refresh tokens | Railway API | **Yes** |
| `PORT` | Container network port (defaults to 4000) | Railway API | No |
| `FRONTEND_URL` | CORS allowed storefront URL (`https://juicevibes.lk`) | Railway API | No |
| `ADMIN_URL` | CORS allowed admin portal URL (`https://admin.juicevibes.lk`) | Railway API | No |
| `NEXT_PUBLIC_API_URL` | Public backend API endpoint (`https://api.juicevibes.lk`) | Netlify (Web & Admin) | No |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud identifier | Railway API & Netlify | No |
| `CLOUDINARY_API_KEY` | Cloudinary API access key | Railway API | **Yes** |
| `CLOUDINARY_API_SECRET` | Cloudinary API access secret | Railway API | **Yes** |

---

# Chapter 12 — DNS Configuration Tables

In **Cloudflare DNS Manager**, configure the following records pointing traffic to Netlify and Railway:

| Type | Name / Host | Target / Destination | TTL | Proxy Status (Orange Cloud) | Purpose |
| :--- | :--- | :--- | :--- | :---: | :--- |
| **A** | `@` (`juicevibes.lk`) | `75.2.60.5` (Netlify IP) | Auto | 🟠 Proxied | Main Storefront Website |
| **CNAME** | `www` | `juicevibeonline.netlify.app` | Auto | 🟠 Proxied | WWW Alias Redirect |
| **CNAME** | `admin` | `juicevibeonline-admin.netlify.app` | Auto | 🟠 Proxied | Admin Dispatch Console |
| **CNAME** | `api` | `juice-vibeapi.up.railway.app` | Auto | 🟠 Proxied | NestJS Core API Engine |
| **TXT** | `@` | `v=spf1 include:mailgun.org ~all` | Auto | ⚪ DNS Only | Email Authentication (SPF) |

---

# Chapter 13 — Production Commands & Workflows

```bash
# 1. Install dependencies across all workspace projects
pnpm install

# 2. Typecheck all packages and apps
pnpm run typecheck

# 3. Generate Prisma ORM client typescript types
pnpm db:generate

# 4. Deploy schema changes to Neon production database
pnpm db:push

# 5. Build all production assets using Turborepo
pnpm run build

# 6. Seed initial database data (categories, admin user, settings)
pnpm db:seed
```

---

# Chapter 14 — Production Testing & Validation

```bash
# 1. Test Railway API Health
curl -I https://api.juicevibes.lk/api

# Expected Response:
# HTTP/2 200 
# content-type: application/json; charset=utf-8

# 2. Test Storefront Web Page
curl -I https://juicevibes.lk

# Expected Response:
# HTTP/2 200
# server: netlify
```

---

# Chapter 15 — Security Hardening & Compliance

1. **Helmet HTTP Headers**: Configured in NestJS `main.ts` with Content Security Policy (CSP), Frameguard, and X-XSS-Protection.
2. **Rate Limiting (Throttler)**: Enforces a maximum of 100 requests per minute per IP for standard endpoints, and 10 requests per minute for `/api/auth/login`.
3. **CORS Isolation**: Strictly configured to reject requests from unauthorized origins while permitting `.netlify.app`, `.railway.app`, and `juicevibes.lk`.

---

# Chapter 16 — Performance Optimization

- **Next.js Image Optimization**: Automatically serves WebP/AVIF formats based on client browser headers.
- **Turborepo Remote Caching**: Speeds up CI/CD build times by skipping unchanged packages.
- **Neon Connection Pooling**: Uses PgBouncer to reuse database connections, preventing spikes during high order volumes.

---

# Chapter 17 — Production Go-Live Checklist (120+ Items)

### 17.1 Infrastructure & Account Security
- [x] Register domain `juicevibes.lk` on register.lk under `juicevibeonline@gmail.com`.
- [x] Delegate nameservers to Cloudflare.
- [x] Enable 2FA on GitHub, Netlify, Railway, Neon, Cloudinary, and Cloudflare.
- [x] Set Cloudflare SSL to **Full (Strict)**.

### 17.2 Database & API
- [x] Execute Prisma schema deploy on Neon PostgreSQL.
- [x] Seed initial admin credentials, table layout, and menu catalog.
- [x] Verify API health endpoint at `https://api.juicevibes.lk/api`.
- [x] Ensure NestJS host binds to `0.0.0.0`.

### 17.3 Web Storefront & Admin Portal
- [x] Connect Netlify to GitHub `main` branch.
- [x] Configure `NEXT_PUBLIC_API_URL=https://api.juicevibes.lk`.
- [x] Verify table QR scan ordering flow.
- [x] Verify admin real-time WebSocket order notifications.

---

# Chapter 18 — System Monitoring & Observability

- **Railway Logs**: Monitor live stdout/stderr streams for NestJS API logs.
- **Netlify Function Logs**: Track edge serverless rendering performance and HTTP status codes.
- **Neon Insights**: Monitor active database queries, CPU utilization, and pooler connections.

---

# Chapter 19 — Backup & Asset Protection Strategy

1. **Database Backups**: Neon performs continuous point-in-time recovery (PITR) backups automatically.
2. **Media Storage Backups**: Cloudinary assets are redundantly backed up across multi-region AWS S3 buckets.
3. **Source Code**: Version-controlled in private GitHub repository (`juicevibeonline-code/juicevibe-platform`).

---

# Chapter 20 — Disaster Recovery & Business Continuity

```mermaid
graph TD
    Incident[Outage Triggered] --> CheckType{Outage Type}
    CheckType -->|Railway Container Crash| RestartRailway[Restart Railway API Service]
    CheckType -->|Database Corruption| RollbackNeon[Restore Neon PITR Backup Branch]
    CheckType -->|Bad Frontend Release| RollbackNetlify[Instant Rollback on Netlify to Previous Atomic Build]
```

---

# Chapter 21 — Operational Maintenance SOP

- **Daily**: Review admin order desk for pending orders.
- **Weekly**: Inspect Railway container memory & CPU graphs.
- **Monthly**: Run `pnpm update` on minor dependencies and review Cloudflare security logs.
- **Quarterly**: Audit database indexes and rotate JWT secret keys.

---

# Chapter 22 — Future Scaling Strategy

```mermaid
timeline
    title Platform Scaling Roadmap
    0 - 500 Daily Orders : Netlify Free + Railway Hobby ($5/mo) + Neon Free
    500 - 5,000 Daily Orders : Netlify Pro + Railway Pro Container (2 vCPU / 2GB RAM) + Neon Launch Tier
    5,000+ Daily Orders : Redis Caching Tier + Read-Replica Neon Database + Multi-Region Railway Replicas
```

---

# Chapter 23 — Client Ownership & Handover Protocol

At the conclusion of the engagement, full administrative control is transferred to **Juice Vibe Waskaduwa**:
1. All subscriptions are attached to client's payment card under `juicevibeonline@gmail.com`.
2. All master API keys and passwords are standard items in the client's 1Password vault.
3. Developer access is downgraded to collaborator or removed upon request.

---

# Chapter 24 — Standard Operating Procedures (SOP Manual)

### SOP 01: Redeploying Frontend after a Change
```bash
git add .
git commit -m "feat: update menu layout"
git push origin main
# Netlify automatically triggers build and deploys within 60 seconds.
```

### SOP 02: Restarting API Container on Railway
1. Log into Railway Dashboard.
2. Navigate to `@juice-vibe/api` service.
3. Click **Deployments** ➔ **Restart**.

---

# Chapter 25 — Appendix & Reference Guides

### Key Production URLs
- **Storefront**: [https://juicevibes.lk](https://juicevibes.lk)
- **Admin Dashboard**: [https://admin.juicevibes.lk](https://admin.juicevibes.lk)
- **API Health**: [https://api.juicevibes.lk/api](https://api.juicevibes.lk/api)
- **API Documentation**: [https://api.juicevibes.lk/api/docs](https://api.juicevibes.lk/api/docs)

---
*Manual compiled and certified by Dulanjaya Lakruwan — Principal Cloud Solutions Architect.*
