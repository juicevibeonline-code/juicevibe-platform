export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  category: string;
}

export const galleryImages: GalleryImage[] = [
  { id: "g1", src: "/gallery/juice-1.jpg", alt: "Fresh Orange Juice", width: 800, height: 1000, category: "juices" },
  { id: "g2", src: "/gallery/juice-2.jpg", alt: "Mango Magic Smoothie", width: 800, height: 800, category: "smoothies" },
  { id: "g3", src: "/gallery/juice-3.jpg", alt: "Berry Fusion Drink", width: 800, height: 600, category: "signature" },
  { id: "g4", src: "/gallery/juice-4.jpg", alt: "Tropical Paradise", width: 800, height: 900, category: "signature" },
  { id: "g5", src: "/gallery/juice-5.jpg", alt: "Green Detox Smoothie", width: 800, height: 700, category: "smoothies" },
  { id: "g6", src: "/gallery/juice-6.jpg", alt: "Fresh Fruit Platter", width: 800, height: 800, category: "food" },
  { id: "g7", src: "/gallery/juice-7.jpg", alt: "Cafe Interior", width: 800, height: 600, category: "interior" },
  { id: "g8", src: "/gallery/juice-8.jpg", alt: "Milkshakes", width: 800, height: 1000, category: "milkshakes" },
  { id: "g9", src: "/gallery/juice-9.jpg", alt: "Juice Vibe Team", width: 800, height: 600, category: "team" },
  { id: "g10", src: "/gallery/juice-10.jpg", alt: "Burger and Sides", width: 800, height: 800, category: "food" },
  { id: "g11", src: "/gallery/juice-11.jpg", alt: "Coffee Art", width: 800, height: 900, category: "coffee" },
  { id: "g12", src: "/gallery/juice-12.jpg", alt: "Juice Bar Counter", width: 800, height: 600, category: "interior" },
];
