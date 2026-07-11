export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  popular?: boolean;
  addOns?: { name: string; price: number }[];
  flavours?: string[];
}

export const categories = [
  { id: "all", name: "All", icon: "Sparkles" },
  { id: "milkshakes", name: "Milkshakes", icon: "CupSoda" },
  { id: "fresh-juices", name: "Fresh Juices", icon: "Apple" },
  { id: "smoothies", name: "Special Smoothies", icon: "Blend" },
  { id: "lassi", name: "Lassi", icon: "Milk" },
  { id: "tea", name: "Tea", icon: "Coffee" },
  { id: "coffee", name: "Coffee", icon: "Coffee" },
  { id: "mocktails", name: "Mocktails", icon: "Wine" },
  { id: "ice-cream", name: "Fruits & Ice Cream", icon: "IceCream" },
  { id: "burgers", name: "Burgers", icon: "Hamburger" },
  { id: "sandwiches", name: "Sandwiches", icon: "Sandwich" },
] as const;

export const menuItems: MenuItem[] = [
  // Milkshakes
  { id: "chocolate-shake", name: "Chocolate", description: "Rich & creamy chocolate milkshake", price: 300, category: "milkshakes", popular: true, image: "/images/MenuItems/Milkshakes-Chocolate - LKR 300.png" },
  { id: "vanilla-shake", name: "Vanilla", description: "Classic vanilla bean milkshake", price: 300, category: "milkshakes", image: "/images/MenuItems/Milkshakes-Vanilla - LKR 300.png" },
  { id: "strawberry-shake", name: "Strawberry", description: "Fresh strawberry milkshake", price: 300, category: "milkshakes", image: "/images/MenuItems/Milkshakes-Strawberry.png" },
  { id: "mango-shake", name: "Mango", description: "Thick mango milkshake", price: 300, category: "milkshakes", popular: true, image: "/images/MenuItems/Milkshakes-Mango – LKR 300.00.png" },
  { id: "passion-shake", name: "Passion Fruit", description: "Tropical passion fruit milkshake", price: 300, category: "milkshakes", image: "/images/MenuItems/Milkshakes-Passion Fruit.png" },
  { id: "banana-shake", name: "Banana", description: "Fresh banana & milk creamy shake", price: 300, category: "milkshakes" },
  { id: "date-almond-shake", name: "Date & Almond", description: "Healthy date & almond milkshake", price: 400, category: "milkshakes", popular: true },
  // Note: Add BOBA +100 is handled as add-on below

  // Fresh Juices
  { id: "ambarella-juice", name: "Ambarella", description: "Freshly squeezed ambarella juice", price: 250, category: "fresh-juices", image: "/images/MenuItems/Ambarella.png" },
  { id: "avocado-juice", name: "Avocado", description: "Creamy fresh avocado juice", price: 300, category: "fresh-juices", image: "/images/MenuItems/FJAvocado.png" },
  { id: "coconut-juice", name: "Coconut", description: "Fresh tender coconut water", price: 250, category: "fresh-juices", image: "/images/MenuItems/FJCoconut.png" },
  { id: "grape-juice", name: "Grapes", description: "Fresh grape juice", price: 500, category: "fresh-juices", popular: true, image: "/images/MenuItems/FreshJuicesGrapes.png" },
  { id: "lime-juice", name: "Lime", description: "Fresh lime juice with a hint of mint", price: 200, category: "fresh-juices", image: "/images/MenuItems/FreshJuicesLime.png" },
  { id: "mango-juice", name: "Mango", description: "Ripe mango pulp blended to perfection", price: 300, category: "fresh-juices", popular: true, image: "/images/MenuItems/FreshJuicesMango.png" },
  { id: "orange-juice", name: "Orange", description: "Freshly squeezed sweet oranges", price: 400, category: "fresh-juices", image: "/images/MenuItems/FreshOrange.png" },
  { id: "papaya-juice", name: "Papaya", description: "Creamy fresh papaya juice", price: 250, category: "fresh-juices", image: "/images/MenuItems/FreshJuicesPapaya.png" },
  { id: "passion-juice", name: "Passion Fruit", description: "Exotic passion fruit pulp juice", price: 250, category: "fresh-juices", image: "/images/MenuItems/FreshJuicesPassionFruit.jpg" },
  { id: "pineapple-juice", name: "Pineapple", description: "Sweet & tangy fresh pineapple juice", price: 250, category: "fresh-juices", image: "/images/MenuItems/FreshJuicesPineapple.png" },
  { id: "soursop-juice", name: "Soursop", description: "Fresh soursop juice", price: 300, category: "fresh-juices", popular: true, image: "/images/MenuItems/FreshJuicesSoursop.png" },
  { id: "watermelon-juice", name: "Watermelon", description: "Chilled refreshing watermelon juice", price: 250, category: "fresh-juices", image: "/images/MenuItems/FreshJuicesWatermelon.png" },
  { id: "wood-apple-juice", name: "Wood Apple", description: "Traditional wood apple juice", price: 300, category: "fresh-juices", image: "/images/MenuItems/FreshJuicesWoodApple.png" },

  // Juice Vibe Special Smoothies
  { id: "avocado-dates", name: "Avocado & Dates", description: "Avocado, Dates, Milk, Treacle", price: 450, category: "smoothies", popular: true, image: "/images/MenuItems/Special Smoothies-AandD.png" },
  { id: "wood-apple-zest", name: "Wood Apple Zest", description: "Wood Apple, Coconut Milk, Jaggery", price: 400, category: "smoothies", image: "/images/MenuItems/Special Smoothies-Wood Apple Zest.png" },

  // Lassi
  { id: "lassi-classic", name: "Classic", description: "Traditional sweet yogurt drink", price: 400, category: "lassi", image: "/images/MenuItems/LassiClassic – LKR 400.00.png" },
  { id: "lassi-mango", name: "Mango", description: "Mango pulp blended with yogurt", price: 400, category: "lassi", popular: true, image: "/images/MenuItems/Lassi-Mango – LKR 400.00.png" },
  { id: "lassi-passion", name: "Passion Fruit", description: "Passion fruit yogurt blend", price: 400, category: "lassi", image: "/images/MenuItems/Lassi-Passion Fruit – LKR 400.00.png" },
  { id: "lassi-orange", name: "Orange", description: "Orange yogurt blend", price: 400, category: "lassi", image: "/images/MenuItems/Lassi-Orange – LKR 400.00.png" },

  // Tea
  { id: "english-breakfast", name: "English Breakfast Tea", description: "Classic English breakfast tea", price: 100, category: "tea", image: "/images/MenuItems/Tea-English Breakfast Tea – LKR 100.00.png" },
  { id: "green-tea", name: "Green Tea", description: "Japanese sencha green tea", price: 100, category: "tea", image: "/images/MenuItems/Tea-Green Tea – LKR 100.00.png" },
  { id: "ginger-tea", name: "Ginger Tea", description: "Spiced ginger tea", price: 100, category: "tea", popular: true, image: "/images/MenuItems/Ginger Tea – LKR 100.00.png" },
  { id: "lemon-tea", name: "Lemon Tea", description: "Black tea with fresh lemon", price: 100, category: "tea", image: "/images/MenuItems/Lemon Tea – LKR 100.00.png" },
  { id: "mint-tea", name: "Mint Tea", description: "Refreshing mint tea", price: 100, category: "tea", image: "/images/MenuItems/Mint Tea – LKR 100.00.png" },

  // Coffee
  { id: "americano", name: "Americano", description: "Espresso with hot water", price: 200, category: "coffee", image: "/images/MenuItems/Americano – LKR 200.00.png" },
  { id: "espresso", name: "Espresso", description: "Double shot espresso", price: 200, category: "coffee", image: "/images/MenuItems/Coffee-Espresso – LKR 200.00.png" },
  { id: "cappuccino", name: "Cappuccino", description: "Espresso with frothy milk", price: 300, category: "coffee", popular: true, image: "/images/MenuItems/Coffee-Cappuccino – LKR 300.00.png" },

  // Mocktails
  { id: "virgin-mojito", name: "Classic Virgin Mojito", description: "Mint, lime, soda & sugar", price: 400, category: "mocktails", popular: true, image: "/images/MenuItems/Mocktails-Classic Virgin Mojito – LKR 400.00.png" },
  { id: "flavoured-mojito", name: "Flavoured Mojito", description: "Choose your favourite flavour", price: 400, category: "mocktails", flavours: ["Mango", "Mandarin", "Passion Fruit", "Blackcurrant"], image: "/images/MenuItems/Mocktails-Flavoured Mojito.png" },

  // Fruits & Ice Cream
  { id: "jaggery-cashew", name: "Jaggery & Cashew Dream", description: "Traditional jaggery with cashew nuts", price: 500, category: "ice-cream", popular: true, image: "/images/MenuItems/Jaggery & Cashew Dream – LKR 500.00.jpg" },
  { id: "banana-boat", name: "Banana Boat", description: "Banana split with ice cream & toppings", price: 500, category: "ice-cream" },
  { id: "fruit-salad", name: "Fruit Salad", description: "Fresh seasonal fruit salad", price: 300, category: "ice-cream" },
  { id: "fruit-salad-icecream", name: "Fruit Salad with Ice Cream", description: "Fresh fruit salad topped with ice cream", price: 350, category: "ice-cream" },
  { id: "ice-cream-scoops", name: "Choice of Ice Cream (3 Scoops)", description: "Mix and match your favourite scoops", price: 350, category: "ice-cream", flavours: ["Vanilla", "Chocolate", "Strawberry", "Fruit & Nut", "Mango"] },

  // Burgers
  { id: "chicken-burger", name: "Chicken Burger", description: "Grilled chicken patty with fresh toppings", price: 400, category: "burgers", popular: true },
  { id: "veg-cheese-burger", name: "Vegetable & Cheese Burger", description: "Crispy veggie patty with melted cheese", price: 300, category: "burgers" },

  // Sandwiches
  { id: "cheese-tomato-sandwich", name: "Cheese & Tomato Sandwich", description: "Grilled cheese with fresh tomato", price: 250, category: "sandwiches" },
  { id: "chicken-ham-cheese-sandwich", name: "Chicken Ham & Cheese Sandwich", description: "Chicken ham with melted cheese", price: 300, category: "sandwiches", popular: true },
];