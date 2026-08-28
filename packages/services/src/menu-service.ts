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
  // Milkshakes (Official: Rs. 350 - 400)
  createFallbackItem("m-1", "Chocolate Milkshake", "chocolate-milkshake", "Rich & creamy chocolate milkshake", 350, "milkshakes", "/images/MenuItems/milkshake-chocolate.png", { isPopular: true }),
  createFallbackItem("m-2", "Vanilla Milkshake", "vanilla-milkshake", "Classic vanilla bean milkshake", 350, "milkshakes", "/images/MenuItems/milkshake-vanilla.png"),
  createFallbackItem("m-3", "Strawberry Milkshake", "strawberry-milkshake", "Fresh strawberry milkshake", 350, "milkshakes", "/images/MenuItems/milkshake-strawberry.png"),
  createFallbackItem("m-4", "Mango Milkshake", "mango-milkshake", "Thick tropical mango milkshake", 350, "milkshakes", "/images/MenuItems/milkshake-mango.png", { isPopular: true }),
  createFallbackItem("m-5", "Passion Fruit Milkshake", "passion-fruit-milkshake", "Tropical passion fruit milkshake", 350, "milkshakes", "/images/MenuItems/milkshake-passion-fruit.png"),
  createFallbackItem("m-6", "Banana Milkshake", "banana-milkshake", "Fresh banana & milk creamy shake", 350, "milkshakes", "/images/MenuItems/milkshake-banana.png"),
  createFallbackItem("m-7", "Mixed Fruit Milkshake", "mixed-fruit-milkshake", "Delicious blend of seasonal fruits and cold milk", 350, "milkshakes", "/images/MenuItems/milkshake-strawberry.png", { isPopular: true }),
  createFallbackItem("m-8", "Date & Almond Milkshake", "date-almond-milkshake", "Healthy energy-boosting date & almond shake", 400, "milkshakes", "/images/MenuItems/milkshake-date-almond.png", { isPopular: true }),
  createFallbackItem("m-9", "Falooda Milkshake", "falooda-milkshake", "Traditional sweet falooda shake with basil seeds", 400, "milkshakes", "/images/MenuItems/milkshake-strawberry.png", { isPopular: true }),

  // Fresh Juices (Official: Rs. 250 - 400)
  createFallbackItem("j-1", "Avocado Juice", "avocado-juice", "Creamy fresh avocado juice", 300, "fresh-juices", "/images/MenuItems/juice-avocado.png", { isPopular: true }),
  createFallbackItem("j-2", "Lime Juice", "lime-juice", "Fresh zesty lime juice with a hint of mint", 250, "fresh-juices", "/images/MenuItems/juice-lime.png"),
  createFallbackItem("j-3", "Mango Juice", "mango-juice", "Ripe sweet mango pulp blended to perfection", 300, "fresh-juices", "/images/MenuItems/juice-mango.png", { isPopular: true }),
  createFallbackItem("j-4", "Mixed Fruit Juice", "mixed-fruit-juice", "Freshly pressed mix of tropical fruits", 350, "fresh-juices", "/images/MenuItems/juice-orange.png", { isPopular: true }),
  createFallbackItem("j-5", "Orange Juice", "orange-juice", "Freshly squeezed sweet citrus oranges", 400, "fresh-juices", "/images/MenuItems/juice-orange.png"),
  createFallbackItem("j-6", "Papaya Juice", "papaya-juice", "Creamy wholesome fresh papaya juice", 250, "fresh-juices", "/images/MenuItems/juice-papaya.png"),
  createFallbackItem("j-7", "Passion Fruit Juice", "passion-fruit-juice", "Exotic tropical passion fruit pulp juice", 300, "fresh-juices", "/images/MenuItems/juice-passion-fruit.jpg"),
  createFallbackItem("j-8", "Pineapple Juice", "pineapple-juice", "Sweet & tangy freshly squeezed pineapple juice", 300, "fresh-juices", "/images/MenuItems/juice-pineapple.png"),
  createFallbackItem("j-9", "Soursop Juice", "soursop-juice", "Fresh soursop juice — rich tropical classic", 300, "fresh-juices", "/images/MenuItems/juice-soursop.png", { isPopular: true }),
  createFallbackItem("j-10", "Watermelon Juice", "watermelon-juice", "Chilled deeply refreshing watermelon juice", 250, "fresh-juices", "/images/MenuItems/juice-watermelon.png"),
  createFallbackItem("j-11", "Wood Apple Juice", "wood-apple-juice", "Traditional Sri Lankan authentic wood apple juice", 300, "fresh-juices", "/images/MenuItems/juice-wood-apple.png"),

  // Special Smoothies (Official: Rs. 500)
  createFallbackItem("s-1", "Avocado & Dates Smoothie", "avocado-dates-smoothie", "Avocado, Dates, Milk, Treacle", 500, "smoothies", "/images/MenuItems/smoothie-avocado-dates.png", { isPopular: true, isFeatured: true }),
  createFallbackItem("s-2", "Wood Apple Zest Smoothie", "wood-apple-zest-smoothie", "Wood Apple, Coconut Milk, Jaggery", 500, "smoothies", "/images/MenuItems/smoothie-wood-apple-zest.png", { isPopular: true, isFeatured: true }),

  // Lassi (Official: Rs. 400)
  createFallbackItem("l-1", "Classic Lassi", "classic-lassi", "Traditional sweet creamy yogurt drink", 400, "lassi", "/images/MenuItems/lassi-classic.png"),
  createFallbackItem("l-2", "Mango Lassi", "mango-lassi", "Mango pulp blended with fresh yogurt", 400, "lassi", "/images/MenuItems/lassi-mango.png", { isPopular: true }),
  createFallbackItem("l-3", "Passion Fruit Lassi", "passion-fruit-lassi", "Passion fruit & yogurt blend", 400, "lassi", "/images/MenuItems/lassi-passion-fruit.png"),
  createFallbackItem("l-4", "Orange Lassi", "orange-lassi", "Orange yogurt refresher", 400, "lassi", "/images/MenuItems/lassi-orange.png"),

  // Tea (Official: Rs. 100)
  createFallbackItem("t-1", "English Breakfast Tea", "english-breakfast-tea", "Classic robust English breakfast tea", 100, "tea", "/images/MenuItems/tea-english-breakfast.png"),
  createFallbackItem("t-2", "Green Tea", "green-tea", "Light & refreshing green tea", 100, "tea", "/images/MenuItems/tea-green.png"),
  createFallbackItem("t-3", "Ginger Tea", "ginger-tea", "Spiced warming ginger tea", 100, "tea", "/images/MenuItems/tea-ginger.png", { isPopular: true }),
  createFallbackItem("t-4", "Lemon Tea", "lemon-tea", "Ceylon black tea with fresh lemon", 100, "tea", "/images/MenuItems/tea-lemon.png"),
  createFallbackItem("t-5", "Mint Tea", "mint-tea", "Cooling fresh mint herbal tea", 100, "tea", "/images/MenuItems/tea-mint.png"),

  // Coffee (Official: Rs. 200 - 300)
  createFallbackItem("c-1", "Americano", "americano", "Bold espresso with hot water", 200, "coffee", "/images/MenuItems/coffee-americano.png"),
  createFallbackItem("c-2", "Espresso", "espresso", "Rich double-shot espresso", 200, "coffee", "/images/MenuItems/coffee-espresso.png"),
  createFallbackItem("c-3", "Cappuccino", "cappuccino", "Espresso with velvety frothy milk", 300, "coffee", "/images/MenuItems/coffee-cappuccino.png", { isPopular: true }),

  // Mocktails (Official: Rs. 400)
  createFallbackItem("mo-1", "Classic Virgin Mojito", "classic-virgin-mojito", "Mint, lime, soda & sugar — the timeless classic", 400, "mocktails", "/images/MenuItems/mocktail-classic-virgin-mojito.png", { isPopular: true, isFeatured: true }),
  createFallbackItem("mo-2", "Flavoured Mojito", "flavoured-mojito", "Choose your flavour: Mango · Mandarin · Passion Fruit · Blackcurrant", 400, "mocktails", "/images/MenuItems/mocktail-flavoured-mojito.png", { isPopular: true }),

  // Fruits & Ice Cream (Official: Rs. 350 - 500)
  createFallbackItem("ic-1", "Jaggery & Cashew Dream", "jaggery-cashew-dream", "Traditional jaggery with premium cashew nuts & ice cream", 500, "ice-cream", "/images/MenuItems/icecream-jaggery-cashew-dream.jpg", { isPopular: true, isFeatured: true }),
  createFallbackItem("ic-2", "Banana Boat", "banana-boat", "Banana split with ice cream & indulgent toppings", 500, "ice-cream", "/images/MenuItems/icecream-banana-boat.png"),
  createFallbackItem("ic-3", "Fruit Salad", "fruit-salad", "Fresh seasonal tropical fruit salad", 350, "ice-cream", "/images/MenuItems/icecream-fruit-salad.png"),
  createFallbackItem("ic-4", "Fruit Salad with Ice Cream", "fruit-salad-with-ice-cream", "Fresh fruit salad topped with creamy ice cream", 400, "ice-cream", "/images/MenuItems/icecream-fruit-salad-with-icecream.png", { isPopular: true }),
  createFallbackItem("ic-5", "Choice of Ice Cream (3 Scoops)", "ice-cream-3-scoops", "Mix & match: Vanilla · Chocolate · Strawberry · Fruit & Nut · Mango", 350, "ice-cream", "/images/MenuItems/icecream-3-scoops.png"),

  // Burgers (Official: Rs. 350 - 400)
  createFallbackItem("b-1", "Chicken Burger", "chicken-burger", "Grilled chicken patty with fresh toppings", 400, "burgers", "/images/MenuItems/burger-chicken.png", { isPopular: true }),
  createFallbackItem("b-2", "Vegetable and Cheese Burger", "veg-cheese-burger", "Crispy veggie patty with melted cheese", 350, "burgers", "/images/MenuItems/burger-veg-cheese.png"),

  // Sandwiches (Official: Rs. 300 - 350)
  createFallbackItem("sw-1", "Cheese and Tomato Sandwich", "cheese-tomato-sandwich", "Grilled cheese with fresh ripe tomato", 300, "sandwiches", "/images/MenuItems/sandwich-cheese-tomato.png"),
  createFallbackItem("sw-2", "Chicken Ham and Cheese", "chicken-ham-cheese-sandwich", "Chicken ham with melted cheese on toasted bread", 350, "sandwiches", "/images/MenuItems/sandwich-chicken-ham-cheese.png", { isPopular: true }),
];

export const menuService = {
  async getCategories(): Promise<MenuCategory[]> {
    try {
      const { data } = await apiClient.get("/menu/categories");
      if (Array.isArray(data.data) && data.data.length > 0) {
        return data.data;
      }
      return Array.isArray(data?.data) ? data.data : FALLBACK_CATEGORIES;
    } catch {
      return FALLBACK_CATEGORIES;
    }
  },

  async getMenuItems(params?: { category?: string; search?: string; popular?: boolean; status?: string }): Promise<MenuItem[]> {
    try {
      const { data } = await apiClient.get("/menu/items", { params });
      if (Array.isArray(data.data)) {
        return data.data;
      }
      return FALLBACK_MENU_ITEMS;
    } catch {
      let items = FALLBACK_MENU_ITEMS;
      if (params?.category && params.category !== "all") {
        items = items.filter((i) => {
          const catSlug = typeof i.category === "string" ? i.category : i.category?.slug;
          return catSlug === params.category;
        });
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        items = items.filter((i) => i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q));
      }
      if (params?.popular) {
        items = items.filter((i) => i.isPopular);
      }
      return items;
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
