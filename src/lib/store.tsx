"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, SessionUser, View, Dish } from "./types";

export type Toast = { id: number; msg: string; action?: { label: string; run: () => void } };

type HBState = {
  /* view router (SPA) */
  view: View;
  history: View[];
  go: (v: View) => void;
  back: () => void;

  /* cart — single restaurant, like real delivery apps */
  cartRestaurant: { slug: string; name: string } | null;
  cart: CartItem[];
  addToCart: (dish: Dish, qty?: number, opts?: string[], note?: string) => "added" | "replaced";
  setQty: (key: string, qty: number) => void;
  clearCart: () => void;

  /* favorites */
  favs: string[];
  toggleFav: (dishId: string) => void;

  /* ui */
  cartOpen: boolean;
  setCartOpen: (b: boolean) => void;
  authOpen: boolean;
  setAuthOpen: (b: boolean) => void;
  dishModal: { dish: Dish } | null;
  openDish: (d: Dish) => void;
  closeDish: () => void;

  /* session */
  user: SessionUser | null;
  signIn: (u: SessionUser) => void;
  signOut: () => void;

  /* toasts */
  toasts: Toast[];
  toast: (msg: string, action?: Toast["action"]) => void;
  dismissToast: (id: number) => void;
};

let toastSeq = 1;

export const useHB = create<HBState>()(
  persist(
    (set, get) => ({
      view: { name: "home" },
      history: [],
      go: (v) => set((s) => ({ view: v, history: [...s.history.slice(-20), s.view], dishModal: null })),
      back: () =>
        set((s) => {
          const h = [...s.history];
          const prev = h.pop();
          return prev ? { view: prev, history: h, dishModal: null } : { view: { name: "home" } as View, history: [] };
        }),

      cartRestaurant: null,
      cart: [],
      addToCart: (dish, qty = 1, opts = [], note) => {
        const st = get();
        let result: "added" | "replaced" = "added";
        let cart = st.cart;
        let cartRestaurant = st.cartRestaurant;

        if (st.cartRestaurant && st.cartRestaurant.slug !== (dish.restaurantSlug ?? "")) {
          // starting a fresh cart from a new restaurant (real-app behaviour)
          result = "replaced";
          cart = [];
          cartRestaurant = { slug: dish.restaurantSlug ?? "", name: dish.restaurantName ?? "" };
        }
        if (!cartRestaurant) cartRestaurant = { slug: dish.restaurantSlug ?? "", name: dish.restaurantName ?? "" };

        const key = `${dish.id}::${opts.slice().sort().join(",")}::${note ?? ""}`;
        const found = cart.find((i) => i.key === key);
        if (found) {
          cart = cart.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i));
        } else {
          cart = [
            ...cart,
            { key, dishId: dish.id, name: dish.name, price: dish.price, qty, image: dish.image, veg: dish.veg, opts, note },
          ];
        }
        set({ cart, cartRestaurant });
        return result;
      },
      setQty: (key, qty) =>
        set((s) => ({
          cart: qty <= 0 ? s.cart.filter((i) => i.key !== key) : s.cart.map((i) => (i.key === key ? { ...i, qty } : i)),
        })),
      clearCart: () => set({ cart: [], cartRestaurant: null }),

      favs: [],
      toggleFav: (dishId) =>
        set((s) => ({ favs: s.favs.includes(dishId) ? s.favs.filter((f) => f !== dishId) : [...s.favs, dishId] })),

      cartOpen: false,
      setCartOpen: (b) => set({ cartOpen: b }),
      authOpen: false,
      setAuthOpen: (b) => set({ authOpen: b }),
      dishModal: null,
      openDish: (dish) => set({ dishModal: { dish } }),
      closeDish: () => set({ dishModal: null }),

      user: null,
      signIn: (user) => set({ user, authOpen: false }),
      signOut: () => set({ user: null }),

      toasts: [],
      toast: (msg, action) => {
        const id = toastSeq++;
        set((s) => ({ toasts: [...s.toasts.slice(-2), { id, msg, action }] }));
        setTimeout(() => get().dismissToast(id), 3600);
      },
      dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
    }),
    {
      name: "hungrybird",
      partialize: (s) => ({ cart: s.cart, cartRestaurant: s.cartRestaurant, favs: s.favs, user: s.user }),
    },
  ),
);

export const cartCount = (cart: CartItem[]) => cart.reduce((n, i) => n + i.qty, 0);
export const cartSubtotal = (cart: CartItem[]) => cart.reduce((n, i) => n + i.qty * i.price, 0);
