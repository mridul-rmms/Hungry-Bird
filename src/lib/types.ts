export type Restaurant = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  cuisines: string[];
  rating: number;
  ratingCount: number;
  etaMin: number;
  etaMax: number;
  distance: number;
  fee: number;
  costForTwo: number;
  pureVeg: boolean;
  promoted: boolean;
  image: string;
  moods: string[];
};

export type Dish = {
  id: string;
  restaurantId: string;
  restaurantSlug?: string;
  restaurantName?: string;
  name: string;
  desc: string;
  price: number;
  rating: number;
  section: string;
  veg: boolean;
  spice: number;
  kcal: number | null;
  prepMin: number;
  image: string;
  bestseller: boolean;
};

export type CartItem = {
  key: string;
  dishId: string;
  name: string;
  price: number;
  qty: number;
  image: string;
  veg: boolean;
  opts: string[];
  note?: string;
};

export type OrderItem = { id: string; name: string; price: number; qty: number; opts: string[]; note?: string };

export type OrderStatus = "placed" | "confirmed" | "cooking" | "picked" | "delivered";

export type Order = {
  id: string;
  code: string;
  restaurantName: string;
  restaurantImage: string;
  items: OrderItem[];
  subtotal: number;
  delivery: number;
  taxes: number;
  discount: number;
  total: number;
  coupon: string | null;
  address: string;
  payment: string;
  status: OrderStatus;
  eta: number;
  createdAt: string;
};

export type SessionUser = { email: string; name: string };

export type View =
  | { name: "home" }
  | { name: "search"; q?: string }
  | { name: "restaurant"; slug: string }
  | { name: "checkout" }
  | { name: "orders" }
  | { name: "tracking"; code: string }
  | { name: "favorites" }
  | { name: "rewards" }
  | { name: "profile" };
