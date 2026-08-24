import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env") });
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ─── Admin User ───────────────────────────────────────────────
  const hashedPassword = "$2a$12$Ql6rP3QJeWvLmRX8kD2aXu5mHKjQzNsOxPYvwAZbTlFcGiE9uRsKi";
  await prisma.user.upsert({
    where: { email: "admin@juicevibe.com" },
    update: {},
    create: {
      email: "admin@juicevibe.com",
      name: "Admin",
      password: hashedPassword,
      role: "admin",
      emailVerified: true,
    },
  });

  // ─── Categories ───────────────────────────────────────────────
  const categoryDefs = [
    { name: "Milkshakes",            slug: "milkshakes",    icon: "CupSoda",    order: 1 },
    { name: "Fresh Juices",          slug: "fresh-juices",  icon: "Apple",      order: 2 },
    { name: "Special Smoothies",     slug: "smoothies",     icon: "Blend",      order: 3 },
    { name: "Lassi",                 slug: "lassi",         icon: "Milk",       order: 4 },
    { name: "Tea",                   slug: "tea",           icon: "Coffee",     order: 5 },
    { name: "Coffee",                slug: "coffee",        icon: "Coffee",     order: 6 },
    { name: "Mocktails",             slug: "mocktails",     icon: "Wine",       order: 7 },
    { name: "Fruits & Ice Cream",    slug: "ice-cream",     icon: "IceCream",   order: 8 },
    { name: "Burgers",               slug: "burgers",       icon: "Hamburger",  order: 9 },
    { name: "Sandwiches",            slug: "sandwiches",    icon: "Sandwich",   order: 10 },
  ];

  for (const cat of categoryDefs) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, icon: cat.icon, order: cat.order },
      create: cat,
    });
  }

  const getCategory = async (slug: string) => {
    const cat = await prisma.category.findUnique({ where: { slug } });
    if (!cat) throw new Error(`Category not found: ${slug}`);
    return cat;
  };

  // ─── Helper: upsert menu item ─────────────────────────────────
  const upsertItem = async (data: {
    name: string; slug: string; description: string; price: number;
    categoryId: string; popular?: boolean; featured?: boolean;
    tags?: string[]; ingredients?: string[];
    thumbnail?: string;
  }) => {
    await prisma.menuItem.upsert({
      where: { slug: data.slug },
      update: { price: data.price, description: data.description, thumbnail: data.thumbnail },
      create: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: data.price,
        categoryId: data.categoryId,
        isPopular: data.popular ?? false,
        isFeatured: data.featured ?? false,
        tags: data.tags ?? [],
        ingredients: data.ingredients ?? [],
        images: [],
        thumbnail: data.thumbnail,
      },
    });
  };

  // ─── MILKSHAKES ───────────────────────────────────────────────
  const milkshakes = await getCategory("milkshakes");
  const milkshakeItems = [
    { name: "Chocolate",      slug: "chocolate-milkshake",      description: "Rich & creamy chocolate milkshake",               price: 350, popular: true,  thumbnail: "/images/MenuItems/milkshake-chocolate.png" },
    { name: "Vanilla",        slug: "vanilla-milkshake",        description: "Classic vanilla bean milkshake",                   price: 350,                thumbnail: "/images/MenuItems/milkshake-vanilla.png" },
    { name: "Strawberry",     slug: "strawberry-milkshake",     description: "Fresh strawberry milkshake",                       price: 350,                thumbnail: "/images/MenuItems/milkshake-strawberry.png" },
    { name: "Mango",          slug: "mango-milkshake",          description: "Thick tropical mango milkshake",                   price: 350, popular: true,  thumbnail: "/images/MenuItems/milkshake-mango.png" },
    { name: "Passion Fruit",  slug: "passion-fruit-milkshake",  description: "Tropical passion fruit milkshake",                 price: 350,                thumbnail: "/images/MenuItems/milkshake-passion-fruit.png" },
    { name: "Banana",         slug: "banana-milkshake",         description: "Fresh banana & milk creamy shake",                 price: 350,                thumbnail: "/images/MenuItems/milkshake-banana.png" },
    { name: "Mixed Fruit",    slug: "mixed-fruit-milkshake",    description: "Delicious blend of seasonal fruits and cold milk", price: 350, popular: true,  thumbnail: "/images/MenuItems/milkshake-strawberry.png" },
    { name: "Date & Almond",  slug: "date-almond-milkshake",    description: "Healthy energy-boosting date & almond shake",      price: 400, popular: true,  thumbnail: "/images/MenuItems/milkshake-date-almond.png" },
    { name: "Falooda",        slug: "falooda-milkshake",        description: "Traditional sweet falooda shake with basil seeds", price: 400, popular: true,  thumbnail: "/images/MenuItems/milkshake-strawberry.png" },
  ];
  for (const item of milkshakeItems) {
    await upsertItem({ ...item, categoryId: milkshakes.id });
  }

  // Add BOBA add-on to all milkshakes (Rs. 150)
  const allMilkshakes = await prisma.menuItem.findMany({ where: { categoryId: milkshakes.id } });
  for (const shake of allMilkshakes) {
    const existing = await prisma.addOn.findFirst({ where: { menuItemId: shake.id, name: "Add BOBA" } });
    if (existing) {
      await prisma.addOn.update({ where: { id: existing.id }, data: { price: 150 } });
    } else {
      await prisma.addOn.create({ data: { name: "Add BOBA", price: 150, category: "extras", menuItemId: shake.id } });
    }
  }

  // ─── FRESH JUICES ─────────────────────────────────────────────
  const freshJuices = await getCategory("fresh-juices");
  const juiceItems = [
    { name: "Avocado",       slug: "avocado-juice",       description: "Creamy fresh avocado juice",                     price: 300, popular: true,  thumbnail: "/images/MenuItems/juice-avocado.png" },
    { name: "Lime",          slug: "lime-juice",          description: "Fresh zesty lime juice with a hint of mint",     price: 250,                thumbnail: "/images/MenuItems/juice-lime.png" },
    { name: "Mango",         slug: "mango-juice",         description: "Ripe sweet mango pulp blended to perfection",     price: 300, popular: true,  thumbnail: "/images/MenuItems/juice-mango.png" },
    { name: "Mixed Fruit",   slug: "mixed-fruit-juice",   description: "Freshly pressed mix of tropical fruits",          price: 350, popular: true,  thumbnail: "/images/MenuItems/juice-orange.png" },
    { name: "Orange",        slug: "orange-juice",        description: "Freshly squeezed sweet citrus oranges",          price: 400,                thumbnail: "/images/MenuItems/juice-orange.png" },
    { name: "Papaya",        slug: "papaya-juice",        description: "Creamy wholesome fresh papaya juice",             price: 250,                thumbnail: "/images/MenuItems/juice-papaya.png" },
    { name: "Passion Fruit", slug: "passion-fruit-juice", description: "Exotic tropical passion fruit pulp juice",        price: 300,                thumbnail: "/images/MenuItems/juice-passion-fruit.jpg" },
    { name: "Pineapple",     slug: "pineapple-juice",     description: "Sweet & tangy freshly squeezed pineapple juice",  price: 300,                thumbnail: "/images/MenuItems/juice-pineapple.png" },
    { name: "Soursop",       slug: "soursop-juice",       description: "Fresh soursop juice — rich tropical classic",     price: 300, popular: true,  thumbnail: "/images/MenuItems/juice-soursop.png" },
    { name: "Watermelon",    slug: "watermelon-juice",    description: "Chilled deeply refreshing watermelon juice",     price: 250,                thumbnail: "/images/MenuItems/juice-watermelon.png" },
    { name: "Wood Apple",    slug: "wood-apple-juice",    description: "Traditional Sri Lankan authentic wood apple juice", price: 300,             thumbnail: "/images/MenuItems/juice-wood-apple.png" },
  ];
  for (const item of juiceItems) {
    await upsertItem({ ...item, categoryId: freshJuices.id });
  }

  // Add Ice Cream add-on to all fresh juices (Rs. 50)
  const allJuices = await prisma.menuItem.findMany({ where: { categoryId: freshJuices.id } });
  for (const juice of allJuices) {
    const existing = await prisma.addOn.findFirst({ where: { menuItemId: juice.id, name: "Add Ice Cream" } });
    if (existing) {
      await prisma.addOn.update({ where: { id: existing.id }, data: { price: 50 } });
    } else {
      await prisma.addOn.create({ data: { name: "Add Ice Cream", price: 50, category: "extras", menuItemId: juice.id } });
    }
  }

  // ─── SPECIAL SMOOTHIES ────────────────────────────────────────
  const smoothies = await getCategory("smoothies");
  const smoothieItems = [
    {
      name: "Avocado & Dates",  slug: "avocado-dates-smoothie",
      description: "Avocado, Dates, Milk, Treacle",
      price: 500, popular: true, featured: true,
      ingredients: ["Avocado", "Dates", "Milk", "Treacle"],
      thumbnail: "/images/MenuItems/smoothie-avocado-dates.png",
    },
    {
      name: "Wood Apple Zest",  slug: "wood-apple-zest-smoothie",
      description: "Wood Apple, Coconut Milk, Jaggery",
      price: 500, popular: true, featured: true,
      ingredients: ["Wood Apple", "Coconut Milk", "Jaggery"],
      thumbnail: "/images/MenuItems/smoothie-wood-apple-zest.png",
    },
  ];
  for (const item of smoothieItems) {
    await upsertItem({ ...item, categoryId: smoothies.id });
  }

  // ─── LASSI ────────────────────────────────────────────────────
  const lassi = await getCategory("lassi");
  const lassiItems = [
    { name: "Classic",       slug: "classic-lassi",       description: "Traditional sweet creamy yogurt drink",  price: 400,                thumbnail: "/images/MenuItems/lassi-classic.png" },
    { name: "Mango",         slug: "mango-lassi",         description: "Mango pulp blended with fresh yogurt",   price: 400, popular: true,  thumbnail: "/images/MenuItems/lassi-mango.png" },
    { name: "Passion Fruit", slug: "passion-fruit-lassi", description: "Passion fruit & yogurt blend",           price: 400,                thumbnail: "/images/MenuItems/lassi-passion-fruit.png" },
    { name: "Orange",        slug: "orange-lassi",        description: "Orange yogurt refresher",                price: 400,                thumbnail: "/images/MenuItems/lassi-orange.png" },
  ];
  for (const item of lassiItems) {
    await upsertItem({ ...item, categoryId: lassi.id });
  }

  // ─── TEA ──────────────────────────────────────────────────────
  const tea = await getCategory("tea");
  const teaItems = [
    { name: "English Breakfast", slug: "english-breakfast-tea", description: "Classic robust English breakfast tea",  price: 100, thumbnail: "/images/MenuItems/tea-english-breakfast.png" },
    { name: "Green Tea",         slug: "green-tea",             description: "Light & refreshing green tea",          price: 100, thumbnail: "/images/MenuItems/tea-green.png" },
    { name: "Ginger Tea",        slug: "ginger-tea",            description: "Spiced warming ginger tea",             price: 100, popular: true, thumbnail: "/images/MenuItems/tea-ginger.png" },
    { name: "Lemon Tea",         slug: "lemon-tea",             description: "Ceylon black tea with fresh lemon",     price: 100, thumbnail: "/images/MenuItems/tea-lemon.png" },
    { name: "Mint Tea",          slug: "mint-tea",              description: "Cooling fresh mint herbal tea",         price: 100, thumbnail: "/images/MenuItems/tea-mint.png" },
  ];
  for (const item of teaItems) {
    await upsertItem({ ...item, categoryId: tea.id });
  }

  // ─── COFFEE ───────────────────────────────────────────────────
  const coffee = await getCategory("coffee");
  const coffeeItems = [
    { name: "Americano",  slug: "americano",  description: "Bold espresso with hot water",               price: 200, thumbnail: "/images/MenuItems/coffee-americano.png" },
    { name: "Espresso",   slug: "espresso",   description: "Rich double-shot espresso",                  price: 200, thumbnail: "/images/MenuItems/coffee-espresso.png" },
    { name: "Cappuccino", slug: "cappuccino", description: "Espresso with velvety frothy milk",          price: 300, popular: true, thumbnail: "/images/MenuItems/coffee-cappuccino.png" },
  ];
  for (const item of coffeeItems) {
    await upsertItem({ ...item, categoryId: coffee.id });
  }

  // ─── MOCKTAILS ────────────────────────────────────────────────
  const mocktails = await getCategory("mocktails");
  const mocktailItems = [
    {
      name: "Classic Virgin Mojito", slug: "classic-virgin-mojito",
      description: "Mint, lime, soda & sugar — the timeless classic",
      price: 400, popular: true, featured: true,
      thumbnail: "/images/MenuItems/mocktail-classic-virgin-mojito.png",
    },
    {
      name: "Flavoured Mojito", slug: "flavoured-mojito",
      description: "Choose your flavour: Mango · Mandarin · Passion Fruit · Blackcurrant",
      price: 400, popular: true,
      tags: ["Mango", "Mandarin", "Passion Fruit", "Blackcurrant"],
      thumbnail: "/images/MenuItems/mocktail-flavoured-mojito.png",
    },
  ];
  for (const item of mocktailItems) {
    await upsertItem({ ...item, categoryId: mocktails.id });
  }

  // ─── FRUITS & ICE CREAM ───────────────────────────────────────
  const iceCream = await getCategory("ice-cream");
  const iceCreamItems = [
    {
      name: "Jaggery & Cashew Dream", slug: "jaggery-cashew-dream",
      description: "Traditional jaggery with premium cashew nuts & ice cream",
      price: 500, popular: true, featured: true,
      thumbnail: "/images/MenuItems/icecream-jaggery-cashew-dream.jpg",
    },
    { name: "Banana Boat",                 slug: "banana-boat",                 description: "Banana split with ice cream & indulgent toppings", price: 500, thumbnail: "/images/MenuItems/icecream-banana-boat.png" },
    { name: "Fruit Salad",                slug: "fruit-salad",                 description: "Fresh seasonal tropical fruit salad",              price: 350, thumbnail: "/images/MenuItems/icecream-fruit-salad.png" },
    { name: "Fruit Salad with Ice Cream", slug: "fruit-salad-with-ice-cream",  description: "Fresh fruit salad topped with creamy ice cream",   price: 400, popular: true, thumbnail: "/images/MenuItems/icecream-fruit-salad-with-icecream.png" },
    {
      name: "Choice of Ice Cream (3 Scoops)", slug: "ice-cream-3-scoops",
      description: "Mix & match: Vanilla · Chocolate · Strawberry · Fruit & Nut · Mango",
      price: 350,
      tags: ["Vanilla", "Chocolate", "Strawberry", "Fruit & Nut", "Mango"],
      thumbnail: "/images/MenuItems/icecream-3-scoops.png",
    },
  ];
  for (const item of iceCreamItems) {
    await upsertItem({ ...item, categoryId: iceCream.id });
  }

  // ─── BURGERS ──────────────────────────────────────────────────
  const burgers = await getCategory("burgers");
  const burgerItems = [
    { name: "Chicken Burger",            slug: "chicken-burger",      description: "Grilled chicken patty with fresh toppings",    price: 400, popular: true, thumbnail: "/images/MenuItems/burger-chicken.png" },
    { name: "Vegetable and Cheese Burger", slug: "veg-cheese-burger", description: "Crispy veggie patty with melted cheese",       price: 350,                thumbnail: "/images/MenuItems/burger-veg-cheese.png" },
  ];
  for (const item of burgerItems) {
    await upsertItem({ ...item, categoryId: burgers.id });
  }

  // ─── SANDWICHES ───────────────────────────────────────────────
  const sandwiches = await getCategory("sandwiches");
  const sandwichItems = [
    { name: "Cheese and Tomato Sandwich",      slug: "cheese-tomato-sandwich",      description: "Grilled cheese with fresh ripe tomato",          price: 300,                thumbnail: "/images/MenuItems/sandwich-cheese-tomato.png" },
    { name: "Chicken Ham and Cheese",          slug: "chicken-ham-cheese-sandwich", description: "Chicken ham with melted cheese on toasted bread", price: 350, popular: true,  thumbnail: "/images/MenuItems/sandwich-chicken-ham-cheese.png" },
  ];
  for (const item of sandwichItems) {
    await upsertItem({ ...item, categoryId: sandwiches.id });
  }

  // ─── TESTIMONIALS ─────────────────────────────────────────────
  const testimonials = [
    { name: "Priya Sharma",   role: "Regular Customer",  rating: 5, text: "The fresh juices here are absolutely incredible! I've never tasted anything like their passion fruit splash. The ambiance is just as amazing as the drinks.", isApproved: true, isFeatured: true },
    { name: "Rahul Verma",    role: "Food Blogger",       rating: 5, text: "As a food blogger, I've been to countless cafes. Juice Vibe stands out with their commitment to quality and presentation. A must-visit!", isApproved: true, isFeatured: true },
    { name: "Ananya Patel",   role: "Health Enthusiast",  rating: 5, text: "Finally a place that serves delicious drinks without compromising on health. Their smoothies are my post-workout go-to!", isApproved: true },
    { name: "Arjun Nair",     role: "Tourist",            rating: 4, text: "Discovered this gem during my visit to Bentota. The wood apple juice is something I still crave. Will definitely come back!", isApproved: true },
    { name: "Neha Gupta",     role: "Local Resident",     rating: 5, text: "Juice Vibe has become our family's favourite weekend spot. The kids love the milkshakes and we love the fresh juices!", isApproved: true },
  ];
  const existingTestimonials = await prisma.testimonial.count();
  if (existingTestimonials === 0) {
    for (const t of testimonials) {
      await prisma.testimonial.create({ data: t });
    }
  }

  // ─── SETTINGS ─────────────────────────────────────────────────
  const settings = [
    { key: "business_name",           value: "Juice Vibe" },
    { key: "business_tagline",        value: "Sip the Good Vibes" },
    { key: "business_phone",          value: "+94718435876" },
    { key: "business_email",          value: "juicevibeonline@gmail.com" },
    { key: "business_address",        value: "No.89 Bandaragama Road, Waskaduwa, Sri Lanka, 12580" },
    { key: "opening_hours_weekdays",  value: "8:00 AM - 10:00 PM" },
    { key: "opening_hours_saturday",  value: "9:00 AM - 11:00 PM" },
    { key: "opening_hours_sunday",    value: "10:00 AM - 9:00 PM" },
    { key: "tax_rate",                value: "0" },
    { key: "currency",                value: "LKR" },
    { key: "delivery_fee",            value: "150" },
    { key: "free_delivery_min",       value: "1500" },
    { key: "whatsapp_number",         value: "+94718435876" },
    { key: "facebook_url",            value: "https://www.facebook.com/share/1L9JR6DXL9/?mibextid=wwXIfr" },
    { key: "tiktok_url",              value: "https://www.tiktok.com/@juice.vibe0" },
  ];
  for (const s of settings) {
    await prisma.setting.upsert({ where: { key: s.key }, update: { value: s.value }, create: s });
  }

  // ─── GALLERY IMAGES ───────────────────────────────────────────
  const galleryDefs = [
    { src: "/images/MenuItems/tropical_smoothie_bowl.png", alt: "Tropical Dragonfruit Smoothie Bowl", category: "smoothies", width: 800, height: 600 },
    { src: "/images/MenuItems/passionfruit_mojito_mocktail.png", alt: "Refreshing Passion Fruit Mojito Mocktail", category: "mocktails", width: 800, height: 600 },
    { src: "/images/MenuItems/juice-orange.png", alt: "Freshly Squeezed Orange Juice", category: "fresh-juices", width: 800, height: 600 },
    { src: "/images/MenuItems/juice-avocado.png", alt: "Creamy Avocado Juice", category: "fresh-juices", width: 800, height: 600 },
    { src: "/images/MenuItems/smoothie-avocado-dates.png", alt: "Avocado & Dates Special Smoothie", category: "smoothies", width: 800, height: 600 },
    { src: "/images/MenuItems/mocktail-classic-virgin-mojito.png", alt: "Classic Virgin Mojito", category: "mocktails", width: 800, height: 600 },
    { src: "/images/MenuItems/burger-chicken.png", alt: "Gourmet Chicken Burger", category: "burgers", width: 800, height: 600 },
    { src: "/images/MenuItems/sandwich-chicken-ham-cheese.png", alt: "Toasted Chicken Ham & Cheese Sandwich", category: "sandwiches", width: 800, height: 600 },
    { src: "/images/MenuItems/coffee-cappuccino.png", alt: "Frothy Cappuccino", category: "coffee", width: 800, height: 600 },
    { src: "/images/MenuItems/milkshake-chocolate.png", alt: "Rich Chocolate Milkshake", category: "milkshakes", width: 800, height: 600 },
    { src: "/images/MenuItems/icecream-jaggery-cashew-dream.jpg", alt: "Jaggery & Cashew Dream Ice Cream", category: "ice-cream", width: 800, height: 600 },
    { src: "/images/Opening/Opening.png", alt: "Juice Vibe Waskaduwa Cafe Atmosphere", category: "general", width: 800, height: 600 },
  ];

  for (const g of galleryDefs) {
    const existing = await prisma.galleryImage.findFirst({ where: { src: g.src } });
    if (!existing) {
      await prisma.galleryImage.create({ data: g });
    }
  }

  console.log("✅ Seed completed successfully!");
  console.log("   Admin login: admin@juicevibe.com / Admin@123");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
