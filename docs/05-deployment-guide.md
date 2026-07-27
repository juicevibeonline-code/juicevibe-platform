# 05. Production Deployment Specification Guide
**System:** Juice Vibe Digital Platform  
**Document Version:** 4.0.0-PROD (Netlify + Railway)  
**Author:** Dulanjaya Lakruwan  
**Date:** July 27, 2026  

---

## 1. Executive Summary

This document details the exact deployment architecture and procedures for the **Juice Vibe Monorepo** (`apps/web`, `apps/admin`, `apps/api`) across Netlify, Railway, Neon PostgreSQL, Cloudflare, and Cloudinary.

---

## 2. Infrastructure Architecture

```
GitHub Repository: juicevibeonline-code/juicevibe-platform (main)
├── Target 1: Web Storefront (apps/web)        → Netlify (https://juicevibes.lk)
├── Target 2: Admin Portal (apps/admin)         → Netlify (https://admin.juicevibes.lk)
└── Target 3: Backend API Engine (apps/api)     → Railway (https://api.juicevibes.lk)
```

---

## 3. Project 1: Deploying Backend API (`apps/api`) to Railway

1. Log in to [Railway](https://railway.app) with `juicevibeonline@gmail.com`.
2. Click **New Project ➔ Deploy from GitHub repo**.
3. Select `juicevibeonline-code/juicevibe-platform`.
4. Configure Settings:
   - **Service Name**: `@juice-vibe/api`
   - **Build Command**: `pnpm install && pnpm db:generate && pnpm --filter @juice-vibe/api build`
   - **Start Command**: `pnpm --filter @juice-vibe/api start`
   - **Custom Domain**: `api.juicevibes.lk`
   - **Health Check Path**: `/api`

### Environment Variables on Railway:
```env
NODE_ENV=production
PORT=4000
DATABASE_URL=postgresql://[USER]:[PASS]@[HOST]/[DB]?sslmode=require&pgbouncer=true
DIRECT_URL=postgresql://[USER]:[PASS]@[HOST]/[DB]?sslmode=require
JWT_SECRET=[REDACTED_64_CHAR_HASH]
JWT_REFRESH_SECRET=[REDACTED_64_CHAR_HASH]
FRONTEND_URL=https://juicevibes.lk
ADMIN_URL=https://admin.juicevibes.lk
CLOUDINARY_CLOUD_NAME=[YOUR_CLOUD_NAME]
CLOUDINARY_API_KEY=[YOUR_API_KEY]
CLOUDINARY_API_SECRET=[YOUR_API_SECRET]
```

---

## 4. Project 2: Deploying Storefront (`apps/web`) to Netlify

1. Log in to [Netlify](https://netlify.com) with `juicevibeonline@gmail.com`.
2. Click **Add new site ➔ Import an existing project**.
3. Select GitHub repo `juicevibeonline-code/juicevibe-platform`.
4. Configure Build Settings:
   - **Base directory**: `apps/web`
   - **Build command**: `cd ../.. && pnpm install && pnpm --filter @juice-vibe/web build`
   - **Publish directory**: `apps/web/.next`
   - **Custom domain**: `juicevibes.lk`

### Environment Variables on Netlify (`apps/web`):
```env
NEXT_PUBLIC_API_URL=https://api.juicevibes.lk
NODE_ENV=production
```

---

## 5. Project 3: Deploying Admin Portal (`apps/admin`) to Netlify

1. In Netlify, click **Add new site ➔ Import an existing project**.
2. Select GitHub repo `juicevibeonline-code/juicevibe-platform`.
3. Configure Build Settings:
   - **Base directory**: `apps/admin`
   - **Build command**: `cd ../.. && pnpm install && pnpm --filter @juice-vibe/admin build`
   - **Publish directory**: `apps/admin/.next`
   - **Custom domain**: `admin.juicevibes.lk`

### Environment Variables on Netlify (`apps/admin`):
```env
NEXT_PUBLIC_API_URL=https://api.juicevibes.lk
NODE_ENV=production
```

---

## 6. Cloudflare DNS Configuration

In Cloudflare DNS Manager for `juicevibes.lk`:

| Type | Name | Content / Target | Proxy Status |
| :--- | :--- | :--- | :---: |
| **A** | `@` | `75.2.60.5` | 🟠 Proxied |
| **CNAME** | `www` | `juicevibeonline.netlify.app` | 🟠 Proxied |
| **CNAME** | `admin` | `juicevibeonline-admin.netlify.app` | 🟠 Proxied |
| **CNAME** | `api` | `juice-vibeapi.up.railway.app` | 🟠 Proxied |

---
*Specification guide updated for production release.*
