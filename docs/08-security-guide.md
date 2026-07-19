# 08. Security Architecture & Controls Specification
**System:** Juice Vibe Digital Platform  
**Document Version:** 3.0.0-PROD  
**Author:** Dulanjaya Lakruwan  
**Date:** July 19, 2026  

---

## 1. Security Architecture Principles

The Juice Vibe Digital Platform implements defense-in-depth security controls across authentication, network transport, database access, and API endpoint protection.

---

## 2. Authentication & Authorization Controls

### 2.1 JWT Access & Refresh Token Architecture
- **Stateless Authentication**: Staff and admin logins issue JSON Web Tokens (JWT) signed with HMAC-SHA256.
- **Short-Lived Access Tokens**: `JWT_ACCESS_EXPIRATION="15m"` limits exposure window in case of token theft.
- **Refresh Token Rotation**: `JWT_REFRESH_EXPIRATION="7d"` allows seamless re-authentication without re-asking credentials.
- **Password Hashing**: Passwords stored in PostgreSQL are hashed using **bcrypt** with a salt round factor of 12.

### 2.2 Server-Side Role-Based Access Control (RBAC)
Role protection is enforced strictly on NestJS controller endpoints via custom `@Roles(...)` metadata decorators and `RolesGuard`:

```typescript
// Enforced on apps/api guards
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("admin", "manager")
@Post("menu/items")
async createMenuItem(@Body() dto: CreateMenuItemDto) { ... }
```

Supported Role Hierarchy:
- `admin`: Full system read/write access, staff management, settings overrides.
- `manager`: Menu, pricing, inventory, order dispatch, reviews.
- `cashier`: Order desk management, payment verification (`Mark Paid`).
- `kitchen`: Read-only order queue for food preparation.
- `editor`: Gallery and blog post management.

---

## 3. Network & API Security Controls

1. **Helmet HTTP Security Headers**: NestJS API is wrapped with `helmet()` middleware, enabling:
   - Strict Content Security Policy (CSP)
   - X-Content-Type-Options: `nosniff`
   - X-Frame-Options: `DENY`
   - Strict-Transport-Security (HSTS)
2. **API Rate Limiting (Throttling)**: Implemented via `@nestjs/throttler` to prevent Denial of Service (DoS) and brute-force login attempts (default: 100 requests per minute per IP).
3. **Strict CORS Policy**: Whitelists explicitly configured origins (`FRONTEND_URL` and `ADMIN_URL`), rejecting unauthorized cross-origin requests.
4. **Data Sanitization**: Global `ValidationPipe` with `class-validator` strips unapproved properties from payload DTOs to prevent mass assignment attacks.

---

## 4. Credential Handling Guidelines

> [!CAUTION]
> Never commit production secrets, database connection strings, or Cloudinary API keys to version control. All secrets are passed dynamically to Vercel runtime memory via Vercel Environment Variables.
