# 07. Production Pre-Flight Inspection Checklist
**System:** Juice Vibe Digital Platform  
**Document Version:** 3.0.0-PROD  
**Author:** Dulanjaya Lakruwan  
**Date:** July 19, 2026  

---

## 1. Quality & Technical Inspection Checklist

Complete this checklist prior to flipping production DNS records to `juicevibe.lk`:

### 1.1 Type Safety & Monorepo Build Integrity
- [x] Run `npx turbo typecheck` ➔ Confirm 0 TypeScript compilation errors.
- [x] Run `npx turbo build` ➔ Confirm clean Turborepo static builds for all packages and apps.

### 1.2 Security & Credential Protection
- [x] Change initial Admin password from default `Admin@123` to client's custom private password.
- [x] Ensure `JWT_SECRET` and `JWT_REFRESH_SECRET` on Vercel are newly generated random 64-character keys.
- [x] Verify `.env` file is in `.gitignore` and zero credentials exist in public Git history.
- [x] Ensure `DATABASE_URL` uses `?sslmode=require` for cloud PostgreSQL connections.

### 1.3 Database & Catalog Integrity
- [x] Run `pnpm db:push` against the cloud database.
- [x] Run `pnpm db:seed` to populate all 35 menu items, category links, add-ons, test reviews, and business settings.
- [x] Confirm 100% of 35 menu items possess valid high-resolution PNG product photography paths.

### 1.4 API Security & CORS Protection
- [x] Update Vercel API `FRONTEND_URL` to `https://juicevibe.lk`.
- [x] Update Vercel API `ADMIN_URL` to `https://admin.juicevibe.lk`.
- [x] Verify `@nestjs/throttler` rate limiting is active (protects against brute-force attacks).
- [x] Confirm Swagger UI documentation is accessible at `https://api.juicevibe.lk/api/docs`.

### 1.5 Client Operations Verification
- [x] Perform a test order on `apps/web` selecting **Online Bank Transfer** ➔ Verify WhatsApp receipt button generates correct text to `+94718435876`.
- [x] Verify new order alert banner flashes live on `apps/admin` Order Desk via WebSocket connection.
- [x] Verify status advance button updates order status smoothly (`Pending` ➔ `Confirmed` ➔ `Preparing` ➔ `Ready` ➔ `Completed`).
