export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  category: string;
}

export const galleryImages: GalleryImage[] = [
  { id: "g1", src: "/images/MenuItems/hero.png", alt: "Tropical Mango Juice", width: 800, height: 1000, category: "juices" },
  { id: "g2", src: "/images/MenuItems/FreshJuicesMango.png", alt: "Fresh Mango Juice", width: 800, height: 800, category: "juices" },
  { id: "g3", src: "/images/MenuItems/FreshJuicesGrapes.png", alt: "Grape Juice", width: 800, height: 600, category: "juices" },
  { id: "g4", src: "/images/MenuItems/FreshJuicesPassionFruit.jpg", alt: "Passion Fruit Juice", width: 800, height: 900, category: "signature" },
  { id: "g5", src: "/images/MenuItems/FreshJuicesSoursop.png", alt: "Soursop Juice", width: 800, height: 700, category: "signature" },
  { id: "g6", src: "/images/MenuItems/FreshJuicesWatermelon.png", alt: "Watermelon Juice", width: 800, height: 800, category: "juices" },
  { id: "g7", src: "/images/MenuItems/Milkshakes-Mango – LKR 300.00.png", alt: "Mango Milkshake", width: 800, height: 600, category: "milkshakes" },
  { id: "g8", src: "/images/MenuItems/Milkshakes-Chocolate - LKR 300.png", alt: "Chocolate Milkshake", width: 800, height: 1000, category: "milkshakes" },
  { id: "g9", src: "/images/MenuItems/Milkshakes-Vanilla - LKR 300.png", alt: "Vanilla Milkshake", width: 800, height: 600, category: "milkshakes" },
  { id: "g10", src: "/images/MenuItems/Lassi-Mango – LKR 400.00.png", alt: "Mango Lassi", width: 800, height: 800, category: "smoothies" },
  { id: "g11", src: "/images/MenuItems/Coffee-Cappuccino – LKR 300.00.png", alt: "Cappuccino", width: 800, height: 900, category: "coffee" },
  { id: "g12", src: "/images/MenuItems/Mocktails-Classic Virgin Mojito – LKR 400.00.png", alt: "Virgin Mojito", width: 800, height: 600, category: "signature" },
  { id: "g13", src: "/images/MenuItems/Special Smoothies-AandD.png", alt: "Avocado & Dates Smoothie", width: 800, height: 800, category: "smoothies" },
  { id: "g14", src: "/images/MenuItems/Jaggery & Cashew Dream – LKR 500.00.jpg", alt: "Jaggery Cashew Dream", width: 800, height: 800, category: "food" },
  { id: "g15", src: "/images/MenuItems/FreshJuicesPineapple.png", alt: "Pineapple Juice", width: 800, height: 600, category: "juices" },
  { id: "g16", src: "/images/MenuItems/FreshJuicesWoodApple.png", alt: "Wood Apple Juice", width: 800, height: 900, category: "signature" },
];