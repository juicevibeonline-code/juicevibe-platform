# 05. Production Deployment Specification Guide
**System:** Juice Vibe Digital Platform  
**Document Version:** 3.0.0-PROD  
**Author:** Dulanjaya Lakruwan  
**Date:** July 19, 2026  

---

## 1. Overview

This document provides exact step-by-step instructions for deploying the **Juice Vibe Monorepo** (`apps/web`, `apps/admin`, `apps/api`) to Vercel Serverless or a Docker Containerized VPS.

---

## 2. Vercel Serverless Deployment Architecture

The monorepo contains 3 deployable applications. Each app is created as an isolated Vercel project connected to the same GitHub repository branch (`main`).

```
GitHub Repository: main
├── Project 1: juice-vibe-api   (Root Directory: apps/api)
├── Project 2: juice-vibe-web   (Root Directory: apps/web)
└── Project 3: juice-vibe-admin (Root Directory: apps/admin)
```

### 2.1 Critical Build Requirement: Corepack Version Enforcer
To prevent PNPM package manager version mismatches during Vercel builds, you **MUST** configure the environment variable `ENABLE_EXPERIMENTAL_COREPACK=1` on all 3 Vercel projects. This instructs Vercel to honor `packageManager: pnpm@10.34.5` from `package.json`.

---

## 3. Project 1: Deploying the Backend API (`apps/api`)

1. Log in to [vercel.com](https://vercel.com) ➔ Click **Add New... ➔ Project**.
2. Import the Git repository.
3. Configure settings:
   - **Project Name**: `juice-vibe-api`
   - **Root Directory**: `apps/api`
   - **Framework Preset**: `Other`
   - **Build Command**: `cd ../.. && pnpm install && pnpm --filter @juice-vibe/api build`
   - **Output Directory**: `dist`
   - **Install Command**: `pnpm install --frozen-lockfile`
4. Add Environment Variables:

| Variable Name | Production Value Placeholder | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql://[USER]:[PASS]@[HOST]/[DB]?sslmode=require` | Managed Neon/Supabase PostgreSQL connection string |
| `JWT_SECRET` | `[REDACTED_SECURE_COMMUNICATION]` | 64-char random hash key for access tokens |
| `JWT_REFRESH_SECRET` | `[REDACTED_SECURE_COMMUNICATION]` | 64-char random hash key for refresh tokens |
| `JWT_ACCESS_EXPIRATION` | `15m` | Access token lifespan |
| `JWT_REFRESH_EXPIRATION` | `7d` | Refresh token lifespan |
| `PORT` | `4000` | Service port |
| `NODE_ENV` | `production` | Node runtime environment |
| `FRONTEND_URL` | `https://juicevibe.lk` | Storefront CORS allowed origin |
| `ADMIN_URL` | `https://admin.juicevibe.lk` | Admin CORS allowed origin |
| `CLOUDINARY_CLOUD_NAME` | `[REDACTED_SECURE_COMMUNICATION]` | Cloudinary cloud account name |
| `CLOUDINARY_API_KEY` | `[REDACTED_SECURE_COMMUNICATION]` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | `[REDACTED_SECURE_COMMUNICATION]` | Cloudinary API secret |
| `ENABLE_EXPERIMENTAL_COREPACK` | `1` | Forces Vercel Corepack PNPM lock |

5. Click **Deploy**. Record the API domain (e.g. `https://api.juicevibe.lk`).

---

## 4. Project 2: Deploying the Web Storefront (`apps/web`)

1. Import the same repository ➔ Select Root Directory: `apps/web`.
2. Settings:
   - **Project Name**: `juice-vibe-web`
   - **Framework Preset**: `Next.js`
   - **Build Command**: `cd ../.. && pnpm install && pnpm --filter @juice-vibe/web build`
   - **Install Command**: `pnpm install --frozen-lockfile`
3. Environment Variables:

| Variable Name | Value |
| :--- | :--- |
| `NEXT_PUBLIC_API_URL` | `https://api.juicevibe.lk` |
| `NODE_ENV` | `production` |
| `ENABLE_EXPERIMENTAL_COREPACK` | `1` |

4. Click **Deploy**.

---

## 5. Project 3: Deploying the Admin Panel (`apps/admin`)

1. Import the repository ➔ Select Root Directory: `apps/admin`.
2. Settings:
   - **Project Name**: `juice-vibe-admin`
   - **Framework Preset**: `Next.js`
   - **Build Command**: `cd ../.. && pnpm install && pnpm --filter @juice-vibe/admin build`
   - **Install Command**: `pnpm install --frozen-lockfile`
3. Environment Variables:

| Variable Name | Value |
| :--- | :--- |
| `NEXT_PUBLIC_API_URL` | `https://api.juicevibe.lk` |
| `NODE_ENV` | `production` |
| `ENABLE_EXPERIMENTAL_COREPACK` | `1` |

4. Click **Deploy**.

---

## 6. Docker VPS Alternative Deployment

To deploy on a dedicated Linux VPS (Hetzner / DigitalOcean) using Docker Compose:

1. Clone repository to `/var/www/juice-vibe`.
2. Create `/var/www/juice-vibe/.env` with production keys.
3. Run container orchestration:
   ```bash
   docker-compose up -d --build
   ```
4. Verify containers:
   - `juice-vibe-postgres` (Port 5432)
   - `juice-vibe-api` (Port 4000)
   - `juice-vibe-web` (Port 3000)
   - `juice-vibe-admin` (Port 3001)
