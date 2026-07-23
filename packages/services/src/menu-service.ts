import { apiClient } from "./api-client";
import type { MenuCategory, MenuItem } from "@juice-vibe/types";

const now = new Date().toISOString();

export const FALLBACK_CATEGORIES: MenuCategory[] = [
  { id: "cat-1", name: "Milkshakes", slug: "milkshakes", icon: "CupSoda", order: 1, status: "active", items: [], createdAt: now, updatedAt: now },
  { id: "cat-2", name: "Fresh Juices", slug: "fresh-juices", icon: "Apple", order: 2, status: "active", items: [], createdAt: now, updatedAt: now },
  { id: "cat-3", name: "Special Smoothies", slug: "smoothies", icon: "Blend", order: 3, status: "active", items: [], createdAt: now, updatedAt: now },
  { id: "cat-4", name: "Lassi", slug: "lassi", icon: "Milk", order: 4, status: "active", items: [], createdAt: now, updatedAt: now },
  { id: "cat-5", name: "Tea", slug: "tea", icon: "Coffee", order: 5, status: "active", items: [], createdAt: now, updatedAt: now },
  { id: "cat-6", name: "Coffee", slug: "coffee", icon: "Coffee", order: 6, status: "active", items: [], createdAt: now, updatedAt: now },
  { id: "cat-7", name: "Mocktails", slug: "mocktails", icon: "Wine", order: 7, status: "active", items: [], createdAt: now, updatedAt: now },
  { id: "cat-8", name: "Fruits & Ice Cream", slug: "ice-cream", icon: "IceCream", order: 8, status: "active", items: [], createdAt: now, updatedAt: now },
  { id: "cat-9", name: "Burgers", slug: "burgers", icon: "Hamburger", order: 9, status: "active", items: [], createdAt: now, updatedAt: now },
  { id: "cat-10", name: "Sandwiches", slug: "sandwiches", icon: "Sandwich", order: 10, status: "active", items: [], createdAt: now, updatedAt: now },
];

const catMap = Object.fromEntries(FALLBACK_CATEGORIES.map((c) => [c.slug, c]));

const createFallbackItem = (
  id: string,
  name: string,
  slug: string,
  description: string,
  price: number,
  categorySlug: string,
  thumbnail: string,
  opts?: { isPopular?: boolean; isFeatured?: boolean }
): MenuItem => ({
  id,
  name,
  slug,
  description,
  price,
  categoryId: catMap[categorySlug]?.id || "cat-1",
  category: catMap[categorySlug] || FALLBACK_CATEGORIES[0],
  images: [thumbnail],
  thumbnail,
  availability: "in_stock",
  isPopular: opts?.isPopular ?? false,
  isFeatured: opts?.isFeatured ?? false,
  ingredients: [],
  tags: [],
  variants: [],
  addOns: [],
  order: 1,
  status: "active",
  createdAt: now,
  updatedAt: now,
});

export const FALLBACK_MENU_ITEMS: MenuItem[] = [
  // Milkshakes
  createFallbackItem("m-1", "Chocolate Milkshake", "chocolate-milkshake", "Rich & creamy chocolate milkshake", 300, "milkshakes", "/images/MenuItems/Milkshakes-Chocolate - LKR 300.png", { isPopular: true }),
  createFallbackItem("m-2", "Vanilla Milkshake", "vanilla-milkshake", "Classic vanilla bean milkshake", 300, "milkshakes", "/images/MenuItems/Milkshakes-Vanilla - LKR 300.png"),
  createFallbackItem("m-3", "Strawberry Milkshake", "strawberry-milkshake", "Fresh strawberry milkshake", 300, "milkshakes", "/images/MenuItems/Milkshakes-Strawberry.png"),
  createFallbackItem("m-4", "Mango Milkshake", "mango-milkshake", "Thick tropical mango milkshake", 300, "milkshakes", "/images/MenuItems/Milkshakes-Mango - LKR 300.00.png", { isPopular: true }),
  createFallbackItem("m-5", "Passion Fruit Milkshake", "passion-fruit-milkshake", "Tropical passion fruit milkshake", 300, "milkshakes", "/images/MenuItems/Milkshakes-Passion Fruit.png"),
  createFallbackItem("m-6", "Banana Milkshake", "banana-milkshake", "Fresh banana & milk creamy shake", 300, "milkshakes", "/images/MenuItems/Milkshakes-Banana.png"),
  createFallbackItem("m-7", "Date & Almond Milkshake", "date-almond-milkshake", "Healthy energy-boosting date & almond shake", 400, "milkshakes", "/images/MenuItems/Milkshakes-Date-Almond.png", { isPopular: true }),

  // Fresh Juices
  createFallbackItem("j-1", "Ambarella Juice", "ambarella-juice", "Freshly squeezed ambarella juice", 250, "fresh-juices", "/images/MenuItems/Ambarella.png"),
  createFallbackItem("j-2", "Avocado Juice", "avocado-juice", "Creamy fresh avocado juice", 300, "fresh-juices", "/images/MenuItems/FJAvocado.png"),
  createFallbackItem("j-3", "Coconut Juice", "coconut-juice", "Fresh tender coconut water", 250, "fresh-juices", "/images/MenuItems/FJCoconut.png"),
  createFallbackItem("j-4", "Grapes Juice", "grapes-juice", "Fresh pressed grape juice", 500, "fresh-juices", "/images/MenuItems/FreshJuicesGrapes.png", { isPopular: true }),
  createFallbackItem("j-5", "Lime Juice", "lime-juice", "Fresh lime juice with a hint of mint", 200, "fresh-juices", "/images/MenuItems/FreshJuicesLime.png"),
  createFallbackItem("j-6", "Mango Juice", "mango-juice", "Ripe mango pulp blended to perfection", 300, "fresh-juices", "/images/MenuItems/FreshJuicesMango.png", { isPopular: true }),
  createFallbackItem("j-7", "Orange Juice", "orange-juice", "Freshly squeezed sweet oranges", 400, "fresh-juices", "/images/MenuItems/FreshOrange.png"),
  createFallbackItem("j-8", "Papaya Juice", "papaya-juice", "Creamy fresh papaya juice", 250, "fresh-juices", "/images/MenuItems/FreshJuicesPapaya.png"),
  createFallbackItem("j-9", "Passion Fruit Juice", "passion-fruit-juice", "Exotic passion fruit pulp juice", 250, "fresh-juices", "/images/MenuItems/FreshJuicesPassionFruit.jpg"),
  createFallbackItem("j-10", "Pineapple Juice", "pineapple-juice", "Sweet & tangy fresh pineapple juice", 250, "fresh-juices", "/images/MenuItems/FreshJuicesPineapple.png"),
  createFallbackItem("j-11", "Soursop Juice", "soursop-juice", "Fresh soursop juice — a tropical classic", 300, "fresh-juices", "/images/MenuItems/FreshJuicesSoursop.png", { isPopular: true }),
  createFallbackItem("j-12", "Watermelon Juice", "watermelon-juice", "Chilled refreshing watermelon juice", 250, "fresh-juices", "/images/MenuItems/FreshJuicesWatermelon.png"),
  createFallbackItem("j-13", "Wood Apple Juice", "wood-apple-juice", "Traditional Sri Lankan wood apple juice", 300, "fresh-juices", "/images/MenuItems/FreshJuicesWoodApple.png"),

  // Smoothies
  createFallbackItem("s-1", "Tropical Smoothie Bowl", "tropical-smoothie-bowl", "Dragonfruit, mango, coconut & chia seeds", 550, "smoothies", "/images/MenuItems/tropical_smoothie_bowl.png", { isPopular: true, isFeatured: true }),
  createFallbackItem("s-2", "Avocado & Dates Smoothie", "avocado-dates-smoothie", "Avocado, Dates, Milk, Treacle", 450, "smoothies", "/images/MenuItems/Special Smoothies-AandD.png", { isPopular: true, isFeatured: true }),
  createFallbackItem("s-3", "Wood Apple Zest Smoothie", "wood-apple-zest-smoothie", "Wood Apple, Coconut Milk, Jaggery", 400, "smoothies", "/images/MenuItems/Special Smoothies-Wood Apple Zest.png"),

  // Lassi
  createFallbackItem("l-1", "Classic Lassi", "classic-lassi", "Traditional sweet creamy yogurt drink", 400, "lassi", "/images/MenuItems/LassiClassic - LKR 400.00.png"),
  createFallbackItem("l-2", "Mango Lassi", "mango-lassi", "Mango pulp blended with fresh yogurt", 400, "lassi", "/images/MenuItems/Lassi-Mango - LKR 400.00.png", { isPopular: true }),
  createFallbackItem("l-3", "Passion Fruit Lassi", "passion-fruit-lassi", "Passion fruit & yogurt blend", 400, "lassi", "/images/MenuItems/Lassi-Passion Fruit - LKR 400.00.png"),
  createFallbackItem("l-4", "Orange Lassi", "orange-lassi", "Orange yogurt refresher", 400, "lassi", "/images/MenuItems/Lassi-Orange - LKR 400.00.png"),

  // Tea
  createFallbackItem("t-1", "English Breakfast Tea", "english-breakfast-tea", "Classic robust English breakfast tea", 100, "tea", "/images/MenuItems/Tea-English Breakfast Tea - LKR 100.00.png"),
  createFallbackItem("t-2", "Green Tea", "green-tea", "Light & refreshing green tea", 100, "tea", "/images/MenuItems/Tea-Green Tea - LKR 100.00.png"),
  createFallbackItem("t-3", "Ginger Tea", "ginger-tea", "Spiced warming ginger tea", 100, "tea", "/images/MenuItems/Ginger Tea - LKR 100.00.png", { isPopular: true }),
  createFallbackItem("t-4", "Lemon Tea", "lemon-tea", "Black tea with fresh lemon zest", 100, "tea", "/images/MenuItems/Lemon Tea - LKR 100.00.png"),
  createFallbackItem("t-5", "Mint Tea", "mint-tea", "Cooling fresh mint herbal tea", 100, "tea", "/images/MenuItems/Mint Tea - LKR 100.00.png"),

  // Coffee
  createFallbackItem("c-1", "Americano", "americano", "Bold espresso with hot water", 200, "coffee", "/images/MenuItems/Americano - LKR 200.00.png"),
  createFallbackItem("c-2", "Espresso", "espresso", "Rich double-shot espresso", 200, "coffee", "/images/MenuItems/Coffee-Espresso - LKR 200.00.png"),
  createFallbackItem("c-3", "Cappuccino", "cappuccino", "Espresso with velvety frothy milk", 300, "coffee", "/images/MenuItems/Coffee-Cappuccino - LKR 300.00.png", { isPopular: true }),

  // Mocktails
  createFallbackItem("mo-1", "Passion Fruit Mojito", "passion-fruit-mojito", "Fresh passionfruit pulp, mint & soda", 450, "mocktails", "/images/MenuItems/passionfruit_mojito_mocktail.png", { isPopular: true, isFeatured: true }),
  createFallbackItem("mo-2", "Classic Virgin Mojito", "classic-virgin-mojito", "Mint, lime, soda & sugar — timeless classic", 400, "mocktails", "/images/MenuItems/Mocktails-Classic Virgin Mojito - LKR 400.00.png", { isPopular: true }),
  createFallbackItem("mo-3", "Flavoured Mojito", "flavoured-mojito", "Choose: Mango · Mandarin · Passion Fruit · Blackcurrant", 400, "mocktails", "/images/MenuItems/Mocktails-Flavoured Mojito.png"),

  // Fruits & Ice Cream
  createFallbackItem("ic-1", "Jaggery & Cashew Dream", "jaggery-cashew-dream", "Traditional jaggery with cashew nuts & ice cream", 500, "ice-cream", "/images/MenuItems/Jaggery & Cashew Dream - LKR 500.00.jpg", { isPopular: true, isFeatured: true }),
  createFallbackItem("ic-2", "Banana Boat", "banana-boat", "Banana split with ice cream & toppings", 500, "ice-cream", "/images/MenuItems/IceCream-BananaBoat.png"),
  createFallbackItem("ic-3", "Fruit Salad", "fruit-salad", "Fresh seasonal tropical fruit salad", 300, "ice-cream", "/images/MenuItems/IceCream-FruitSalad.png"),
  createFallbackItem("ic-4", "Fruit Salad with Ice Cream", "fruit-salad-with-ice-cream", "Fresh fruit salad topped with ice cream", 350, "ice-cream", "/images/MenuItems/IceCream-FruitSaladWithIceCream.png"),
  createFallbackItem("ic-5", "Choice of Ice Cream (3 Scoops)", "ice-cream-3-scoops", "Mix & match: Vanilla · Chocolate · Strawberry · Mango", 350, "ice-cream", "/images/MenuItems/IceCream-3Scoops.png"),

  // Burgers
  createFallbackItem("b-1", "Chicken Burger", "chicken-burger", "Grilled chicken patty with fresh toppings", 400, "burgers", "/images/MenuItems/Burgers-ChickenBurger.png", { isPopular: true }),
  createFallbackItem("b-2", "Vegetable & Cheese Burger", "veg-cheese-burger", "Crispy veggie patty with melted cheese", 300, "burgers", "/images/MenuItems/Burgers-VegCheeseBurger.png"),

  // Sandwiches
  createFallbackItem("sw-1", "Cheese & Tomato Sandwich", "cheese-tomato-sandwich", "Grilled cheese with fresh ripe tomato", 250, "sandwiches", "/images/MenuItems/Sandwiches-CheeseTomato.png"),
  createFallbackItem("sw-2", "Chicken Ham & Cheese Sandwich", "chicken-ham-cheese-sandwich", "Chicken ham with melted cheese on toasted bread", 300, "sandwiches", "/images/MenuItems/Sandwiches-ChickenHamCheese.png", { isPopular: true }),
];

export const menuService = {
  async getCategories(): Promise<MenuCategory[]> {
    try {
      const { data } = await apiClient.get("/menu/categories");
      if (Array.isArray(data.data) && data.data.length > 0) {
        return data.data;
      }
      return FALLBACK_CATEGORIES;
    } catch {
      return FALLBACK_CATEGORIES;
    }
  },

  async getMenuItems(params?: { category?: string; search?: string; popular?: boolean; status?: string }): Promise<MenuItem[]> {
    try {
      const { data } = await apiClient.get("/menu/items", { params });
      if (Array.isArray(data.data) && data.data.length > 0) {
        return data.data;
      }
      return FALLBACK_MENU_ITEMS;
    } catch {
      return FALLBACK_MENU_ITEMS;
    }
  },

  async getMenuItem(id: string): Promise<MenuItem> {
    try {
      const { data } = await apiClient.get(`/menu/items/${id}`);
      return data.data;
    } catch {
      const found = FALLBACK_MENU_ITEMS.find((item) => item.id === id || item.slug === id);
      if (found) return found;
      throw new Error("Item not found");
    }
  },

  async createCategory(input: { name: string; description?: string; icon: string }): Promise<MenuCategory> {
    const { data } = await apiClient.post("/menu/categories", input);
    return data.data;
  },

  async createItem(input: FormData): Promise<MenuItem> {
    const { data } = await apiClient.post("/menu/items", input, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.data;
  },

  async createMenuItem(input: any): Promise<MenuItem> {
    const { data } = await apiClient.post("/menu/items", input);
    return data.data;
  },

  async updateItem(id: string, input: Partial<MenuItem>): Promise<MenuItem> {
    const { data } = await apiClient.patch(`/menu/items/${id}`, input);
    return data.data;
  },

  async deleteItem(id: string): Promise<void> {
    await apiClient.delete(`/menu/items/${id}`);
  },

  async restoreItem(id: string): Promise<MenuItem> {
    const { data } = await apiClient.patch(`/menu/items/${id}/restore`);
    return data.data;
  },

  async reorderItems(items: { id: string; order: number }[]): Promise<void> {
    await apiClient.put("/menu/items/reorder", { items });
  },
};
