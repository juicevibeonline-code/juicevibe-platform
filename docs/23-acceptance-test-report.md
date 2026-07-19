# 23. Acceptance Test Execution Report
**System:** Juice Vibe Digital Platform  
**Document Version:** 3.0.0-PROD  
**Author:** Dulanjaya Lakruwan  
**Date:** July 19, 2026  

---

## 1. Test Suite Summary & Pass Rate

```
[Total Test Cases Executed: 25]
[Passed: 25]  [Failed: 0]  [Pass Rate: 100%]
```

| Test ID | Test Module | Test Description | Expected Result | Pass/Fail |
| :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Web Storefront | Menu category filter navigation | Displays filtered product subset | 🟢 PASS |
| **TC-02** | Web Storefront | Search bar keyword query | Indexes titles, descriptions & tags | 🟢 PASS |
| **TC-03** | Web Storefront | Table QR scan URL (`?tableId=5`) | Detects table 5 for dine-in | 🟢 PASS |
| **TC-04** | Web Storefront | Cart add-on selection (Add BOBA) | Adds +LKR 100 to line total | 🟢 PASS |
| **TC-05** | Web Storefront | Bank transfer checkout submit | Displays bank details & WhatsApp link | 🟢 PASS |
| **TC-06** | Admin Desk | Real-time WebSocket order alert | Banner flashes with order details | 🟢 PASS |
| **TC-07** | Admin Desk | Kanban status advance | Transitions `Pending` ➔ `Completed` | 🟢 PASS |
| **TC-08** | Admin Desk | Grid view CSV export | Downloads valid `.csv` order file | 🟢 PASS |
| **TC-09** | NestJS API | Auth JWT Login | Returns signed access & refresh tokens | 🟢 PASS |
| **TC-10** | Database | Prisma seed script execution | Seeds 35 items with thumbnails | 🟢 PASS |
