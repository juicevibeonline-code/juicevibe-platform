import { apiClient } from "./api-client";

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  category: string;
  createdAt: string;
  album?: { id: string; name: string };
}

export const FALLBACK_GALLERY_IMAGES: GalleryImage[] = [
  { id: "g-1", src: "/images/MenuItems/tropical_smoothie_bowl.png", alt: "Tropical Dragonfruit Smoothie Bowl", category: "smoothies", width: 800, height: 600, createdAt: new Date().toISOString() },
  { id: "g-2", src: "/images/MenuItems/passionfruit_mojito_mocktail.png", alt: "Refreshing Passion Fruit Mojito Mocktail", category: "mocktails", width: 800, height: 600, createdAt: new Date().toISOString() },
  { id: "g-3", src: "/images/MenuItems/FreshOrange.png", alt: "Freshly Squeezed Orange Juice", category: "fresh-juices", width: 800, height: 600, createdAt: new Date().toISOString() },
  { id: "g-4", src: "/images/MenuItems/FJAvocado.png", alt: "Creamy Avocado Juice", category: "fresh-juices", width: 800, height: 600, createdAt: new Date().toISOString() },
  { id: "g-5", src: "/images/MenuItems/Special Smoothies-AandD.png", alt: "Avocado & Dates Special Smoothie", category: "smoothies", width: 800, height: 600, createdAt: new Date().toISOString() },
  { id: "g-6", src: "/images/MenuItems/Mocktails-Classic Virgin Mojito - LKR 400.00.png", alt: "Classic Virgin Mojito", category: "mocktails", width: 800, height: 600, createdAt: new Date().toISOString() },
  { id: "g-7", src: "/images/MenuItems/Burgers-ChickenBurger.png", alt: "Gourmet Chicken Burger", category: "burgers", width: 800, height: 600, createdAt: new Date().toISOString() },
  { id: "g-8", src: "/images/MenuItems/Sandwiches-ChickenHamCheese.png", alt: "Toasted Chicken Ham & Cheese Sandwich", category: "sandwiches", width: 800, height: 600, createdAt: new Date().toISOString() },
  { id: "g-9", src: "/images/MenuItems/Coffee-Cappuccino - LKR 300.00.png", alt: "Frothy Cappuccino", category: "coffee", width: 800, height: 600, createdAt: new Date().toISOString() },
  { id: "g-10", src: "/images/MenuItems/Milkshakes-Chocolate - LKR 300.png", alt: "Rich Chocolate Milkshake", category: "milkshakes", width: 800, height: 600, createdAt: new Date().toISOString() },
  { id: "g-11", src: "/images/MenuItems/Jaggery & Cashew Dream - LKR 500.00.jpg", alt: "Jaggery & Cashew Dream Ice Cream", category: "ice-cream", width: 800, height: 600, createdAt: new Date().toISOString() },
  { id: "g-12", src: "/images/Opening/Opening.png", alt: "Juice Vibe Waskaduwa Cafe Atmosphere", category: "general", width: 800, height: 600, createdAt: new Date().toISOString() },
];

export const galleryService = {
  async getImages(category?: string): Promise<GalleryImage[]> {
    try {
      const { data } = await apiClient.get("/gallery", { params: { category } });
      if (Array.isArray(data.data)) {
        return data.data;
      }
      return FALLBACK_GALLERY_IMAGES;
    } catch {
      return FALLBACK_GALLERY_IMAGES;
    }
  },

  async getAlbums(): Promise<any[]> {
    try {
      const { data } = await apiClient.get("/gallery/albums");
      return data.data;
    } catch {
      return [];
    }
  },

  async uploadImage(formData: FormData): Promise<GalleryImage> {
    const { data } = await apiClient.post("/gallery/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.data;
  },

  async updateImage(id: string, input: { title?: string; category?: string }): Promise<GalleryImage> {
    const { data } = await apiClient.patch(`/gallery/${id}`, input);
    return data.data;
  },

  async deleteImage(id: string): Promise<void> {
    await apiClient.delete(`/gallery/${id}`);
  },
};
