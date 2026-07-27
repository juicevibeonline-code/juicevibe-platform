# 📄 JuiceVibe Digital Platform — Client Handover & Infrastructure Cost Summary

**Client:** Juice Vibe Waskaduwa  
**Business Email:** `juicevibeonline@gmail.com`  
**Document Version:** 1.0.0-FINAL  
**Date:** July 27, 2026  
**Prepared By:** Dulanjaya Lakruwan (Lead Architect & Systems Engineer)  

---

## 1. Executive Summary

This document serves as the official **Infrastructure Ownership, Pricing Breakdown, and Client Handover Guide** for the **JuiceVibe Digital Platform**.

The platform is engineered using modern serverless and containerized cloud architecture. All services are registered directly under the client's business email (`juicevibeonline@gmail.com`), giving **Juice Vibe Waskaduwa** 100% legal ownership, full administrative control, direct billing management, and zero vendor lock-in.

---

## 2. Infrastructure Services & Pricing Breakdown

| Infrastructure Component | Service Provider | Selected Tier | Monthly Cost (USD) | Annual Cost (USD / LKR) |
| :--- | :--- | :--- | :---: | :---: |
| **Domain Name (`juicevibes.lk`)** | **register.lk** (LK Registry) | `.lk` Commercial TLD | N/A | **LKR 3,500 – 4,500** / year (~$12.50 USD) |
| **Storefront & Admin Hosting** | **Netlify** | Starter Tier (Free) | **$0.00 / mo** | **$0.00** |
| **Backend API Container** | **Railway** | Usage-based / Hobby ($5 credit) | **~$5.00 / mo** | **~$60.00** / year |
| **PostgreSQL Database** | **Neon PostgreSQL** | Serverless Free Tier | **$0.00 / mo** | **$0.00** |
| **Media & Image CDN** | **Cloudinary** | Free Tier (25 Credits) | **$0.00 / mo** | **$0.00** |
| **DNS, SSL & DDoS Security** | **Cloudflare** | Enterprise-grade Free Tier | **$0.00 / mo** | **$0.00** |
| **TOTAL OPERATIONAL COST** | — | — | **~$5.00 / mo** | **~LKR 22,000 – 25,000** / year total |

> [!NOTE]
> All free tiers (Netlify, Neon, Cloudinary, Cloudflare) automatically scale with your traffic. You only pay for increased compute/storage as your monthly orders scale into the thousands.

---

## 3. Account Ownership Summary (`juicevibeonline@gmail.com`)

The client holds master ownership over the following provider accounts:

1. **register.lk**: Domain ownership and annual `.lk` renewals.
2. **Cloudflare**: DNS records, SSL/TLS certificates, security rules.
3. **Netlify**: Frontend web application (`juicevibes.lk`) & Admin Portal (`admin.juicevibes.lk`).
4. **Railway**: Backend NestJS container runtime (`api.juicevibes.lk`).
5. **Neon PostgreSQL**: Production database storing orders, menu items, users, and settings.
6. **Cloudinary**: High-resolution image CDN storage.
7. **GitHub**: Monorepo source code repository (`juicevibeonline-code/juicevibe-platform`).

---

## 4. Live Production Endpoints & Credentials

### 🌐 Live Application URLs
- **Public Customer Storefront**: [https://juicevibes.lk](https://juicevibes.lk) *(or temporary Netlify domain: [https://juicevibeonline.netlify.app](https://juicevibeonline.netlify.app))*
- **Admin Dispatch Console**: [https://admin.juicevibes.lk](https://admin.juicevibes.lk) *(or temporary Netlify domain: [https://juicevibeonline-admin.netlify.app/login](https://juicevibeonline-admin.netlify.app/login))*
- **Backend Core API Engine**: [https://api.juicevibes.lk/api](https://api.juicevibes.lk/api) *(or temporary Railway domain: [https://juice-vibeapi.up.railway.app/api](https://juice-vibeapi.up.railway.app/api))*
- **Swagger API Documentation**: [https://juice-vibeapi.up.railway.app/api/docs](https://juice-vibeapi.up.railway.app/api/docs)

### 🔐 Master Admin Login Credentials
- **Portal URL**: [https://juicevibeonline-admin.netlify.app/login](https://juicevibeonline-admin.netlify.app/login)
- **Security Identity (Email)**: `admin@juicevibe.com`
- **Access Token (Password)**: `Admin@123`

---

## 5. Ongoing Maintenance & Renewal Protocol

1. **Annual Domain Renewal (`register.lk`)**:
   - Renew `.lk` domain annually via [register.lk](https://register.lk) control panel using registered credit/debit card (~LKR 3,500 - 4,500/year).
2. **Monthly Infrastructure Billing (`Railway`)**:
   - Railway bills usage monthly (~$5.00/mo). Ensure an active debit/credit card is attached under **Railway Settings ➔ Billing**.
3. **Password Security**:
   - Change `admin@juicevibe.com` password after initial onboarding via Admin Console ➔ Staff Settings.

---
*Client Handover Document compiled and verified by Dulanjaya Lakruwan.*
