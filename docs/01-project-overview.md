# 01. Project Overview
**System:** Juice Vibe Digital Platform  
**Document Version:** 3.0.0-PROD  
**Author:** Dulanjaya Lakruwan  
**Date:** July 19, 2026  

---

## 1. Project Background & Context

**Juice Vibe Waskaduwa** is a premium tropical juice café and eatery located in Waskaduwa, near Bentota, Sri Lanka. The establishment specializes in fresh organic fruit juices, thick smoothies, lassis, specialty teas and coffees, mocktails, burgers, sandwiches, and artisanal ice cream split desserts.

To support both local walk-in customers and tourists, the business required a modernized digital infrastructure that enables:
1. **Digital Menu Browsing & Ordering**: Customers can browse the full visual catalog, filter by category or dietary needs, and order directly online.
2. **Table QR Scan Ordering**: Dine-in customers can scan QR codes on tables to trigger direct table delivery.
3. **Automated Order Dispatch**: Café staff and kitchen personnel manage incoming orders through a real-time dispatch dashboard.
4. **Local SEO Dominance**: Establishing top Google Search and Google Maps rankings for high-intent keywords in Waskaduwa and Bentota.

---

## 2. Project Scope & Deliverables

The scope of work delivered encompasses a complete full-stack web software monorepo:

### 2.1 Core Deliverables Matrix
- **Customer Storefront (`apps/web`)**: Next.js 16 storefront with real-time menu search, category filtering, cart management, dine-in table QR recognition, and Cash / Bank Transfer checkout with automated WhatsApp receipt link generation.
- **Admin Operations Dashboard (`apps/admin`)**: Next.js 16 management dashboard with real-time WebSocket order alert banners, Kanban board dispatching, Grid List sorting/CSV exporting, Table Map tracking, and catalog price management.
- **Backend API Server (`apps/api`)**: NestJS 11 REST API with JWT Passport authentication, Swagger UI documentation at `/api/docs`, Throttling rate limiters, Helmet HTTP security headers, and WebSocket gateway dispatchers.
- **Database & Data Pipeline (`packages/database`)**: PostgreSQL database with Prisma ORM schema covering Users, Customer Profiles, Menu Items, Variants, Add-Ons, Orders, Order Items, Coupons, Testimonials, Gallery Albums, and Business Settings.
- **100% Product Photography Catalog**: 35 studio-quality high-resolution PNG product photos created for every single menu item.
- **DevOps & Infrastructure Configurations**: Production Turborepo workspace configs, Docker Compose scripts, Vercel environment variable templates, and seed scripts.

---

## 3. Key Stakeholders

| Role | Organization | Responsibilities |
| :--- | :--- | :--- |
| **Client Owner** | Juice Vibe Waskaduwa | Business approval, operational usage, domain management |
| **Lead Architect & Developer** | Dulanjaya Lakruwan | Solution architecture, software development, deployment |
| **Café Staff & Cashiers** | Juice Vibe Waskaduwa | Day-to-day order processing via Admin Order Desk |
