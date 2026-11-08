/* Hungry Bird — seed data (matches cloned repo's domain: restaurants, menu, orders, coupons, ratings) */

export type Dish = {
  id: string;
  name: string;
  desc: string;
  price: number;
  img: string;
  rating: number;
  time: number; // mins
  veg: boolean;
  spice?: 0 | 1 | 2 | 3;
  kcal: number;
  tags: string[];
  restoId: string;
  cat: string;
  bestseller?: boolean;
};

export type Resto = {
  id: string;
  name: string;
  cuisine: string;
  img: string;
  rating: number;
  time: number;
  dist: number; // km
  price: 1 | 2 | 3; // ₹ symbols
  promo?: string;
  mood: string[];
};

export const MOODS = [
  { id: "comfort", label: "Comfort", emoji: "🫂", hue: "#c98a4b", word: "warm hugs, slow afternoons" },
  { id: "spicy", label: "Spicy", emoji: "🌶️", hue: "#d6482b", word: "bring the fire" },
  { id: "late", label: "Late-night", emoji: "🌙", hue: "#c445c9", word: "2am cravings" },
  { id: "healthy", label: "Healthy", emoji: "🌿", hue: "#7ba05b", word: "green & glowing" },
  { id: "celebrate", label: "Celebration", emoji: "🥂", hue: "#e3b75c", word: "today we feast" },
  { id: "quick", label: "Quick bite", emoji: "⚡", hue: "#33a186", word: "under 20 minutes" },
] as const;

export const RESTOS: Resto[] = [
  { id: "r1", name: "Ember & Smoke", cuisine: "North Indian • Tandoor", img: "/img/hero-butter.jpg", rating: 4.8, time: 28, dist: 1.2, price: 3, promo: "20% OFF", mood: ["comfort", "celebrate"] },
  { id: "r2", name: "Midnight Ramen Bar", cuisine: "Japanese • Ramen", img: "/img/resto-1.jpg", rating: 4.7, time: 24, dist: 0.8, price: 2, promo: "Free chashu", mood: ["late", "comfort"] },
  { id: "r3", name: "Fiamma Verde", cuisine: "Italian • Wood-fired", img: "/img/dish-pizza.jpg", rating: 4.6, time: 32, dist: 2.1, price: 2, mood: ["comfort", "quick"] },
  { id: "r4", name: "The Green Hour", cuisine: "Bowls • Salads", img: "/img/dish-bowl.jpg", rating: 4.5, time: 18, dist: 0.6, price: 2, promo: "₹100 OFF", mood: ["healthy", "quick"] },
  { id: "r5", name: "Copper Handi", cuisine: "Biryani • Hyderabadi", img: "/img/dish-biryani.jpg", rating: 4.9, time: 35, dist: 2.8, price: 2, mood: ["celebrate", "spicy"] },
  { id: "r6", name: "Grill Theory", cuisine: "Burgers • Grill", img: "/img/dish-burger.jpg", rating: 4.6, time: 22, dist: 1.5, price: 1, mood: ["quick", "late"] },
  { id: "r7", name: "Casa Fuego", cuisine: "Mexican • Street", img: "/img/dish-tacos.jpg", rating: 4.7, time: 26, dist: 1.9, price: 1, promo: "Free churros", mood: ["spicy", "quick"] },
  { id: "r8", name: "Sugar & Ash", cuisine: "Desserts • Bakes", img: "/img/dish-lava.jpg", rating: 4.8, time: 20, dist: 1.1, price: 2, mood: ["celebrate", "late"] },
];

export const DISHES: Dish[] = [
  { id: "d1", name: "Old Delhi Butter Chicken", desc: "14-hour tomato gravy, white butter, charred garlic naan on the side. The one we're famous for.", price: 429, img: "/img/hero-butter.jpg", rating: 4.9, time: 28, veg: false, spice: 1, kcal: 620, tags: ["Bestseller", "Chef's pick"], restoId: "r1", cat: "Mains", bestseller: true },
  { id: "d2", name: "Tonkotsu Midnight Ramen", desc: "18-hour pork broth, chashu, jammy egg, black garlic oil. Cooked while the city sleeps.", price: 389, img: "/img/dish-ramen.jpg", rating: 4.8, time: 24, veg: false, spice: 1, kcal: 540, tags: ["Late-night hero"], restoId: "r2", cat: "Ramen", bestseller: true },
  { id: "d3", name: "Fiamma Margherita", desc: "Leopard-spotted crust, buffalo mozzarella, San Marzano tomatoes, basil torn at the table.", price: 349, img: "/img/dish-pizza.jpg", rating: 4.7, time: 30, veg: true, spice: 0, kcal: 780, tags: ["Wood-fired"], restoId: "r3", cat: "Pizza", bestseller: true },
  { id: "d4", name: "Double Smash Stack", desc: "Two caramelised patties, molten cheddar, smoked house sauce on a toasted brioche.", price: 299, img: "/img/dish-burger.jpg", rating: 4.6, time: 20, veg: false, spice: 1, kcal: 890, tags: ["Fan favourite"], restoId: "r6", cat: "Burgers", bestseller: true },
  { id: "d5", name: "Nigiri & Maki Board", desc: "Salmon toro nigiri, tuna maki, fresh wasabi. Sliced to order, never before.", price: 549, img: "/img/dish-sushi.jpg", rating: 4.8, time: 26, veg: false, spice: 0, kcal: 460, tags: ["Fresh catch"], restoId: "r2", cat: "Sushi" },
  { id: "d6", name: "Hyderabadi Dum Biryani", desc: "Sealed copper handi, saffron basmati, slow lamb, burani raita. Open it at the table.", price: 479, img: "/img/dish-biryani.jpg", rating: 4.9, time: 35, veg: false, spice: 2, kcal: 710, tags: ["Bestseller", "Serves 2"], restoId: "r5", cat: "Biryani", bestseller: true },
  { id: "d7", name: "Molten Lava Cake", desc: "Dark chocolate core that flows, vanilla bean ice cream, smoked cocoa dust.", price: 249, img: "/img/dish-lava.jpg", rating: 4.8, time: 18, veg: true, spice: 0, kcal: 520, tags: ["Trending"], restoId: "r8", cat: "Desserts", bestseller: true },
  { id: "d8", name: "Al Pastor Street Tacos", desc: "Charred pineapple, onion, cilantro, salsa roja. Three per plate, no sharing required.", price: 279, img: "/img/dish-tacos.jpg", rating: 4.7, time: 22, veg: false, spice: 3, kcal: 480, tags: ["Spicy", "Street style"], restoId: "r7", cat: "Tacos" },
  { id: "d9", name: "The Glow Bowl", desc: "Avocado fan, quinoa, crisp chickpeas, edamame, tahini drizzle. Sunshine in a bowl.", price: 329, img: "/img/dish-bowl.jpg", rating: 4.6, time: 15, veg: true, spice: 0, kcal: 410, tags: ["Healthy", "Under 20 min"], restoId: "r4", cat: "Bowls", bestseller: true },
  { id: "d10", name: "Himalayan Chicken Momo", desc: "Hand-pleated, bamboo-steamed, fiery tomato chutney on the side. Eight pieces.", price: 219, img: "/img/dish-momos.jpg", rating: 4.7, time: 17, veg: false, spice: 2, kcal: 380, tags: ["Under 20 min"], restoId: "r7", cat: "Starters" },
  { id: "d11", name: "Buttermilk Cloudcakes", desc: "Three-layer stack, maple pour, whipped butter, warm berries. Breakfast, anytime.", price: 269, img: "/img/dish-pancakes.jpg", rating: 4.8, time: 19, veg: true, spice: 0, kcal: 590, tags: ["Breakfast"], restoId: "r8", cat: "Desserts" },
  { id: "d12", name: "Iced Cascade Cold Brew", desc: "18-hour steep, cream poured tableside, condensation guaranteed.", price: 189, img: "/img/dish-coldbrew.jpg", rating: 4.5, time: 12, veg: true, spice: 0, kcal: 90, tags: ["Cold"], restoId: "r8", cat: "Drinks" },
];

export const COUPONS = [
  { code: "EMBER50", title: "50% OFF up to ₹120", sub: "On orders above ₹249", tone: "gold" },
  { code: "FIRSTFLIGHT", title: "Flat ₹100 OFF", sub: "Your first order on Hungry Bird", tone: "sage" },
  { code: "LATENIGHT", title: "Free delivery", sub: "Midnight orders, 11pm–3am", tone: "plum" },
];

export const ADDONS = [
  { id: "a1", name: "Extra garlic naan", price: 49 },
  { id: "a2", name: "Butter swirl", price: 29 },
  { id: "a3", name: "Burani raita", price: 39 },
  { id: "a4", name: "Pickled onions", price: 25 },
];

export type CartItem = {
  key: string;
  dishId: string;
  qty: number;
  size: string;
  spice: number;
  addons: string[];
  note?: string;
  unitPrice: number;
};

export type Order = {
  id: string;
  items: CartItem[];
  total: number;
  status: "confirmed" | "preparing" | "picked" | "arriving" | "delivered";
  placedAt: string;
  restoName: string;
  eta: number;
};

export const PAST_ORDERS: Order[] = [
  { id: "HB-2841", items: [{ key: "p1", dishId: "d1", qty: 1, size: "Regular", spice: 1, addons: ["a1"], unitPrice: 429 }], total: 507, status: "delivered", placedAt: "Yesterday, 8:42 pm", restoName: "Ember & Smoke", eta: 0 },
  { id: "HB-2796", items: [{ key: "p2", dishId: "d2", qty: 2, size: "Large", spice: 2, addons: [], unitPrice: 389 }], total: 838, status: "delivered", placedAt: "Fri, 1:12 am", restoName: "Midnight Ramen Bar", eta: 0 },
  { id: "HB-2731", items: [{ key: "p3", dishId: "d9", qty: 1, size: "Regular", spice: 0, addons: ["a3"], unitPrice: 329 }], total: 397, status: "delivered", placedAt: "Tue, 1:30 pm", restoName: "The Green Hour", eta: 0 },
];

export const NOTIFS = [
  { id: "n1", type: "live", title: "Your biryani is on the fire", body: "Copper Handi started cooking · arrives ~7:45 pm", ago: "2 min", unread: true },
  { id: "n2", type: "offer", title: "Ember50 unlocked 🔥", body: "50% off up to ₹120 — today only", ago: "1 h", unread: true },
  { id: "n3", type: "order", title: "Delivered · HB-2796", body: "Ramen × 2 · Rate your midnight feast", ago: "3 d", unread: false },
  { id: "n4", type: "offer", title: "New near you", body: "Casa Fuego opened 1.9 km away — free churros this week", ago: "5 d", unread: false },
];

export const RIDER_MSGS = [
  { from: "rider", text: "Hi! Picked up your order, heading to Gate 2 🛵", t: "7:12 pm" },
  { from: "you", text: "Great, I'll wait at the lobby. Rain there?", t: "7:14 pm" },
  { from: "rider", text: "Light drizzle, food is covered well 👍", t: "7:14 pm" },
];
