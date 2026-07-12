# 🚀 Juice Vibe — Vercel Deployment Guide
### Step-by-Step: Frontend + Backend on Vercel

---

> [!IMPORTANT]
> This monorepo has **3 apps** to deploy: `apps/web` (storefront), `apps/admin` (dashboard), and `apps/api` (NestJS backend). Each gets its own Vercel project.

---

## Architecture Overview

```
juice-vibe-monorepo/
├── apps/
│   ├── web/       → Vercel Project 1: juice-vibe-web.vercel.app
│   ├── admin/     → Vercel Project 2: juice-vibe-admin.vercel.app
│   └── api/       → Vercel Project 3: juice-vibe-api.vercel.app
├── packages/      → Shared (auto-built by Turborepo)
└── prisma/        → Database schema
```

---

## ⚠️ PRE-DEPLOYMENT CHECKLIST

Before deploying, make sure these are ready:

- [ ] **PostgreSQL database** hosted on [Neon.tech](https://neon.tech) or [Supabase](https://supabase.com) (NOT localhost)
- [ ] **Cloudinary account** (for image uploads) — [cloudinary.com](https://cloudinary.com)
- [ ] **GitHub repository** with this code pushed
- [ ] **Vercel account** — [vercel.com](https://vercel.com)
- [ ] Strong **JWT secrets** generated (replace defaults)

---

## STEP 1 — Set Up a Cloud PostgreSQL Database

> [!CAUTION]
> Your current `DATABASE_URL` points to `localhost:5432` — this **will NOT work** on Vercel. You MUST use a cloud database.

### Option A: Neon (Recommended — Free Tier)
1. Go to [neon.tech](https://neon.tech) → **Sign up / Log in**
2. Click **New Project** → Name it `juice-vibe`
3. Select region: **Asia Pacific (Singapore)** (closest to Sri Lanka)
4. Click **Create Project**
5. Copy the connection string — it looks like:
   ```
   postgresql://user:password@ep-xxxx.ap-southeast-1.aws.neon.tech/juice-vibe?sslmode=require
   ```
6. **Save this URL** — you'll use it in all 3 Vercel projects

### Option B: Supabase (Alternative)
1. Go to [supabase.com](https://supabase.com) → **New Project**
2. Name: `juice-vibe`, set a strong DB password
3. Region: **Southeast Asia (Singapore)**
4. Go to **Settings → Database → Connection String (URI)**
5. Copy the URI with your password inserted

---

## STEP 2 — Generate Strong JWT Secrets

Run this in PowerShell to generate secure secrets:

```powershell
# Run in your terminal
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Run it **twice** — one for `JWT_SECRET` and one for `JWT_REFRESH_SECRET`. Save both.

---

## STEP 3 — Push Code to GitHub

```powershell
# In d:\Clients\Juce-Vibes
git add .
git commit -m "chore: prepare for Vercel deployment"
git push origin main
```

> [!NOTE]
> Make sure `.env` is in your `.gitignore` (it should already be). Never commit secrets to Git.

---

## STEP 4 — Add `vercel.json` for the NestJS API

> [!IMPORTANT]
> NestJS is a Node.js server — it needs a special `vercel.json` to run as a Vercel Serverless Function.

Create the file `apps/api/vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/main.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/main.js"
    }
  ]
}
```

Also update `apps/api/package.json` to add a `vercel-build` script:

```json
"scripts": {
  "dev": "nest start --watch",
  "build": "nest build",
  "start": "node dist/main",
  "vercel-build": "nest build",
  "lint": "eslint \"{src,test}/**/*.ts\""
}
```

---

## STEP 5 — Deploy the API Backend (`apps/api`)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import Git Repository** → select your repo
3. **Configure the project:**
   - **Project Name:** `juice-vibe-api`
   - **Root Directory:** Click **Edit** → type `apps/api`
   - **Framework Preset:** `Other`
   - **Build Command:** `cd ../.. && pnpm install && pnpm --filter @juice-vibe/api build`
   - **Output Directory:** `dist`
   - **Install Command:** `pnpm install --frozen-lockfile`

4. **Add Environment Variables** (click "Add" for each):

   > [!IMPORTANT]
   > You **must** add the `ENABLE_EXPERIMENTAL_COREPACK` variable. This ensures Vercel uses the correct `pnpm` version (`9.15.9`) specified in your `package.json` to prevent package installation errors.

   | Variable | Value |
   |---|---|
   | `DATABASE_URL` | `postgresql://...` (your Neon/Supabase URL) |
   | `JWT_SECRET` | (your generated secret) |
   | `JWT_REFRESH_SECRET` | (your generated refresh secret) |
   | `JWT_ACCESS_EXPIRATION` | `15m` |
   | `JWT_REFRESH_EXPIRATION` | `7d` |
   | `PORT` | `4000` |
   | `NODE_ENV` | `production` |
   | `FRONTEND_URL` | `https://juice-vibe-web.vercel.app` |
   | `ADMIN_URL` | `https://juice-vibe-admin.vercel.app` |
   | `CLOUDINARY_CLOUD_NAME` | (your Cloudinary name) |
   | `CLOUDINARY_API_KEY` | (your Cloudinary key) |
   | `CLOUDINARY_API_SECRET` | (your Cloudinary secret) |
   | `ENABLE_EXPERIMENTAL_COREPACK` | `1` *(Critical: forces Vercel to use pnpm@9.15.9)* |

5. Click **Deploy** and wait for the build to complete
6. Note your API URL: `https://juice-vibe-api.vercel.app`

---

## STEP 6 — Run Database Migrations

After the API deploys, run Prisma migrations against the cloud DB:

```powershell
# In d:\Clients\Juce-Vibes
# First update your local .env to use the CLOUD database URL
# Then run:
pnpm db:generate
pnpm db:push
# Optional: seed initial data
pnpm db:seed
```

> [!TIP]
> You can also set up Prisma migrations to run automatically in the Vercel build command by adding `prisma migrate deploy` before `nest build`.

---

## STEP 7 — Deploy the Web Frontend (`apps/web`)

1. Go to [vercel.com/new](https://vercel.com/new)
2. **Import the same Git Repository**
3. **Configure the project:**
   - **Project Name:** `juice-vibe-web`
   - **Root Directory:** `apps/web`
   - **Framework Preset:** `Next.js` (auto-detected)
   - **Build Command:** `cd ../.. && pnpm install && pnpm --filter @juice-vibe/web build`
   - **Install Command:** `pnpm install --frozen-lockfile`

4. **Add Environment Variables:**

   > [!IMPORTANT]
   > You **must** add the `ENABLE_EXPERIMENTAL_COREPACK` variable. This ensures Vercel uses the correct `pnpm` version (`9.15.9`) specified in your `package.json` to prevent package installation errors.

   | Variable | Value |
   |---|---|
   | `NEXT_PUBLIC_API_URL` | `https://juice-vibe-api.vercel.app` |
   | `NODE_ENV` | `production` |
   | `ENABLE_EXPERIMENTAL_COREPACK` | `1` *(Critical: forces Vercel to use pnpm@9.15.9)* |

5. Click **Deploy**
6. Your storefront URL: `https://juice-vibe-web.vercel.app`

---

## STEP 8 — Deploy the Admin Panel (`apps/admin`)

1. Go to [vercel.com/new](https://vercel.com/new)
2. **Import the same Git Repository** (3rd time)
3. **Configure the project:**
   - **Project Name:** `juice-vibe-admin`
   - **Root Directory:** `apps/admin`
   - **Framework Preset:** `Next.js` (auto-detected)
   - **Build Command:** `cd ../.. && pnpm install && pnpm --filter @juice-vibe/admin build`
   - **Install Command:** `pnpm install --frozen-lockfile`

4. **Add Environment Variables:**

   > [!IMPORTANT]
   > You **must** add the `ENABLE_EXPERIMENTAL_COREPACK` variable. This ensures Vercel uses the correct `pnpm` version (`9.15.9`) specified in your `package.json` to prevent package installation errors.

   | Variable | Value |
   |---|---|
   | `NEXT_PUBLIC_API_URL` | `https://juice-vibe-api.vercel.app` |
   | `NODE_ENV` | `production` |
   | `ENABLE_EXPERIMENTAL_COREPACK` | `1` *(Critical: forces Vercel to use pnpm@9.15.9)* |

5. Click **Deploy**
6. Your admin URL: `https://juice-vibe-admin.vercel.app`

---

## STEP 9 — Update API CORS with Real URLs

After all 3 projects deploy, update the API's environment variables on Vercel:

Go to **Vercel → juice-vibe-api → Settings → Environment Variables** and update:
- `FRONTEND_URL` → `https://juice-vibe-web.vercel.app`
- `ADMIN_URL` → `https://juice-vibe-admin.vercel.app`

Then go to **Deployments → Redeploy** to apply the changes.

---

## STEP 10 — Custom Domains (Optional but Professional)

If you have a domain like `juicevibe.lk`:
1. Go to **Vercel → juice-vibe-web → Settings → Domains**
2. Add `juicevibe.lk` and `www.juicevibe.lk`
3. Update your domain registrar's DNS records as Vercel instructs
4. Similarly add `admin.juicevibe.lk` for the admin panel
5. Add `api.juicevibe.lk` for the API

---

## 🔍 Troubleshooting

| Issue | Solution |
|---|---|
| `Module not found: @juice-vibe/...` | Set Root Directory to the app folder, not monorepo root |
| `CORS error` | Update `FRONTEND_URL` and `ADMIN_URL` env vars in API project |
| `PrismaClientInitializationError` | Check `DATABASE_URL` env var is set correctly with `?sslmode=require` |
| `Build timeout` | Add `pnpm install --frozen-lockfile` as Install Command |
| `Function timeout` | NestJS cold starts can be slow — consider Railway for the API instead |

---

## ✅ Final URLs After Deployment

| App | URL |
|---|---|
| 🌐 Customer Storefront | `https://juice-vibe-web.vercel.app` |
| 🎛️ Admin Dashboard | `https://juice-vibe-admin.vercel.app` |
| 🔌 Backend API | `https://juice-vibe-api.vercel.app` |
| 📚 API Docs (Swagger) | `https://juice-vibe-api.vercel.app/api/docs` |

