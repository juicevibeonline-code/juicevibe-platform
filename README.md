<div align="center">

# 🌿 JUICE VIBE DIGITAL PLATFORM
### *Enterprise Food & Beverage Monorepo Ecosystem*

[![Next.js 16](https://img.shields.io/badge/Next.js-16.2.10-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![NestJS 11](https://img.shields.io/badge/NestJS-11.0.0-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript 5.7](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma 6](https://img.shields.io/badge/Prisma-6.19-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Managed-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Turborepo](https://img.shields.io/badge/Turborepo-Monorepo-EF4444?style=for-the-badge&logo=turborepo&logoColor=white)](https://turbo.build/repo)
[![Vercel](https://img.shields.io/badge/Vercel-Deployment-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![Railway](https://img.shields.io/badge/Railway-Cloud%20API-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)](https://railway.app/)

<p align="center">
  <b>A high-performance digital commerce platform and operations dispatch hub built for Juice Vibe Waskaduwa, Kalutara, Sri Lanka.</b>
</p>

[Live Storefront](https://juicevibe.lk) • [Admin Operations](https://admin.juicevibe.lk) • [API Documentation](https://api.juicevibe.lk/api/docs) • [Technical Docs](docs/README.md)

</div>

---

## 🌟 Executive Overview

The **Juice Vibe Digital Platform** is a full-stack, enterprise-grade web application monorepo. It features a high-converting customer storefront, an operations dispatch admin control center (Kanban, Grid List, Table Map views), and a secure REST API engine with real-time WebSocket order notifications.

- **100% Studio Catalog:** 35 menu products seeded with high-resolution studio photography.
- **Real-Time Kitchen Desk:** WebSocket-powered order dispatch with instantaneous status progression.
- **WhatsApp Direct Receipt:** Automated pre-filled order receipt dispatch to business WhatsApp.
- **Enterprise Design System:** Tailored Emerald brand theme (`#0F2A1E`), IBM Plex Mono numeric formatting, and responsive mobile-first UI.

---

## 🌐 Live Production Deployments

| Component | Platform / Host | Production URL | Status | Health Check |
| :--- | :--- | :--- | :---: | :---: |
| **Customer Storefront** | Vercel (Edge Network) | [`https://juicevibe.lk`](https://juicevibe.lk) | 🟢 `200 OK` | [`/`](https://juicevibe.lk) |
| **Admin Operations Hub** | Vercel (Edge Network) | [`https://admin.juicevibe.lk`](https://admin.juicevibe.lk) | 🟢 `200 OK` | [`/login`](https://admin.juicevibe.lk/login) |
| **Backend REST API** | Railway (Docker / Node 20) | [`https://api.juicevibe.lk/api`](https://api.juicevibe.lk/api) | 🟢 `200 OK` | [`/api/health`](https://api.juicevibe.lk/api) |
| **Swagger API Docs** | Railway | [`https://api.juicevibe.lk/api/docs`](https://api.juicevibe.lk/api/docs) | 🟢 `200 OK` | OpenAPI 3.0 |

---

## 🏗️ System Architecture

```mermaid
graph TD
    subgraph ClientLayer [Client Tier (Next.js 16 / React 19)]
        Web["🛍️ Customer Storefront\n(apps/web — juicevibe.lk)"]
        Admin["📊 Operations Dashboard\n(apps/admin — admin.juicevibe.lk)"]
    end

    subgraph APILayer [Core Service Tier (NestJS 11)]
        API["⚡ Backend REST Engine\n(apps/api — api.juicevibe.lk)"]
        WS["🔔 WebSocket Gateway\n(Real-time Order Alerts)"]
        Swagger["📑 Swagger Documentation\n(/api/docs)"]
    end

    subgraph DataLayer [Persistence & Cloud Media]
        Postgres[("🗄️ PostgreSQL Database\n(Prisma ORM / Cloud Postgres)")]
        Cloudinary["🖼️ Cloudinary CDN\n(Product Media Assets)"]
    end

    Web -->|HTTPS / REST| API
    Admin -->|HTTPS / REST| API
    Admin <-->|WebSockets| WS
    API -->|Prisma Client| Postgres
    API -->|Upload / Serve| Cloudinary
    API --> Swagger
```

---

## 📦 Monorepo Workspace Structure

```
juicevibe-platform/
├── apps/
│   ├── web/            # Next.js 16 Customer Storefront (App Router, Turbopack, Tailwind)
│   ├── admin/          # Next.js 16 Operations Center (React Query, Kanban, Emerald Theme)
│   └── api/            # NestJS 11 REST API Engine (Prisma, Passport JWT, WebSockets, Swagger)
├── packages/
│   ├── services/       # Centralized API clients, Zustand stores, and state synchronization
│   ├── database/       # Prisma Client schema, migrations, and seed scripts
│   ├── ui/             # Reusable accessible UI component library
│   ├── types/          # Shared TypeScript type definitions and enums
│   ├── utils/          # Formatting helpers, price calculations, and utility functions
│   ├── config/         # Shared Tailwind CSS, ESLint, and PostCSS configurations
│   └── hooks/          # Shared custom React hooks
├── docs/               # 25+ Essential Technical Architecture & Deployment Guides
├── prisma/             # Primary Prisma schema & 35-item catalog seed script
├── package.json        # Monorepo root configuration & Turborepo orchestration
├── pnpm-workspace.yaml # PNPM 9 monorepo workspace definition
└── turbo.json          # Turbo build caching pipeline configuration
```

---

## 🚀 Key Functional Capabilities

### 🛍️ Customer Storefront (`apps/web`)
* **Interactive Menu & Filtering:** Dynamic category tabs (Juices, Smoothies, Lassis, Burgers, Desserts), search, and nutritional tags.
* **Smart Cart & Checkout:** Dine-in (Table selection), Takeaway, and Home Delivery with Cash/Card/Bank Transfer workflows.
* **WhatsApp Receipt Dispatch:** Automatic pre-formatted WhatsApp order summary generated and routed to the café desk (`+94718435876`).
* **Live Order Tracking:** Real-time order status tracking by order number (`/track`).
* **Local SEO Optimized:** Rich Schema.org JSON-LD microdata, OpenGraph tags, sitemap, and robots.txt for Google Search.

### 📊 Admin Operations Hub (`apps/admin`)
* **Live Order Desk:** Three synchronized dispatch perspectives:
  * **Kanban Board:** Real-time draggable status columns (`Pending` ➔ `Preparing` ➔ `Ready` ➔ `Completed`).
  * **Grid / List View:** Paginated, filterable high-density order ledger.
  * **Table Map:** Floor plan overview of occupied tables and active dine-in bills.
* **Menu & Pricing Editor:** Instant item creation, price updates, category management, and stock status toggle.
* **Cloudinary Gallery:** Image management for marketing highlights and customer showcase photos.
* **Role-Based Access Control:** Enforced authentication levels (`admin`, `manager`, `cashier`, `kitchen`, `editor`).

### ⚡ Backend REST Engine (`apps/api`)
* **Security & Auth:** Passport JWT authentication with refresh token rotation, bcrypt password hashing, and NestJS RBAC guards.
* **Traffic Protection:** Helmet security headers, rate limiting throttlers, and validated CORS origin whitelisting.
* **Prisma ORM & PostgreSQL:** Relational schema supporting orders, order items, tables, categories, menu items, reviews, and audit logs.

---

## 🛠️ Getting Started (Local Development)

### Prerequisites
* **Node.js:** `>= 20.0.0`
* **Package Manager:** `pnpm@9.15.4` (`corepack enable && corepack prepare pnpm@9.15.4 --activate`)
* **Database:** PostgreSQL database instance (Local or Cloud)

### 1. Installation
```bash
# Clone the repository
git clone https://github.com/juicevibeonline-code/juicevibe-platform.git
cd juicevibe-platform

# Install monorepo dependencies
pnpm install
```

### 2. Environment Variables Setup
Create a root `.env` file (or copy `.env.example`):
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/juicevibe?sslmode=disable"

# Backend API
PORT=4000
HOST=0.0.0.0
NODE_ENV=development
JWT_SECRET="your_super_secret_jwt_key_here"
JWT_REFRESH_SECRET="your_super_secret_refresh_jwt_key_here"
JWT_ACCESS_EXPIRATION="15m"
JWT_REFRESH_EXPIRATION="7d"

# Frontend URLs
FRONTEND_URL="http://localhost:3000"
ADMIN_URL="http://localhost:3001"

# Web Client Public Env
NEXT_PUBLIC_API_URL="http://localhost:4000"

# Cloudinary (Media Uploads)
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

### 3. Database Migration & Seeding
```bash
# Generate Prisma Client
pnpm db:generate

# Push schema to database
pnpm db:push

# Seed initial 35-item catalog with photography & admin user
pnpm db:seed
```

### 4. Running Development Servers
```bash
# Start all 3 applications concurrently via Turborepo
pnpm dev
```
* **Customer Storefront:** `http://localhost:3000`
* **Admin Dashboard:** `http://localhost:3001` (Login: `admin@juicevibe.com` / `Admin@123`)
* **Backend API:** `http://localhost:4000/api`
* **Swagger API Docs:** `http://localhost:4000/api/docs`

---

## 📜 Monorepo Scripts Reference

| Command | Description |
| :--- | :--- |
| `pnpm dev` | Starts all applications in parallel development mode |
| `pnpm build` | Executes cached production build across all packages via Turborepo |
| `pnpm typecheck` | Runs TypeScript static analysis across all 10 monorepo packages (`0 errors`) |
| `pnpm lint` | Runs ESLint analysis across workspace |
| `pnpm format` | Formats all code, markdown, and config files with Prettier |
| `pnpm db:generate` | Generates Prisma client types from `schema.prisma` |
| `pnpm db:push` | Synchronizes database schema with PostgreSQL |
| `pnpm db:seed` | Seeds database with 35 items, categories, and initial admin account |
| `pnpm db:studio` | Opens Prisma Studio visual database editor |

---

## 📚 Technical Documentation Suite

Comprehensive technical and architecture guides are available in the [`docs/`](docs/README.md) directory:

* 🏛️ [System Architecture & Data Flow](docs/03-system-architecture.md)
* 🚀 [Production Deployment Guide](docs/05-deployment-guide.md)
* 🔒 [Security & RBAC Architecture](docs/08-security-guide.md)
* 📑 [REST API & WebSockets Guide](docs/11-api-guide.md)
* 🗄️ [PostgreSQL Database & Prisma Schema](docs/12-database-documentation.md)
* 🌐 [DNS & Custom Domain (`juicevibe.lk`) Guide](docs/domain_deployment_guide.md)
* 🔍 [Local SEO & Google Search Strategy](docs/15-seo-guide.md)

---

## 👨‍💻 Engineering & Authorship

* **Lead Developer:** Dulanjaya Lakruwan (Full Stack Software Developer)
* **Client Partner:** Juice Vibe Waskaduwa, Kalutara, Sri Lanka
* **Repository:** [`juicevibeonline-code/juicevibe-platform`](https://github.com/juicevibeonline-code/juicevibe-platform)
* **License:** Proprietary Commercial Software — All Rights Reserved.

<div align="center">
  <sub>Built with ❤️ for Juice Vibe Waskaduwa</sub>
</div>