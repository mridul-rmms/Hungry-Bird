"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { RestaurantWithMenu } from "@/lib/api";

type DataCtx = {
  restaurants: RestaurantWithMenu[];
  loading: boolean;
  bestsellers: RestaurantWithMenu["menu"];
  bySlug: (slug: string) => RestaurantWithMenu | undefined;
};

const Ctx = createContext<DataCtx>({ restaurants: [], loading: true, bestsellers: [], bySlug: () => undefined });

export function DataProvider({ children }: { children: ReactNode }) {
  const [restaurants, setRestaurants] = useState<RestaurantWithMenu[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetch("/api/restaurants")
      .then((r) => r.json())
      .then((d) => alive && setRestaurants(d.restaurants ?? []))
      .catch(() => undefined)
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const bestsellers = restaurants.flatMap((r) => r.menu.filter((d) => d.bestseller).map((d) => d)).slice(0, 8);

  return (
    <Ctx.Provider value={{ restaurants, loading, bestsellers, bySlug: (slug) => restaurants.find((r) => r.slug === slug) }}>
      {children}
    </Ctx.Provider>
  );
}

export const useData = () => useContext(Ctx);
