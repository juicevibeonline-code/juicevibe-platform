# 04. Feature Documentation Specification
**System:** Juice Vibe Digital Platform  
**Document Version:** 3.0.0-PROD  
**Author:** Dulanjaya Lakruwan  
**Date:** July 19, 2026  

---

## 1. Customer Storefront Features (`apps/web`)

### 1.1 Dynamic Menu Catalog & Filtering
- **Category Navigation**: 10 primary categories: Milkshakes, Fresh Juices, Special Smoothies, Lassi, Tea, Coffee, Mocktails, Fruits & Ice Cream, Burgers, and Sandwiches.
- **Search Query Indexing**: Instant client-side filtering matching product titles, descriptions, ingredients, and tags.
- **Visual Badges**: Dynamic `Popular` star badges, `Organic`, `100% Pure`, and `Creamy` category tag badges.

### 1.2 Table QR Code Dine-in Recognition
- **QR Parameter Parsing**: Automatically inspects URL query parameters (e.g., `?tableId=5`).
- **Cart Context Sync**: Stores table number in Zustand persistent storage and labels the order as `Dine-in — Table delivery incoming!` upon checkout.

### 1.3 Shopping Cart & Drawer
- **Persistent LocalStorage State**: Shopping cart items, quantities, selected variants (e.g., Small, Large), and add-ons (e.g., Add BOBA +LKR 100) persist across page refreshes.
- **Slide-out Drawer**: Quick cart summary with one-click quantity adjustment and instant price recalculations.

### 1.4 Multi-Option Checkout & Receipt Generation
- **Cash on Delivery (COD)**: Standard delivery or pickup order placement.
- **Online Bank Transfer**: Displays official Commercial Bank of Ceylon account details (Account Name: Juice Vibe Bentota, Account Number: 8010156942, Branch: Bentota) and generates an automated WhatsApp receipt submission button (`wa.me/94718435876?text=...`).
- **Coupon Code Validation**: Real-time server-side validation for discount coupons (e.g. `WELCOME10`).

---

## 2. Admin Operations Dashboard Features (`apps/admin`)

### 2.1 Multi-View Dispatch Order Desk
The order desk reads from a unified state source with 3 operational viewing modes:
1. **KANBAN BOARD**: Visual drag/advance status columns (`Pending` ➔ `Confirmed` ➔ `Preparing` ➔ `Ready` ➔ `Completed`).
2. **GRID LIST**: High-density tabular view with column sorting, status filtering, and **CSV Data Export** functionality.
3. **TABLE MAP**: Visual grid mapping out café table numbers, showing active orders per table and instant status transition buttons.

### 2.2 Real-time WebSocket Dispatcher (`useOrdersSocket`)
- Establishes a persistent socket connection to the NestJS API gateway.
- Plays an animated alert banner at the top of the Order Desk showing the new order number, table number, and LKR order total.

### 2.3 Brand Design System Compliance
- **Emerald Theme**: Anchored to `#0F2A1E` / `#1F2E24` dark tones, eliminating generic un-themed default UI components per `AGENTS.md` guidelines.
- **Typography**: IBM Plex Mono font applied to all price tags, totals, stock counts, dates, and order IDs.

---

## 3. Product Photography Catalog (100% Coverage)

All 35 menu items feature high-resolution studio product photography:

| Category | Item Name | Image Path |
| :--- | :--- | :--- |
| Milkshakes | Chocolate Milkshake | `/images/MenuItems/Milkshakes-Chocolate - LKR 300.png` |
| Milkshakes | Vanilla Milkshake | `/images/MenuItems/Milkshakes-Vanilla - LKR 300.png` |
| Milkshakes | Strawberry Milkshake | `/images/MenuItems/Milkshakes-Strawberry.png` |
| Milkshakes | Mango Milkshake | `/images/MenuItems/Milkshakes-Mango – LKR 300.00.png` |
| Milkshakes | Passion Fruit Milkshake | `/images/MenuItems/Milkshakes-Passion Fruit.png` |
| Milkshakes | Banana Milkshake | `/images/MenuItems/Milkshakes-Banana.png` |
| Milkshakes | Date & Almond Milkshake | `/images/MenuItems/Milkshakes-Date-Almond.png` |
| Fresh Juices | Ambarella Juice | `/images/MenuItems/Ambarella.png` |
| Fresh Juices | Avocado Juice | `/images/MenuItems/FJAvocado.png` |
| Fresh Juices | Coconut Water | `/images/MenuItems/FJCoconut.png` |
| Fresh Juices | Grapes Juice | `/images/MenuItems/FreshJuicesGrapes.png` |
| Fresh Juices | Lime Juice | `/images/MenuItems/FreshJuicesLime.png` |
| Fresh Juices | Mango Juice | `/images/MenuItems/FreshJuicesMango.png` |
| Fresh Juices | Orange Juice | `/images/MenuItems/FreshOrange.png` |
| Fresh Juices | Papaya Juice | `/images/MenuItems/FreshJuicesPapaya.png` |
| Fresh Juices | Passion Fruit Juice | `/images/MenuItems/FreshJuicesPassionFruit.jpg` |
| Fresh Juices | Pineapple Juice | `/images/MenuItems/FreshJuicesPineapple.png` |
| Fresh Juices | Soursop Juice | `/images/MenuItems/FreshJuicesSoursop.png` |
| Fresh Juices | Watermelon Juice | `/images/MenuItems/FreshJuicesWatermelon.png` |
| Fresh Juices | Wood Apple Juice | `/images/MenuItems/FreshJuicesWoodApple.png` |
| Smoothies | Avocado & Dates Smoothie | `/images/MenuItems/Special Smoothies-AandD.png` |
| Smoothies | Wood Apple Zest Smoothie | `/images/MenuItems/Special Smoothies-Wood Apple Zest.png` |
| Lassi | Classic Lassi | `/images/MenuItems/LassiClassic – LKR 400.00.png` |
| Lassi | Mango Lassi | `/images/MenuItems/Lassi-Mango – LKR 400.00.png` |
| Lassi | Passion Fruit Lassi | `/images/MenuItems/Lassi-Passion Fruit – LKR 400.00.png` |
| Lassi | Orange Lassi | `/images/MenuItems/Lassi-Orange – LKR 400.00.png` |
| Tea | English Breakfast Tea | `/images/MenuItems/Tea-English Breakfast Tea – LKR 100.00.png` |
| Tea | Green Tea | `/images/MenuItems/Tea-Green Tea – LKR 100.00.png` |
| Tea | Ginger Tea | `/images/MenuItems/Ginger Tea – LKR 100.00.png` |
| Tea | Lemon Tea | `/images/MenuItems/Lemon Tea – LKR 100.00.png` |
| Tea | Mint Tea | `/images/MenuItems/Mint Tea – LKR 100.00.png` |
| Coffee | Americano | `/images/MenuItems/Americano – LKR 200.00.png` |
| Coffee | Espresso | `/images/MenuItems/Coffee-Espresso – LKR 200.00.png` |
| Coffee | Cappuccino | `/images/MenuItems/Coffee-Cappuccino – LKR 300.00.png` |
| Mocktails | Classic Virgin Mojito | `/images/MenuItems/Mocktails-Classic Virgin Mojito – LKR 400.00.png` |
| Mocktails | Flavoured Mojito | `/images/MenuItems/Mocktails-Flavoured Mojito.png` |
| Desserts | Jaggery & Cashew Dream | `/images/MenuItems/Jaggery & Cashew Dream – LKR 500.00.jpg` |
| Desserts | Banana Boat Split | `/images/MenuItems/IceCream-BananaBoat.png` |
| Desserts | Tropical Fruit Salad | `/images/MenuItems/IceCream-FruitSalad.png` |
| Desserts | Fruit Salad with Ice Cream | `/images/MenuItems/IceCream-FruitSaladWithIceCream.png` |
| Desserts | Choice of Ice Cream 3 Scoops | `/images/MenuItems/IceCream-3Scoops.png` |
| Burgers | Chicken Burger | `/images/MenuItems/Burgers-ChickenBurger.png` |
| Burgers | Vegetable & Cheese Burger | `/images/MenuItems/Burgers-VegCheeseBurger.png` |
| Sandwiches | Cheese & Tomato Sandwich | `/images/MenuItems/Sandwiches-CheeseTomato.png` |
| Sandwiches | Chicken Ham & Cheese Sandwich | `/images/MenuItems/Sandwiches-ChickenHamCheese.png` |
