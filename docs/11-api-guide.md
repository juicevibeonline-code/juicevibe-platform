# 11. API & WebSocket Integration Guide
**System:** Juice Vibe Digital Platform  
**Document Version:** 3.0.0-PROD  
**Author:** Dulanjaya Lakruwan  
**Date:** July 19, 2026  

---

## 1. REST API Architecture Overview

The backend API is built on **NestJS 11** and serves JSON REST endpoints over HTTPS.

- **Base URL**: `https://api.juicevibe.lk` (or local `http://localhost:4000`)
- **Interactive Swagger Documentation**: Available in production and development at `https://api.juicevibe.lk/api/docs`.

---

## 2. Primary API Endpoint Reference

### 2.1 Authentication Module (`/api/auth`)
| Method | Endpoint | Access Level | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Public | Staff & Admin login (returns JWT Access & Refresh tokens) |
| `POST` | `/api/auth/refresh` | Public | Refresh expired JWT access token |
| `GET` | `/api/auth/me` | Authenticated | Retrieve current user profile & roles |

### 2.2 Menu Catalog Module (`/api/menu`)
| Method | Endpoint | Access Level | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/menu/categories` | Public | List all menu categories |
| `GET` | `/api/menu/items` | Public | List all active menu items with variants & add-ons |
| `POST` | `/api/menu/items` | Admin / Manager | Create new menu item |
| `PATCH` | `/api/menu/items/:id` | Admin / Manager | Update menu item details or price |
| `DELETE` | `/api/menu/items/:id` | Admin | Delete menu item |

### 2.3 Order Management Module (`/api/orders`)
| Method | Endpoint | Access Level | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/orders` | Public | Create new customer order (Web / QR) |
| `GET` | `/api/orders` | Cashier / Manager | List orders (supports `status`, `type`, `limit` query filters) |
| `PATCH` | `/api/orders/:id/status` | Staff | Advance order status (`pending` ➔ `confirmed` ➔ `preparing` ➔ `ready` ➔ `completed`) |
| `PATCH` | `/api/orders/:id/payment` | Cashier / Admin | Update payment status (`pending` ➔ `paid`) |

---

## 3. Real-Time WebSocket Gateway (`apps/api/src/orders/orders.gateway.ts`)

- **Protocol**: WebSockets / Socket.io
- **Event Name**: `orderCreated`
- **Payload Structure**:
  ```json
  {
    "event": "orderCreated",
    "order": {
      "id": "cm123xyz...",
      "orderNumber": "JV-1048",
      "customerName": "Kamal Perera",
      "total": 1250,
      "table": { "number": 4 }
    }
  }
  ```
- **Consumer**: Handled in `apps/admin` via `useOrdersSocket` hook to trigger audio/banner alerts.
