# 13. Backup & Disaster Recovery Specification
**System:** Juice Vibe Digital Platform  
**Document Version:** 3.0.0-PROD  
**Author:** Dulanjaya Lakruwan  
**Date:** July 19, 2026  

---

## 1. Backup Strategy & Objectives

The Juice Vibe platform backup architecture safeguards business transaction records, order history, menu catalogs, customer reviews, and staff access accounts.

| Metric | Target SLA | Strategy |
| :--- | :--- | :--- |
| **Recovery Point Objective (RPO)** | `< 1 hour` | Managed Neon/Supabase Automated Daily & Point-in-time Snapshots |
| **Recovery Time Objective (RTO)** | `< 30 minutes` | Automated cloud restoration & seed automation scripts |

---

## 2. Automated Cloud Database Snapshots

When utilizing managed cloud PostgreSQL (Neon.tech or Supabase):

1. **Daily Automated Snapshots**: Neon/Supabase takes automated full database backups every 24 hours.
2. **Point-In-Time Recovery (PITR)**: Enables restoring database state to any specific minute within the retention window (up to 7 days on standard cloud plans).
3. **Manual SQL Export Command**:
   ```bash
   # Export PostgreSQL Database to SQL File
   pg_dump "postgresql://[USER]:[PASS]@[HOST]/juice-vibe?sslmode=require" > juice_vibe_backup_$(date +%Y%m%d).sql
   ```

---

## 3. Disaster Recovery & System Restoration Protocol

If the main PostgreSQL instance becomes corrupted or inaccessible:

### 3.1 Scenario A: Restoring Existing Cloud Provider
1. Log into Neon/Supabase Console ➔ Navigate to **Backups / Snapshots**.
2. Select desired restore timestamp ➔ Click **Restore to New Branch / Project**.
3. Copy the restored `DATABASE_URL` ➔ Update Environment Variables on Vercel API project (`juice-vibe-api`).
4. Click **Redeploy** on Vercel.

### 3.2 Scenario B: Rebuilding from Blank Database Instance
If establishing a completely new database provider:

1. Update `DATABASE_URL` in `.env` with new PostgreSQL connection URL.
2. Execute schema migration and seed execution scripts:
   ```bash
   # Push PostgreSQL tables
   pnpm db:push
   # Seed catalog with 35 menu products & business settings
   pnpm db:seed
   ```
3. The platform will be 100% operational with baseline catalog and admin credentials restored within 5 minutes.
