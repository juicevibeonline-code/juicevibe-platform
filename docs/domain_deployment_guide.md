# 🚀 JuiceVibe Platform - Complete Domain & Production Deployment Guide (`juicevibe.lk`)

This guide details the step-by-step process to deploy the complete **JuiceVibe Monorepo Platform** (Neon PostgreSQL, Railway NestJS API, Vercel Web Storefront, Vercel Admin Dashboard) and link your custom domain: **`juicevibe.lk`**.

---

## 📐 1. Monorepo Architecture & Subdomain Mapping (`juicevibe.lk`)

| Application | Technology | Production Host | Subdomain Mapping |
| :--- | :--- | :--- | :--- |
| **Storefront App** (`apps/web`) | Next.js 16 | **Vercel** | `juicevibe.lk` / `www.juicevibe.lk` |
| **Admin Dashboard** (`apps/admin`) | Next.js 16 | **Vercel** | `admin.juicevibe.lk` |
| **Backend API & WebSockets** (`apps/api`) | NestJS 11 + Socket.io | **Railway** | `api.juicevibe.lk` |
| **PostgreSQL Database** | PostgreSQL 16 | **Neon.tech** | Cloud PostgreSQL Connection |

---

## 🗄️ Step 1: Cloud Database Setup (Neon.tech)

1. **Database Connection**:
   Your Neon database connection string:
   ```env
   DATABASE_URL="postgresql://neondb_owner:npg_...@ep-rapid-surf-aye64lkc-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require"
   ```

2. **Schema Push & Database Seed**:
   Run the following commands in your local workspace root (`d:\Clients\Juice-Vibe-Pro\juicevibe-platform`):
   ```bash
   # Push latest schema tables to Neon Cloud DB
   pnpm db:push

   # Seed default admin user (admin@juicevibe.com / Admin@123), menu items, and settings
   pnpm db:seed
   ```

---

## 🚂 Step 2: Deploy NestJS Backend API to Railway (`apps/api`) ➔ `api.juicevibe.lk`

1. **Create Project on Railway**:
   - Go to [Railway.app](https://railway.app) ➔ **New Project** ➔ **Deploy from GitHub repo**.
   - Select your repository: `Juice-Vibe-Pro/juicevibe-platform`.

2. **Configure Service Settings**:
   In Railway Service ➔ **Settings**:
   - **Service Name**: `juicevibe-api`
   - **Root Directory**: `/` *(Leave as root for pnpm workspace resolution)*
   - **Build Command**:
     ```bash
     pnpm install && pnpm db:generate && pnpm --filter @juice-vibe/api build
     ```
   - **Start Command**:
     ```bash
     node apps/api/dist/main
     ```

3. **Set Environment Variables**:
   In Railway Service ➔ **Variables**:
   ```env
   DATABASE_URL = postgresql://neondb_owner:npg_...@ep-rapid-surf-aye64lkc-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require
   JWT_SECRET = super-secure-jwt-secret-min-32-chars
   JWT_REFRESH_SECRET = super-secure-refresh-secret-min-32-chars
   PORT = 4000
   FRONTEND_URL = https://juicevibe.lk
   ADMIN_URL = https://admin.juicevibe.lk
   ```

4. **Link Custom Domain (`api.juicevibe.lk`)**:
   - Go to **Settings** ➔ **Networking** ➔ **Custom Domain**.
   - Type: `api.juicevibe.lk`.
   - Set **Target Port**: `4000`.
   - Copy the provided Railway target URL (e.g. `juicevibe-api-production.up.railway.app`).

---

## 🌐 Step 3: Deploy Web Storefront to Vercel (`apps/web`) ➔ `juicevibe.lk`

1. Go to [Vercel](https://vercel.com) ➔ **Add New Project**.
2. Select your repository `Juice-Vibe-Pro/juicevibe-platform`.
3. Configure Project:
   - **Project Name**: `juicevibe-web`
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web`
4. Environment Variables:
   ```env
   NEXT_PUBLIC_API_URL = https://api.juicevibe.lk
   ```
5. Click **Deploy**.
6. Under Project Settings ➔ **Domains**, add `juicevibe.lk` and `www.juicevibe.lk`.

---

## ⚙️ Step 4: Deploy Admin Dashboard to Vercel (`apps/admin`) ➔ `admin.juicevibe.lk`

1. Go to [Vercel](https://vercel.com) ➔ **Add New Project** (Second project for Admin).
2. Select your repository `Juice-Vibe-Pro/juicevibe-platform`.
3. Configure Project:
   - **Project Name**: `juicevibe-admin`
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/admin`
4. Environment Variables:
   ```env
   NEXT_PUBLIC_API_URL = https://api.juicevibe.lk
   ```
5. Click **Deploy**.
6. Under Project Settings ➔ **Domains**, add `admin.juicevibe.lk`.

---

## 🎯 Step 5: DNS Configuration for LK Domain (`juicevibe.lk`)

In your Domain Registrar / DNS Provider (Cloudflare / LK Domain Registry DNS), add the following records:

| Type | Host / Subdomain | Target / Value | Description |
| :--- | :--- | :--- | :--- |
| **A** | `@` | `76.76.21.21` | Points `juicevibe.lk` to Vercel |
| **CNAME** | `www` | `cname.vercel-dns.com` | Points `www.juicevibe.lk` to Vercel |
| **CNAME** | `admin` | `cname.vercel-dns.com` | Points `admin.juicevibe.lk` to Vercel Admin |
| **CNAME** | `api` | `juicevibe-api-production.up.railway.app` | Points `api.juicevibe.lk` to Railway API |

---

## 🔒 Step 6: Verification & Testing Checklist

- [x] **Database**: Schema pushed & default seed data loaded (`admin@juicevibe.com` / `Admin@123`).
- [ ] **Railway NestJS API**: `https://api.juicevibe.lk/api` returns active NestJS API status.
- [ ] **Storefront Web App**: `https://juicevibe.lk` loads products, categories, and shopping cart.
- [ ] **Admin Dashboard**: `https://admin.juicevibe.lk` logs in with `admin@juicevibe.com`.
- [ ] **Real-Time Orders**: Test order placement; verifies WebSocket communication between API, Web, and Admin.
