# 🛡️ Client Environment Handover & Production Checklist
**Project:** Juice Vibe Digital Platform  
**Client:** Juice Vibe Waskaduwa, Sri Lanka  
**Developer:** Dulanjaya Lakruwan  
**Date:** July 19, 2026  

---

## 📌 Top Critical Items to Pay Attention To (අවධානය යොමුකළ යුතු කරුණු)

When transferring this project to the client's production environment, make sure to execute and double-check these 7 crucial areas:

---

### 1. 🔐 Security & Password Changes (ආරක්ෂාව)
- [ ] **Change Admin Password**: Log in with `admin@juicevibe.com` / `Admin@123` on first launch and immediately change the password via **Admin Settings ➔ Profile**.
- [ ] **Production JWT Secrets**: Generate brand-new 64-character random string keys for `JWT_SECRET` and `JWT_REFRESH_SECRET`. Never use development keys in production.
- [ ] **Keep `.env` Secrets Private**: Ensure `.env` is listed in `.gitignore` and never pushed to GitHub. Add all credentials securely via Vercel's Environment Variables dashboard.

---

### 2. 🗄️ Production Cloud Database (Neon / Supabase)
- [ ] **SSL Required**: Ensure `DATABASE_URL` ends with `?sslmode=require` (e.g., `postgresql://user:pass@ep-xxx.neon.tech/juicevibe?sslmode=require`).
- [ ] **Database Migration & Seeding**:
  ```bash
  # Push database tables to cloud DB
  pnpm db:push
  # Seed catalog with 35 menu items & product photos
  pnpm db:seed
  ```
- [ ] **Automated Backups**: Enable Neon / Supabase automatic daily database snapshots.

---

### 3. 🌐 Domain & CORS Sync (Domain සහ CORS Matching)
When connecting custom domains (e.g., `juicevibe.lk`):

- [ ] **API CORS Alignment**: On Vercel for `juice-vibe-api`, update Environment Variables:
  - `FRONTEND_URL` ➔ `https://juicevibe.lk`
  - `ADMIN_URL` ➔ `https://admin.juicevibe.lk`
- [ ] **Web & Admin API Connection**:
  - `NEXT_PUBLIC_API_URL` ➔ `https://api.juicevibe.lk`
- [ ] **Redeploy**: Click **Redeploy** on Vercel for all 3 projects after updating environment variables.

---

### 4. 📲 WhatsApp & Phone Number Verification
- [ ] **WhatsApp Receipt Link**: Verify that the business phone number in `apps/web/src/app/checkout/page.tsx` and admin settings is set to the client's active WhatsApp number (`+94718435876`).
- [ ] **Test Order Notification**: Place a test order using "Online Bank Transfer" and confirm that clicking "Send WhatsApp Receipt" opens a pre-formatted message to the client's phone.

---

### 5. 🖼️ Cloudinary Media Upload Test
- [ ] **Test Image Upload**: Log into Admin ➔ Go to **Gallery Management** ➔ Upload a test photo.
- [ ] Verify the image uploads to Cloudinary and renders clearly without CORS or authorization errors.

---

### 6. 🧑‍🍳 Client Staff Training & Demo Walkthrough
Spend 15–20 minutes with the client or café manager to demonstrate:
1. **Order Desk Operations**:
   - How to view incoming orders on **Kanban**, **Grid List**, and **Table Map**.
   - How to click **Advance** to move orders from `Pending` ➔ `Preparing` ➔ `Ready` ➔ `Completed`.
   - How to click **Mark Paid** for Bank Transfer orders.
2. **Menu & Price Adjustments**:
   - How to change item prices, edit descriptions, or toggle `Popular` badges.

---

### 7. 📑 Legal Sign-off & Balance Payment
- [ ] **Client Sign-off**: Print or share [docs/client_delivery_handbook.md](file:///d:/Clients/Juce-Vibes/docs/client_delivery_handbook.md) and get the acceptance section signed.
- [ ] **Final Balance Collection**: Collect the outstanding final balance payment of **LKR 20,000.00**.
- [ ] **Handover Source Code**: Hand over Git repository access and project credentials to the client.

---

## 📋 Quick Production Handover Summary Table

| Checklist Item | Tool / Platform | Action |
| :--- | :--- | :--- |
| Admin Password Change | Admin Portal | Change `Admin@123` immediately |
| Cloud Database Setup | Neon.tech / Supabase | Run `pnpm db:push` & `pnpm db:seed` |
| Vercel Env Vars & Corepack | Vercel Dashboard | Add `ENABLE_EXPERIMENTAL_COREPACK=1` |
| Domain DNS Records | LK Domain Registry | Point `juicevibe.lk` to Vercel |
| Staff Order Desk Demo | Admin Portal (`:3001`) | Train client on Kanban & Table Map |
| Final Balance Payment | Bank Transfer / Cash | Collect remaining **LKR 20,000.00** |
