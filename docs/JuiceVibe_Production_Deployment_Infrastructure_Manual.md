# JuiceVibe Digital Platform
## Production Deployment & Infrastructure Operations Manual

**Client:** Juice Vibe Waskaduwa
**Project Type:** Restaurant Website + Admin Portal + Backend API + Mobile Application
**Document Classification:** Internal / Client Technical Reference
**Version:** 1.0
**Date:** July 2026
**Prepared By:** Dulanjaya Lakruwan

---

### Document Control

| Field | Value |
|---|---|
| Document Owner | Dulanjaya Lakruwan |
| Project Codename | JuiceVibe |
| Environments Covered | Production, Preview/Staging |
| Primary Domain | `https://juicevibes.lk` |
| Admin Domain | `https://admin.juicevibes.lk` |
| API Domain | `https://api.juicevibes.lk` |
| Review Cycle | Quarterly |
| Status | Active |

---

## How to Use This Manual

This manual is written so that an engineer with general web development experience — but no prior exposure to this specific stack — can deploy, operate, secure, and recover the JuiceVibe platform from zero. Every operational procedure follows a consistent structure:

- **Purpose** — why this step exists
- **Prerequisites** — what must be true before you start
- **Commands** — exact commands or UI actions to run
- **Expected Results** — what success looks like
- **Validation** — how to confirm it actually worked
- **Troubleshooting** — what to do when it doesn't
- **Rollback** — how to safely undo the change
- **Best Practices** — how senior engineers do this in production
- **Security Considerations** — what to watch for

> **Note:** Commands in this manual assume a Unix-like shell (macOS/Linux) or WSL2 on Windows. Where a step is UI-driven (e.g., a dashboard click-path), the manual describes it in numbered form rather than as a shell command.

> **Warning:** This manual describes a real production system serving paying customers. Every destructive command (drops, force-pushes, resets) is explicitly labeled `[DESTRUCTIVE]`. Do not run a `[DESTRUCTIVE]` command outside of a scheduled maintenance window without a verified backup.

---

# Chapter 01 — Executive Summary

## 1.1 Purpose of This Document

This document is the single source of truth for deploying, operating, securing, monitoring, and recovering the JuiceVibe Digital Platform in production. It exists to remove single points of knowledge failure — any competent engineer should be able to pick up this manual and safely operate the system without relying on tribal knowledge held only by the original developer.

## 1.2 Project Summary

JuiceVibe is a digital ordering and brand platform for **Juice Vibe Waskaduwa**, a juice bar / restaurant business. The platform consists of four independently deployable applications sharing a common database and type system:

| Component | Purpose | Audience |
|---|---|---|
| **Website** (`apps/web`) | Public-facing storefront: menu browsing, ordering, brand presence | Customers |
| **Admin Portal** (`apps/admin`) | Order management, menu/product management, reporting | Restaurant staff/owner |
| **Backend API** (`apps/api`) | Business logic, authentication, order processing, data persistence | Website, Admin, Mobile App |
| **Mobile App** (React Native) | Customer-facing ordering on iOS/Android | Customers |

## 1.3 Business Objectives

1. Enable online ordering without dependency on third-party marketplace commissions.
2. Give the client full ownership of all infrastructure, data, and accounts (no vendor lock-in to the development agency).
3. Launch on infrastructure that costs near-zero at low order volume, and scales linearly as the business grows.
4. Establish a maintainable, documented system that can outlive the original development engagement.

## 1.4 Technology Stack Summary

| Layer | Technology |
|---|---|
| Frontend (Web) | Next.js 16, React 19, TypeScript, Tailwind CSS |
| Admin Portal | Next.js 16, React, TypeScript |
| Backend API | NestJS 11, Prisma ORM |
| Database | PostgreSQL (Neon, serverless) |
| Mobile | React Native |
| Package Manager | pnpm (monorepo) |
| Hosting — Web/Admin | Vercel |
| Hosting — API | Railway |
| DNS / CDN / Security | Cloudflare |
| Domain Registrar | register.lk |
| Media Storage | Cloudinary |
| Source Control / CI | GitHub + GitHub Actions (via Vercel/Railway native integrations) |

## 1.5 Infrastructure Philosophy

The infrastructure choices in this manual deliberately favor **managed, serverless-first platforms** over self-managed servers (no raw EC2/VPS, no self-managed Kubernetes, no self-managed Postgres). This trades a small amount of monthly cost and platform flexibility for a very large reduction in operational burden — appropriate for a small business without a dedicated infrastructure team. Chapter 24 describes the explicit upgrade path away from this posture as the business scales.

## 1.6 Ownership Model

Every account (register.lk, Cloudflare, GitHub, Vercel, Railway, Neon, Cloudinary) is created and owned under the **client's** identity and billing details, not the developer's. The developer is granted collaborator/member access for the duration of the engagement. This is covered in full in Chapter 25 (Client Handover Documentation).

## 1.7 Document Scope

**In scope:** Domain, DNS, hosting, database, CI/CD, security hardening, performance, testing, monitoring, backup, disaster recovery, maintenance, scaling, and handover for the web, admin, and API components.

**Out of scope:** Native mobile app store submission (Apple App Store / Google Play Store review processes), payment gateway PCI compliance audit, and physical point-of-sale hardware integration. These are addressed at a high level only, with pointers to where dedicated documentation would be needed.

---

# Chapter 02 — System Overview

## 2.1 What the System Does

A customer visits `juicevibes.lk`, browses the menu (fetched from the API, images served via Cloudinary), places an order, and authenticates (or checks out as guest, depending on business rules). The order is written to PostgreSQL via the NestJS API. Restaurant staff view and manage incoming orders in real time through `admin.juicevibes.lk`, which talks to the same API. The React Native mobile app is a second client of the same API, giving customers a native ordering experience on iOS/Android.

## 2.2 Repository Structure

The project is a **pnpm monorepo** — a single Git repository containing multiple applications and shared packages, so that types, database schema, and utility code are written once and consumed everywhere.

```
juicevibe/
├── apps/
│   ├── web/          # Next.js customer-facing website
│   ├── admin/         # Next.js admin portal
│   └── api/           # NestJS backend API
├── packages/
│   ├── database/      # Prisma schema + client
│   ├── types/          # Shared TypeScript types/interfaces
│   └── utils/          # Shared utility functions
├── pnpm-workspace.yaml
├── package.json
└── turbo.json (optional, if using Turborepo for build orchestration)
```

**Why a monorepo:** a shared `packages/database` package means the API's Prisma schema and the generated TypeScript types are available to `web` and `admin` without publishing a private npm package. A shared `packages/types` package guarantees the frontend and backend agree on the shape of an "Order" or "Product" at compile time, catching integration bugs before runtime.

## 2.3 Environments

| Environment | Purpose | Web/Admin Host | API Host | Database |
|---|---|---|---|---|
| Production | Live customer traffic | Vercel Production | Railway Production service | Neon Production branch |
| Preview | Per-pull-request review | Vercel Preview Deployments | Railway PR environments (optional) | Neon branch (optional) |
| Local | Developer machines | `localhost:3000` / `3001` | `localhost:4000` | Local Postgres or Neon dev branch |

## 2.4 High-Level Data Flow

1. Client (browser or mobile app) requests a page or calls an API endpoint.
2. Cloudflare receives the request first (DNS points here), applies security/caching rules, and forwards to the origin (Vercel or Railway).
3. Vercel serves static/server-rendered Next.js pages; for data, the page calls the API.
4. Railway runs the NestJS API container, which validates the request (JWT), executes business logic, and reads/writes via Prisma to Neon PostgreSQL.
5. Images referenced in products/orders are fetched directly from Cloudinary's CDN, not proxied through the API.

## 2.5 Key Non-Functional Requirements

| Requirement | Target |
|---|---|
| Availability | 99.5%+ (managed platform SLAs; no custom HA engineering required at this scale) |
| API response time (p95) | < 500ms for standard CRUD endpoints |
| Time to first byte (web) | < 200ms (Cloudflare edge cache + Vercel edge network) |
| RPO (Recovery Point Objective) | ≤ 24 hours (see Chapter 22) |
| RTO (Recovery Time Objective) | ≤ 4 hours for full platform restore (see Chapter 22) |

---

# Chapter 03 — Complete Infrastructure Architecture

## 3.1 Architecture Overview

The diagram below shows every major component and how traffic flows between them.

```mermaid
flowchart TB
    User[("Customer / Staff<br/>Browser or Mobile")]
    RN["React Native<br/>Mobile App"]
    CF["Cloudflare<br/>DNS · CDN · WAF · SSL"]
    VWeb["Vercel<br/>apps/web (Next.js)"]
    VAdmin["Vercel<br/>apps/admin (Next.js)"]
    RailAPI["Railway<br/>apps/api (NestJS)"]
    Neon[("Neon<br/>PostgreSQL")]
    Cloud["Cloudinary<br/>Media CDN"]
    GH["GitHub<br/>Monorepo"]

    User -->|HTTPS| CF
    RN -->|HTTPS| CF
    CF -->|juicevibes.lk| VWeb
    CF -->|admin.juicevibes.lk| VAdmin
    CF -->|api.juicevibes.lk| RailAPI
    VWeb -->|REST calls| RailAPI
    VAdmin -->|REST calls| RailAPI
    RN -->|REST calls| RailAPI
    RailAPI -->|Prisma Client| Neon
    VWeb -.->|image URLs| Cloud
    VAdmin -.->|upload/fetch| Cloud
    RailAPI -.->|signed uploads| Cloud
    GH -->|push to main| VWeb
    GH -->|push to main| VAdmin
    GH -->|push to main| RailAPI
```

## 3.2 Deployment Flow

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant GH as GitHub
    participant Vercel as Vercel
    participant Railway as Railway
    participant Neon as Neon

    Dev->>GH: git push origin main
    GH-->>Vercel: webhook trigger (web, admin)
    GH-->>Railway: webhook trigger (api)
    Vercel->>Vercel: pnpm install, build, deploy
    Railway->>Railway: build image, run migrations, deploy
    Railway->>Neon: prisma migrate deploy
    Vercel-->>Dev: Deployment URL + status
    Railway-->>Dev: Deployment URL + status
```

## 3.3 Request Flow (Web Page Load)

```mermaid
sequenceDiagram
    participant Browser
    participant CF as Cloudflare
    participant Vercel
    participant API as Railway API
    participant DB as Neon

    Browser->>CF: GET juicevibes.lk/menu
    CF->>Vercel: forward (cache miss) or serve cached edge copy
    Vercel->>API: GET api.juicevibes.lk/products
    API->>DB: SELECT products
    DB-->>API: rows
    API-->>Vercel: JSON
    Vercel-->>CF: rendered HTML
    CF-->>Browser: HTML (cached at edge for next request)
```

## 3.4 Authentication Flow

```mermaid
sequenceDiagram
    participant Client
    participant API as Railway API
    participant DB as Neon

    Client->>API: POST /auth/login {email, password}
    API->>DB: fetch user by email
    DB-->>API: user record (hashed password)
    API->>API: bcrypt.compare(password, hash)
    API->>API: sign JWT_SECRET (access) + JWT_REFRESH_SECRET (refresh)
    API-->>Client: {accessToken, refreshToken}
    Client->>API: subsequent requests: Authorization: Bearer accessToken
    API->>API: verify JWT signature + expiry
    API-->>Client: 200 OK / 401 Unauthorized
```

## 3.5 Image Upload Flow

```mermaid
sequenceDiagram
    participant Admin as Admin Portal
    participant API as Railway API
    participant Cloud as Cloudinary

    Admin->>API: POST /uploads/signature
    API->>API: generate signed upload params (API secret never exposed to client)
    API-->>Admin: {signature, timestamp, apiKey, cloudName}
    Admin->>Cloud: direct upload (multipart/form-data + signature)
    Cloud-->>Admin: {secure_url, public_id}
    Admin->>API: POST /products {..., imageUrl: secure_url}
    API->>API: persist product with Cloudinary URL
```

**Why signed direct uploads:** the browser uploads straight to Cloudinary rather than routing large image files through the Railway API. This avoids consuming Railway's bandwidth/memory for file transfer and keeps the API stateless and fast. The Cloudinary **API secret** is never sent to the client — only a short-lived signature is.

## 3.6 Order Flow

```mermaid
sequenceDiagram
    participant Customer
    participant Web as Web/Mobile Client
    participant API as Railway API
    participant DB as Neon
    participant Admin as Admin Portal (staff)

    Customer->>Web: Add items, checkout
    Web->>API: POST /orders {items, customerInfo}
    API->>API: validate JWT (if authenticated) or guest checkout rules
    API->>DB: BEGIN TRANSACTION
    API->>DB: INSERT order, INSERT order_items, DECREMENT stock (if tracked)
    API->>DB: COMMIT
    DB-->>API: order record
    API-->>Web: {orderId, status: "pending"}
    Admin->>API: GET /orders?status=pending (polling or websocket)
    API->>DB: SELECT pending orders
    DB-->>API: rows
    API-->>Admin: order list
    Admin->>API: PATCH /orders/:id {status: "confirmed"}
    API->>DB: UPDATE order status
```

## 3.7 Component Ownership Matrix

| Component | Deployed To | Owned/Billed By | Managed By (during engagement) |
|---|---|---|---|
| Domain | register.lk | Client | Developer (delegated access) |
| DNS/CDN/WAF | Cloudflare | Client | Developer (delegated access) |
| Web/Admin hosting | Vercel | Client | Developer (team member role) |
| API hosting | Railway | Client | Developer (team member role) |
| Database | Neon | Client | Developer (team member role) |
| Media | Cloudinary | Client | Developer (team member role) |
| Source code | GitHub | Client (org) or Developer (transferred at handover) | Developer |

> **Best Practice:** Never hold client production infrastructure under a personal developer account "temporarily." Create every account under the client's email/billing from day one and add the developer as a collaborator. Retrofitting ownership transfer later is error-prone and has caused real businesses to lose access to their own domains and databases.

---

# Chapter 04 — Required Accounts

## 4.1 Account Inventory

Before any deployment work begins, the following accounts must exist, each registered under the **client's** business email address (recommended: a Google Workspace address such as `admin@juicevibes.lk`, or a personal email the client controls long-term — never a developer's personal email).

| # | Account | Purpose | Free Tier Available | Requires Payment Method |
|---|---|---|---|---|
| 1 | register.lk | Domain registration for `.lk` TLD | No (paid annually) | Yes |
| 2 | Cloudflare | DNS, CDN, SSL, WAF | Yes | No (free plan) |
| 3 | GitHub | Source control, CI triggers | Yes | No |
| 4 | Vercel | Web + Admin hosting | Yes (Hobby) | No (Hobby), Yes (Pro) |
| 5 | Railway | API hosting | Yes (trial credit), then paid Hobby | Yes |
| 6 | Neon | PostgreSQL database | Yes (Free plan) | No (Free), Yes (paid tiers) |
| 7 | Cloudinary | Media storage/CDN | Yes (Free plan) | No (Free), Yes (paid tiers) |
| 8 | Google Workspace (optional) | Professional email (`admin@juicevibes.lk`) | No | Yes |

## 4.2 Account Creation Order

**Purpose:** Some accounts depend on others being created first (e.g., you need a domain before you can configure Cloudflare DNS for it).

**Recommended sequence:**
1. register.lk — purchase the domain first; everything else depends on it existing.
2. Cloudflare — add the domain as a zone.
3. GitHub — create the organization/repository.
4. Neon — create the database project (no dependency on domain).
5. Cloudinary — create the media account (no dependency on domain).
6. Vercel — create the account, connect GitHub, then attach the custom domain (needs Cloudflare DNS access).
7. Railway — create the account, connect GitHub, then attach the API subdomain (needs Cloudflare DNS access).
8. Google Workspace (optional) — set up professional email, ideally before the domain is used publicly.

## 4.3 Credential Custody During Development

| Credential Type | Where It Lives | Who Has Access |
|---|---|---|
| Account passwords | Client's password manager (e.g., 1Password, Bitwarden) shared vault | Client + Developer (during engagement) |
| API keys / secrets | Platform environment variable stores (Vercel/Railway dashboards) | Never committed to Git |
| `.env` files (local dev only) | Developer's local machine, `.gitignore`d | Never shared via chat/email |

> **Warning:** Never send API keys, database connection strings, or JWT secrets over email, Slack DMs, or WhatsApp in plaintext. Use the platform's dashboard directly, or a secrets manager. If a secret is ever sent insecurely, rotate it immediately (see Chapter 16).

## 4.4 Best Practices

- Enable **two-factor authentication (2FA)** on every account in this table before any production data or traffic touches the system.
- Use a unique, generated password per account, stored in a password manager — never reuse passwords across register.lk, Cloudflare, GitHub, Vercel, Railway, and Neon.
- Add the client as **Owner** and the developer as **Admin/Member** on every platform that supports role-based access (Vercel, Railway, Cloudflare, GitHub), rather than sharing a single login.

---

# Chapter 05 — Domain Registration (register.lk)

## 5.1 Purpose

Register `juicevibes.lk` as the platform's canonical domain, under the client's ownership, and prepare it to be pointed at Cloudflare's nameservers.

## 5.2 Prerequisites

- Client's legal/business name, address, and contact email and phone number (required for WHOIS registration).
- A payment method (card) — LKR 3,500–4,000/year, billed annually.
- Decision on privacy: whether WHOIS contact details should be business-public or use a privacy/proxy service, if register.lk offers one.

## 5.3 Step-by-Step: Domain Purchase

1. Navigate to `https://register.lk` and create an account using the client's email address.
2. Use the domain search tool to confirm `juicevibes.lk` is available.
3. Select the `.lk` (or `.com.lk`, if that is the intended variant) domain and add it to cart.
4. Enter registrant (WHOIS) details exactly as the legal business is named — this matters for future domain transfer or dispute resolution.
5. Select registration period: minimum 1 year; consider 2–3 years to reduce renewal admin overhead (at the cost of upfront cash outlay).
6. Complete payment under the **client's** payment method.
7. Wait for registration confirmation email — `.lk` domains sometimes require manual verification by LK Domain Registry, which can take 1–3 business days for certain TLD variants.

## 5.4 Step-by-Step: Nameserver Configuration

**Purpose:** Point the domain at Cloudflare so Cloudflare becomes the authoritative DNS provider (required before Chapter 06 configuration takes effect).

1. Log into the register.lk control panel.
2. Locate **Nameserver Management** / **DNS Management** for `juicevibes.lk`.
3. Replace the default register.lk nameservers with the two nameservers Cloudflare assigns when you add the zone (see Chapter 06, Section 6.2) — typically in the form `xxxx.ns.cloudflare.com` and `yyyy.ns.cloudflare.com`.
4. Save changes.

## 5.5 Expected Results

- Domain shows as **Active** in the register.lk dashboard.
- WHOIS lookup (`whois juicevibes.lk`) shows the client as the registrant.
- Nameservers eventually resolve to Cloudflare's assigned nameservers.

## 5.6 Validation

```bash
# Confirm domain resolves and check nameservers
dig NS juicevibes.lk +short

# Expect output similar to:
# xxxx.ns.cloudflare.com.
# yyyy.ns.cloudflare.com.
```

> **Note:** Nameserver changes can take anywhere from a few minutes to 24–48 hours to fully propagate globally, because DNS resolvers around the world cache records according to TTL (Time To Live) values. This is normal and not a fault in the configuration.

## 5.7 Troubleshooting

| Symptom | Likely Cause | Fix |
|---|---|---|
| `dig NS` still shows register.lk's default nameservers after 48 hours | Nameserver change not saved, or registrar-side propagation delay | Re-check the nameserver fields were saved; contact register.lk support if beyond 48 hours |
| Domain shows "pending verification" | `.lk` registry manual review in progress | Wait for registry email confirmation; contact register.lk support if beyond 3 business days |
| WHOIS shows wrong registrant details | Typo during registration | Contact register.lk support to correct WHOIS record |

## 5.8 Rollback

Domain registration itself has no "rollback" — it is a purchase. If nameservers were pointed incorrectly, simply revert the nameserver fields in the register.lk panel to the previous (or correct) values; there is no data loss risk at this stage since no traffic depends on the domain yet.

## 5.9 Best Practices

- Enable **auto-renewal** at register.lk to avoid accidental domain expiry — a lapsed domain can be re-registered by a third party and is extremely disruptive to recover.
- Set a calendar reminder 30 days before renewal regardless of auto-renewal, as a safety net.
- Keep WHOIS contact email as a **role-based address** (e.g., `admin@juicevibes.lk` once Workspace is set up) rather than a personal email, so renewal notices aren't lost if a staff member leaves.

## 5.10 Security Considerations

- Enable **domain lock / transfer lock** at register.lk if available, to prevent unauthorized domain transfers.
- Enable 2FA on the register.lk account itself.

---

# Chapter 06 — Cloudflare Configuration

## 6.1 Purpose

Cloudflare sits in front of every public-facing hostname (`juicevibes.lk`, `admin.juicevibes.lk`, `api.juicevibes.lk`), providing DNS resolution, TLS termination, caching, compression, and basic security (WAF, bot protection, rate limiting) — all on the free plan.

## 6.2 Step-by-Step: Add the Site to Cloudflare

1. Log into Cloudflare with the client's account.
2. Click **Add a Site**, enter `juicevibes.lk`.
3. Select the **Free** plan.
4. Cloudflare scans existing DNS records (if any) and presents them for review.
5. Note the two nameservers Cloudflare assigns — these are what get entered at register.lk (Chapter 05.4).
6. Click **Continue**, then **Done, check nameservers**.

## 6.3 DNS Records Configuration

See Chapter 13 for the complete DNS table. At minimum, the following records must exist before Vercel/Railway custom domains will verify:

| Type | Name | Content | Proxy Status |
|---|---|---|---|
| CNAME | `@` or `www` | `cname.vercel-dns.com` (Vercel-provided) | Proxied |
| CNAME | `admin` | `cname.vercel-dns.com` (Vercel-provided) | Proxied |
| CNAME | `api` | Railway-provided target | Proxied (with care — see 6.4 warning) |

## 6.4 SSL/TLS Configuration

1. Navigate to **SSL/TLS** → **Overview**.
2. Set encryption mode to **Full (Strict)** — this requires the origin (Vercel/Railway) to present a valid certificate, which both platforms provide automatically. **Do not** use "Flexible" mode in production — it encrypts only browser-to-Cloudflare, leaving Cloudflare-to-origin unencrypted, which is a security gap.
3. Navigate to **SSL/TLS** → **Edge Certificates**:
   - Enable **Always Use HTTPS**.
   - Enable **HTTP Strict Transport Security (HSTS)** — start with a short `max-age` (e.g., 300 seconds) during initial rollout, then increase to 6–12 months once confirmed stable. **Warning:** HSTS with a long `max-age` is very hard to undo for users who already loaded it, since browsers cache the policy — test thoroughly before setting a long duration.
   - Enable **Minimum TLS Version**: TLS 1.2 or higher.
   - Enable **TLS 1.3**.

> **Warning:** Enabling "Full (Strict)" before the origin (Vercel/Railway) has an active, valid SSL certificate on its custom domain will cause SSL handshake errors (521/526 errors). Configure the custom domain on Vercel/Railway first (Chapters 09–10), confirm their auto-issued certificate is active, then switch Cloudflare to Full (Strict).

## 6.5 Performance Configuration

| Setting | Location | Recommended Value |
|---|---|---|
| Caching Level | Caching → Configuration | Standard |
| Browser Cache TTL | Caching → Configuration | 4 hours (adjust per asset type via Page Rules) |
| Brotli Compression | Speed → Optimization | On |
| HTTP/3 (QUIC) | Network | On |
| Early Hints | Speed → Optimization | On |
| Rocket Loader | Speed → Optimization | Off initially (can break some React hydration; test before enabling) |

## 6.6 Page Rules / Cache Rules

Example rule for static assets (adjust to actual Next.js asset paths):

| Rule | Match | Setting |
|---|---|---|
| Cache static assets aggressively | `juicevibes.lk/_next/static/*` | Cache Level: Cache Everything, Edge TTL: 30 days |
| Never cache API responses | `api.juicevibes.lk/*` | Cache Level: Bypass |

## 6.7 Security Configuration

### 6.7.1 Web Application Firewall (WAF)

1. Navigate to **Security** → **WAF**.
2. Enable the **Cloudflare Managed Ruleset** (included free).
3. Review and enable **OWASP Core Ruleset** if available on plan (may require a paid add-on on some Cloudflare plan tiers — verify current plan entitlements).

### 6.7.2 Bot Protection

1. Navigate to **Security** → **Bots**.
2. Enable **Bot Fight Mode** (available on Free plan) to challenge obviously automated traffic without impacting legitimate users.

### 6.7.3 Rate Limiting

Configure a rate limiting rule to protect the login endpoint from brute-force attempts:

| Rule Name | Match | Rate | Action |
|---|---|---|---|
| Login brute-force protection | `api.juicevibes.lk/auth/login` | 10 requests / 1 minute per IP | Block for 10 minutes |

> **Note:** Cloudflare's free plan includes a limited number of rate limiting rules. Prioritize the login and checkout endpoints, which are the most common brute-force/abuse targets.

## 6.8 Expected Results

- `https://juicevibes.lk` loads with a valid padlock (TLS) in the browser.
- `dig` shows Cloudflare's anycast IPs (typically in the `104.x` / `172.6x` ranges) rather than Vercel's or Railway's raw IPs — confirming traffic is proxied.

## 6.9 Validation

```bash
# Confirm SSL certificate is valid and served by Cloudflare
curl -svo /dev/null https://juicevibes.lk 2>&1 | grep -E "SSL|subject"

# Confirm the site is proxied through Cloudflare (look for cf-ray header)
curl -sI https://juicevibes.lk | grep -i cf-ray
```

## 6.10 Troubleshooting

| Symptom | Likely Cause | Fix |
|---|---|---|
| Error 521 (Web server is down) | Origin (Vercel/Railway) not reachable or SSL mode mismatch | Verify origin is live; confirm SSL/TLS mode matches origin capability |
| Error 526 (Invalid SSL certificate) | "Full (Strict)" enabled before origin cert is active | Wait for origin cert provisioning, or temporarily use "Full" (not Strict) |
| Redirect loop on custom domain | "Always Use HTTPS" combined with an app-level HTTPS redirect creating a loop | Ensure only one layer (Cloudflare OR app) enforces the redirect, not both conflicting |

## 6.11 Rollback

To roll back any Cloudflare change: settings under SSL/TLS, Speed, and Security are reversible in place — toggle the setting back to its previous value. There is no data loss risk since Cloudflare does not store application data, only configuration and cached copies of public content (which can be purged via **Caching → Configuration → Purge Everything**).

## 6.12 Best Practices

- Keep an **audit log** (Cloudflare's dashboard provides one on paid plans; on Free, manually log configuration changes in a shared doc) of every DNS/security change and who made it.
- Never disable "Always Use HTTPS" in production once enabled and verified.

## 6.13 Security Considerations

- Restrict Cloudflare dashboard access to Owner/Admin roles only; do not share the login broadly.
- Enable 2FA on the Cloudflare account.

---

# Chapter 07 — GitHub Repository

## 7.1 Purpose

GitHub hosts the monorepo source code and acts as the trigger source for all CI/CD: pushes to `main` trigger Vercel and Railway deployments automatically.

## 7.2 Repository Structure

```
juicevibe/  (GitHub repository, private)
├── apps/
│   ├── web/
│   ├── admin/
│   └── api/
├── packages/
│   ├── database/
│   ├── types/
│   └── utils/
├── .github/
│   └── workflows/       (optional custom GitHub Actions, e.g. lint/test on PR)
├── pnpm-workspace.yaml
├── package.json
├── turbo.json
└── README.md
```

## 7.3 Branch Strategy (Git Flow — Simplified)

| Branch | Purpose | Deploys To |
|---|---|---|
| `main` | Always-deployable production code | Production (Vercel + Railway) |
| `develop` (optional) | Integration branch for in-progress features | Preview environments |
| `feature/*` | Individual feature work | Vercel Preview Deployment (automatic per PR) |
| `hotfix/*` | Urgent production fixes | Merged directly to `main` after review |

**Rule:** No one commits directly to `main`. All changes land via Pull Request, even for a single-developer project — this preserves a reviewable history and lets CI run checks before merge.

## 7.4 Repository Setup Steps

1. Create a **private** GitHub repository under the client's GitHub organization (or the developer's account with the client added as Owner, if no org exists — organization is preferred for easier future access management).
2. Initialize with the monorepo structure above.
3. Add a `.gitignore` covering: `node_modules/`, `.env`, `.env.local`, `dist/`, `.next/`, `.turbo/`.
4. Configure **branch protection** on `main`:
   - Require pull request review before merging (at least 1 approval, or self-approval allowed if solo developer with a documented exception).
   - Require status checks to pass (lint, typecheck, build) before merging.
   - Disallow force-pushes to `main`.

## 7.5 Secrets Management

GitHub itself does **not** need to store production secrets for this stack, because Vercel and Railway each manage their own environment variables natively (Chapter 12). GitHub Secrets are only needed if custom GitHub Actions workflows are added later (e.g., automated database seeding on a schedule).

If GitHub Actions secrets are used:

1. Navigate to **Settings → Secrets and variables → Actions**.
2. Add secrets individually (never as a single blob).
3. Reference in workflow YAML as `${{ secrets.SECRET_NAME }}`.

## 7.6 Release Strategy

- Tag production releases using **semantic versioning**: `v1.0.0`, `v1.1.0`, `v1.1.1`.
- Use GitHub **Releases** to attach a changelog to each tag, summarizing what shipped — this becomes the audit trail for "what changed and when" during incident response.

## 7.7 Expected Results

- Pushing to `main` automatically triggers a Vercel build for `web` and `admin`, and a Railway build for `api`.
- Opening a Pull Request automatically creates a Vercel Preview Deployment with a unique URL for review.

## 7.8 Validation

```bash
# Confirm remote is set correctly
git remote -v

# Confirm branch protection is active (should reject a direct push)
git checkout main
git commit --allow-empty -m "test: direct push should be rejected"
git push origin main
# Expected: rejected if branch protection is correctly configured
```

## 7.9 Troubleshooting

| Symptom | Likely Cause | Fix |
|---|---|---|
| Push to `main` succeeds despite protection rule | Protection rule not saved, or admin bypass enabled | Re-check branch protection settings; disable "Allow administrators to bypass" |
| Vercel/Railway doesn't trigger on push | GitHub App integration not authorized for the repo | Re-check the Vercel/Railway GitHub App's repository access list |

## 7.10 Rollback

`[DESTRUCTIVE within limits]` To roll back a bad merge to `main`:

```bash
# Identify the commit before the bad merge
git log --oneline -10

# Revert the merge commit (safe — creates a new commit, does not rewrite history)
git revert -m 1 <merge-commit-sha>
git push origin main
```

> **Warning:** Avoid `git reset --hard` + force-push on `main` in a team setting — it rewrites history that others may have already pulled. `git revert` is the safe, auditable way to undo a bad change in production.

## 7.11 Best Practices

- Squash-merge feature branches into `main` to keep history readable.
- Write commit messages that explain **why**, not just what.
- Never commit `.env` files — verify with `git status` before every commit that no secret file is staged.

## 7.12 Security Considerations

- Enable 2FA requirement at the GitHub organization level for all members.
- Restrict who can modify branch protection rules to Owner role only.
- Enable GitHub's **secret scanning** and **push protection** features (free for public repos, available for private repos on GitHub Team/Enterprise, or via GitHub Advanced Security) to catch accidentally committed secrets before they land in history.

---

# Chapter 08 — Neon PostgreSQL

## 8.1 Purpose

Neon provides a serverless, auto-scaling PostgreSQL database. Unlike a traditional always-on Postgres instance, Neon separates storage from compute and can suspend compute during idle periods — which is why its free tier is viable for a launch-stage app, but also why connection handling needs care (Section 8.4).

## 8.2 Database Creation

**Purpose:** Create the production database that the NestJS API will connect to via Prisma.

**Prerequisites:** Neon account created under client ownership (Chapter 04).

**Steps:**
1. Log into Neon, click **New Project**.
2. Name the project `juicevibe-production`.
3. Select a region geographically close to Railway's deployment region (minimizing latency between API and DB — check Railway's region setting in Chapter 09 and match it here, e.g., both in a Singapore or Mumbai region if available, given Sri Lanka's location).
4. Neon provisions a default database (commonly named the project name or `neondb`) and a default branch (`main`).
5. Copy the **connection string** shown — this becomes `DATABASE_URL` (Chapter 12).

**Expected Results:** A connection string in the form:
```
postgresql://<user>:<password>@<host>.neon.tech/<database>?sslmode=require
```

## 8.3 Connection Pooling

**Purpose:** Serverless functions (and NestJS instances that scale) can open many short-lived database connections simultaneously; raw Postgres has a hard connection limit. Neon provides a built-in **PgBouncer-based pooled connection endpoint** to handle this.

**Steps:**
1. In the Neon dashboard, locate the **Pooled connection string** (distinct from the direct connection string) — it typically includes `-pooler` in the hostname.
2. Use the **pooled** connection string for the application's runtime `DATABASE_URL`.
3. Use the **direct** (non-pooled) connection string only for running migrations (`prisma migrate deploy`), since some migration operations are incompatible with transaction-mode pooling.

```env
# Runtime (API) — pooled
DATABASE_URL="postgresql://user:pass@ep-xxxx-pooler.region.aws.neon.tech/neondb?sslmode=require"

# Migrations only — direct
DIRECT_URL="postgresql://user:pass@ep-xxxx.region.aws.neon.tech/neondb?sslmode=require"
```

In `packages/database/prisma/schema.prisma`:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

> **Warning:** Running `prisma migrate deploy` against the **pooled** connection string can fail or behave unpredictably because migrations use session-level features (advisory locks) that transaction-mode pooling doesn't support. Always point migrations at the direct URL.

## 8.4 Prisma Setup

**Steps:**
1. In `packages/database`, define the schema (`schema.prisma`) with models for `User`, `Product`, `Order`, `OrderItem`, etc.
2. Generate the Prisma Client:

```bash
pnpm --filter database exec prisma generate
```

3. Export the generated client from `packages/database` so `apps/api` can import it as `@juicevibe/database`.

## 8.5 Migrations

**Purpose:** Apply schema changes to production safely and repeatably.

**Development workflow:**
```bash
# Create a new migration from schema changes, apply locally
pnpm --filter database exec prisma migrate dev --name add_order_status_column
```

**Production deployment:**
```bash
# Apply all pending migrations to production — non-interactive, safe for CI/CD
pnpm --filter database exec prisma migrate deploy
```

**Expected Results:** Prisma prints each migration applied, ending in `All migrations have been successfully applied.`

**Validation:**
```bash
pnpm --filter database exec prisma migrate status
# Expected: "Database schema is up to date!"
```

> **Warning:** Never run `prisma migrate dev` against production — it is designed for local development and can prompt for destructive resets. Production always uses `prisma migrate deploy`.

## 8.6 Seeding

**Purpose:** Populate initial reference data (e.g., default admin user, starter product categories) on first deploy.

```bash
pnpm --filter database exec prisma db seed
```

Seed scripts should be **idempotent** (safe to run multiple times without duplicating data) — use `upsert` rather than `create` for reference data.

## 8.7 Rollback (Migrations)

`[DESTRUCTIVE]` Prisma does not have a built-in automatic "undo last migration" for production. The safe pattern:

1. Write a **new** migration that reverses the change (e.g., a migration that re-adds a dropped column), rather than trying to delete/rewrite the previous migration file.
2. Only in local development, before anything is deployed, is it acceptable to delete a migration folder and regenerate.

```bash
# Safe production rollback pattern: forward-fix, don't rewrite history
pnpm --filter database exec prisma migrate dev --name revert_order_status_column
```

## 8.8 Backup

**Purpose:** Protect against data loss from accidental deletes, bad migrations, or platform incidents.

**Neon's built-in mechanism:** Neon retains **point-in-time recovery (PITR)** history for a window determined by the plan tier (commonly a few hours to 7 days depending on plan — verify current retention window in the Neon dashboard for the active plan, as this has changed across Neon's tier restructuring).

**Manual backup (defense in depth, recommended even with PITR):**
```bash
pg_dump "postgresql://user:pass@direct-host.neon.tech/neondb?sslmode=require" \
  --format=custom \
  --file="juicevibe_backup_$(date +%Y%m%d_%H%M%S).dump"
```

Store the resulting `.dump` file in a separate, versioned location (e.g., a private cloud storage bucket) — not only on the developer's local machine.

## 8.9 Recovery

**Purpose:** Restore the database to a known-good state after data loss or corruption.

**Option A — Neon Point-in-Time Restore (preferred, fast):**
1. In the Neon dashboard, navigate to **Branches** → select the production branch → **Restore**.
2. Choose a timestamp before the incident.
3. Neon creates a new branch at that point in time — verify data there before promoting it or copying data back to production.

**Option B — Manual restore from `pg_dump`:**
```bash
pg_restore --clean --if-exists \
  --dbname="postgresql://user:pass@direct-host.neon.tech/neondb?sslmode=require" \
  juicevibe_backup_20260715_020000.dump
```

> **Warning:** `pg_restore --clean` drops existing objects before recreating them. Only run this against a target you intend to fully overwrite — never run it against production without first confirming you're restoring to the correct branch/database.

## 8.10 Expected Results / Validation Checklist

- [ ] `DATABASE_URL` (pooled) and `DIRECT_URL` (direct) are both set correctly in Railway's environment variables.
- [ ] `prisma migrate status` reports "up to date" after every deploy.
- [ ] A manual `pg_dump` backup exists and is less than 24 hours old at all times.
- [ ] A test restore has been performed at least once (not just backups taken — an untested backup is not a verified backup).

## 8.11 Troubleshooting

| Symptom | Likely Cause | Fix |
|---|---|---|
| `Error: too many connections` | Using direct (non-pooled) URL at runtime under load | Switch runtime `DATABASE_URL` to the pooled connection string |
| Migration fails with "prepared statement already exists" | Pooled connection used for migration | Use `DIRECT_URL` for `prisma migrate deploy` |
| Slow first request after idle period | Neon's compute auto-suspended and is "waking up" (cold start) | Expected behavior on Free plan; consider a paid "always-on" tier if this impacts UX at higher traffic |

## 8.12 Best Practices

- Use one Neon **branch per environment** (production, and optionally a "staging" branch created from a production snapshot for safe migration testing).
- Never test destructive migrations directly against production — apply to a branch first.

## 8.13 Security Considerations

- Rotate the database password if it is ever exposed (e.g., committed to Git accidentally) — Neon allows password reset without downtime for the pooled endpoint.
- Restrict Neon project access to Owner/Admin roles for schema-altering operations.

---

# Chapter 09 — Railway Deployment

## 9.1 Purpose

Railway hosts the NestJS API as a containerized, always-deployed service reachable at `api.juicevibes.lk`.

## 9.2 Create Project

**Steps:**
1. Log into Railway with the client's account.
2. Click **New Project** → **Deploy from GitHub repo**.
3. Authorize Railway's GitHub App for the `juicevibe` repository (grant access to this repo only, not all repos, per least-privilege).
4. Select the repository; Railway detects it as a monorepo — set the **Root Directory** to `apps/api`.

## 9.3 Build & Start Commands

Because this is a monorepo, Railway needs to know how to build only the `api` app while still installing shared `packages/*` dependencies.

**Build Command:**
```bash
pnpm install --frozen-lockfile && pnpm --filter api... build
```

**Start Command:**
```bash
pnpm --filter api start:prod
```

> **Note:** `pnpm --filter api...` (with the trailing `...`) tells pnpm to also build any workspace packages that `api` depends on (`packages/database`, `packages/types`, `packages/utils`) — this is essential in a monorepo or the build will fail on missing shared package output.

## 9.4 Environment Variables

Set in Railway dashboard → **Variables** tab (see Chapter 12 for the full explained list):

```
DATABASE_URL=
DIRECT_URL=
JWT_SECRET=
JWT_REFRESH_SECRET=
FRONTEND_URL=https://juicevibes.lk
ADMIN_URL=https://admin.juicevibes.lk
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NODE_ENV=production
PORT=4000
```

## 9.5 Custom Domain

**Steps:**
1. In Railway, navigate to the service → **Settings** → **Networking** → **Custom Domain**.
2. Enter `api.juicevibes.lk`.
3. Railway provides a target hostname (e.g., `xxxx.up.railway.app` or a specific CNAME target).
4. In Cloudflare, create a CNAME record: `api` → the Railway-provided target, **Proxied**.
5. Wait for Railway to confirm the custom domain is verified and SSL is issued (usually a few minutes).

## 9.6 Deploy

Once connected, every push to `main` (affecting `apps/api` or `packages/*`) triggers an automatic build and deploy. Manual deploys can be triggered from the Railway dashboard via **Deploy** → **Redeploy**.

## 9.7 Expected Results

```bash
curl -s https://api.juicevibes.lk/health
# Expected: {"status":"ok"} or similar health check response
```

## 9.8 Logs

**Steps:**
1. Navigate to the service in Railway.
2. Click **Deployments** → select the active deployment → **View Logs**.
3. Logs stream in real time; use the search bar to filter by keyword (e.g., `ERROR`).

## 9.9 Health Checks

Configure a health check endpoint in NestJS (e.g., `GET /health` returning `200 OK`) and set it in Railway → **Settings** → **Health Check Path**: `/health`. Railway uses this to determine if a deployment is healthy before routing traffic to it, and to auto-restart unhealthy instances.

## 9.10 Scaling

| Setting | Location | Notes |
|---|---|---|
| Vertical scaling (CPU/RAM) | Service → Settings → Resources | Hobby plan has fixed limits; upgrade to Pro for configurable resources |
| Horizontal scaling (replicas) | Service → Settings → Replicas | Available on higher tiers; Hobby plan typically runs a single instance |
| Restart policy | Service → Settings → Restart Policy | "On Failure" recommended, with a max retry count to avoid crash-loop billing surprises |

## 9.11 Monitoring

Railway provides built-in CPU, memory, and network graphs per service under the **Metrics** tab. Set up **Railway's usage alerts** (if available on plan) or external uptime monitoring (Chapter 20) to be notified of downtime independent of Railway's own dashboards.

## 9.12 Validation Checklist

- [ ] `https://api.juicevibes.lk/health` returns 200 OK.
- [ ] Environment variables match Chapter 12 exactly, with no trailing whitespace or quotes.
- [ ] Custom domain shows "Active" with a valid SSL certificate in Railway's dashboard.
- [ ] A deploy triggered by a `main` push completes and the health check passes within 5 minutes.

## 9.13 Troubleshooting

| Symptom | Likely Cause | Fix |
|---|---|---|
| Build fails: "command not found: pnpm" | Railway's build image doesn't have pnpm activated | Add a `packageManager` field in root `package.json` (e.g., `"packageManager": "pnpm@9.0.0"`) so Railway's Corepack detects it |
| Build fails: cannot find module `@juicevibe/database` | Shared package not built before `api` | Ensure build command uses `pnpm --filter api...` (with ellipsis) to build dependencies first |
| 502 Bad Gateway | App crashed on start, or wrong `PORT` binding | Check logs; ensure NestJS binds to `process.env.PORT`, not a hardcoded port |
| Custom domain stuck "Pending" | DNS CNAME not yet propagated, or Cloudflare proxy interfering with verification | Temporarily set the CNAME to "DNS Only" (grey cloud) during verification, then re-enable proxy after Railway confirms |

## 9.14 Rollback

**Steps:**
1. In Railway, navigate to **Deployments**.
2. Locate the last known-good deployment.
3. Click the options menu → **Redeploy** on that specific past deployment.

This instantly rolls traffic back to the previous build without needing a Git revert, buying time to fix and re-deploy `main` properly.

## 9.15 Best Practices

- Never store secrets in the repository; always use Railway's **Variables** tab.
- Use Railway's **environment** feature to separate production variables from any preview/staging environment variables, even if both point at different Neon branches.

## 9.16 Security Considerations

- Restrict Railway project membership to necessary team members only.
- Rotate `JWT_SECRET`/`JWT_REFRESH_SECRET` on any suspected compromise (Chapter 16 covers the token invalidation implications).

---

# Chapter 10 — Vercel Deployment

## 10.1 Purpose

Vercel hosts both Next.js applications — the public website (`apps/web`) at `juicevibes.lk` and the admin portal (`apps/admin`) at `admin.juicevibes.lk` — as two separate Vercel **Projects** within one Vercel **Team**, both connected to the same monorepo.

## 10.2 Project Setup — Website

**Steps:**
1. Log into Vercel with the client's account; create a **Team** (e.g., "Juice Vibe") so future members can be added with roles, rather than using a personal account.
2. Click **Add New → Project**, import the `juicevibe` GitHub repository.
3. Set **Root Directory** to `apps/web`.
4. Framework Preset: Vercel auto-detects **Next.js**.
5. Build Command: `pnpm --filter web... build` (ensures shared packages build first).
6. Output Directory: leave as default (Next.js managed).
7. Install Command: `pnpm install --frozen-lockfile`.

## 10.3 Project Setup — Admin Portal

Repeat the same process as 10.2, with:
- **Root Directory:** `apps/admin`
- **Build Command:** `pnpm --filter admin... build`

This creates a second, independent Vercel Project (`juicevibe-admin`) sharing the same repository but building/deploying separately.

## 10.4 Environment Variables

Set per-project in Vercel → **Settings → Environment Variables**, scoped to **Production**, **Preview**, and **Development** separately where values differ (e.g., Preview may point at a different API URL than Production):

**Website project:**
```
NEXT_PUBLIC_API_URL=https://api.juicevibes.lk
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
```

**Admin project:**
```
NEXT_PUBLIC_API_URL=https://api.juicevibes.lk
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
```

> **Note:** Any variable prefixed `NEXT_PUBLIC_` is bundled into client-side JavaScript and is **not secret** — it will be visible in browser dev tools. Never put a real secret (API secret, JWT signing key) behind `NEXT_PUBLIC_`.

## 10.5 Custom Domains

**Website:**
1. Vercel Project (`web`) → **Settings → Domains** → add `juicevibes.lk` (and `www.juicevibes.lk` redirecting to the apex, or vice versa, per client preference).
2. Vercel shows the required DNS record (typically a CNAME to `cname.vercel-dns.com`, or an A record to Vercel's anycast IP for apex domains depending on current Vercel configuration).
3. Add that record in Cloudflare (Chapter 13).

**Admin:**
1. Vercel Project (`admin`) → **Settings → Domains** → add `admin.juicevibes.lk`.
2. Add the corresponding CNAME in Cloudflare.

## 10.6 Preview Deployments

Every Pull Request automatically receives a unique preview URL (e.g., `juicevibe-git-feature-x-team.vercel.app`), letting the client review UI changes before merge without touching production. No manual configuration is required — this is Vercel's default GitHub integration behavior.

## 10.7 Production Deployments

Merging to `main` triggers an automatic production deployment. Vercel keeps every past production deployment addressable and instantly promotable (Section 10.9, Rollback).

## 10.8 Expected Results

```bash
curl -sI https://juicevibes.lk | head -5
curl -sI https://admin.juicevibes.lk | head -5
# Expected: HTTP/2 200, with `server: Vercel` or Cloudflare headers if proxied
```

## 10.9 Rollback

**Steps:**
1. Vercel Project → **Deployments** tab.
2. Locate the last known-good deployment (marked with a green checkmark and passing status).
3. Click the options menu (⋯) → **Promote to Production**.

This re-points the production domain at the previous build **instantly**, with zero downtime, while the team investigates the issue in the broken deployment.

## 10.10 Validation Checklist

- [ ] Both `web` and `admin` projects build successfully from `main`.
- [ ] Custom domains show "Valid Configuration" in Vercel's Domains settings.
- [ ] Preview deployments generate correctly on a test Pull Request.
- [ ] Rollback (promote previous deployment) has been tested at least once in a non-emergency situation, so the team knows the procedure before they need it under pressure.

## 10.11 Troubleshooting

| Symptom | Likely Cause | Fix |
|---|---|---|
| Build fails: "Module not found: @juicevibe/types" | Shared package not built in monorepo build step | Use `pnpm --filter web... build` (with ellipsis) as the build command |
| Domain shows "Invalid Configuration" | DNS record missing or incorrect in Cloudflare | Re-verify the exact CNAME/A record Vercel specifies, matching exactly |
| Environment variable not reflected after change | Forgot to redeploy after changing env vars | Vercel requires a new deployment to pick up changed env vars — trigger a redeploy |

## 10.12 Best Practices

- Keep `web` and `admin` as separate Vercel Projects (not one project serving both) — this isolates build failures and allows independent rollback.
- Use Vercel's **Deployment Protection** (password protection or Vercel Authentication) on Preview Deployments if the client's menu/pricing data is sensitive pre-launch.

## 10.13 Security Considerations

- Never expose Cloudinary API secret or JWT secrets via `NEXT_PUBLIC_` variables.
- Restrict Vercel Team membership; use role "Member" rather than "Owner" for the developer if the client wants to retain sole administrative control.

---

# Chapter 11 — Cloudinary

## 11.1 Purpose

Cloudinary stores and serves all product images, hero banners, and any user-uploaded media, offloading image storage, transformation (resizing, format conversion), and CDN delivery away from the application servers.

## 11.2 Account Creation

1. Create a Cloudinary account under the client's business email (Chapter 04).
2. Note the **Cloud Name** — this is public and used directly in image URLs.
3. Note the **API Key** and **API Secret** from the Dashboard — the secret must never be exposed client-side.

## 11.3 Folder Structure

Organize uploads to keep the media library manageable as the catalog grows:

```
juicevibe/
├── products/         # menu item photos
├── banners/           # homepage hero images
├── categories/        # category thumbnail images
└── uploads/temp/      # short-lived staging folder for admin uploads pending approval
```

## 11.4 Security — Signed Uploads

**Purpose:** Prevent arbitrary/unauthenticated uploads to the account (which could be abused to store unrelated or abusive content at the client's expense and reputational risk).

**Steps:**
1. In the NestJS API, create an endpoint (e.g., `POST /uploads/signature`) that generates a Cloudinary upload signature using the **API Secret** (server-side only).
2. The client (admin portal) requests a signature from the API, then uploads directly to Cloudinary using that signature (see Chapter 03.5 diagram).
3. Restrict **unsigned uploads** — ensure Cloudinary's "Upload Presets" are **not** set to allow unsigned/public uploads for production presets.

```typescript
// Example (NestJS) — generate a signed upload payload
import { v2 as cloudinary } from 'cloudinary';

const timestamp = Math.round(Date.now() / 1000);
const signature = cloudinary.utils.api_sign_request(
  { timestamp, folder: 'juicevibe/products' },
  process.env.CLOUDINARY_API_SECRET
);
// Return { signature, timestamp, apiKey: process.env.CLOUDINARY_API_KEY, cloudName: process.env.CLOUDINARY_CLOUD_NAME }
```

## 11.5 Upload Presets

1. Navigate to **Settings → Upload → Upload presets**.
2. Create a preset named `juicevibe_products`, mode: **Signed**.
3. Restrict allowed formats (e.g., `jpg`, `png`, `webp`) and set a maximum file size (e.g., 5MB) to prevent abuse and control storage costs.

## 11.6 Transformations

Cloudinary can resize/optimize images on the fly via URL parameters, avoiding the need to store multiple pre-resized copies:

```
https://res.cloudinary.com/<cloud_name>/image/upload/w_400,h_400,c_fill,q_auto,f_auto/juicevibe/products/mango-smoothie.jpg
```

| Parameter | Meaning |
|---|---|
| `w_400,h_400` | Resize to 400×400 |
| `c_fill` | Crop to fill the dimensions without distortion |
| `q_auto` | Automatic quality compression |
| `f_auto` | Automatically serve the best format (WebP/AVIF) per browser |

## 11.7 Optimization Best Practices

- Always use `f_auto,q_auto` in production image URLs — this alone typically cuts image payload size by 30–60% with no visible quality loss.
- Use responsive `srcset`-style transformations for the website's hero banners to avoid serving desktop-sized images to mobile devices.

## 11.8 Expected Results / Validation

```bash
curl -sI "https://res.cloudinary.com/<cloud_name>/image/upload/juicevibe/products/mango-smoothie.jpg" | head -5
# Expected: HTTP/2 200, content-type: image/*
```

## 11.9 Troubleshooting

| Symptom | Likely Cause | Fix |
|---|---|---|
| 401 Unauthorized on upload | Missing or expired signature | Regenerate signature server-side per upload attempt; signatures are time-bound |
| Uploaded images publicly guessable/abused | Unsigned preset accidentally left enabled | Disable unsigned uploads; audit the Upload Presets list |

## 11.10 Rollback

Deleted images can be recovered from Cloudinary's **Media Library → Trash** if deletion protection/versioning is enabled on the plan; otherwise, restore from the most recent media backup (Chapter 21).

## 11.11 Security Considerations

- Keep `CLOUDINARY_API_SECRET` only in Railway's environment variables — never in `NEXT_PUBLIC_` variables or committed code.
- Periodically audit the Cloudinary Media Library for unexpected content if any public upload path exists.

---

# Chapter 12 — Environment Variables (Complete Reference)

## 12.1 Purpose

This chapter explains **every** environment variable used across the platform, why it exists, where it's set, and what happens if it's misconfigured.

## 12.2 Backend API (Railway) Variables

| Variable | Purpose | Example / Format | Sensitivity |
|---|---|---|---|
| `DATABASE_URL` | Pooled Postgres connection string used at runtime by Prisma Client | `postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require` | Secret |
| `DIRECT_URL` | Direct (non-pooled) Postgres connection string, used only for running migrations | `postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require` | Secret |
| `JWT_SECRET` | Signing key for short-lived access tokens; anyone with this key can forge valid login tokens | Randomly generated, ≥32 characters | Secret — highest sensitivity |
| `JWT_REFRESH_SECRET` | Separate signing key for longer-lived refresh tokens; kept distinct from `JWT_SECRET` so compromising one doesn't compromise the other token type | Randomly generated, ≥32 characters, different from `JWT_SECRET` | Secret — highest sensitivity |
| `JWT_EXPIRES_IN` | Access token lifetime | e.g., `15m` | Non-secret config |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token lifetime | e.g., `7d` | Non-secret config |
| `FRONTEND_URL` | Used for CORS allow-list and for generating links in emails (e.g., password reset links pointing back to the website) | `https://juicevibes.lk` | Non-secret |
| `ADMIN_URL` | Used for CORS allow-list for the admin portal's origin | `https://admin.juicevibes.lk` | Non-secret |
| `CLOUDINARY_CLOUD_NAME` | Identifies the Cloudinary account for building image URLs | e.g., `juicevibe` | Non-secret (public by design) |
| `CLOUDINARY_API_KEY` | Identifies the API credential pair for signed uploads | Numeric string | Semi-secret (paired with secret below) |
| `CLOUDINARY_API_SECRET` | Used server-side to sign upload requests; must never reach the client | Alphanumeric string | Secret |
| `NODE_ENV` | Tells NestJS and dependent libraries to run in production mode (disables verbose debug output, enables production optimizations) | `production` | Non-secret |
| `PORT` | Port the NestJS server binds to; Railway injects this automatically — the app must read it, not hardcode a port | Injected by Railway | Non-secret |

## 12.3 Frontend (Vercel — Website & Admin) Variables

| Variable | Purpose | Example | Sensitivity |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL the frontend uses to call the backend API | `https://api.juicevibes.lk` | Non-secret (public, visible in browser) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Used to build Cloudinary image URLs directly in the frontend without an API round-trip | e.g., `juicevibe` | Non-secret |

> **Warning:** Any variable prefixed `NEXT_PUBLIC_` is compiled directly into the JavaScript bundle shipped to every visitor's browser. Treat every `NEXT_PUBLIC_` variable as **public information**, equivalent to putting it in the page's HTML source.

## 12.4 Generating Strong Secrets

```bash
# Generate a cryptographically random 64-character secret (for JWT_SECRET, JWT_REFRESH_SECRET)
openssl rand -hex 32
```

## 12.5 Where Each Variable Is Set

| Variable Group | Set In |
|---|---|
| API secrets (`DATABASE_URL`, `JWT_*`, `CLOUDINARY_API_SECRET`) | Railway → Variables tab only |
| Public frontend variables (`NEXT_PUBLIC_*`) | Vercel → each project's Environment Variables |
| Local development | `.env.local` files, `.gitignore`d, never committed |

## 12.6 Validation Checklist

- [ ] No `.env` file with real secrets exists anywhere in Git history (`git log --all --full-history -- .env` should return nothing).
- [ ] `JWT_SECRET` and `JWT_REFRESH_SECRET` are different values.
- [ ] Production `DATABASE_URL` uses the **pooled** endpoint; `DIRECT_URL` uses the **direct** endpoint.
- [ ] `FRONTEND_URL` and `ADMIN_URL` exactly match the real production origins (protocol + host, no trailing slash) — a mismatch here silently breaks CORS.

## 12.7 Troubleshooting

| Symptom | Likely Cause | Fix |
|---|---|---|
| CORS errors in browser console | `FRONTEND_URL`/`ADMIN_URL` mismatch, or CORS middleware not reading them correctly | Confirm exact string match including protocol; check NestJS CORS config uses these env vars, not a hardcoded value |
| "jwt malformed" errors after a secret rotation | Old tokens signed with the previous secret still in circulation | Expected — users must re-authenticate after a secret rotation; this is intentional, not a bug |

## 12.8 Security Considerations

- Rotate `JWT_SECRET` / `JWT_REFRESH_SECRET` immediately if ever exposed; understand this invalidates all currently logged-in sessions (acceptable trade-off vs. a compromised secret).
- Never log environment variable values, even in debug logs.

---

# Chapter 13 — DNS Configuration

## 13.1 Purpose

This chapter is the authoritative reference for every DNS record required, so any engineer can reconstruct the DNS configuration from scratch if needed.

## 13.2 Complete DNS Record Table

| Type | Host | Value | TTL | Proxy Status | Purpose |
|---|---|---|---|---|---|
| CNAME | `@` (or `www`, per Vercel's apex handling) | `cname.vercel-dns.com` | Auto | Proxied | Points root domain to Vercel (website) |
| CNAME | `www` | `cname.vercel-dns.com` | Auto | Proxied | Points `www` subdomain to Vercel (or redirect to apex, per preference) |
| CNAME | `admin` | `cname.vercel-dns.com` | Auto | Proxied | Points admin portal to Vercel |
| CNAME | `api` | Railway-provided target (e.g., `xxxx.up.railway.app`) | Auto | Proxied | Points API subdomain to Railway |
| TXT | `@` | Vercel/Railway domain-verification string (provided during setup) | Auto | N/A | Proves domain ownership to the hosting platform |
| MX | `@` | Google Workspace mail servers (if Workspace is used) | Auto | DNS Only | Routes email for `@juicevibes.lk` addresses |
| TXT | `@` | SPF record, e.g. `v=spf1 include:_spf.google.com ~all` | Auto | N/A | Authorizes Google Workspace to send email as the domain |
| CNAME | `google._domainkey` | DKIM key provided by Google Workspace | Auto | N/A | Email authentication (DKIM) |

## 13.3 Explanation of Every Record Type Used

- **CNAME (Canonical Name):** Points a hostname to another hostname. Used here so Vercel/Railway can manage the underlying IP addresses on their end without the client needing to update DNS every time those platforms change infrastructure.
- **TXT:** Holds arbitrary text; used for domain-ownership verification and email authentication (SPF/DKIM) — never routes traffic itself.
- **MX (Mail Exchange):** Tells the internet which mail servers accept email for this domain. Required only if using Google Workspace (or any hosted email) on this domain.

## 13.4 Proxy Status — Proxied vs. DNS Only

| Status | Icon | Meaning | When to Use |
|---|---|---|---|
| Proxied | Orange cloud | Traffic passes through Cloudflare's network (WAF, caching, hidden origin IP) | Web, Admin, API hostnames |
| DNS Only | Grey cloud | Cloudflare only resolves the DNS query; traffic goes directly to the origin | Mail records (MX, DKIM), and temporarily during initial domain-verification steps that don't tolerate a proxy in front |

> **Warning:** Never set an MX record to "Proxied" — Cloudflare's proxy only handles HTTP(S) traffic, not SMTP; a proxied MX record will simply break email delivery.

## 13.5 Validation

```bash
# Verify each hostname resolves correctly
dig CNAME www.juicevibes.lk +short
dig CNAME admin.juicevibes.lk +short
dig CNAME api.juicevibes.lk +short
dig MX juicevibes.lk +short
dig TXT juicevibes.lk +short
```

## 13.6 Troubleshooting

| Symptom | Likely Cause | Fix |
|---|---|---|
| Platform shows "domain verification pending" indefinitely | Proxy (orange cloud) enabled before verification completed | Temporarily switch to "DNS Only" (grey cloud), wait for verification, then re-enable proxy |
| Email not arriving | MX record proxied, or SPF/DKIM misconfigured | Ensure MX is "DNS Only"; verify SPF/DKIM strings exactly match what Google Workspace provides |

## 13.7 Best Practices

- Keep a copy of this DNS table (Section 13.2) outside of Cloudflare itself (e.g., in this manual and a shared doc) so it can be reconstructed if the zone is ever accidentally deleted.
- Use Cloudflare's **DNS record comments/tags** feature (if available on plan) to annotate what each record is for, directly in the dashboard.

---

# Chapter 14 — Production Build Commands

## 14.1 Purpose

This chapter is a single reference point for every command needed to build, migrate, seed, and start the platform — useful both for CI/CD configuration and for manual recovery if a platform's dashboard is unavailable.

## 14.2 Install Dependencies

```bash
# Install all workspace dependencies, using the exact locked versions
pnpm install --frozen-lockfile
```

> **Note:** `--frozen-lockfile` causes the install to fail loudly if `pnpm-lock.yaml` is out of sync with `package.json`, rather than silently updating it — this is what you want in CI/production, where an unexpected dependency update should never happen implicitly.

## 14.3 Build — Each Application

```bash
# Build the shared packages first (database client, types, utils)
pnpm --filter "./packages/**" build

# Build the website (also builds its package dependencies via the ellipsis operator)
pnpm --filter web... build

# Build the admin portal
pnpm --filter admin... build

# Build the API
pnpm --filter api... build
```

## 14.4 Database — Generate, Migrate, Seed

```bash
# Generate Prisma Client from schema
pnpm --filter database exec prisma generate

# Apply all pending migrations to production (non-interactive)
pnpm --filter database exec prisma migrate deploy

# Seed reference data (idempotent — safe to re-run)
pnpm --filter database exec prisma db seed
```

## 14.5 Start — Production

```bash
# API (NestJS production server)
pnpm --filter api start:prod

# Website and Admin are served by Vercel's managed Next.js runtime —
# no manual "start" command needed in production; Vercel handles this internally.
```

## 14.6 Full Production Deployment Sequence (Reference)

This is the complete order of operations a CI/CD pipeline (or a manual deploy) executes, end to end:

```bash
# 1. Install
pnpm install --frozen-lockfile

# 2. Generate Prisma Client
pnpm --filter database exec prisma generate

# 3. Build shared packages
pnpm --filter "./packages/**" build

# 4. Build applications
pnpm --filter web... build
pnpm --filter admin... build
pnpm --filter api... build

# 5. Apply database migrations (production, direct connection)
pnpm --filter database exec prisma migrate deploy

# 6. Seed (only if new reference data was added this release)
pnpm --filter database exec prisma db seed

# 7. Start API (Railway executes this automatically per its Start Command)
pnpm --filter api start:prod
```

## 14.7 Expected Results

Each command should exit with status code `0`. A non-zero exit code at any step should halt the deployment pipeline — never proceed to "start" if "build" or "migrate" failed.

## 14.8 Validation

```bash
echo $?
# 0 = success, anything else = failure — check the command's stderr output above
```

## 14.9 Troubleshooting

| Symptom | Likely Cause | Fix |
|---|---|---|
| `ERR_PNPM_OUTDATED_LOCKFILE` | `package.json` changed without regenerating the lockfile | Run `pnpm install` (without `--frozen-lockfile`) locally, commit the updated `pnpm-lock.yaml` |
| Build succeeds locally but fails in CI/Railway/Vercel | Node.js version mismatch between local machine and platform | Pin the Node version explicitly (e.g., `"engines": { "node": "20.x" }` in `package.json`, or a platform-specific version file) |

## 14.10 Best Practices

- Never run `prisma db seed` unconditionally on every deploy if it's not fully idempotent — guard it, or only run it manually/on first deploy.
- Keep build commands identical between local, CI, and production to avoid "works on my machine" discrepancies.

---

# Chapter 15 — CI/CD

## 15.1 Purpose

Continuous Integration / Continuous Deployment automates build, test, and deployment on every code change, removing manual, error-prone deployment steps.

## 15.2 Architecture

```mermaid
flowchart LR
    Dev["Developer"] -->|git push| PR["Pull Request"]
    PR -->|auto| VP["Vercel Preview Build<br/>(web + admin)"]
    PR -->|optional| GA["GitHub Actions<br/>lint/test/typecheck"]
    PR -->|merge approved| Main["main branch"]
    Main -->|webhook| VProd["Vercel Production Deploy"]
    Main -->|webhook| RProd["Railway Production Deploy"]
    RProd --> Migrate["prisma migrate deploy"]
```

## 15.3 GitHub → Vercel Integration

This is native and requires no custom YAML: connecting a GitHub repo to a Vercel Project (Chapter 10) automatically wires up both Preview and Production deployments via Vercel's GitHub App webhook.

## 15.4 GitHub → Railway Integration

Similarly native: connecting the repo to a Railway service (Chapter 09) automatically deploys on every push to the configured branch (`main` for production).

## 15.5 Optional: Custom GitHub Actions for Pre-Merge Checks

While Vercel/Railway handle deployment natively, adding a lightweight CI check for lint/typecheck/test before merge catches issues before they ever reach a deploy step.

```yaml
# .github/workflows/ci.yml
name: CI
on:
  pull_request:
    branches: [main]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm --filter "./packages/**" build
      - run: pnpm -r lint
      - run: pnpm -r typecheck
```

## 15.6 Automatic Deployments

| Trigger | Result |
|---|---|
| Push to `main` | Production deploy on Vercel (web, admin) and Railway (api) |
| Open/update Pull Request | Preview deploy on Vercel only (Railway preview environments are an optional paid-tier feature — verify current availability before relying on it) |

## 15.7 Rollback via CI/CD

Both Vercel (Section 10.9) and Railway (Section 9.14) support one-click rollback to a previous deployment independent of Git — this is faster than a `git revert` + re-deploy cycle during an active incident, and should be the **first** response, with the proper Git-level fix following once traffic is stable.

## 15.8 Validation Checklist

- [ ] A test Pull Request produces a working Vercel Preview URL.
- [ ] Merging that PR to `main` triggers both a Vercel and a Railway production deployment automatically, without manual dashboard action.
- [ ] (If configured) GitHub Actions CI check blocks merge on lint/typecheck failure.

## 15.9 Troubleshooting

| Symptom | Likely Cause | Fix |
|---|---|---|
| Push to `main` doesn't trigger deploy | GitHub App/webhook disconnected | Re-authorize the Vercel/Railway GitHub App for the repository |
| CI passes but production deploy fails | Environment variables differ between CI and production runtime | CI only validates build/lint/typecheck, not runtime env — verify separately per Chapter 12 checklist |

## 15.10 Best Practices

- Treat a failing CI check as a hard merge blocker, not a suggestion.
- Keep the CI pipeline fast (under ~3 minutes) so it doesn't become an obstacle developers route around.

---

# Chapter 16 — Security Hardening

## 16.1 Purpose

Consolidate every security control across the stack into a single checklist-driven chapter.

## 16.2 JWT Security

- Use two distinct secrets: `JWT_SECRET` (access tokens) and `JWT_REFRESH_SECRET` (refresh tokens) — never the same value.
- Keep access token lifetime short (`15m` typical) and refresh token lifetime longer but bounded (`7d` typical), never "never expires."
- Store refresh tokens in an `HttpOnly`, `Secure`, `SameSite=Strict` cookie where possible (web), rather than in `localStorage`, to reduce XSS token-theft risk. For the React Native mobile app, use secure device storage (e.g., iOS Keychain / Android Keystore via a library like `react-native-keychain`), not plain `AsyncStorage`.

## 16.3 HTTPS Everywhere

- Cloudflare "Always Use HTTPS" (Chapter 06.4) plus Vercel/Railway's automatic origin SSL certificates ensures no plaintext HTTP ever carries application data.

## 16.4 Security Headers

Configure the following response headers in the NestJS API (via the `helmet` middleware) and in Next.js (via `next.config.js` headers):

```typescript
// NestJS — main.ts
import helmet from 'helmet';
app.use(helmet());
```

```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};
```

| Header | Purpose |
|---|---|
| `X-Frame-Options: DENY` | Prevents the site from being embedded in an `<iframe>` (clickjacking protection) |
| `X-Content-Type-Options: nosniff` | Prevents browsers from MIME-sniffing a response away from its declared content-type |
| `Referrer-Policy` | Limits how much of the URL is leaked to third-party sites via the `Referer` header |
| `Permissions-Policy` | Explicitly disables browser features (camera, mic, geolocation) the app doesn't use |

## 16.5 CORS Configuration

```typescript
// NestJS — main.ts
app.enableCors({
  origin: [process.env.FRONTEND_URL, process.env.ADMIN_URL],
  credentials: true,
});
```

> **Warning:** Never set `origin: '*'` in combination with `credentials: true` — browsers reject this combination, and even if they didn't, it would allow any website to make authenticated requests to the API on a logged-in user's behalf.

## 16.6 Rate Limiting (Application Level)

In addition to Cloudflare's edge rate limiting (Chapter 06.7.3), apply application-level rate limiting as defense in depth using NestJS's `@nestjs/throttler`:

```typescript
ThrottlerModule.forRoot({
  ttl: 60,
  limit: 20, // 20 requests per 60 seconds per IP, default for all routes
});
```

## 16.7 Secrets Management Recap

- All secrets live only in Railway/Vercel environment variable stores.
- No secret is ever committed to Git, logged, or sent via chat/email.
- Rotate secrets on any suspected exposure (Section 16.8).

## 16.8 Secret Rotation Procedure

**Purpose:** Safely replace a compromised or routinely-rotated secret without unnecessary downtime.

**Steps (for `JWT_SECRET` as the example):**
1. Generate a new secret: `openssl rand -hex 32`.
2. Update `JWT_SECRET` in Railway's Variables tab.
3. Redeploy the API service (Railway does this automatically on variable change, or trigger manually).
4. **Expected side effect:** every currently-issued access token becomes invalid immediately; all logged-in users are forced to re-authenticate via their refresh token (or fully re-login if the refresh secret was also rotated).
5. Communicate to the client/support team ahead of a planned rotation, since users may see a brief "please log in again" moment.

## 16.9 Validation Checklist

- [ ] `helmet()` is active on the API (`curl -sI` shows `X-Frame-Options`, etc.).
- [ ] CORS only allows the exact production origins, verified by attempting a request from an unauthorized origin and confirming it's blocked.
- [ ] No secret appears in `git log --all -p | grep -i secret` across the repository history.
- [ ] 2FA is enabled on every platform account (Chapter 04.4).

## 16.10 Troubleshooting

| Symptom | Likely Cause | Fix |
|---|---|---|
| Legitimate frontend requests blocked by CORS | `FRONTEND_URL`/`ADMIN_URL` env var doesn't exactly match browser's Origin header (protocol/subdomain mismatch) | Verify exact string match, including `https://` and no trailing slash |
| Users unexpectedly logged out platform-wide | A secret rotation occurred (intentional) or JWT expiry misconfigured (unintentional) | Confirm against the deployment/change log; this is expected after Section 16.8 |

## 16.11 Best Practices

- Treat every new third-party dependency as a potential supply-chain risk; review `package.json` diffs in PRs, and run `pnpm audit` periodically.
- Apply the **principle of least privilege** to every account and API key across the entire stack.

---

# Chapter 17 — Performance Optimization

## 17.1 Purpose

Ensure the platform feels fast for customers on ordinary mobile connections in Sri Lanka, and stays fast as the catalog and traffic grow.

## 17.2 Caching Strategy by Layer

| Layer | What's Cached | Mechanism |
|---|---|---|
| Cloudflare Edge | Static assets, and optionally full HTML pages for anonymous, non-personalized routes | Cache Rules / Page Rules (Chapter 06.6) |
| Vercel Edge Network | Next.js static and ISR (Incremental Static Regeneration) pages | Automatic, via Next.js `revalidate` config |
| Browser | Fonts, JS/CSS bundles, images | `Cache-Control` headers, long `max-age` on hashed filenames |
| Cloudinary | Transformed image variants | CDN-cached automatically after first request per transformation |
| Database | Frequently-read, rarely-changed data (e.g., product categories) | Application-level in-memory or Redis cache (optional future addition — not required at launch scale) |

## 17.3 Next.js Optimization

- Use `next/image` for all product/banner images so Next.js handles responsive sizing and lazy-loading automatically.
- Use **Incremental Static Regeneration** (`revalidate: 60` or similar) for the menu page, so it's served instantly from cache but refreshes periodically without a full redeploy.
- Avoid client-side data fetching for content that could be server-rendered — this improves both performance and SEO.

## 17.4 Railway/API Optimization

- Enable Prisma's connection pooling (Chapter 08.3) to avoid connection-exhaustion latency spikes.
- Keep API response payloads lean — return only fields the client needs (avoid `SELECT *`-equivalent over-fetching).
- Add database indexes on frequently-queried columns (e.g., `Order.status`, `Order.createdAt`) — verify with `EXPLAIN ANALYZE` on slow queries.

## 17.5 Database Performance

```sql
-- Example: identify slow queries
EXPLAIN ANALYZE SELECT * FROM "Order" WHERE status = 'pending' ORDER BY "createdAt" DESC;
```

Add an index if the query plan shows a sequential scan on a large table:

```prisma
model Order {
  // ...
  @@index([status, createdAt])
}
```

## 17.6 Cloudflare CDN & Compression

- Confirm Brotli compression is active (Chapter 06.5) — reduces text-based asset (JS/CSS/HTML) size by 15–25% versus gzip.
- Confirm `f_auto,q_auto` is used on every Cloudinary image URL (Chapter 11.7).

## 17.7 Expected Results / Targets

| Metric | Target | How to Measure |
|---|---|---|
| Largest Contentful Paint (LCP) | < 2.5s | Chrome DevTools Lighthouse, or PageSpeed Insights |
| Time to First Byte (TTFB) | < 200ms (cached), < 600ms (uncached) | `curl -w "%{time_starttransfer}"` |
| API p95 response time | < 500ms | Railway metrics / custom APM |

## 17.8 Validation

```bash
curl -s -o /dev/null -w "TTFB: %{time_starttransfer}s Total: %{time_total}s\n" https://juicevibes.lk
```

## 17.9 Troubleshooting

| Symptom | Likely Cause | Fix |
|---|---|---|
| Slow menu page load | Images not using `next/image` or missing `f_auto,q_auto` | Audit image components; enforce Cloudinary transformation params |
| Slow API responses under moderate load | Missing database index, or N+1 query pattern in Prisma | Run `EXPLAIN ANALYZE`; use Prisma's `include`/`select` carefully to avoid N+1 |

## 17.10 Best Practices

- Run a Lighthouse audit before every major release, not just at launch.
- Set a performance budget (e.g., "homepage JS bundle must stay under 200KB gzipped") and enforce it in CI if possible.

---

# Chapter 18 — Production Testing

## 18.1 Purpose

Define the testing pass required before any release is considered production-ready, and before the initial go-live.

## 18.2 Test Matrix

| Area | Test Cases |
|---|---|
| Authentication | Register, login, logout, refresh token flow, invalid password, expired token, password reset |
| Orders | Place order (guest + authenticated), view order history, cancel order, order status transitions |
| Admin | Login as staff, view incoming orders, update order status, add/edit/delete product, manage categories |
| Products | Create product with image, edit price, mark out-of-stock, delete product, category assignment |
| Images | Upload via signed URL, verify Cloudinary transformation renders correctly, reject oversized/invalid file type |
| Notifications | Order confirmation (if email/SMS is in scope), staff new-order alert (if implemented) |
| Database | Migration applies cleanly on a fresh database, seed data loads correctly, rollback migration works |
| Performance | Lighthouse score ≥ 90 (Performance), API p95 < 500ms under simulated load |
| Security | CORS blocks unauthorized origins, rate limiting triggers correctly, JWT expiry enforced, SQL injection attempts rejected (Prisma's parameterized queries handle this by default — verify no raw string-concatenated queries exist) |

## 18.3 Manual Test Procedure — Example (Order Placement)

**Purpose:** Verify the core revenue-generating flow works end-to-end before go-live.

**Steps:**
1. Navigate to `https://juicevibes.lk` (or the latest Preview URL).
2. Add 2–3 items to cart.
3. Proceed to checkout as a guest.
4. Submit the order.
5. Confirm a success message/order confirmation number is shown.
6. Log into `admin.juicevibes.lk`.
7. Confirm the new order appears in the pending orders list within a few seconds.
8. Update the order status to "Confirmed."
9. (If implemented) Confirm the customer-facing order status updates accordingly.

**Expected Results:** Order appears correctly in the admin portal with accurate items, total, and customer details; status updates propagate correctly.

## 18.4 Load Testing (Basic)

```bash
# Simple load test using a tool like autocannon (install: pnpm add -g autocannon)
autocannon -c 20 -d 30 https://api.juicevibes.lk/products
```

Review Railway's Metrics tab during the test for CPU/memory spikes, and Neon's dashboard for connection count.

## 18.5 Validation Checklist

- [ ] Every row in the Test Matrix (18.2) has been manually executed at least once against a Preview/staging environment before go-live.
- [ ] At least one basic load test has been run against the API, and results reviewed against the performance targets in Chapter 17.7.

## 18.6 Troubleshooting

| Symptom | Likely Cause | Fix |
|---|---|---|
| Orders placed in test disappear or duplicate | Missing database transaction wrapping order + order-item inserts | Wrap the multi-table insert in a Prisma `$transaction` |
| Admin doesn't see new orders without manual refresh | No real-time mechanism (polling/websocket) implemented | Acceptable at launch scale with periodic polling; document as a known limitation, revisit in Chapter 24 scaling plan |

## 18.7 Best Practices

- Never perform load testing directly against production without prior warning to the team and, ideally, during a low-traffic window — Chapter 08.3's Neon free-tier connection limits can be exhausted by an aggressive test.
- Keep a written test log (date, tester, results) for each pre-release testing pass, as part of the audit trail referenced in Chapter 07.6.

---

# Chapter 19 — Go-Live Checklist

## 19.1 Purpose

A single, exhaustive checklist to run through immediately before flipping the switch to serve real customer traffic. Every item should be checked off and, where practical, signed off by name/date in the client's shared handover document.

## 19.2 Domain & DNS

1. [ ] `juicevibes.lk` registered and active at register.lk.
2. [ ] Registrant (WHOIS) details correct and reflect the client's business.
3. [ ] Domain auto-renewal enabled.
4. [ ] Nameservers point to Cloudflare.
5. [ ] `dig NS juicevibes.lk` confirms Cloudflare nameservers globally.
6. [ ] All DNS records from Chapter 13.2 present and correct.
7. [ ] MX/SPF/DKIM records verified (if Workspace email is in scope).
8. [ ] No stray/legacy DNS records left over from any prior hosting attempt.

## 19.3 Cloudflare

9. [ ] Zone active on Cloudflare Free plan under client ownership.
10. [ ] SSL/TLS mode set to Full (Strict).
11. [ ] Always Use HTTPS enabled.
12. [ ] HSTS enabled with an appropriate `max-age` for launch.
13. [ ] Minimum TLS version set to 1.2+.
14. [ ] Brotli compression enabled.
15. [ ] HTTP/3 enabled.
16. [ ] WAF Managed Ruleset enabled.
17. [ ] Bot Fight Mode enabled.
18. [ ] Rate limiting rule active on `/auth/login`.
19. [ ] Cache rules configured for static assets.
20. [ ] Cache bypass confirmed for API routes.

## 19.4 GitHub

21. [ ] Repository private, under client organization (or ownership transfer plan documented).
22. [ ] Branch protection active on `main`.
23. [ ] No secrets present anywhere in Git history.
24. [ ] `.gitignore` correctly excludes `.env`, `node_modules`, build output.
25. [ ] 2FA enforced for all organization members.
26. [ ] README documents local setup steps for a new developer.

## 19.5 Neon Database

27. [ ] Production project created under client ownership.
28. [ ] Pooled and direct connection strings both captured correctly.
29. [ ] `prisma migrate status` shows "up to date."
30. [ ] Seed data loaded and verified (categories, admin user, etc.).
31. [ ] A manual `pg_dump` backup taken and stored externally.
32. [ ] A test restore performed successfully at least once.
33. [ ] Database region matches/is geographically close to Railway's region.

## 19.6 Railway (API)

34. [ ] Service deployed from `main`, root directory set to `apps/api`.
35. [ ] All environment variables from Chapter 12.2 set correctly.
36. [ ] `/health` endpoint returns 200 OK.
37. [ ] Custom domain `api.juicevibes.lk` verified with active SSL.
38. [ ] Health check path configured in Railway settings.
39. [ ] Restart policy configured ("On Failure").
40. [ ] Logs reviewed for any startup warnings/errors.
41. [ ] A rollback to a previous deployment has been tested successfully.

## 19.7 Vercel (Website & Admin)

42. [ ] Website project deployed from `main`, root directory `apps/web`.
43. [ ] Admin project deployed from `main`, root directory `apps/admin`.
44. [ ] Custom domain `juicevibes.lk` (and `www`) verified.
45. [ ] Custom domain `admin.juicevibes.lk` verified.
46. [ ] All `NEXT_PUBLIC_*` environment variables set correctly for Production.
47. [ ] Preview deployments confirmed working on a test PR.
48. [ ] Rollback (promote previous deployment) tested successfully.
49. [ ] Admin portal access restricted appropriately (not indexed by search engines — add `robots.txt` disallow or Vercel Deployment Protection).

## 19.8 Cloudinary

50. [ ] Account created under client ownership.
51. [ ] Folder structure created (`products/`, `banners/`, `categories/`, `uploads/temp/`).
52. [ ] Upload preset set to Signed mode.
53. [ ] Unsigned uploads confirmed disabled.
54. [ ] File size/format restrictions configured on the preset.
55. [ ] Signed upload flow tested end-to-end from the admin portal.
56. [ ] `f_auto,q_auto` confirmed in production image URLs.

## 19.9 Security

57. [ ] `JWT_SECRET` and `JWT_REFRESH_SECRET` are distinct, randomly generated, ≥32 characters.
58. [ ] `helmet()` active on the API; security headers verified via `curl -I`.
59. [ ] CORS restricted to exact production origins only.
60. [ ] Application-level rate limiting (`@nestjs/throttler`) active.
61. [ ] 2FA enabled on register.lk, Cloudflare, GitHub, Vercel, Railway, Neon, Cloudinary.
62. [ ] No secrets committed to Git, logged, or shared insecurely.
63. [ ] Refresh tokens stored securely (HttpOnly cookie for web; Keychain/Keystore for mobile).

## 19.10 Performance

64. [ ] Lighthouse Performance score ≥ 90 on homepage and menu page.
65. [ ] TTFB targets met per Chapter 17.7.
66. [ ] Basic load test executed against the API with acceptable results.
67. [ ] All product/banner images verified using `next/image` and Cloudinary transformations.

## 19.11 Functional Testing

68. [ ] Full Test Matrix (Chapter 18.2) executed and passed.
69. [ ] Guest checkout flow tested end-to-end.
70. [ ] Authenticated checkout flow tested end-to-end.
71. [ ] Admin order management flow tested end-to-end.
72. [ ] Product CRUD (create/read/update/delete) tested in admin portal.
73. [ ] Password reset flow tested (if in scope).
74. [ ] Mobile app (React Native) tested against production API on both iOS and Android, if mobile launch is simultaneous.

## 19.12 Monitoring & Observability

75. [ ] Railway Metrics dashboard reviewed and understood by the team.
76. [ ] Vercel Analytics enabled (or acknowledged as a future add-on).
77. [ ] Cloudflare Analytics reviewed for baseline traffic patterns.
78. [ ] External uptime monitor configured (Chapter 20) with alerting to a real, monitored channel (not just a dashboard no one checks).

## 19.13 Backup & Recovery

79. [ ] Database backup schedule documented and, ideally, automated (Chapter 21).
80. [ ] Media (Cloudinary) backup/export strategy documented.
81. [ ] Environment variables backed up securely outside of the platforms themselves (e.g., in the client's password manager).
82. [ ] Disaster recovery runbook (Chapter 22) reviewed by the team.

## 19.14 Legal / Business Readiness

83. [ ] Terms of Service and Privacy Policy published on the website, if legally required for the business type/jurisdiction.
84. [ ] Payment processing (if applicable) reconciled against the relevant payment gateway's own compliance requirements (out of scope for this manual's technical detail — flagged for the client's attention).
85. [ ] Business contact information (phone/email/address) correct on the website.

## 19.15 Handover Readiness

86. [ ] All accounts confirmed under client ownership (Chapter 25 credentials checklist).
87. [ ] Client has access to the shared password manager vault.
88. [ ] Renewal schedule documented and shared with the client (Chapter 25.4).
89. [ ] Support process/escalation path documented and shared with the client.

## 19.16 Final Go/No-Go

90. [ ] All items 1–89 checked off.
91. [ ] No open Sev-1/Sev-2 bugs in the issue tracker.
92. [ ] Rollback procedures for both Vercel and Railway have been demonstrated to the client or a second engineer, not just documented.
93. [ ] A designated on-call contact is identified for the first 48 hours post-launch.
94. [ ] Client has explicitly signed off on go-live in writing (email or shared doc).
95. [ ] DNS TTLs temporarily lowered (if not already low) 24–48 hours before go-live, to allow fast rollback of DNS-level changes if needed, then raised again post-launch.
96. [ ] A final full-flow smoke test (order placement → admin visibility → status update) is run **after** the final production deploy, not only against a pre-production build.
97. [ ] Screenshots/recordings of the final smoke test are archived for the launch record.
98. [ ] Post-launch monitoring window scheduled (first 2–4 hours of active, close observation of logs/metrics).
99. [ ] Client informed of expected DNS propagation window (up to 48 hours) if any last-minute DNS change was made.
100. [ ] This checklist itself is archived (dated, filled) as part of the project's permanent record.

> **Best Practice:** Treat item 96 as non-negotiable — a smoke test against the *actual final production deployment*, executed *after* it's live, is the only test that truly validates go-live readiness. Pre-production testing (Chapter 18) reduces risk but does not replace this final check.

---

# Chapter 20 — Monitoring

## 20.1 Purpose

Ensure the team knows the moment something breaks, ideally before customers report it.

## 20.2 Railway Logs & Metrics

- **Logs:** Real-time and historical logs available per deployment (Chapter 09.8). Use log search to filter for `ERROR` or `WARN` level entries.
- **Metrics:** CPU, memory, and network graphs available under the service's **Metrics** tab — review weekly at minimum, and immediately after any deploy.

## 20.3 Vercel Analytics

Vercel's built-in Analytics (Web Analytics / Speed Insights, availability may depend on plan tier) reports real-user page load performance and traffic volume. Enable under **Project → Analytics**.

## 20.4 Cloudflare Analytics

Cloudflare's dashboard (**Analytics & Logs**) shows request volume, bandwidth, threats blocked by the WAF, and cache hit ratio — useful for spotting traffic anomalies (sudden spikes can indicate either a viral moment or an attack).

## 20.5 Database Monitoring

Neon's dashboard shows active connections, compute usage (relevant to free-tier limits), and storage size. Set a personal reminder to check this monthly, since exceeding free-tier storage/compute silently triggers billing on paid tiers or throttling on free tiers.

## 20.6 External Uptime Monitoring

**Purpose:** Detect downtime independent of any single platform's own status dashboard (a platform's monitoring can itself be affected by the same outage).

**Recommended approach:** Use a third-party uptime monitor (many offer free tiers for a handful of monitors) configured to:
- Check `https://juicevibes.lk` every 1–5 minutes.
- Check `https://api.juicevibes.lk/health` every 1–5 minutes.
- Alert via email and/or SMS/push notification to the on-call contact on failure.

## 20.7 Validation Checklist

- [ ] External uptime monitor configured for both website and API health endpoint.
- [ ] Alert notifications confirmed working (trigger a test alert).
- [ ] Team knows where to find Railway logs, Vercel Analytics, and Cloudflare Analytics without needing this manual open.

## 20.8 Troubleshooting

| Symptom | Likely Cause | Fix |
|---|---|---|
| Uptime monitor reports false-positive downtime | Monitor's own network issue, or a transient blip | Cross-check against Railway/Vercel/Cloudflare status pages before assuming a real outage |
| No alert received during a real outage | Alert channel misconfigured or notification fatigue (muted) | Test the alert channel monthly; treat monitoring alerts as high-priority, non-mutable |

## 20.9 Best Practices

- Review dashboards proactively on a schedule (Chapter 23), not only reactively during an incident.
- Keep monitoring simple at this scale — three dashboards (Railway, Vercel, Cloudflare) plus one external uptime check is sufficient; resist the urge to over-engineer observability before it's needed (see Chapter 24 for when to add more).

---

# Chapter 21 — Backup Strategy

## 21.1 Purpose

Define what is backed up, how often, where, and how it's verified — across every stateful component of the platform.

## 21.2 Backup Matrix

| Asset | Method | Frequency | Retention | Storage Location |
|---|---|---|---|---|
| Database (Neon) | Neon PITR (automatic) + manual `pg_dump` | Continuous (PITR) + daily (manual) | Per Neon plan (PITR) + 30 days (manual dumps) | Neon (PITR) + external cloud storage (manual) |
| Media (Cloudinary) | Cloudinary's own redundancy + periodic export of the Media Library manifest | Monthly export | 90 days | External cloud storage |
| Environment Variables | Manual export/documentation | On every change | Indefinite | Client's password manager |
| Source Code (GitHub) | Git itself is the backup (full history) + optional periodic mirror | Continuous (Git) | Indefinite | GitHub + optional secondary mirror |

## 21.3 Database Backup Procedure

See Chapter 08.8 for the exact `pg_dump` command. Automate this with a scheduled job (e.g., a simple cron job on a small always-on machine, or a scheduled GitHub Action using `workflow_dispatch` with a cron trigger) rather than relying on manual discipline.

```yaml
# .github/workflows/db-backup.yml (illustrative — requires storing DIRECT_URL as a GitHub secret)
name: Nightly DB Backup
on:
  schedule:
    - cron: '0 20 * * *'  # 20:00 UTC daily
jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - name: Dump database
        run: pg_dump "${{ secrets.DIRECT_URL }}" --format=custom --file=backup.dump
      - name: Upload to storage
        run: echo "Upload backup.dump to external storage here"
```

## 21.4 Media Backup Procedure

Cloudinary retains uploaded originals with high durability by design; the additional manual export is a defense-in-depth measure against accidental account-level deletion or a billing lapse causing account suspension.

## 21.5 Environment Variable Backup

Maintain a secure note (in the client's password manager) mirroring the exact contents of Chapter 12's variable tables with real values filled in, updated every time a variable changes in Railway/Vercel.

## 21.6 Validation

- [ ] A database backup file exists and is less than 24 hours old.
- [ ] A restore from that backup file has been tested against a non-production target within the last 90 days.
- [ ] Environment variable documentation matches the actual live values in Railway/Vercel (spot-check quarterly).

## 21.7 Troubleshooting

| Symptom | Likely Cause | Fix |
|---|---|---|
| Automated backup job silently stopped running | GitHub Actions scheduled workflows are disabled automatically after 60 days of repository inactivity | Re-enable the workflow; consider a commit/ping mechanism to keep the repo "active" |
| Restore test fails | Backup file corrupted, or `pg_restore` version mismatch | Verify `pg_dump`/`pg_restore` versions match; keep a recent backup verified working before trusting older ones |

## 21.8 Best Practices

- **An untested backup is not a backup.** Schedule a quarterly restore drill, even if nothing is wrong.
- Store backups in a location with different failure characteristics than the primary systems (i.e., not solely inside the same cloud account/region as production).

---

# Chapter 22 — Disaster Recovery

## 22.1 Purpose

Define exactly what to do when a major component fails, minimizing both downtime (RTO) and data loss (RPO).

## 22.2 Recovery Objectives

| Objective | Target | Rationale |
|---|---|---|
| **RPO** (Recovery Point Objective) — maximum acceptable data loss | ≤ 24 hours | Matches the daily manual backup cadence (Chapter 21.3); Neon PITR typically allows tighter recovery within its retention window |
| **RTO** (Recovery Time Objective) — maximum acceptable downtime | ≤ 4 hours | Achievable given all components are managed platforms with their own high-availability, and rollback/restore procedures are pre-documented in this manual |

## 22.3 Scenario: API Server Failure (Railway)

**Symptoms:** `api.juicevibes.lk/health` fails; website/admin show errors fetching data.

**Response:**
1. Check Railway's status page for a platform-wide incident.
2. If platform-wide: monitor Railway's status page; no local action will resolve a platform outage — communicate expected downtime to the client.
3. If application-specific (bad deploy): execute rollback (Chapter 09.14) to the last known-good deployment immediately.
4. Investigate root cause in logs (Chapter 09.8) before attempting to re-deploy the fix.

## 22.4 Scenario: Database Failure (Neon)

**Symptoms:** API logs show connection errors; `prisma` queries time out or fail.

**Response:**
1. Check Neon's status page for a platform-wide incident.
2. If data corruption/accidental deletion (not platform outage): use Neon's Point-in-Time Restore (Chapter 08.9, Option A) to a new branch, verify integrity, then either promote that branch or copy the needed data back to production.
3. If PITR window has been exceeded: restore from the most recent manual `pg_dump` (Chapter 08.9, Option B), accepting data loss back to that backup's timestamp — communicate this data-loss window transparently to the client.

## 22.5 Scenario: DNS Failure

**Symptoms:** Domain doesn't resolve, or resolves incorrectly; SSL errors appear.

**Response:**
1. Verify via `dig` from multiple networks/locations (or an online DNS-checker tool) whether this is a propagation issue vs. a misconfiguration.
2. Compare current DNS records against the authoritative table in Chapter 13.2; correct any discrepancy.
3. If nameservers were somehow changed away from Cloudflare, re-verify and correct at register.lk (Chapter 05.4).

## 22.6 Scenario: Cloudflare Outage

**Symptoms:** Site unreachable despite Vercel/Railway showing healthy status independently.

**Response:**
1. Check Cloudflare's public status page.
2. Cloudflare outages are rare but, when they occur, affect a huge portion of the internet simultaneously — there is no practical instant failover for a small business at this budget tier. Document this as an accepted risk (Section 22.8).
3. Communicate proactively to customers via any available out-of-band channel (social media) if the outage is prolonged.

## 22.7 Scenario: Complete Platform Loss (Worst Case)

**Response (full rebuild from backups):**
1. Re-provision Neon database from the most recent verified backup (Chapter 08.9).
2. Re-deploy `api`, `web`, `admin` from the GitHub repository's `main` branch to fresh Vercel/Railway projects.
3. Re-apply all environment variables from the secured documentation (Chapter 21.5).
4. Re-point DNS (Chapter 13) at the newly created services.
5. Run the full Go-Live Checklist (Chapter 19) again before declaring recovery complete.

## 22.8 Accepted Risks

| Risk | Why It's Accepted | Mitigation |
|---|---|---|
| Cloudflare/Vercel/Railway/Neon simultaneous multi-provider outage | Extremely low probability; building custom multi-cloud failover is disproportionate to this business's scale and budget | Monitor status pages; communicate transparently during rare events |
| Up to 24 hours of data loss in worst-case database failure | Matches the manual backup cadence; tighter RPO requires paid, more frequent backup tooling | Revisit as order volume grows (Chapter 24) |

## 22.9 Validation Checklist

- [ ] Every scenario in this chapter has a named, current on-call contact who has read it.
- [ ] The "Complete Platform Loss" rebuild procedure has been dry-run at least once in a non-production sandbox.

## 22.10 Best Practices

- Review and re-test this chapter's procedures at least twice a year, and after any significant infrastructure change.
- Keep a printed or offline copy of this manual — if the outage affects the systems where this manual itself is stored, it needs to still be accessible.

---

# Chapter 23 — Maintenance SOP

## 23.1 Purpose

Define recurring maintenance tasks so the platform doesn't silently decay (expired certs, forgotten renewals, growing technical debt) between active development engagements.

## 23.2 Daily

- [ ] Glance at the external uptime monitor / any overnight alerts.
- [ ] Skim Railway logs for new `ERROR` entries if any alert fired.

## 23.3 Weekly

- [ ] Review Railway and Neon metrics for any concerning trend (rising memory, connection count, storage).
- [ ] Confirm the automated database backup job ran successfully (Chapter 21.3).
- [ ] Review any open Pull Requests for staleness.

## 23.4 Monthly

- [ ] Run `pnpm audit` (or `pnpm audit --prod`) across the monorepo and address any high/critical vulnerabilities.
- [ ] Review Cloudflare Analytics for traffic trends and any blocked-threat spikes worth investigating.
- [ ] Confirm Neon storage/compute usage is within the current plan's limits.
- [ ] Verify environment variable documentation (Chapter 21.5) still matches live values.

## 23.5 Quarterly

- [ ] Perform a full database restore drill (Chapter 21.8).
- [ ] Review and rotate any credentials due for rotation per the client's security policy (if one exists) or at minimum review for any suspected exposure.
- [ ] Re-review this manual's Disaster Recovery chapter (22) with the team.
- [ ] Review dependency versions (Next.js, NestJS, Prisma, React Native) for security-relevant updates; plan upgrades deliberately rather than reactively.

## 23.6 Annually

- [ ] Confirm domain renewal (even with auto-renewal enabled) actually processed successfully.
- [ ] Review the client's overall infrastructure spend against the Future Scaling plan (Chapter 24) and adjust tiers if traffic has grown.
- [ ] Full security review: re-run the Chapter 19 Security section (items 57–63) as a fresh audit, not just a memory check.
- [ ] Review and refresh this manual itself — technology and platform features change; a manual that isn't maintained becomes actively misleading.

## 23.7 Validation Checklist

- [ ] A named person (client staff member, or a retained maintenance contract with the developer) is explicitly responsible for each cadence above.
- [ ] Maintenance tasks are tracked somewhere durable (a shared checklist doc, ticketing system) rather than relying on memory.

## 23.8 Best Practices

- Prefer automating any recurring task over relying on a human remembering to do it manually — every checkbox above that can become a scheduled script or alert should.

---

# Chapter 24 — Future Scaling

## 24.1 Purpose

Describe the explicit upgrade path as JuiceVibe's order volume grows, so the team scales infrastructure proactively rather than reactively during an outage.

## 24.2 Scaling Stages Overview

| Stage | Approx. Daily Active Users | Primary Bottleneck | Action |
|---|---|---|---|
| Launch | Up to ~100 | None expected | Current free/Hobby-tier stack as documented in this manual |
| Growth | ~1,000 | Railway Hobby resource ceiling; Neon free-tier cold starts | Upgrade Railway to Pro (configurable resources); consider Neon's paid "always-on" tier to eliminate cold-start latency |
| Scale | ~10,000 | Single Railway instance; database connection pressure; image bandwidth | Enable Railway horizontal scaling (multiple replicas) behind its load balancer; upgrade Neon compute size; introduce a caching layer (e.g., Redis) for frequently-read data |
| Enterprise | ~100,000+ | Full re-architecture territory | Evaluate dedicated infrastructure (managed Kubernetes or similar), read replicas for the database, a CDN strategy beyond Cloudflare's free tier, dedicated on-call/SRE practices |

## 24.3 Stage: 100 Users

No changes needed. The infrastructure described in Chapters 04–13 comfortably serves this level of traffic on free/near-free tiers.

## 24.4 Stage: 1,000 Users

**Triggers to watch for:** Railway Hobby resource warnings; Neon cold-start latency becoming noticeable in user-facing load times; approaching Cloudinary free-tier bandwidth limits.

**Actions:**
- Upgrade Railway to **Pro** plan for configurable, higher resource limits.
- Evaluate Neon's paid tier for an "always-on" compute option, eliminating the cold-start delay after idle periods.
- Monitor Cloudinary bandwidth; upgrade if approaching free-tier limits.

## 24.5 Stage: 10,000 Users

**Triggers to watch for:** Single Railway instance CPU consistently near capacity; database connection count near the pooler's limit; API p95 latency degrading under load.

**Actions:**
- Enable Railway's horizontal scaling (multiple replicas of the API service).
- Upgrade Neon's compute size tier; review whether read-heavy endpoints (e.g., menu browsing) would benefit from a read replica.
- Introduce an application-level cache (Redis, e.g., via Railway's Redis plugin or an external managed Redis) for frequently-read, rarely-changed data (categories, published menu).
- Re-evaluate Cloudflare plan tier for enhanced WAF/rate-limiting capabilities beyond Free.

## 24.6 Stage: 100,000 Users

This stage represents a genuine re-architecture decision point, not an incremental upgrade. At this scale:
- Evaluate whether a managed container orchestration platform (rather than Railway's PaaS model) offers better cost/performance at volume.
- Consider database read replicas and/or sharding strategy depending on data access patterns.
- Formalize an SRE/on-call rotation with paid incident-management tooling, rather than the lightweight monitoring in Chapter 20.
- Revisit RTO/RPO targets (Chapter 22.2) — a business at this scale typically requires tighter recovery objectives than the ≤4 hour / ≤24 hour targets set for the launch stage.

## 24.7 Upgrade Path Summary Table

| Platform | Launch Tier | Growth Tier | Scale Tier |
|---|---|---|---|
| Vercel | Hobby (Free) | Pro | Pro / Enterprise |
| Railway | Hobby ($5/mo) | Pro | Pro (horizontal scaling) |
| Neon | Free | Paid (always-on) | Paid (larger compute + read replica) |
| Cloudflare | Free | Free / Pro | Pro / Business |
| Cloudinary | Free | Paid | Paid (higher bandwidth tier) |

## 24.8 Best Practices

- Upgrade **proactively** based on the trigger signals in Sections 24.4–24.6, not reactively after a customer-facing incident.
- Re-run relevant portions of Chapter 18 (Production Testing) and Chapter 19 (Go-Live Checklist) after any significant infrastructure tier change, treating it as a mini-launch.

---

# Chapter 25 — Client Handover Documentation

## 25.1 Purpose

Ensure the client has full, independent ownership and operational understanding of their platform at the conclusion of the development engagement — no dependency on the original developer to access or operate their own systems.

## 25.2 Account Ownership Confirmation

| Account | Ownership Confirmed | Owner Email | 2FA Enabled |
|---|---|---|---|
| register.lk | [ ] | | [ ] |
| Cloudflare | [ ] | | [ ] |
| GitHub (organization) | [ ] | | [ ] |
| Vercel (team) | [ ] | | [ ] |
| Railway | [ ] | | [ ] |
| Neon | [ ] | | [ ] |
| Cloudinary | [ ] | | [ ] |
| Google Workspace (if applicable) | [ ] | | [ ] |

## 25.3 Credentials Checklist

- [ ] All account credentials stored in a password manager vault owned and controlled by the client (not the developer's personal vault).
- [ ] The developer's access is via **member/collaborator roles**, not shared logins to the client's Owner account.
- [ ] A documented process exists for revoking the developer's access cleanly at the end of any support arrangement.

## 25.4 Renewal Schedule

| Item | Renewal Frequency | Approximate Cost | Renewal Action Owner |
|---|---|---|---|
| Domain (register.lk) | Annual | LKR 3,500–4,000/year | Client (auto-renewal enabled, per Ch. 05.9) |
| Railway Hosting | Monthly | USD 5/month (usage-based, may vary) | Client |
| Vercel, Neon, Cloudinary, Cloudflare | N/A (Free tier) | Free (until upgraded per Ch. 24) | N/A |
| Google Workspace (if applicable) | Monthly/Annual | Per Google's current pricing | Client |

## 25.5 Support Process

**Recommended structure post-launch:**
1. Define a support tier (e.g., a fixed-scope retainer, or ad-hoc hourly support) between the client and developer, documented separately from this manual.
2. Define response-time expectations for Sev-1 (site down) vs. Sev-2 (degraded) vs. Sev-3 (minor bug) issues.
3. Define the escalation path if the original developer is unavailable — this manual is specifically written to allow a **different** engineer to step in, provided they have access per Section 25.2.

## 25.6 What the Client Should Understand (Non-Technical Summary)

Even without technical background, the client should understand:
- They own every account listed in Section 25.2 — nothing is held by the developer.
- The domain must be renewed annually (or auto-renewal must remain active and funded).
- Railway hosting has a small recurring monthly cost tied to their payment method.
- This manual (and its appendix) is the reference document for anyone taking over technical operation of the platform.

## 25.7 Validation Checklist

- [ ] Section 25.2 table fully completed and verified, not assumed.
- [ ] Client has successfully logged into every account independently, without the developer's assistance, at least once.
- [ ] Client has received and acknowledged the renewal schedule (Section 25.4).

## 25.8 Best Practices

- Schedule a formal handover meeting (even 30 minutes) walking the client through Sections 25.2–25.6 live, rather than only sending this document.
- Revisit this chapter any time account ownership or team composition changes.

---

# Appendix

## A.1 Production Checklist (Condensed)

A condensed, printable version of Chapter 19 for quick reference during an actual launch window:

- [ ] Domain + DNS live and verified
- [ ] Cloudflare SSL/security configured (Full Strict, HSTS, WAF, Bot Fight Mode)
- [ ] GitHub repo protected, no secrets in history
- [ ] Neon migrated, seeded, backed up, restore-tested
- [ ] Railway API healthy, custom domain verified, rollback tested
- [ ] Vercel web + admin deployed, custom domains verified, rollback tested
- [ ] Cloudinary signed uploads only, folder structure in place
- [ ] JWT/CORS/rate-limiting/security headers verified
- [ ] Full functional test matrix passed
- [ ] External uptime monitoring live and alert-tested
- [ ] Backup + DR runbook reviewed by team
- [ ] Client sign-off obtained in writing

## A.2 Deployment Checklist (Per-Release)

- [ ] PR reviewed and CI passing
- [ ] Merge to `main`
- [ ] Confirm Vercel (web, admin) and Railway (api) builds succeed
- [ ] Confirm `prisma migrate deploy` applied cleanly (check Railway deploy logs)
- [ ] Smoke test the core order flow against production
- [ ] Monitor logs/metrics for 15–30 minutes post-deploy

## A.3 Infrastructure Checklist (Periodic Health Check)

- [ ] All 2FA still enabled across accounts
- [ ] SSL certificates valid and auto-renewing (Vercel/Railway managed — verify no manual cert has silently expired)
- [ ] DNS records match Chapter 13.2 exactly
- [ ] No unused/orphaned environment variables lingering from removed features

## A.4 Rollback Checklist

- [ ] Identify the failing component (web, admin, api, database) via logs/monitoring
- [ ] For web/admin: Vercel → Promote previous deployment
- [ ] For api: Railway → Redeploy previous deployment
- [ ] For database: Neon PITR restore to a branch, verify, then promote/copy back
- [ ] Communicate status to the client/team throughout
- [ ] Root-cause the failure before re-attempting the fixed deploy

## A.5 Troubleshooting Guide — Common Errors Quick Reference

| Error | Where | Meaning | First Action |
|---|---|---|---|
| 521 | Cloudflare | Origin server unreachable | Check Vercel/Railway status directly |
| 526 | Cloudflare | Invalid origin SSL certificate | Verify origin's cert is active before using Full (Strict) |
| 502 | Railway | App crashed or not bound to correct port | Check Railway logs; verify `PORT` env var usage |
| `ERR_PNPM_OUTDATED_LOCKFILE` | Build (any platform) | Lockfile out of sync | Regenerate lockfile locally, commit |
| `too many connections` | API/Database | Using direct instead of pooled DB URL | Switch runtime to pooled `DATABASE_URL` |
| CORS error in browser console | Frontend | Origin mismatch | Verify `FRONTEND_URL`/`ADMIN_URL` exact match |
| `jwt malformed` / mass logout | API | Secret rotation occurred | Expected after Ch. 16.8; confirm against change log |

## A.6 CLI Commands Quick Reference

```bash
# Install
pnpm install --frozen-lockfile

# Build
pnpm --filter web... build
pnpm --filter admin... build
pnpm --filter api... build

# Database
pnpm --filter database exec prisma generate
pnpm --filter database exec prisma migrate deploy
pnpm --filter database exec prisma migrate status
pnpm --filter database exec prisma db seed

# Backup / Restore
pg_dump "$DIRECT_URL" --format=custom --file=backup.dump
pg_restore --clean --if-exists --dbname="$DIRECT_URL" backup.dump

# DNS validation
dig NS juicevibes.lk +short
dig CNAME api.juicevibes.lk +short
dig MX juicevibes.lk +short

# Secrets
openssl rand -hex 32
```

## A.7 Useful Links (Reference Only — Verify Current URLs)

| Resource | Purpose |
|---|---|
| Vercel Documentation | Deployment configuration reference |
| Railway Documentation | Service configuration, custom domains |
| Neon Documentation | Connection pooling, branching, PITR |
| Cloudflare Documentation | DNS, SSL/TLS, WAF configuration |
| Cloudinary Documentation | Signed uploads, transformations |
| Prisma Documentation | Migrations, schema reference |
| NestJS Documentation | Framework reference |
| Next.js Documentation | Framework reference |

> **Note:** Always verify current documentation directly on each provider's site — platform UIs, pricing, and plan feature sets change over time, and this manual reflects the configuration valid as of July 2026.

## A.8 Glossary

| Term | Definition |
|---|---|
| **CDN** | Content Delivery Network — a distributed set of servers that cache and serve content from a location geographically close to the requesting user |
| **CNAME** | A DNS record type that points one hostname to another hostname |
| **CORS** | Cross-Origin Resource Sharing — a browser security mechanism controlling which origins may call an API |
| **CI/CD** | Continuous Integration / Continuous Deployment — automated build, test, and release pipeline |
| **JWT** | JSON Web Token — a signed token format used to represent an authenticated session |
| **Monorepo** | A single repository containing multiple applications/packages that share code |
| **ORM** | Object-Relational Mapper — a library (Prisma, in this project) that lets code interact with a database using objects/models rather than raw SQL |
| **PITR** | Point-in-Time Recovery — the ability to restore a database to any specific moment within a retention window |
| **RPO** | Recovery Point Objective — the maximum acceptable amount of data loss, measured in time |
| **RTO** | Recovery Time Objective — the maximum acceptable duration of downtime during recovery |
| **SSL/TLS** | Protocols that encrypt traffic between a client and server (commonly still called "SSL" colloquially; modern implementations use TLS) |
| **WAF** | Web Application Firewall — a security layer that filters malicious HTTP traffic before it reaches the origin server |
| **WHOIS** | A public lookup protocol/database showing domain registration/ownership information |

---

**End of Manual.**

*This document should be treated as a living reference — update it whenever infrastructure, tooling, or procedures change, per the annual review item in Chapter 23.6.*
