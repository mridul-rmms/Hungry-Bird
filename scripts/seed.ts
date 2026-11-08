/**
 * Seed the Hungry Bird web app database.
 * Run: bun run scripts/seed.ts
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const R = (
  slug: string, name: string, tagline: string, cuisines: string,
  rating: number, ratingCount: number, etaMin: number, etaMax: number,
  distance: number, fee: number, costForTwo: number, image: string,
  moods: string, promoted = false, pureVeg = false,
) => ({
  slug, name, tagline, cuisines, rating, ratingCount, etaMin, etaMax,
  distance, fee, costForTwo, image, moods, promoted, pureVeg,
});

const restaurants = [
  R("ember-smoke", "Ember & Smoke", "Slow-fire BBQ, burgers & charred bowls", "BBQ,Burgers,Tacos", 4.8, 2431, 25, 35, 1.2, 49, 550, "/img/resto-3.jpg", "spicy,celebration,latenight", true),
  R("dakshin-spoon", "Dakshin Spoon", "Heritage South Indian, dum biryanis", "Biryani,South Indian,Momos", 4.8, 3127, 30, 40, 1.4, 39, 500, "/img/resto-2.jpg", "comfort,spicy", true),
  R("neon-wok", "Neon Wok", "Late-night ramen, sushi & gyoza bar", "Asian,Ramen,Sushi", 4.7, 1876, 20, 30, 0.8, 45, 600, "/img/resto-1.jpg", "latenight,comfort", false),
  R("forno-nova", "Forno Nova", "Wood-fired pizzas, Italian classics", "Pizza,Italian,Desserts", 4.7, 1245, 25, 35, 1.8, 35, 450, "/img/dish-pizza.jpg", "celebration,comfort", false),
  R("daily-bowl", "The Daily Bowl", "Macro-balanced bowls & cold-pressed", "Healthy,Salads,Bowls", 4.9, 987, 15, 25, 0.9, 29, 400, "/img/dish-bowl.jpg", "healthy,quick", false, true),
  R("butter-bloom", "Butter & Bloom", "Sunrise bakes, pancakes & slow coffee", "Cafe,Breakfast,Coffee", 4.6, 763, 15, 25, 1.1, 25, 350, "/img/dish-pancakes.jpg", "comfort,quick", false),
];

type D = [string, string, string, number, number, string, boolean, number, number | null, number, string, boolean];
// name, desc, price, rating, section, veg, spice, kcal, prepMin, image, bestseller
const dishes: Record<string, D[]> = {
  "ember-smoke": [
    ["Al Pastor Street Tacos", "Charred pineapple, smoked yoghurt drizzle, 4 pcs", 269, 4.8, "Bestsellers", false, 2, 520, 18, "/img/dish-tacos.jpg", true],
    ["Double Smash Burger", "Two seared patties, cheddar cascade, house smoke sauce", 249, 4.9, "Bestsellers", false, 1, 780, 15, "/img/dish-burger.jpg", true],
    ["Molten Chocolate Lava", "Dark 70% core, torched banana, cocoa dust", 189, 4.7, "Desserts", true, 0, 420, 12, "/img/dish-lava.jpg", false],
    ["Smokehouse Chuck Bowl", "6-hour smoked chuck curry, charred corn, pickled onion, naan", 389, 4.8, "Mains", false, 2, 850, 22, "/img/hero-butter.jpg", false],
  ],
  "dakshin-spoon": [
    ["Slow Butter Chicken", "Tandoor-smoked, tomato-cashew gravy, cream swirl", 329, 4.9, "Bestsellers", false, 1, 690, 20, "/img/hero-butter.jpg", true],
    ["Hyderabadi Dum Biryani", "Saffron basmati, lamb shank, burani raita", 349, 4.8, "Bestsellers", false, 2, 820, 25, "/img/dish-biryani.jpg", true],
    ["Steamed Chicken Momos", "Translucent pleats, fiery red chutney, 6 pcs", 179, 4.6, "Starters", false, 3, 380, 14, "/img/dish-momos.jpg", false],
    ["Filter Coffee Lava Cake", "Kaapi ganache core, jaggery crumble", 169, 4.5, "Desserts", true, 0, 390, 12, "/img/dish-lava.jpg", false],
  ],
  "neon-wok": [
    ["Midnight Tonkotsu Ramen", "18-hour pork broth, chashu, ajitama egg", 349, 4.8, "Bestsellers", false, 1, 760, 18, "/img/dish-ramen.jpg", true],
    ["Salmon Nigiri Platter", "8 pcs, hand-cut salmon, smoked soy glaze", 429, 4.7, "Sushi", false, 0, 520, 16, "/img/dish-sushi.jpg", false],
    ["Gyoza Basket", "Pan-seared chicken dumplings, black vinegar, 6 pcs", 199, 4.6, "Starters", false, 1, 360, 13, "/img/dish-momos.jpg", false],
  ],
  "forno-nova": [
    ["Charred Margherita", "San Marzano, fior di latte, basil, 12\" wood-fired", 299, 4.7, "Bestsellers", true, 0, 640, 17, "/img/dish-pizza.jpg", true],
    ["Molten Chocolate Lava", "Dark 70% core, raspberry, cocoa dust", 189, 4.7, "Desserts", true, 0, 420, 12, "/img/dish-lava.jpg", false],
  ],
  "daily-bowl": [
    ["Green Goddess Bowl", "Avocado fan, quinoa, tahini, 22 g protein", 269, 4.9, "Bestsellers", true, 0, 460, 10, "/img/dish-bowl.jpg", true],
    ["Buddha Reset Bowl", "Chickpea, edamame, purple cabbage, miso drizzle", 249, 4.8, "Bowls", true, 0, 430, 10, "/img/dish-bowl.jpg", false],
  ],
  "butter-bloom": [
    ["Morning Stack Pancakes", "Buttermilk cloud, maple cascade, berries", 199, 4.7, "Bestsellers", true, 0, 540, 12, "/img/dish-pancakes.jpg", true],
    ["Iced Cold Brew", "18-hr steep, cream cascade, single origin", 149, 4.6, "Coffee", true, 0, 90, 6, "/img/dish-coldbrew.jpg", false],
  ],
};

async function main() {
  await db.order.deleteMany();
  await db.dish.deleteMany();
  await db.restaurant.deleteMany();
  await db.user.deleteMany();

  for (const r of restaurants) {
    const created = await db.restaurant.create({ data: r });
    for (const [name, desc, price, rating, section, veg, spice, kcal, prepMin, image, best] of dishes[created.slug]) {
      await db.dish.create({
        data: { restaurantId: created.id, name, desc, price, rating, section, veg, spice, kcal, prepMin, image, bestseller: best },
      });
    }
  }
  const n1 = await db.restaurant.count();
  const n2 = await db.dish.count();
  console.log(`Seeded ${n1} restaurants, ${n2} dishes.`);
}

main().finally(() => db.$disconnect());
