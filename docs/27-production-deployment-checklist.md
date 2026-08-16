# 🚀 Juice Vibe Production Deployment TODO Checklist

> **Target System:** Juice Vibe Platform (Storefront + Admin Panel + NestJS API + Neon PostgreSQL)  
> **Production Domains:** `juicevibe.lk` | `admin.juicevibe.lk` | `api.juicevibe.lk`  
> **Status:** Active Deployment Operations  

---

## 📅 Phase 01 – Project Final Review

### Backend (NestJS)
- [x] Production build setup (`turbo build`)
- [x] All API endpoints defined and structured
- [x] Environment variables configured (`.env.example` template ready)
- [x] JWT Secret security configured for production
- [x] CORS configured for production domains (`juicevibe.lk`, `admin.juicevibe.lk`)
- [x] Rate limiting enabled
- [x] Error handling verified
- [x] Health check endpoint working (`/api/health`)
- [x] API documentation verified (Swagger / OpenAPI docs ready)

---

### Frontend (Next.js Website)
- [x] Production build setup
- [x] Responsive design on Mobile, Tablet & Desktop
- [x] All core pages working correctly (Home, Menu, Contact, QR scan)
- [x] Images optimized (Next.js Image optimization & WebP formats)
- [x] SEO metadata configured (Meta titles, descriptions, Schema.org)
- [x] Open Graph metadata configured (OG images & social sharing tags)
- [x] Favicon added
- [x] `robots.txt` created
- [x] `sitemap.xml` generated
- [x] Contact form logic & validation tested
- [x] Performance & Web Vitals optimized

---

### Admin Panel
- [x] Login & JWT authentication working
- [x] Logout functionality verified
- [x] Dashboard UI & metrics verified
- [x] CRUD operations tested (Menu items, Orders, Stock)
- [x] Image upload functionality tested
- [x] Role-Based Access Control (RBAC) authorization verified
- [x] Error handling & toast notifications verified

---

### Database (Neon PostgreSQL)
- [x] Prisma Schema defined and compiled
- [x] Migrations executed / DB schema prepared
- [x] Seed data script verified (`pnpm db:seed`)
- [x] Database connection pooling configured
- [ ] Neon PostgreSQL Production instance created
- [ ] Production database connection verified

---

## 📅 Phase 02 – Client Meeting Preparation

- [ ] Schedule meeting with client
- [x] Prepare Authorization Letter ([26-domain-registration-letter-register-lk.md](file:///d:/Clients/Juice-Vibe-Pro/juicevibe-platform/docs/26-domain-registration-letter-register-lk.md))
- [ ] Get client’s NIC copy (Front & Back scan)
- [ ] Confirm client email address
- [ ] Confirm client phone number
- [ ] Confirm official business name ("Juice Vibe")
- [ ] Confirm registered business address
- [ ] Prepare domain payment method (Credit/Debit Card)

---

## 📅 Phase 03 – Register.lk Domain Registration (🟢 COMPLETED)

- [x] Login to Register.lk portal
- [x] Search domain availability (`juicevibe.lk`)
- [x] Add domain to cart
- [x] Upload signed Authorization Letter
- [x] Upload owner's NIC copy
- [x] Complete payment transaction (Rs 3,700.00 — Confirmed 2026-08-14)
- [x] Wait for LK Domain Registry approval notification (Approved & Queued 2026-08-14)

---

## 📅 Phase 04 – Configure Vercel

### Website Domain: `juicevibe.lk` / `www.juicevibe.lk`
### Admin Panel Domain: `admin.juicevibe.lk`

- [ ] Import `apps/web` project to Vercel
- [ ] Import `apps/admin` project to Vercel
- [ ] Add custom domain `juicevibe.lk` and `www.juicevibe.lk` to Storefront
- [ ] Add custom domain `admin.juicevibe.lk` to Admin Panel
- [ ] Verify DNS records in Vercel
- [ ] Enable automatic SSL certificates (HTTPS)
- [ ] Verify successful production deployments

---

## 📅 Phase 05 – Configure Railway

### API Domain: `api.juicevibe.lk`

- [ ] Create Railway Project & link GitHub repo (`apps/api`)
- [ ] Set environment variables (`DATABASE_URL`, `JWT_SECRET`, etc.)
- [ ] Add custom domain `api.juicevibe.lk` in Railway domain settings
- [ ] Configure CNAME DNS record in domain manager
- [ ] Verify SSL certificate issued by Railway
- [ ] Verify API production deployment & health endpoint

---

## 📅 Phase 06 – Configure Register.lk DNS (🟢 CONFIGURATION COMPLETE)

| Record Type | Subdomain / Name | Destination / Target | Purpose | Status |
| :--- | :--- | :--- | :--- | :---: |
| **A** | `@` (`juicevibe.lk.`) | `76.76.21.21` | Points `juicevibe.lk` to Vercel | 🟢 Configured |
| **CNAME** | `www` (`www.juicevibe.lk.`) | `cname.vercel-dns.com` | Redirects `www.juicevibe.lk` to root domain | 🟢 Configured |
| **CNAME** | `admin` (`admin.juicevibe.lk.`) | `cname.vercel-dns.com` | Points `admin.juicevibe.lk` to Vercel Admin Panel | 🟢 Configured |
| **CNAME** | `api` (`api.juicevibe.lk.`) | `juicevibe-api-production.up.railway.app` | Points `api.juicevibe.lk` to Railway NestJS Backend | 🟢 Configured |
| **TXT** | `_railway-verify.api` | `railway-verify=0dd7ca6ed8c...` | Railway Custom Domain Ownership Verification | 🟢 Configured |

- [x] Add Root A Record (`@` ➔ `76.76.21.21`)
- [x] Add CNAME Record for `www` (`cname.vercel-dns.com`)
- [x] Add CNAME Record for `admin` (`cname.vercel-dns.com`)
- [x] Add CNAME Record for `api` (`juicevibe-api-production.up.railway.app`)
- [x] Add TXT Record for Railway Domain Verification
- [ ] Save Changes in Register.lk Zone Manager
- [ ] Wait for DNS propagation (1–24 hours / typical 1–2 hrs in Sri Lanka)
- [ ] Verify all live DNS records using `nslookup` / `dig`

---

## 📅 Phase 07 – Environment Variables

### Backend (`apps/api`)
- [ ] `DATABASE_URL` (Neon PostgreSQL Connection String)
- [ ] `JWT_SECRET` (Strong random 64-char key)
- [ ] `FRONTEND_URL` (`https://juicevibe.lk`)
- [ ] `ADMIN_URL` (`https://admin.juicevibe.lk`)
- [ ] `PORT` (`3000` / dynamic cloud port)

### Website (`apps/web`)
- [ ] `NEXT_PUBLIC_API_URL` (`https://api.juicevibe.lk`)

### Admin Panel (`apps/admin`)
- [ ] `NEXT_PUBLIC_API_URL` (`https://api.juicevibe.lk`)

---

## 📅 Phase 08 – Production Deployment

### Railway (Backend API)
- [ ] Trigger deployment from `main` branch
- [ ] Inspect deployment logs for clean startup
- [ ] Test live API endpoints (`https://api.juicevibe.lk/api/health`)

### Vercel (Storefront Website)
- [ ] Trigger deployment from `main` branch
- [ ] Verify build logs pass cleanly
- [ ] Verify domain routing to `https://juicevibe.lk`

### Vercel (Admin Panel)
- [ ] Trigger deployment from `main` branch
- [ ] Verify build logs pass cleanly
- [ ] Verify domain routing to `https://admin.juicevibe.lk`

---

## 📅 Phase 09 – Production Testing

### Website (`https://juicevibe.lk`)
- [ ] Homepage rendering & visual layout
- [ ] Interactive Menu page & category filtering
- [ ] Photo Gallery section
- [ ] Contact details & inquiry form submission
- [ ] Google Maps embed loading
- [ ] Direct Call button action
- [ ] WhatsApp order/inquiry button action
- [ ] All images loading without broken links
- [ ] QR code scan order flow verification

### Admin Panel (`https://admin.juicevibe.lk`)
- [ ] Admin Login with production credentials
- [ ] Operations Dashboard metrics display
- [ ] Add new Menu Item (Title, Price, Category, Image)
- [ ] Edit existing Menu Item
- [ ] Delete / archive Menu Item
- [ ] Image upload to cloud storage
- [ ] Order desk status changes (Pending ➔ Preparing ➔ Completed)
- [ ] Logout & session invalidation

### Backend API (`https://api.juicevibe.lk`)
- [ ] Database connection stability under load
- [ ] JWT Authentication & token refresh flow
- [ ] RBAC Guard enforcement (Admin vs Cashier vs Kitchen)
- [ ] CRUD APIs response latency (<200ms)
- [ ] Standardized JSON error responses

---

## 📅 Phase 10 – Security Verification

- [ ] HTTPS enforced on all domains (HSTS headers)
- [ ] Valid SSL certificates active (`juicevibe.lk`, `admin.juicevibe.lk`, `api.juicevibe.lk`)
- [ ] Security headers configured (X-Frame-Options, CSP, X-Content-Type-Options)
- [ ] CORS policies restricted to production origins only
- [ ] Strong JWT Secret in use
- [ ] Environment variables secured in deployment dashboards (no secrets in git)

---

## 📅 Phase 11 – SEO & Analytics Setup

- [ ] Register domain in Google Search Console
- [ ] Configure Google Analytics (GA4) property
- [ ] Register in Bing Webmaster Tools
- [ ] Submit sitemap (`https://juicevibe.lk/sitemap.xml`)
- [ ] Verify `https://juicevibe.lk/robots.txt` accessibility
- [ ] Submit URL inspection request for key landing pages

---

## 📅 Phase 12 – Final Client Handover

- [ ] Storefront Website live on `https://juicevibe.lk`
- [ ] Admin Panel live on `https://admin.juicevibe.lk`
- [ ] Backend API live on `https://api.juicevibe.lk`
- [ ] SSL & security verified across all endpoints
- [ ] Domain ownership registered to client name
- [ ] Client formal acceptance & sign-off received
- [ ] Client operational training session completed
- [ ] Complete documentation package delivered ([docs/README.md](file:///d:/Clients/Juice-Vibe-Pro/juicevibe-platform/docs/README.md))
- [ ] Backup & recovery strategy explained to client
- [ ] Post-launch maintenance plan agreed upon

---

## 🌐 Final Production Endpoints Summary

| Service | Technology | Hosting Provider | Live URL |
| :--- | :--- | :--- | :--- |
| **Storefront Web App** | Next.js 16 | Vercel | [https://juicevibe.lk](https://juicevibe.lk) |
| **Admin Dashboard** | Next.js 16 | Vercel | [https://admin.juicevibe.lk](https://admin.juicevibe.lk) |
| **Backend REST & WS API** | NestJS 11 + Socket.io | Railway | [https://api.juicevibe.lk](https://api.juicevibe.lk) |
| **Database** | PostgreSQL | Neon PostgreSQL | Cloud Managed Instance |

---

## 📊 Project Readiness Status

- [x] **System Architecture & Code Base**: Ready for Production (`100%`)
- [x] **Documentation Package**: Complete & Enterprise Ready ([docs/README.md](file:///d:/Clients/Juice-Vibe-Pro/juicevibe-platform/docs/README.md))
- [ ] **Client Legal / Domain Registration**: Pending NIC & Letter Signing (Phase 02 / 03)
- [ ] **Cloud Provisioning & DNS Binding**: Pending Domain Approval (Phase 04 – 08)
