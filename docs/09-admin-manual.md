# 09. Administrator & Operations Manual
**System:** Juice Vibe Digital Platform  
**Document Version:** 3.0.0-PROD  
**Author:** Dulanjaya Lakruwan  
**Date:** July 19, 2026  

---

## 1. System Access & Authentication

- **Admin Dashboard URL**: `https://admin.juicevibe.lk` (or local `http://localhost:3001`)
- **Initial Login Credentials**:
  - **Email**: `admin@juicevibe.com`
  - **Password**: `[PROVIDED_SEPARATELY_VIA_SECURE_VAULT]` *(Default: `Admin@123` on first install)*

> [!IMPORTANT]
> Immediately change your password after logging in for the first time by clicking on **Settings ➔ Account Profile ➔ Change Password**.

---

## 2. Order Desk Management (`/dashboard/orders`)

The Order Desk is the operational hub for café cashiers and kitchen staff. It processes incoming orders in real time.

```
[ Incoming Customer Order ]
           │
           ▼
┌──────────────────────┐
│  PENDING APPROVAL    │ ── (Click 'Advance')
└──────────────────────┘
           │
           ▼
┌──────────────────────┐
│      CONFIRMED       │ ── (Click 'Advance')
└──────────────────────┘
           │
           ▼
┌──────────────────────┐
│      PREPARING       │ ── (Click 'Advance')
└──────────────────────┘
           │
           ▼
┌──────────────────────┐
│        READY         │ ── (Click 'Advance')
└──────────────────────┘
           │
           ▼
┌──────────────────────┐
│      COMPLETED       │ ── (Finished Order)
└──────────────────────┘
```

### 2.1 View Modes
- **KANBAN**: Drag-and-drop / single-click operational columns. Ideal for rapid kitchen processing.
- **GRID LIST**: Tabular list view with full search, date filtering, and **Export CSV** capabilities for daily bookkeeping.
- **TABLE MAP**: Visual table layout mapping orders directly to table numbers for dine-in waiter service.

### 2.2 Payment Verification
- For orders placed via **Online Bank Transfer**, a flashing yellow badge appears indicating `Payment Pending`.
- Verify receipt proof sent by the customer on WhatsApp (`+94 71 843 5876`).
- Click **Mark Paid** on the order card to update payment status to `Paid`.

---

## 3. Menu Catalog Management (`/dashboard/menu`)

1. **Adding New Products**: Click **+ Add Menu Item** ➔ Enter name, price, category, description, and upload a thumbnail photo.
2. **Editing Existing Products**: Modify prices, add/remove ingredients, or update popular star badges.
3. **Managing Stock Availability**: Toggle items as `Out of Stock` to automatically grey them out on the customer website.
