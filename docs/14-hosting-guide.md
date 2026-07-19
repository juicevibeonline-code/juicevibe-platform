# 14. Comprehensive Hosting Guide & Cost Analysis
**System:** Juice Vibe Digital Platform  
**Document Version:** 3.0.0-PROD  
**Author:** Dulanjaya Lakruwan  
**Date:** July 19, 2026  

---

## 1. Hosting Options & Cost Matrix

To accommodate Juice Vibe Waskaduwa's operational budget and scaling roadmap, three production deployment options are specified:

### 1.1 Option Comparison Matrix

| Feature / Resource | Option 1: Managed Cloud (Starter Plan) | Option 2: Dedicated VPS (Self-Hosted) | Option 3: Enterprise Cloud (Scale Plan) |
| :--- | :--- | :--- | :--- |
| **Web Storefront** | Vercel Hobby ($0/mo) | DigitalOcean / Hetzner Docker | Vercel Pro ($20/mo) |
| **Admin Dashboard** | Vercel Hobby ($0/mo) | DigitalOcean / Hetzner Docker | Included in Vercel Pro |
| **Backend REST API** | Vercel Serverless / Render ($0/mo) | Docker Container on VPS | Render Web Service ($7/mo) |
| **PostgreSQL Database** | Neon.tech / Supabase Free ($0/mo) | Local PostgreSQL Container | Supabase Pro ($25/mo) |
| **Media CDN** | Cloudinary Free Tier (25 GB) | Cloudinary Free / MinIO | Cloudinary Starter ($89/mo) |
| **Monthly Cost (USD)** | **$0.00 / month** | **~$12.00 / month** | **~$32.00 / month** |
| **Monthly Cost (LKR)** | **LKR 0.00 / month** | **~LKR 3,600 / month** | **~LKR 9,600 / month** |
| **Annual Domain (.lk)** | **LKR 3,500 - 4,500 / year** | **LKR 3,500 - 4,500 / year** | **LKR 3,500 - 4,500 / year** |

---

## 2. Recommendation for Production Launch

> [!TIP]
> **Option 1 (Managed Cloud — $0/month)** is strongly recommended for project launch. It incurs zero recurring server costs, provides automatic SSL certificates, and handles up to 10,000 monthly website visits seamlessly.
