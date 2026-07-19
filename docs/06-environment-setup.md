# 06. Environment Setup Guide
**System:** Juice Vibe Digital Platform  
**Document Version:** 3.0.0-PROD  
**Author:** Dulanjaya Lakruwan  
**Date:** July 19, 2026  

---

## 1. Local Development Prerequisites

Ensure your development environment meets these versions:

- **Node.js**: `>= 20.0.0` (LTS recommended)
- **PNPM**: `10.34.5` (Enforced via `packageManager` in `package.json`)
- **Docker Desktop**: Optional (for local PostgreSQL instance)
- **Git**: `^2.40.0`

---

## 2. Step-by-Step Initial Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/DULANJAYA-LAKRUWAN/Juice-Vibe-Waskaduwa.git
   cd Juice-Vibe-Waskaduwa
   ```

2. **Install Workspace Dependencies**:
   ```bash
   pnpm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env` at root:
   ```bash
   cp .env.example .env
   ```

   Fill in local development variables in `.env`:
   ```env
   DATABASE_URL="postgresql://postgres:20021115@localhost:5432/juice-vibe?schema=public"
   JWT_SECRET="dev_jwt_secret_key_change_in_production_123456789"
   JWT_REFRESH_SECRET="dev_jwt_refresh_secret_key_change_in_production_987654321"
   JWT_ACCESS_EXPIRATION="15m"
   JWT_REFRESH_EXPIRATION="7d"
   PORT=4000
   FRONTEND_URL="http://localhost:3000"
   ADMIN_URL="http://localhost:3001"
   NODE_ENV="development"
   ```

4. **Initialize Local Database & Seed Catalog**:
   ```bash
   # Generate Prisma Client
   pnpm db:generate
   # Push database schema to PostgreSQL
   pnpm db:push
   # Seed 35 menu items and settings
   pnpm db:seed
   ```

5. **Launch Turborepo Development Server**:
   ```bash
   npm run dev
   ```
   - Storefront Web: `http://localhost:3000`
   - Admin Operations: `http://localhost:3001`
   - NestJS REST API: `http://localhost:4000`
   - Swagger API Docs: `http://localhost:4000/api/docs`
