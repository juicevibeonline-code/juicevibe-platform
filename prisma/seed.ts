import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@juicevibe.com" },
    update: {},
    create: {
      email: "admin@juicevibe.com",
      name: "Admin",
      password: "$2a$12$LJ3m4ys3Lk0TSwHnbfOMiOx5XKq5H5n5m5m5m5m5m5m5m5m5m5m",
      role: "admin",
      emailVerified: true,
    },
  });

  // Create categories
  const categories = [
    { name: "Fresh Juices", icon: "Orange", order: 1 },
    { name: "Milkshakes", icon: "Milk", order: 2 },
    { name: "Smoothies", icon: "Apple", order: 3 },
    { name: "Mocktails", icon: "Wine", order: 4 },
    { name: "Lassi", icon: "CupSoda", order: 5 },
    { name: "Tea", icon: "Coffee", order: 6 },
    { name: "Coffee", icon: "Coffee", order: 7 },
    { name: "Ice Cream", icon: "IceCream", order: 8 },
    { name: "Burgers", icon: "Sandwich", order: 9 },
    { name: "Sandwiches", icon: "Sandwich", order: 10 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.name.toLowerCase().replace(/\s+/g, "-") },
      update: {},
      create: {
        name: cat.name,
        slug: cat.name.toLowerCase().replace(/\s+/g, "-"),
        icon: cat.icon,
        order: cat.order,
      },
    });
  }

  // Create sample menu items for Milkshakes
  const milkshakeCat = await prisma.category.findUnique({ where: { slug: "milkshakes" } });
  if (milkshakeCat) {
    const milkshakes = [
      { name: "Chocolate Milkshake", description: "Rich and creamy chocolate milkshake made with premium cocoa", price: 300, isPopular: true },
      { name: "Vanilla Milkshake", description: "Classic vanilla milkshake with real vanilla extract", price: 300 },
      { name: "Strawberry Milkshake", description: "Fresh strawberry milkshake with real fruit", price: 350, isPopular: true },
      { name: "Mango Milkshake", description: "Tropical mango milkshake with fresh Alphonso mangoes", price: 350, isPopular: true },
      { name: "Passion Fruit Milkshake", description: "Tangy and sweet passion fruit milkshake", price: 350 },
      { name: "Banana Milkshake", description: "Creamy banana milkshake with ripe bananas", price: 300 },
      { name: "Date & Almond Milkshake", description: "Healthy and energizing date and almond milkshake", price: 400 },
    ];

    for (const shake of milkshakes) {
      await prisma.menuItem.upsert({
        where: { slug: shake.name.toLowerCase().replace(/\s+/g, "-") },
        update: {},
        create: {
          ...shake,
          slug: shake.name.toLowerCase().replace(/\s+/g, "-"),
          categoryId: milkshakeCat.id,
          ingredients: [],
          tags: [],
        },
      });
    }
  }

  // Create sample testimonials
  const testimonials = [
    { name: "Priya Sharma", role: "Regular Customer", rating: 5, text: "The fresh juices here are absolutely incredible! I've never tasted anything like their passion fruit splash. The ambiance is just as amazing as the drinks.", isApproved: true, isFeatured: true },
    { name: "Rahul Verma", role: "Food Blogger", rating: 5, text: "As a food blogger, I've been to countless cafes. Juice Vibe stands out with their commitment to quality and presentation. A must-visit!", isApproved: true, isFeatured: true },
    { name: "Ananya Patel", role: "Health Enthusiast", rating: 5, text: "Finally a place that serves delicious drinks without compromising on health. Their smoothies are my post-workout go-to!", isApproved: true },
    { name: "Arjun Nair", role: "Tourist", rating: 4, text: "Discovered this gem during my visit to Bentota. The wood apple juice is something I still crave. Will definitely come back!", isApproved: true },
    { name: "Neha Gupta", role: "Local Resident", rating: 5, text: "Juice Vibe has become our family's favorite weekend spot. The kids love the milkshakes and we love the fresh juices!", isApproved: true },
  ];

  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t });
  }

  // Create gallery images
  const galleryImages = [
    { src: "/gallery/juice-1.jpg", alt: "Fresh Orange Juice", width: 800, height: 600, category: "juices" },
    { src: "/gallery/juice-2.jpg", alt: "Tropical Smoothie Bowl", width: 800, height: 800, category: "smoothies" },
    { src: "/gallery/juice-3.jpg", alt: "Signature Mocktail", width: 600, height: 800, category: "signature" },
    { src: "/gallery/juice-4.jpg", alt: "Premium Burger", width: 800, height: 600, category: "food" },
    { src: "/gallery/juice-5.jpg", alt: "Chocolate Milkshake", width: 600, height: 800, category: "milkshakes" },
    { src: "/gallery/juice-6.jpg", alt: "Cappuccino Art", width: 800, height: 800, category: "coffee" },
    { src: "/gallery/juice-7.jpg", alt: "Cafe Interior", width: 1200, height: 800, category: "interior" },
    { src: "/gallery/juice-8.jpg", alt: "Our Amazing Team", width: 1200, height: 800, category: "team" },
  ];

  for (const img of galleryImages) {
    await prisma.galleryImage.create({ data: img });
  }

  // Create settings
  const settings = [
    { key: "business_name", value: "Juice Vibe" },
    { key: "business_tagline", value: "Sip the Good Vibes" },
    { key: "business_phone", value: "+94718435876" },
    { key: "business_email", value: "hello@juicevibe.com" },
    { key: "business_address", value: "Galle Road, Bentota, Sri Lanka" },
    { key: "opening_hours_weekdays", value: "8:00 AM - 10:00 PM" },
    { key: "opening_hours_saturday", value: "9:00 AM - 11:00 PM" },
    { key: "opening_hours_sunday", value: "10:00 AM - 9:00 PM" },
    { key: "tax_rate", value: "5" },
    { key: "currency", value: "LKR" },
    { key: "delivery_fee", value: "150" },
    { key: "free_delivery_min", value: "1000" },
  ];

  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
