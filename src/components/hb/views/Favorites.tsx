"use client";

import { Heart } from "lucide-react";
import { useHB } from "@/lib/store";
import { useData } from "../data";
import { EmptyState } from "../ui";
import DishCard from "../DishCard";

export default function FavoritesView() {
  const favs = useHB((s) => s.favs);
  const { go } = useHB();
  const { restaurants, loading } = useData();

  const dishes = restaurants.flatMap((r) => r.menu).filter((d) => favs.includes(d.id));

  return (
    <div className="hb-container pb-16 pt-8">
      <p className="hb-eyebrow mb-1 text-[var(--hb-accent)]">Saved with ♥</p>
      <h1 className="hb-h1">Favorites</h1>

      <div className="mt-8">
        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {favs.slice(0, 4).map((id) => <div key={id} className="hb-skeleton h-64" />)}
          </div>
        ) : dishes.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="No favorites yet"
            sub="Tap the heart on any dish and it will wait for you here."
            action={<button onClick={() => go({ name: "search" })} className="hb-btn hb-btn-primary h-10 rounded-xl px-4 text-sm">Discover dishes</button>}
          />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {dishes.map((d) => <DishCard key={d.id} dish={d} />)}
          </div>
        )}
      </div>
    </div>
  );
}
