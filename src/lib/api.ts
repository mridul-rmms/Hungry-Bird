"use client";

import type { Restaurant, Dish, Order } from "./types";

const j = async <T,>(res: Response): Promise<T> => {
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? `HTTP ${res.status}`);
  return res.json() as Promise<T>;
};

export type RestaurantWithMenu = Restaurant & { menu: Dish[] };

export const api = {
  restaurants: () => fetch("/api/restaurants").then((r) => j<{ restaurants: RestaurantWithMenu[] }>(r)),

  order: (code: string) => fetch(`/api/orders/${code}`).then((r) => j<{ order: Order }>(r)),

  orders: (email?: string) =>
    fetch(`/api/orders${email ? `?email=${encodeURIComponent(email)}` : ""}`).then((r) => j<{ orders: Order[] }>(r)),

  placeOrder: (body: {
    items: Order["items"];
    restaurantSlug: string;
    email?: string;
    subtotal: number;
    delivery: number;
    taxes: number;
    discount: number;
    total: number;
    coupon?: string;
    address: string;
    payment: string;
  }) => fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then((r) => j<{ order: Order }>(r)),

  otp: (email: string, code?: string, name?: string) =>
    fetch("/api/auth/otp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, code, name }) }).then((r) => j<{ ok: boolean; user: { email: string; name: string }; devCode?: string }>(r)),
};

/* ---------- coupons (static rules, validated client-side) ---------- */
export type Coupon = { code: string; label: string; min: number; off: (sub: number, del: number) => { discount: number; freeDel: boolean } };

export const COUPONS: Coupon[] = [
  { code: "HUNGRY20", label: "20% off up to ₹120", min: 299, off: (sub) => ({ discount: Math.min(120, Math.round(sub * 0.2)), freeDel: false }) },
  { code: "WELCOME50", label: "Flat ₹50 off", min: 199, off: () => ({ discount: 50, freeDel: false }) },
  { code: "FREEDEL", label: "Free delivery", min: 149, off: (_s, del) => ({ discount: 0, freeDel: del > 0 }) },
];

export const money = (n: number) => `₹${n.toLocaleString("en-IN")}`;
