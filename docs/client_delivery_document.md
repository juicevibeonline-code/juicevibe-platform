# Juice Vibe Waskaduwa — Project Delivery Document
**Client:** Juice Vibe Waskaduwa, Bentota, Sri Lanka
**Prepared by:** Dulanjaya Lakruwan 
**Date:** July 12, 2026
**Version:** 1.0 — Initial Delivery

---

## 🎉 Project Overview

We are pleased to deliver the **Juice Vibe Digital Platform** — a complete, full-stack web solution for your tropical juice café. The platform includes a premium customer-facing website, a powerful admin dashboard, and a secure backend API, all designed to reflect the vibrant energy of your brand.

---

## 🌐 Live Demo URLs

> Access your platform right now using the links below:

| Platform | URL | Purpose |
|---|---|---|
| **Customer Website** | https://juice-vibe-waskaduwa-web.vercel.app/ | Public-facing storefront for your customers |
| **Admin Dashboard** | https://juice-vibe-waskaduwa-admin.vercel.app/ | Internal management portal for staff |
| **API & Docs** | https://juice-vibe-waskaduwa-api.vercel.app/api/docs | Backend API documentation (Swagger) |

> Custom domains (e.g., `juicevibe.lk`) can be connected at any time via the Vercel dashboard.

---

## ✅ What's Included

### 🛍️ Customer Website (`apps/web`)
A gorgeous, mobile-friendly customer storefront built with Next.js 16:

- **Homepage** — Hero section, featured products, call-to-action
- **Menu Page** — Full juice & food menu with categories, filters, and search
- **Gallery** — Beautiful image gallery showcasing your café and products
- **Cart System** — Dynamic shopping cart with quantity management (persists on refresh)
- **Premium Design** — Smooth animations (Framer Motion), tropical color palette, modern typography

### 🎛️ Admin Dashboard (`apps/admin`)
A professional management portal for your team:

- **Dashboard Overview** — Sales summaries, order counts, revenue KPIs
- **Orders Management** — View, update, and track all incoming orders
- **Menu Management** — Add/edit/delete menu items, categories, variants, and add-ons
- **Gallery Management** — Upload and manage gallery photos
- **Settings** — Manage tax rates, delivery fees, business hours, and more
- **Role-Based Access** — Different access levels for Admin, Manager, Cashier, Kitchen, and Editor roles

### 🔌 Backend API (`apps/api`)
A powerful, secure REST API built with NestJS 11:

- **Authentication** — Secure JWT-based login with access & refresh tokens
- **Rate Limiting** — Prevents abuse with request throttling
- **Full CRUD APIs** — Menu items, orders, gallery, analytics, settings, testimonials
- **Swagger Docs** — Interactive API documentation at `/api/docs`
- **Security** — Helmet.js security headers, input validation, CORS protection

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16.2, React 19, Tailwind CSS v4 |
| Animations | Framer Motion |
| Backend | NestJS 11, Node.js |
| Database | PostgreSQL + Prisma ORM |
| Authentication | Passport.js + JWT |
| Image Storage | Cloudinary |
| Deployment | Vercel (Serverless) |
| Monorepo | Turborepo + pnpm workspaces |

---

## 🔐 Access Credentials

> [!CAUTION]
> Keep this section strictly confidential. Do not share login credentials over public channels.

### Admin Panel Login
| Field | Value |
|---|---|
| URL | https://juice-vibe-waskaduwa-admin.vercel.app/ |
| Admin Email | `admin@juicevibe.com` |
| Admin Password | `Admin@123` |

> [!TIP]
> Change the admin password immediately after first login via the Settings page.

### Database (For Developer Reference)
| Field | Value |
|---|---|
| Provider | Neon.tech / Supabase PostgreSQL |
| Project Name | `juice-vibe` |
| Access | Via Vercel Environment Variables (secure) |

---

## 📋 Deployment Checklist (Handover Status)

| Task | Status |
|---|---|
| ✅ Customer website built | Complete |
| ✅ Admin dashboard built | Complete |
| ✅ Backend API built | Complete |
| ✅ Database schema designed | Complete |
| ✅ Cloud database provisioned | Complete (Neon PostgreSQL) |
| ✅ Vercel deployment — API | Complete |
| ✅ Vercel deployment — Web | Complete |
| ✅ Vercel deployment — Admin | Complete |
| ✅ Database seeded with initial data | Complete |
| ⏳ Custom domain connected | Optional |
| ✅ Cloudinary image upload configured | Complete |

---

## 🚀 Next Steps (Recommended)

1. **Change admin password** — Update from the default `Admin@123` via the admin Settings page.
2. **Custom domain** (optional) — Connect your domain (e.g., `juicevibe.lk`) through the Vercel dashboard.
3. **Review content** — Let us know if any colors, text, or layout needs adjustment.

---

## 📞 Support & Maintenance

| Type | Details |
|---|---|
| **Bug Fixes** | Included for 30 days after launch |
| **Content Updates** | Via the admin panel (self-service) |
| **Technical Support** | Contact [devlakruwan@gmail.com / WhatsApp-0714089493] |
| **Hosting Cost** | Vercel Free Tier ($0/month for this traffic level) |
| **Database Cost** | Neon Free Tier ($0/month up to 0.5 GB) |

---

## 📬 Project Delivery Sign-Off

By proceeding to use the delivered platform, the client acknowledges receipt of the described deliverables.

| | Client | Developer |
|---|---|---|
| **Name** | | |
| **Signature** | | |
| **Date** | | |

---

*Thank you for choosing us to build your digital presence. We look forward to seeing Juice Vibe Waskaduwa thrive online! 🥭🧃*

---
*Document prepared for: Juice Vibe Waskaduwa, Bentota, Sri Lanka*
*Contact: [devlakruwan@gmail.com / WhatsApp-0714089493]*
