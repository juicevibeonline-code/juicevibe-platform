# 12. Database Schema & Data Dictionary Specification
**System:** Juice Vibe Digital Platform  
**Document Version:** 3.0.0-PROD  
**Author:** Dulanjaya Lakruwan  
**Date:** July 19, 2026  

---

## 1. Relational Entity-Relationship (ER) Architecture

The database is built on **PostgreSQL** using **Prisma ORM**.

```mermaid
erDiagram
    Category ||--o{ MenuItem : contains
    MenuItem ||--o{ ItemVariant : offers
    MenuItem ||--o{ AddOn : includes
    MenuItem ||--o{ OrderItem : details
    Order ||--o{ OrderItem : contains
    Customer ||--o{ Order : places
    Customer ||--o{ Address : has
    User ||--o{ Employee : profile

    Category {
        string id PK
        string name
        string slug UK
        string icon
        int order
    }

    MenuItem {
        string id PK
        string name
        string slug UK
        string description
        float price
        boolean isPopular
        boolean isFeatured
        string thumbnail
        string categoryId FK
    }

    Order {
        string id PK
        string orderNumber UK
        string customerName
        string customerPhone
        string type
        string status
        string paymentMethod
        string paymentStatus
        float subtotal
        float tax
        float discount
        float total
    }

    OrderItem {
        string id PK
        string orderId FK
        string menuItemId FK
        int quantity
        float price
    }
```

---

## 2. Primary Database Entities

| Entity | Model Name | Description | Key Fields |
| :--- | :--- | :--- | :--- |
| **Users** | `User` | Authentication accounts & staff roles | `id`, `email`, `password`, `role` |
| **Categories** | `Category` | Menu categories (Milkshakes, Juices...) | `id`, `name`, `slug`, `order` |
| **Menu Items** | `MenuItem` | Food & drink items catalog | `id`, `name`, `slug`, `price`, `thumbnail` |
| **Item Variants** | `ItemVariant` | Size/flavor variants (Small, Large) | `id`, `name`, `priceAdjustment`, `menuItemId` |
| **Add-Ons** | `AddOn` | Extras (e.g. Add BOBA +100 LKR) | `id`, `name`, `price`, `menuItemId` |
| **Orders** | `Order` | Customer transactions & statuses | `id`, `orderNumber`, `type`, `status`, `total` |
| **Order Items** | `OrderItem` | Line items in an order | `id`, `orderId`, `menuItemId`, `quantity` |
| **Coupons** | `Coupon` | Promotional discount codes | `id`, `code`, `discountType`, `value` |
| **Testimonials** | `Testimonial` | Customer reviews & ratings | `id`, `name`, `rating`, `text`, `isApproved` |
| **Settings** | `Setting` | Global business configuration | `id`, `key`, `value` |

---

## 3. Database Migration Commands

- **Generate Prisma Client**:
  ```bash
  pnpm db:generate
  ```
- **Push Schema Changes to Cloud DB**:
  ```bash
  pnpm db:push
  ```
- **Seed Initial Data (35 Products & Admin User)**:
  ```bash
  pnpm db:seed
  ```
- **Launch Prisma Studio Database GUI**:
  ```bash
  pnpm db:studio
  ```
