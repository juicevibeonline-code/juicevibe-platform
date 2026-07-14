# Implementation Plan — Fix All TODOs

## Overview
Fix all 18 identified gaps across the Juice Vibe platform, in order of priority. Items 1–6 (high priority) first, then medium, then low.

---

## 🔴 Phase 1 — High Priority (Admin Gaps & Mock Data)

---

### Item 1 — Admin Table/QR Code Management UI

#### [NEW] `apps/admin/src/app/dashboard/tables/page.tsx`
- List all existing tables (number, ID, created date)
- "Create Table" form (number input)
- Each table row shows an "Print QR" button — opens a modal with the `qrCodeUrl` base64 image and a browser print button
- Delete table button (calls `DELETE /api/tables/:id` — we'll add this endpoint)

#### [MODIFY] `apps/api/src/table/table.controller.ts`
- Add `DELETE /:id` endpoint (Admin/Manager only)

#### [MODIFY] `apps/api/src/table/table.service.ts`
- Add `deleteTable(id)` method

#### [MODIFY] `apps/admin/src/components/layout/sidebar.tsx`
- Add "Tables & QR" nav item (`QrCode` icon → `/dashboard/tables`)

#### [MODIFY] `apps/admin/src/app/dashboard/layout.tsx`
- Add command palette entry for Tables page

---

### Item 2 — Admin Coupon Management UI

#### [NEW] `apps/admin/src/app/dashboard/coupons/page.tsx`
- List all coupons (code, type, value, uses, expiry, active status)
- "Create Coupon" modal form: code, type (%), value, minOrder, maxDiscount, usageLimit, expiresAt
- Toggle active/inactive, delete coupon buttons

#### [MODIFY] `packages/services/src/coupon-service.ts` [NEW file]
- `getCoupons()`, `createCoupon()`, `deleteCoupon()` — wrapping existing API endpoints

#### [MODIFY] `apps/admin/src/components/layout/sidebar.tsx`
- Add "Coupons" nav item (`Tag` icon → `/dashboard/coupons`)

---

### Item 3 — Inventory Page: Wire to Real Database

The `InventoryItem` model already exists in the Prisma schema. We just need the API module.

#### [NEW] `apps/api/src/inventory/inventory.controller.ts`
- `GET /inventory` — list all items (Admin/Manager)
- `POST /inventory` — create item (Admin/Manager)
- `PATCH /inventory/:id` — update quantity/details
- `DELETE /inventory/:id` — delete item

#### [NEW] `apps/api/src/inventory/inventory.service.ts`
- Prisma CRUD for `InventoryItem`

#### [NEW] `apps/api/src/inventory/inventory.module.ts`

#### [MODIFY] `apps/api/src/app.module.ts`
- Register `InventoryModule`

#### [MODIFY] `apps/admin/src/app/dashboard/inventory/page.tsx`
- Replace hardcoded `useState` array with `useQuery(() => inventoryService.getItems())`
- Wire create/edit/delete mutations

#### [NEW] `packages/services/src/inventory-service.ts`
- `getItems()`, `createItem()`, `updateItem()`, `deleteItem()`

---

### Item 4 — Employees Page: Wire to Real Database

The `Employee` model + `User` model already exist in Prisma with all needed fields.

#### [NEW] `apps/api/src/employees/employees.controller.ts`
- `GET /employees` — list all staff users (Admin/Manager)
- `POST /employees` — create employee + user account
- `PATCH /employees/:id` — update employee record
- `DELETE /employees/:id` — deactivate

#### [NEW] `apps/api/src/employees/employees.service.ts`
- Prisma queries joining `Employee` + `User`

#### [NEW] `apps/api/src/employees/employees.module.ts`

#### [MODIFY] `apps/api/src/app.module.ts`
- Register `EmployeesModule`

#### [MODIFY] `apps/admin/src/app/dashboard/employees/page.tsx`
- Replace hardcoded array with live API queries

#### [NEW] `packages/services/src/employee-service.ts`

---

### Item 5 — Dashboard KPIs: Remove Misleading Fallbacks

#### [MODIFY] `apps/admin/src/app/dashboard/page.tsx`
- Replace `fallbackStats` / `fallbackChartData` with proper empty/loading states
- Show `—` dashes in KPI cards when data is not available instead of fake numbers
- Only use real data from `analyticsService`

---

### Item 6 — Customers Page: Show Guest Orders

#### [MODIFY] `apps/api/src/auth/auth.controller.ts`
- Extend `GET /auth/customers` to also return aggregated **guest orders** (orders where `customerId` is null), grouped by phone number

#### [MODIFY] `apps/admin/src/app/dashboard/customers/page.tsx`
- Remove `fallbackCustomers` mock array
- Show real registered customers + guest order summary rows

---

## 🟡 Phase 2 — Medium Priority (Missing Features)

---

### Item 7 — Table Map View in Orders Page

#### [MODIFY] `apps/admin/src/app/dashboard/orders/page.tsx`
- Add a 3rd view mode: "Table Map" (alongside Kanban/List)
- Shows a visual grid of table numbers with active order counts and their statuses

---

### Item 8 — Live Coupon Validation in Checkout

#### [MODIFY] `apps/web/src/app/checkout/page.tsx`
- Add "Apply" button next to coupon input
- On click → call `GET /api/coupons/validate?code=XXX&amount=YYY`
- Show discount amount inline (`-LKR 50`) and update total display before submit

---

### Item 9 — Password Change UI in Settings

#### [MODIFY] `apps/api/src/auth/auth.controller.ts`
- Add `PATCH /auth/change-password` endpoint

#### [MODIFY] `apps/api/src/auth/auth.service.ts`
- Add `changePassword(userId, oldPassword, newPassword)` method

#### [MODIFY] `apps/admin/src/app/dashboard/settings/page.tsx`
- Add "Change Password" section with old/new/confirm fields

---

### Item 10 — Testimonials Approval Screen

#### [NEW] `apps/admin/src/app/dashboard/testimonials/page.tsx`
- List pending testimonials with approve/reject/feature buttons
- Calls existing `PATCH /api/testimonials/:id/approve` (or similar) endpoint

#### [MODIFY] `apps/api/src/testimonials/testimonials.controller.ts`
- Add `PATCH /:id` to approve/feature testimonials

#### [MODIFY] `apps/admin/src/components/layout/sidebar.tsx`
- Add "Testimonials" nav item

---

### Item 11 — Newsletter Subscribers List

#### [MODIFY] `apps/api/src/contact/contact.controller.ts`
- Add `GET /contact/subscribers` endpoint (Admin only)

#### [NEW] `apps/admin/src/app/dashboard/subscribers/page.tsx`
- List all newsletter subscribers with email, date, and unsubscribe toggle
- CSV export button

#### [MODIFY] sidebar + command palette

---

### Item 12 — Blog Management UI

#### [NEW] `apps/admin/src/app/dashboard/blog/page.tsx`
- List posts (draft/published), create/edit/publish/delete
- Rich text area for content editing

#### [MODIFY] `apps/admin/src/components/layout/sidebar.tsx`
- Add "Blog Posts" nav item

---

## 🟢 Phase 3 — Low Priority

---

### Item 13 — Order Confirmation Emails
- Integrate **Nodemailer** or **Resend** into the NestJS API
- Trigger on `orderService.createOrder()` completion
- Send template email with order number, items, total to `customerEmail`

### Item 14 — Customer Order Tracking Page
#### [NEW] `apps/web/src/app/track/page.tsx`
- Input: order number (`JV-XXXX`)
- Calls `GET /api/orders?orderNumber=JV-XXXX` (public endpoint)
- Shows order status timeline

### Item 15 — FRONTEND_URL Production Config
- Document must update `.env` → `FRONTEND_URL=https://your-domain.com` before going live
- Already noted in QR guide

### Item 16 — Analytics Chart Zero-Value Handling
- Add fallback empty-date handling in `analyticsService.getRevenueChart()`

### Item 17 — Gallery Upload Verification
- Test and verify Cloudinary upload flow end-to-end

### Item 18 — Order Print/Export
#### [MODIFY] `apps/admin/src/app/dashboard/orders/page.tsx`
- Add "Export CSV" button that downloads filtered orders as a `.csv` file (client-side, no API needed)

---

## Execution Order

| Phase | Items | Scope |
|---|---|---|
| Phase 1A | Items 1, 2 (Table UI, Coupon UI) | Admin UI only — no schema changes |
| Phase 1B | Items 3, 4 (Inventory, Employees) | New API modules + UI rewire |
| Phase 1C | Items 5, 6 (KPI fallbacks, Customers) | Logic fixes only |
| Phase 2A | Items 8, 9 (Coupon validation, Password change) | API + UI |
| Phase 2B | Items 10, 11 (Testimonials, Newsletter) | API + Admin UI |
| Phase 2C | Items 7, 12 (Table Map, Blog) | Admin UI |
| Phase 3 | Items 13–18 | New services + pages |

> [!IMPORTANT]
> Phase 1B requires running `npx prisma migrate dev` locally and pushing schema changes. Confirm before proceeding if this could affect the production database.

> [!WARNING]
> The employee and inventory API modules are **not** yet registered in `app.module.ts`. These must be added and deployed to the API before the admin UI changes take effect.

## Open Questions

1. **Blog page on the storefront?** — Should there be a public `/blog` page on `apps/web` showing published posts, or is blog only for admin content management?
2. **Employee creation** — When creating an employee, should it also create a login account (User + Employee records) or just an Employee profile linked to an existing User?
3. **Email service for order confirmations** — Do you have a preference for email provider (Resend, SendGrid, Nodemailer with SMTP)? Or should we skip email for now and only do items 1–12?
