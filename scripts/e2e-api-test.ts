import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import { spawn, ChildProcess } from "child_process";

const API_BASE = process.env.TEST_API_URL || `http://localhost:${process.env.PORT || 4000}/api`;
const API_ROOT = process.env.TEST_API_URL ? process.env.TEST_API_URL.replace(/\/api$/, "") : `http://localhost:${process.env.PORT || 4000}`;

interface TestResult {
  group: string;
  name: string;
  method: string;
  endpoint: string;
  status: "PASS" | "FAIL";
  httpStatus?: number;
  durationMs: number;
  error?: string;
}

const results: TestResult[] = [];
let apiServerProcess: ChildProcess | null = null;

// Context shared across tests
const ctx: {
  adminToken?: string;
  customerToken?: string;
  customerRefreshToken?: string;
  customerId?: string;
  customerEmail?: string;
  testCategoryId?: string;
  testCategorySlug?: string;
  testMenuItemId?: string;
  testMenuItemSlug?: string;
  testOrderId?: string;
  testOrderNumber?: string;
  testTableId?: string;
  testTableNumber?: number;
  testInventoryId?: string;
  testEmployeeId?: string;
  testEmployeeUserId?: string;
  testCouponId?: string;
  testCouponCode?: string;
  testContactMessageId?: string;
  testSubscriberId?: string;
  testSubscriberEmail?: string;
  testBlogPostId?: string;
  testBlogPostSlug?: string;
  testGalleryImageId?: string;
  testTestimonialId?: string;
} = {};

const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
};

async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function request(
  method: string,
  urlPath: string,
  options: {
    body?: any;
    token?: string;
    expectedStatus?: number | number[];
    isFormData?: boolean;
    useRoot?: boolean;
  } = {}
) {
  const targetUrl = options.useRoot ? `${API_ROOT}${urlPath}` : `${API_BASE}${urlPath}`;
  const headers: Record<string, string> = {};

  if (!options.isFormData && options.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (options.token) {
    headers["Authorization"] = `Bearer ${options.token}`;
  }

  const start = performance.now();
  let res: Response;
  try {
    res = await fetch(targetUrl, {
      method,
      headers,
      body: options.body !== undefined ? (options.isFormData ? options.body : JSON.stringify(options.body)) : undefined,
    });
  } catch (err: any) {
    const durationMs = Math.round(performance.now() - start);
    throw new Error(`Network/Connection failed to ${method} ${targetUrl}: ${err.message} (${durationMs}ms)`);
  }

  const durationMs = Math.round(performance.now() - start);
  const expected = options.expectedStatus || 200;
  const expectedArray = Array.isArray(expected) ? expected : [expected];

  let json: any = null;
  const text = await res.text();
  try {
    json = JSON.parse(text);
  } catch {
    json = text;
  }

  const statusOk = expectedArray.includes(res.status);
  if (!statusOk) {
    const errMsg = typeof json === "object" && json?.message ? json.message : text;
    throw new Error(`Expected HTTP ${expectedArray.join("/")} but got ${res.status}. Response: ${typeof errMsg === "string" ? errMsg.slice(0, 300) : JSON.stringify(errMsg)}`);
  }

  return { status: res.status, data: json, durationMs };
}

async function runTest(
  group: string,
  name: string,
  method: string,
  endpoint: string,
  testFn: () => Promise<void>
) {
  const start = performance.now();
  process.stdout.write(`  ${colors.dim}•${colors.reset} [${method.padEnd(6)}] ${endpoint.padEnd(35)} - ${name}... `);

  try {
    await testFn();
    const durationMs = Math.round(performance.now() - start);
    results.push({ group, name, method, endpoint, status: "PASS", durationMs });
    console.log(`${colors.green}✓ PASS${colors.reset} ${colors.dim}(${durationMs}ms)${colors.reset}`);
  } catch (err: any) {
    const durationMs = Math.round(performance.now() - start);
    results.push({ group, name, method, endpoint, status: "FAIL", durationMs, error: err.message });
    console.log(`${colors.red}✗ FAIL${colors.reset} ${colors.dim}(${durationMs}ms)${colors.reset}`);
    console.log(`    ${colors.red}Error: ${err.message}${colors.reset}`);
  }
}

async function ensureServerRunning() {
  console.log(`${colors.bright}${colors.cyan}Checking if API server is reachable at ${API_ROOT}...${colors.reset}`);
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      console.log(`${colors.green}✓ API server is already running.${colors.reset}\n`);
      return;
    }
  } catch {
    // Server is not running, spawn it
  }

  console.log(`${colors.yellow}API server not running. Starting local Nest server...${colors.reset}`);
  const apiDir = path.resolve(__dirname, "../apps/api");
  apiServerProcess = spawn("node", ["dist/main.js"], {
    cwd: apiDir,
    env: { ...process.env, PORT: "4000", HOST: "0.0.0.0" },
    stdio: "pipe",
  });

  apiServerProcess.stdout?.on("data", (data) => {
    // debug logging
  });

  apiServerProcess.stderr?.on("data", (data) => {
    // console.error(`[API STDERR] ${data}`);
  });

  // Poll for readiness
  const maxAttempts = 30;
  for (let i = 1; i <= maxAttempts; i++) {
    await wait(1000);
    try {
      const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        console.log(`${colors.green}✓ API server started and ready on attempt ${i}.${colors.reset}\n`);
        return;
      }
    } catch {
      process.stdout.write(".");
    }
  }

  throw new Error("Could not connect to API server after 30s.");
}

async function main() {
  console.log(`\n${colors.bright}${colors.cyan}====================================================`);
  console.log(`   🍹 JUICE VIBE PLATFORM — FULL E2E API VERIFICATION`);
  console.log(`====================================================${colors.reset}\n`);

  try {
    await ensureServerRunning();
  } catch (err: any) {
    console.error(`${colors.red}Fatal: ${err.message}${colors.reset}`);
    process.exit(1);
  }

  const timestamp = Date.now();
  ctx.customerEmail = `e2e_customer_${timestamp}@juicevibe.test`;
  const customerPassword = "TestCustomer@123";
  ctx.testCouponCode = `E2E${Math.floor(1000 + Math.random() * 9000)}`;
  ctx.testTableNumber = 8800 + Math.floor(Math.random() * 1000);
  ctx.testSubscriberEmail = `subscriber_${timestamp}@juicevibe.test`;

  // ─────────────────────────────────────────────────────────────
  // 1. HEALTH & SYSTEM CHECKS
  // ─────────────────────────────────────────────────────────────
  console.log(`\n${colors.bright}1. Health & Base System Endpoints${colors.reset}`);
  
  await runTest("System", "Base /api endpoint", "GET", "/api", async () => {
    const res = await request("GET", "", { expectedStatus: 200 });
    if (!res.data || res.data.status !== "ok") throw new Error("Invalid response format");
  });

  await runTest("System", "Health check endpoint", "GET", "/api/health", async () => {
    const res = await request("GET", "/health", { expectedStatus: 200 });
    if (!res.data || res.data.status !== "healthy") throw new Error("Invalid health check status");
  });

  await runTest("System", "Swagger API Documentation UI", "GET", "/api/docs", async () => {
    const res = await request("GET", "/docs", { expectedStatus: [200, 301, 302] });
    if (!res.data) throw new Error("Empty Swagger docs response");
  });

  // ─────────────────────────────────────────────────────────────
  // 2. AUTHENTICATION & USERS
  // ─────────────────────────────────────────────────────────────
  console.log(`\n${colors.bright}2. Authentication & User Management (/api/auth)${colors.reset}`);

  await runTest("Auth", "Admin Login", "POST", "/api/auth/login", async () => {
    const res = await request("POST", "/auth/login", {
      body: { email: "admin@juicevibe.com", password: "Admin@123" },
      expectedStatus: 200,
    });
    if (!res.data?.success || !res.data?.data?.tokens?.accessToken) {
      throw new Error("Admin login failed or tokens missing");
    }
    ctx.adminToken = res.data.data.tokens.accessToken;
  });

  await runTest("Auth", "Customer Registration", "POST", "/api/auth/register", async () => {
    const res = await request("POST", "/auth/register", {
      body: {
        name: "E2E Test Customer",
        email: ctx.customerEmail,
        password: customerPassword,
        phone: "+94771234567",
      },
      expectedStatus: [200, 201],
    });
    if (!res.data?.success || !res.data?.data?.tokens?.accessToken) {
      throw new Error("Customer registration failed");
    }
    ctx.customerToken = res.data.data.tokens.accessToken;
    ctx.customerRefreshToken = res.data.data.tokens.refreshToken;
    ctx.customerId = res.data.data.user.id;
  });

  await runTest("Auth", "Customer Login", "POST", "/api/auth/login", async () => {
    const res = await request("POST", "/auth/login", {
      body: { email: ctx.customerEmail, password: customerPassword },
      expectedStatus: 200,
    });
    if (!res.data?.success || !res.data?.data?.tokens?.accessToken) {
      throw new Error("Customer login failed");
    }
    ctx.customerToken = res.data.data.tokens.accessToken;
    ctx.customerRefreshToken = res.data.data.tokens.refreshToken;
  });

  await runTest("Auth", "Refresh Token Rotation", "POST", "/api/auth/refresh", async () => {
    const res = await request("POST", "/auth/refresh", {
      body: { refreshToken: ctx.customerRefreshToken },
      expectedStatus: 200,
    });
    if (!res.data?.success || !res.data?.data?.accessToken) {
      throw new Error("Token refresh failed");
    }
    ctx.customerToken = res.data.data.accessToken;
    ctx.customerRefreshToken = res.data.data.refreshToken;
  });

  await runTest("Auth", "Get Profile (Me)", "GET", "/api/auth/me", async () => {
    const res = await request("GET", "/auth/me", {
      token: ctx.customerToken,
      expectedStatus: 200,
    });
    if (!res.data?.success || res.data?.data?.email !== ctx.customerEmail) {
      throw new Error("Profile retrieval returned unexpected data");
    }
  });

  await runTest("Auth", "Get Customers List (Admin)", "GET", "/api/auth/customers", async () => {
    const res = await request("GET", "/auth/customers", {
      token: ctx.adminToken,
      expectedStatus: 200,
    });
    if (!res.data?.success || !Array.isArray(res.data?.data)) {
      throw new Error("Customers list not array");
    }
  });

  await runTest("Auth", "Change Password", "PATCH", "/api/auth/change-password", async () => {
    const newPassword = "TestCustomerNew@123";
    const res = await request("PATCH", "/auth/change-password", {
      token: ctx.customerToken,
      body: { oldPassword: customerPassword, newPassword },
      expectedStatus: 200,
    });
    if (!res.data?.success) throw new Error("Password change failed");

    // Test login with new password
    const loginRes = await request("POST", "/auth/login", {
      body: { email: ctx.customerEmail, password: newPassword },
      expectedStatus: 200,
    });
    ctx.customerToken = loginRes.data.data.tokens.accessToken;
  });

  // ─────────────────────────────────────────────────────────────
  // 3. MENU CATEGORIES & ITEMS
  // ─────────────────────────────────────────────────────────────
  console.log(`\n${colors.bright}3. Menu Categories & Items (/api/menu)${colors.reset}`);

  await runTest("Menu", "Get Active Categories (Public)", "GET", "/api/menu/categories", async () => {
    const res = await request("GET", "/menu/categories", { expectedStatus: 200 });
    if (!res.data?.success || !Array.isArray(res.data?.data)) {
      throw new Error("Expected array of categories");
    }
  });

  await runTest("Menu", "Get All Categories (Admin)", "GET", "/api/menu/categories/all", async () => {
    const res = await request("GET", "/menu/categories/all", {
      token: ctx.adminToken,
      expectedStatus: 200,
    });
    if (!res.data?.success || !Array.isArray(res.data?.data)) {
      throw new Error("Expected array of categories");
    }
  });

  await runTest("Menu", "Create Category (Admin)", "POST", "/api/menu/categories", async () => {
    const res = await request("POST", "/menu/categories", {
      token: ctx.adminToken,
      body: {
        name: `E2E Category ${timestamp}`,
        icon: "CupSoda",
        description: "Automated E2E Test Category",
        order: 99,
      },
      expectedStatus: [200, 201],
    });
    if (!res.data?.success || !res.data?.data?.id) {
      throw new Error("Category creation failed");
    }
    ctx.testCategoryId = res.data.data.id;
    ctx.testCategorySlug = res.data.data.slug;
  });

  await runTest("Menu", "Update Category (Admin)", "PATCH", "/api/menu/categories/:id", async () => {
    const res = await request("PATCH", `/menu/categories/${ctx.testCategoryId}`, {
      token: ctx.adminToken,
      body: {
        name: `E2E Category Updated ${timestamp}`,
        icon: "Wine",
      },
      expectedStatus: 200,
    });
    if (!res.data?.success) throw new Error("Category update failed");
  });

  await runTest("Menu", "Create Menu Item (Admin)", "POST", "/api/menu/items", async () => {
    const res = await request("POST", "/menu/items", {
      token: ctx.adminToken,
      body: {
        name: `E2E Mango Punch ${timestamp}`,
        description: "Sweet fresh mango punch with lime",
        price: 450,
        categoryId: ctx.testCategoryId,
        isPopular: true,
        isFeatured: true,
        ingredients: ["Mango", "Lime", "Sugar", "Ice"],
        tags: ["Refreshing", "Best Seller"],
      },
      expectedStatus: [200, 201],
    });
    if (!res.data?.success || !res.data?.data?.id) {
      throw new Error("Menu item creation failed");
    }
    ctx.testMenuItemId = res.data.data.id;
    ctx.testMenuItemSlug = res.data.data.slug;
  });

  await runTest("Menu", "Get Menu Items with Filters (Public)", "GET", "/api/menu/items", async () => {
    const res = await request("GET", `/menu/items?category=${ctx.testCategorySlug}&search=Mango&page=1&limit=10`, {
      expectedStatus: 200,
    });
    if (!res.data?.success || !Array.isArray(res.data?.data)) {
      throw new Error("Filtered menu items query failed");
    }
  });

  await runTest("Menu", "Get Menu Item Details by ID (Public)", "GET", "/api/menu/items/:id", async () => {
    const res = await request("GET", `/menu/items/${ctx.testMenuItemId}`, {
      expectedStatus: 200,
    });
    if (!res.data?.success || res.data?.data?.id !== ctx.testMenuItemId) {
      throw new Error("Menu item by ID mismatch");
    }
  });

  await runTest("Menu", "Update Menu Item (Admin)", "PATCH", "/api/menu/items/:id", async () => {
    const res = await request("PATCH", `/menu/items/${ctx.testMenuItemId}`, {
      token: ctx.adminToken,
      body: {
        name: `E2E Mango Punch Premium ${timestamp}`,
        price: 480,
      },
      expectedStatus: 200,
    });
    if (!res.data?.success || res.data?.data?.price !== 480) {
      throw new Error("Menu item update failed");
    }
  });

  await runTest("Menu", "Reorder Menu Items (Admin)", "PUT", "/api/menu/items/reorder", async () => {
    const res = await request("PUT", "/menu/items/reorder", {
      token: ctx.adminToken,
      body: {
        items: [{ id: ctx.testMenuItemId, order: 5 }],
      },
      expectedStatus: 200,
    });
    if (!res.data?.success) throw new Error("Reordering menu items failed");
  });

  // ─────────────────────────────────────────────────────────────
  // 4. ORDERS SYSTEM
  // ─────────────────────────────────────────────────────────────
  console.log(`\n${colors.bright}4. Orders System (/api/orders)${colors.reset}`);

  await runTest("Orders", "Create Order (Customer / Authenticated)", "POST", "/api/orders", async () => {
    const res = await request("POST", "/orders", {
      token: ctx.customerToken,
      body: {
        type: "pickup",
        customerName: "E2E Test Customer",
        customerPhone: "+94771234567",
        customerEmail: ctx.customerEmail,
        paymentMethod: "cash",
        notes: "No sugar please",
        items: [
          {
            menuItemId: ctx.testMenuItemId,
            name: "E2E Mango Punch",
            quantity: 2,
            price: 480,
          },
        ],
      },
      expectedStatus: [200, 201],
    });
    if (!res.data?.success || !res.data?.data?.id || !res.data?.data?.orderNumber) {
      throw new Error("Order creation failed");
    }
    ctx.testOrderId = res.data.data.id;
    ctx.testOrderNumber = res.data.data.orderNumber;
  });

  await runTest("Orders", "Get All Orders (Admin)", "GET", "/api/orders", async () => {
    const res = await request("GET", "/orders?page=1&limit=10", {
      token: ctx.adminToken,
      expectedStatus: 200,
    });
    if (!res.data?.success || !Array.isArray(res.data?.data)) {
      throw new Error("Admin get orders failed");
    }
  });

  await runTest("Orders", "Get Customer Orders (My)", "GET", "/api/orders/my", async () => {
    const res = await request("GET", "/orders/my", {
      token: ctx.customerToken,
      expectedStatus: 200,
    });
    if (!res.data?.success || !Array.isArray(res.data?.data)) {
      throw new Error("Customer get orders failed");
    }
  });

  await runTest("Orders", "Get Recent Orders (Admin)", "GET", "/api/orders/recent", async () => {
    const res = await request("GET", "/orders/recent?limit=5", {
      token: ctx.adminToken,
      expectedStatus: 200,
    });
    if (!res.data?.success || !Array.isArray(res.data?.data)) {
      throw new Error("Recent orders failed");
    }
  });

  await runTest("Orders", "Track Order by Order Number (Public)", "GET", "/api/orders/track/:orderNumber", async () => {
    const res = await request("GET", `/orders/track/${ctx.testOrderNumber}`, {
      expectedStatus: 200,
    });
    if (!res.data?.success || res.data?.data?.orderNumber !== ctx.testOrderNumber) {
      throw new Error("Track order failed");
    }
  });

  await runTest("Orders", "Get Order by ID (Admin)", "GET", "/api/orders/:id", async () => {
    const res = await request("GET", `/orders/${ctx.testOrderId}`, {
      token: ctx.adminToken,
      expectedStatus: 200,
    });
    if (!res.data?.success || res.data?.data?.id !== ctx.testOrderId) {
      throw new Error("Get order by ID failed");
    }
  });

  await runTest("Orders", "Update Order Status (confirmed -> preparing -> ready -> completed)", "PATCH", "/api/orders/:id/status", async () => {
    const statuses = ["confirmed", "preparing", "ready", "completed"];
    for (const st of statuses) {
      const res = await request("PATCH", `/orders/${ctx.testOrderId}/status`, {
        token: ctx.adminToken,
        body: { status: st },
        expectedStatus: 200,
      });
      if (!res.data?.success || res.data?.data?.status !== st) {
        throw new Error(`Failed transitioning order status to ${st}`);
      }
    }
  });

  await runTest("Orders", "Update Order Payment Status (pending -> paid)", "PATCH", "/api/orders/:id/payment-status", async () => {
    const res = await request("PATCH", `/orders/${ctx.testOrderId}/payment-status`, {
      token: ctx.adminToken,
      body: { status: "paid" },
      expectedStatus: 200,
    });
    if (!res.data?.success || res.data?.data?.paymentStatus !== "paid") {
      throw new Error("Order payment status update failed");
    }
  });

  // ─────────────────────────────────────────────────────────────
  // 5. TABLE MANAGEMENT
  // ─────────────────────────────────────────────────────────────
  console.log(`\n${colors.bright}5. Table & Dine-In Management (/api/tables)${colors.reset}`);

  await runTest("Tables", "Create Dine-In Table with QR Code (Admin)", "POST", "/api/tables", async () => {
    const res = await request("POST", "/tables", {
      token: ctx.adminToken,
      body: { number: ctx.testTableNumber },
      expectedStatus: [200, 201],
    });
    if (!res.data?.success || !res.data?.data?.id || !res.data?.data?.qrCodeUrl) {
      throw new Error("Table creation with QR generation failed");
    }
    ctx.testTableId = res.data.data.id;
  });

  await runTest("Tables", "Get All Tables (Public/Admin)", "GET", "/api/tables", async () => {
    const res = await request("GET", "/tables", { expectedStatus: 200 });
    if (!res.data?.success || !Array.isArray(res.data?.data)) {
      throw new Error("Get tables failed");
    }
  });

  await runTest("Tables", "Get Table by ID", "GET", "/api/tables/:id", async () => {
    const res = await request("GET", `/tables/${ctx.testTableId}`, { expectedStatus: 200 });
    if (!res.data?.success || res.data?.data?.id !== ctx.testTableId) {
      throw new Error("Get table by ID failed");
    }
  });

  await runTest("Tables", "Regenerate All Table QR Codes (Admin)", "POST", "/api/tables/regenerate-qr", async () => {
    const res = await request("POST", "/tables/regenerate-qr", {
      token: ctx.adminToken,
      expectedStatus: [200, 201],
    });
    if (!res.data?.success) throw new Error("Regenerate QR codes failed");
  });

  // ─────────────────────────────────────────────────────────────
  // 6. INVENTORY MANAGEMENT
  // ─────────────────────────────────────────────────────────────
  console.log(`\n${colors.bright}6. Inventory Management (/api/inventory)${colors.reset}`);

  await runTest("Inventory", "Create Inventory Item (Admin)", "POST", "/api/inventory", async () => {
    const res = await request("POST", "/inventory", {
      token: ctx.adminToken,
      body: {
        name: `Fresh Strawberries ${timestamp}`,
        quantity: 25.5,
        unit: "kg",
        minStockLevel: 5.0,
        supplier: "Nuwara Eliya Farms",
      },
      expectedStatus: [200, 201],
    });
    if (!res.data?.success || !res.data?.data?.id) {
      throw new Error("Inventory item creation failed");
    }
    ctx.testInventoryId = res.data.data.id;
  });

  await runTest("Inventory", "Get All Inventory Items (Admin)", "GET", "/api/inventory", async () => {
    const res = await request("GET", "/inventory", {
      token: ctx.adminToken,
      expectedStatus: 200,
    });
    if (!res.data?.success || !Array.isArray(res.data?.data)) {
      throw new Error("Get inventory items failed");
    }
  });

  await runTest("Inventory", "Get Inventory Item by ID (Admin)", "GET", "/api/inventory/:id", async () => {
    const res = await request("GET", `/inventory/${ctx.testInventoryId}`, {
      token: ctx.adminToken,
      expectedStatus: 200,
    });
    if (!res.data?.success || res.data?.data?.id !== ctx.testInventoryId) {
      throw new Error("Get inventory item by ID failed");
    }
  });

  await runTest("Inventory", "Update Inventory Item (Admin)", "PATCH", "/api/inventory/:id", async () => {
    const res = await request("PATCH", `/inventory/${ctx.testInventoryId}`, {
      token: ctx.adminToken,
      body: { quantity: 30.0, minStockLevel: 6.0 },
      expectedStatus: 200,
    });
    if (!res.data?.success || res.data?.data?.quantity !== 30.0) {
      throw new Error("Inventory item update failed");
    }
  });

  // ─────────────────────────────────────────────────────────────
  // 7. EMPLOYEES & STAFF
  // ─────────────────────────────────────────────────────────────
  console.log(`\n${colors.bright}7. Staff & Employees (/api/employees)${colors.reset}`);

  const employeeCode = `E2E-${Math.floor(1000 + Math.random() * 9000)}`;
  const employeeEmail = `staff_${timestamp}@juicevibe.test`;

  await runTest("Employees", "Create Employee & User Account (Admin)", "POST", "/api/employees", async () => {
    const res = await request("POST", "/employees", {
      token: ctx.adminToken,
      body: {
        employeeId: employeeCode,
        name: "E2E Staff Member",
        email: employeeEmail,
        password: "StaffPassword@123",
        role: "kitchen",
        position: "Juice Master",
        salary: 55000,
      },
      expectedStatus: [200, 201],
    });
    if (!res.data?.success || !res.data?.data?.id) {
      throw new Error("Employee creation failed");
    }
    ctx.testEmployeeId = res.data.data.id;
    ctx.testEmployeeUserId = res.data.data.userId;
  });

  await runTest("Employees", "Get All Employees (Admin)", "GET", "/api/employees", async () => {
    const res = await request("GET", "/employees", {
      token: ctx.adminToken,
      expectedStatus: 200,
    });
    if (!res.data?.success || !Array.isArray(res.data?.data)) {
      throw new Error("Get employees failed");
    }
  });

  await runTest("Employees", "Get Employee Details (Admin)", "GET", "/api/employees/:id", async () => {
    const res = await request("GET", `/employees/${ctx.testEmployeeId}`, {
      token: ctx.adminToken,
      expectedStatus: 200,
    });
    if (!res.data?.success || res.data?.data?.id !== ctx.testEmployeeId) {
      throw new Error("Get employee by ID failed");
    }
  });

  await runTest("Employees", "Update Employee Position/Salary (Admin)", "PATCH", "/api/employees/:id", async () => {
    const res = await request("PATCH", `/employees/${ctx.testEmployeeId}`, {
      token: ctx.adminToken,
      body: { position: "Head Juice Master", salary: 60000 },
      expectedStatus: 200,
    });
    if (!res.data?.success || res.data?.data?.position !== "Head Juice Master") {
      throw new Error("Employee update failed");
    }
  });

  // ─────────────────────────────────────────────────────────────
  // 8. COUPONS & DISCOUNTS
  // ─────────────────────────────────────────────────────────────
  console.log(`\n${colors.bright}8. Coupons & Promotions (/api/coupons)${colors.reset}`);

  await runTest("Coupons", "Create Coupon (Admin)", "POST", "/api/coupons", async () => {
    const res = await request("POST", "/coupons", {
      token: ctx.adminToken,
      body: {
        code: ctx.testCouponCode,
        type: "percentage",
        value: 15,
        minOrderAmount: 500,
        maxDiscount: 200,
        usageLimit: 50,
      },
      expectedStatus: [200, 201],
    });
    if (!res.data?.success || !res.data?.data?.id) {
      throw new Error("Coupon creation failed");
    }
    ctx.testCouponId = res.data.data.id;
  });

  await runTest("Coupons", "Get All Coupons (Admin)", "GET", "/api/coupons", async () => {
    const res = await request("GET", "/coupons", {
      token: ctx.adminToken,
      expectedStatus: 200,
    });
    if (!res.data?.success || !Array.isArray(res.data?.data)) {
      throw new Error("Get coupons failed");
    }
  });

  await runTest("Coupons", "Validate Coupon (Public)", "GET", "/api/coupons/validate", async () => {
    const res = await request("GET", `/coupons/validate?code=${ctx.testCouponCode}&amount=1000`, {
      expectedStatus: 200,
    });
    if (!res.data?.success || !res.data?.data?.valid || res.data?.data?.discount !== 150) {
      throw new Error("Coupon calculation/validation mismatch");
    }
  });

  // ─────────────────────────────────────────────────────────────
  // 9. CONTACT & NEWSLETTER
  // ─────────────────────────────────────────────────────────────
  console.log(`\n${colors.bright}9. Contact Messages & Newsletter (/api/contact)${colors.reset}`);

  await runTest("Contact", "Submit Contact Message (Public)", "POST", "/api/contact", async () => {
    const res = await request("POST", "/contact", {
      body: {
        name: "E2E Inquirer",
        email: "inquirer@test.com",
        subject: "Event Catering Inquiry",
        message: "We would like to order fresh juices for our office event.",
      },
      expectedStatus: [200, 201],
    });
    if (!res.data?.success) throw new Error("Submit contact message failed");
  });

  await runTest("Contact", "Get Contact Messages (Admin)", "GET", "/api/contact/messages", async () => {
    const res = await request("GET", "/contact/messages?page=1&limit=10", {
      token: ctx.adminToken,
      expectedStatus: 200,
    });
    if (!res.data?.success || !Array.isArray(res.data?.data)) {
      throw new Error("Get contact messages failed");
    }
    if (res.data.data.length > 0) {
      ctx.testContactMessageId = res.data.data[0].id;
    }
  });

  if (ctx.testContactMessageId) {
    await runTest("Contact", "Mark Contact Message as Read (Admin)", "PATCH", "/api/contact/messages/:id/read", async () => {
      const res = await request("PATCH", `/contact/messages/${ctx.testContactMessageId}/read`, {
        token: ctx.adminToken,
        expectedStatus: 200,
      });
      if (!res.data?.success) throw new Error("Mark contact message as read failed");
    });
  }

  await runTest("Contact", "Subscribe to Newsletter (Public)", "POST", "/api/contact/subscribe", async () => {
    const res = await request("POST", "/contact/subscribe", {
      body: { email: ctx.testSubscriberEmail },
      expectedStatus: [200, 201],
    });
    if (!res.data?.success) throw new Error("Newsletter subscription failed");
  });

  await runTest("Contact", "Get Newsletter Subscribers (Admin)", "GET", "/api/contact/subscribers", async () => {
    const res = await request("GET", "/contact/subscribers?page=1&limit=10", {
      token: ctx.adminToken,
      expectedStatus: 200,
    });
    if (!res.data?.success || !Array.isArray(res.data?.data)) {
      throw new Error("Get subscribers failed");
    }
    const found = res.data.data.find((s: any) => s.email === ctx.testSubscriberEmail);
    if (found) {
      ctx.testSubscriberId = found.id;
    }
  });

  if (ctx.testSubscriberId) {
    await runTest("Contact", "Toggle Subscriber Active State (Admin)", "PATCH", "/api/contact/subscribers/:id/toggle", async () => {
      const res = await request("PATCH", `/contact/subscribers/${ctx.testSubscriberId}/toggle`, {
        token: ctx.adminToken,
        expectedStatus: 200,
      });
      if (!res.data?.success) throw new Error("Toggle subscriber failed");
    });
  }

  // ─────────────────────────────────────────────────────────────
  // 10. BLOG SYSTEM
  // ─────────────────────────────────────────────────────────────
  console.log(`\n${colors.bright}10. Blog System (/api/blog)${colors.reset}`);

  await runTest("Blog", "Create Blog Post (Admin/Editor)", "POST", "/api/blog", async () => {
    const res = await request("POST", "/blog", {
      token: ctx.adminToken,
      body: {
        title: `E2E Top 10 Cold-Pressed Juice Benefits ${timestamp}`,
        excerpt: "Discover the vitality of pure organic nutrients.",
        content: "Detailed blog post content discussing health benefits...",
        category: "Health & Nutrition",
        tags: ["Juices", "Wellness", "Detox"],
        isPublished: false,
      },
      expectedStatus: [200, 201],
    });
    if (!res.data?.success || !res.data?.data?.id) {
      throw new Error("Blog creation failed");
    }
    ctx.testBlogPostId = res.data.data.id;
    ctx.testBlogPostSlug = res.data.data.slug;
  });

  await runTest("Blog", "Publish Blog Post (Admin)", "PATCH", "/api/blog/:id/publish", async () => {
    const res = await request("PATCH", `/blog/${ctx.testBlogPostId}/publish`, {
      token: ctx.adminToken,
      expectedStatus: 200,
    });
    if (!res.data?.success || !res.data?.data?.isPublished) {
      throw new Error("Publishing blog failed");
    }
  });

  await runTest("Blog", "Get Published Blog Posts (Public)", "GET", "/api/blog", async () => {
    const res = await request("GET", "/blog", { expectedStatus: 200 });
    if (!res.data?.success || !Array.isArray(res.data?.data)) {
      throw new Error("Get published blog posts failed");
    }
  });

  await runTest("Blog", "Get All Blog Posts (Admin)", "GET", "/api/blog/all", async () => {
    const res = await request("GET", "/blog/all", {
      token: ctx.adminToken,
      expectedStatus: 200,
    });
    if (!res.data?.success || !Array.isArray(res.data?.data)) {
      throw new Error("Get all blog posts failed");
    }
  });

  await runTest("Blog", "Get Blog Post by Slug (Public)", "GET", "/api/blog/:slug", async () => {
    const res = await request("GET", `/blog/${ctx.testBlogPostSlug}`, {
      expectedStatus: 200,
    });
    if (!res.data?.success || res.data?.data?.slug !== ctx.testBlogPostSlug) {
      throw new Error("Get blog post by slug failed");
    }
  });

  await runTest("Blog", "Update Blog Post (Admin)", "PATCH", "/api/blog/:id", async () => {
    const res = await request("PATCH", `/blog/${ctx.testBlogPostId}`, {
      token: ctx.adminToken,
      body: { title: `E2E Updated Juice Benefits ${timestamp}` },
      expectedStatus: 200,
    });
    if (!res.data?.success) throw new Error("Update blog post failed");
  });

  // ─────────────────────────────────────────────────────────────
  // 11. GALLERY
  // ─────────────────────────────────────────────────────────────
  console.log(`\n${colors.bright}11. Gallery System (/api/gallery)${colors.reset}`);

  await runTest("Gallery", "Add Gallery Image (Admin)", "POST", "/api/gallery", async () => {
    const res = await request("POST", "/gallery", {
      token: ctx.adminToken,
      body: {
        src: "/images/MenuItems/juice-orange.png",
        alt: "Fresh Orange Sunshine",
        width: 800,
        height: 600,
        category: "fresh-juices",
      },
      expectedStatus: [200, 201],
    });
    if (!res.data?.success || !res.data?.data?.id) {
      throw new Error("Gallery image creation failed");
    }
    ctx.testGalleryImageId = res.data.data.id;
  });

  await runTest("Gallery", "Get Gallery Images (Public)", "GET", "/api/gallery", async () => {
    const res = await request("GET", "/gallery?category=fresh-juices", {
      expectedStatus: 200,
    });
    if (!res.data?.success || !Array.isArray(res.data?.data)) {
      throw new Error("Get gallery images failed");
    }
  });

  await runTest("Gallery", "Get Gallery Albums (Public)", "GET", "/api/gallery/albums", async () => {
    const res = await request("GET", "/gallery/albums", {
      expectedStatus: 200,
    });
    if (!res.data?.success || !Array.isArray(res.data?.data)) {
      throw new Error("Get gallery albums failed");
    }
  });

  await runTest("Gallery", "Update Gallery Image (Admin)", "PATCH", "/api/gallery/:id", async () => {
    const res = await request("PATCH", `/gallery/${ctx.testGalleryImageId}`, {
      token: ctx.adminToken,
      body: { title: "Fresh Orange Sunshine Updated" },
      expectedStatus: 200,
    });
    if (!res.data?.success) throw new Error("Gallery image update failed");
  });

  // ─────────────────────────────────────────────────────────────
  // 12. TESTIMONIALS
  // ─────────────────────────────────────────────────────────────
  console.log(`\n${colors.bright}12. Testimonials & Reviews (/api/testimonials)${colors.reset}`);

  await runTest("Testimonials", "Submit Testimonial (Public)", "POST", "/api/testimonials", async () => {
    const res = await request("POST", "/testimonials", {
      body: {
        name: "Nuwan Bandara",
        role: "Local Foodie",
        rating: 5,
        text: "The Wood Apple Juice here is unbeatable! 10/10 recommended.",
      },
      expectedStatus: [200, 201],
    });
    if (!res.data?.success || !res.data?.data?.id) {
      throw new Error("Testimonial submission failed");
    }
    ctx.testTestimonialId = res.data.data.id;
  });

  await runTest("Testimonials", "Get Approved Testimonials (Public)", "GET", "/api/testimonials", async () => {
    const res = await request("GET", "/testimonials", { expectedStatus: 200 });
    if (!res.data?.success || !Array.isArray(res.data?.data)) {
      throw new Error("Get testimonials failed");
    }
  });

  await runTest("Testimonials", "Get All Testimonials (Admin)", "GET", "/api/testimonials/all", async () => {
    const res = await request("GET", "/testimonials/all", {
      token: ctx.adminToken,
      expectedStatus: 200,
    });
    if (!res.data?.success || !Array.isArray(res.data?.data)) {
      throw new Error("Get all testimonials failed");
    }
  });

  await runTest("Testimonials", "Approve Testimonial (Admin)", "PATCH", "/api/testimonials/:id/approve", async () => {
    const res = await request("PATCH", `/testimonials/${ctx.testTestimonialId}/approve`, {
      token: ctx.adminToken,
      expectedStatus: 200,
    });
    if (!res.data?.success) throw new Error("Testimonial approval failed");
  });

  await runTest("Testimonials", "Update Testimonial (Admin)", "PATCH", "/api/testimonials/:id", async () => {
    const res = await request("PATCH", `/testimonials/${ctx.testTestimonialId}`, {
      token: ctx.adminToken,
      body: { isFeatured: true, rating: 5 },
      expectedStatus: 200,
    });
    if (!res.data?.success) throw new Error("Testimonial update failed");
  });

  // ─────────────────────────────────────────────────────────────
  // 13. SETTINGS
  // ─────────────────────────────────────────────────────────────
  console.log(`\n${colors.bright}13. Settings & Configuration (/api/settings)${colors.reset}`);

  await runTest("Settings", "Get Business Settings (Admin)", "GET", "/api/settings", async () => {
    const res = await request("GET", "/settings", {
      token: ctx.adminToken,
      expectedStatus: 200,
    });
    if (!res.data?.success || typeof res.data?.data !== "object") {
      throw new Error("Get settings failed");
    }
  });

  await runTest("Settings", "Update Business Settings (Admin)", "PATCH", "/api/settings", async () => {
    const res = await request("PATCH", "/settings", {
      token: ctx.adminToken,
      body: { delivery_fee: "150", currency: "LKR" },
      expectedStatus: 200,
    });
    if (!res.data?.success) throw new Error("Update settings failed");
  });

  // ─────────────────────────────────────────────────────────────
  // 14. ANALYTICS & DASHBOARD
  // ─────────────────────────────────────────────────────────────
  console.log(`\n${colors.bright}14. Analytics & Reports (/api/analytics)${colors.reset}`);

  await runTest("Analytics", "Get Dashboard KPI Stats (Admin)", "GET", "/api/analytics/dashboard", async () => {
    const res = await request("GET", "/analytics/dashboard", {
      token: ctx.adminToken,
      expectedStatus: 200,
    });
    if (!res.data?.success || typeof res.data?.data !== "object") {
      throw new Error("Dashboard analytics failed");
    }
  });

  await runTest("Analytics", "Get Revenue Chart (Admin)", "GET", "/api/analytics/revenue", async () => {
    const res = await request("GET", "/analytics/revenue?days=30", {
      token: ctx.adminToken,
      expectedStatus: 200,
    });
    if (!res.data?.success || !Array.isArray(res.data?.data)) {
      throw new Error("Revenue chart analytics failed");
    }
  });

  await runTest("Analytics", "Get Top Selling Menu Items (Admin)", "GET", "/api/analytics/top-selling", async () => {
    const res = await request("GET", "/analytics/top-selling?limit=5", {
      token: ctx.adminToken,
      expectedStatus: 200,
    });
    if (!res.data?.success || !Array.isArray(res.data?.data)) {
      throw new Error("Top selling analytics failed");
    }
  });

  await runTest("Analytics", "Get Order Status Breakdown (Admin)", "GET", "/api/analytics/order-statuses", async () => {
    const res = await request("GET", "/analytics/order-statuses", {
      token: ctx.adminToken,
      expectedStatus: 200,
    });
    if (!res.data?.success || typeof res.data?.data !== "object") {
      throw new Error("Order status breakdown failed");
    }
  });

  // ─────────────────────────────────────────────────────────────
  // 15. SECURITY & ROLE GUARDS
  // ─────────────────────────────────────────────────────────────
  console.log(`\n${colors.bright}15. Security & Access Control (Guards)${colors.reset}`);

  await runTest("Security", "Reject Unauthorized Access to /api/auth/me", "GET", "/api/auth/me", async () => {
    await request("GET", "/auth/me", { expectedStatus: 401 });
  });

  await runTest("Security", "Reject Customer Access to Admin Settings", "GET", "/api/settings", async () => {
    await request("GET", "/settings", {
      token: ctx.customerToken,
      expectedStatus: 403,
    });
  });

  await runTest("Security", "Reject Customer Access to Admin Inventory", "GET", "/api/inventory", async () => {
    await request("GET", "/inventory", {
      token: ctx.customerToken,
      expectedStatus: 403,
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 16. CLEANUP TEST ARTIFACTS
  // ─────────────────────────────────────────────────────────────
  console.log(`\n${colors.bright}16. Teardown & Resource Cleanup${colors.reset}`);

  if (ctx.testMenuItemId) {
    await runTest("Cleanup", "Delete Test Menu Item (Admin)", "DELETE", "/api/menu/items/:id", async () => {
      await request("DELETE", `/menu/items/${ctx.testMenuItemId}`, {
        token: ctx.adminToken,
        expectedStatus: 200,
      });
    });
  }

  if (ctx.testCategoryId) {
    await runTest("Cleanup", "Delete Test Category (Admin)", "DELETE", "/api/menu/categories/:id", async () => {
      await request("DELETE", `/menu/categories/${ctx.testCategoryId}`, {
        token: ctx.adminToken,
        expectedStatus: 200,
      });
    });
  }

  if (ctx.testTableId) {
    await runTest("Cleanup", "Delete Test Table (Admin)", "DELETE", "/api/tables/:id", async () => {
      await request("DELETE", `/tables/${ctx.testTableId}`, {
        token: ctx.adminToken,
        expectedStatus: 200,
      });
    });
  }

  if (ctx.testInventoryId) {
    await runTest("Cleanup", "Delete Test Inventory Item (Admin)", "DELETE", "/api/inventory/:id", async () => {
      await request("DELETE", `/inventory/${ctx.testInventoryId}`, {
        token: ctx.adminToken,
        expectedStatus: 200,
      });
    });
  }

  if (ctx.testEmployeeId) {
    await runTest("Cleanup", "Deactivate Test Employee (Admin)", "DELETE", "/api/employees/:id", async () => {
      await request("DELETE", `/employees/${ctx.testEmployeeId}`, {
        token: ctx.adminToken,
        expectedStatus: 200,
      });
    });
  }

  if (ctx.testCouponId) {
    await runTest("Cleanup", "Delete Test Coupon (Admin)", "DELETE", "/api/coupons/:id", async () => {
      await request("DELETE", `/coupons/${ctx.testCouponId}`, {
        token: ctx.adminToken,
        expectedStatus: 200,
      });
    });
  }

  if (ctx.testBlogPostId) {
    await runTest("Cleanup", "Delete Test Blog Post (Admin)", "DELETE", "/api/blog/:id", async () => {
      await request("DELETE", `/blog/${ctx.testBlogPostId}`, {
        token: ctx.adminToken,
        expectedStatus: 200,
      });
    });
  }

  if (ctx.testGalleryImageId) {
    await runTest("Cleanup", "Delete Test Gallery Image (Admin)", "DELETE", "/api/gallery/:id", async () => {
      await request("DELETE", `/gallery/${ctx.testGalleryImageId}`, {
        token: ctx.adminToken,
        expectedStatus: 200,
      });
    });
  }

  if (ctx.testTestimonialId) {
    await runTest("Cleanup", "Delete Test Testimonial (Admin)", "DELETE", "/api/testimonials/:id", async () => {
      await request("DELETE", `/testimonials/${ctx.testTestimonialId}`, {
        token: ctx.adminToken,
        expectedStatus: 200,
      });
    });
  }

  if (ctx.testSubscriberId) {
    await runTest("Cleanup", "Delete Test Subscriber (Admin)", "DELETE", "/api/contact/subscribers/:id", async () => {
      await request("DELETE", `/contact/subscribers/${ctx.testSubscriberId}`, {
        token: ctx.adminToken,
        expectedStatus: 200,
      });
    });
  }

  if (ctx.customerToken) {
    await runTest("Cleanup", "Customer Logout", "POST", "/api/auth/logout", async () => {
      await request("POST", "/auth/logout", {
        token: ctx.customerToken,
        expectedStatus: 200,
      });
    });
  }

  // ─────────────────────────────────────────────────────────────
  // REPORT SUMMARY
  // ─────────────────────────────────────────────────────────────
  const total = results.length;
  const passed = results.filter((r) => r.status === "PASS").length;
  const failed = results.filter((r) => r.status === "FAIL").length;
  const totalDuration = results.reduce((acc, r) => acc + r.durationMs, 0);

  console.log(`\n${colors.bright}${colors.cyan}====================================================`);
  console.log(`                  E2E TEST REPORT`);
  console.log(`====================================================${colors.reset}`);
  console.log(`  Total Test Cases : ${total}`);
  console.log(`  ${colors.green}Passed           : ${passed}${colors.reset}`);
  console.log(`  ${failed > 0 ? colors.red : colors.green}Failed           : ${failed}${colors.reset}`);
  console.log(`  Total Duration   : ${totalDuration}ms`);
  console.log(`  Success Rate     : ${Math.round((passed / total) * 100)}%`);
  console.log(`${colors.cyan}====================================================${colors.reset}\n`);

  if (failed > 0) {
    console.log(`${colors.red}Failed Tests Details:${colors.reset}`);
    results
      .filter((r) => r.status === "FAIL")
      .forEach((r) => {
        console.log(`  • [${r.method}] ${r.endpoint} (${r.group} - ${r.name}): ${r.error}`);
      });
    console.log();
  }

  if (apiServerProcess) {
    console.log(`${colors.dim}Stopping spawned API server...${colors.reset}`);
    apiServerProcess.kill();
  }

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

main().catch((err) => {
  console.error(`${colors.red}Fatal execution error:${colors.reset}`, err);
  if (apiServerProcess) apiServerProcess.kill();
  process.exit(1);
});
