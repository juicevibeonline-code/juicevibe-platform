# 🚀 JuiceVibe Platform - Complete Domain & Production Deployment Guide

This guide details the step-by-step process to deploy the complete **JuiceVibe Monorepo Platform** (Neon PostgreSQL, Railway NestJS API, Vercel Web Storefront, Vercel Admin Dashboard) and link your custom domain.

---

## 📐 1. Monorepo Architecture & Subdomain Mapping

Assuming your custom domain is **`juicevibe.com`** (replace with your actual domain):

| Application | Technology | Production Host | Subdomain Mapping |
| :--- | :--- | :--- | :--- |
| **Storefront App** (`apps/web`) | Next.js 16 | **Vercel** | `juicevibe.com` / `www.juicevibe.com` |
| **Admin Dashboard** (`apps/admin`) | Next.js 16 | **Vercel** | `admin.juicevibe.com` |
| **Backend API & WebSockets** (`apps/api`) | NestJS 11 + Socket.io | **Railway** | `api.juicevibe.com` |
| **PostgreSQL Database** | PostgreSQL 16 | **Neon.tech** | Cloud PostgreSQL Connection |

---

## 🗄️ Step 1: Cloud Database Setup (Neon.tech)

1. **Database Connection**:
   Your Neon database is active at:
   ```env
   DATABASE_URL="postgresql://neondb_owner:...@ep-rapid-surf-aye64lkc-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require"
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

## 🚂 Step 2: Deploy NestJS Backend API to Railway (`apps/api`)

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
   DATABASE_URL = postgresql://neondb_owner:...@ep-rapid-surf-aye64lkc-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require
   JWT_SECRET = super-secure-jwt-secret-min-32-chars
   JWT_REFRESH_SECRET = super-secure-refresh-secret-min-32-chars
   PORT = 4000
   FRONTEND_URL = https://juicevibe.com
   ADMIN_URL = https://admin.juicevibe.com
   ```

4. **Link Custom Subdomain (`api.juicevibe.com`)**:
   - Go to **Settings** ➔ **Networking** ➔ **Custom Domain**.
   - Type: `api.juicevibe.com`.
   - Copy the provided Railway target URL (e.g. `juicevibe-api-production.up.railway.app`).

---

## 🌐 Step 3: Deploy Web Storefront to Vercel (`apps/web`)

1. Go to [Vercel](https://vercel.com) ➔ **Add New Project**.
2. Select your repository `Juice-Vibe-Pro/juicevibe-platform`.
3. Configure Project:
   - **Project Name**: `juicevibe-web`
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web`
4. Environment Variables:
   ```env
   NEXT_PUBLIC_API_URL = https://api.juicevibe.com
   ```
5. Click **Deploy**.
6. Under Project Settings ➔ **Domains**, add `juicevibe.com` and `www.juicevibe.com`.

---

## ⚙️ Step 4: Deploy Admin Dashboard to Vercel (`apps/admin`)

1. Go to [Vercel](https://vercel.com) ➔ **Add New Project** (Second project for Admin).
2. Select your repository `Juice-Vibe-Pro/juicevibe-platform`.
3. Configure Project:
   - **Project Name**: `juicevibe-admin`
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/admin`
4. Environment Variables:
   ```env
   NEXT_PUBLIC_API_URL = https://api.juicevibe.com
   ```
5. Click **Deploy**.
6. Under Project Settings ➔ **Domains**, add `admin.juicevibe.com`.

---

## 🎯 Step 5: DNS Configuration (Cloudflare / Namecheap / GoDaddy)

In your Domain Registrar's **DNS Management**, add the following records:

| Type | Name / Host | Target / Value | Description |
| :--- | :--- | :--- | :--- |
| **A** | `@` | `76.76.21.21` | Points `juicevibe.com` to Vercel |
| **CNAME** | `www` | `cname.vercel-dns.com` | Points `www.juicevibe.com` to Vercel |
| **CNAME** | `admin` | `cname.vercel-dns.com` | Points `admin.juicevibe.com` to Vercel |
| **CNAME** | `api` | `juicevibe-api-production.up.railway.app` | Points `api.juicevibe.com` to Railway |

---

## 🔒 Step 6: Verification & Testing Checklist

- [x] **Database**: Schema pushed & default seed data loaded (`admin@juicevibe.com` / `Admin@123`).
- [ ] **Railway NestJS API**: `https://api.juicevibe.com/api` returns active NestJS API status.
- [ ] **Storefront Web App**: `https://juicevibe.com` loads products, categories, and shopping cart.
- [ ] **Admin Dashboard**: `https://admin.juicevibe.com` logs in with `admin@juicevibe.com`.
- [ ] **Real-Time Orders**: Test order placement; verifies WebSocket communication between API, Web, and Admin.
