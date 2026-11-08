"use client";

import { motion } from "framer-motion";
import { Plus, Heart } from "lucide-react";
import { useHB } from "@/lib/store";
import type { Dish } from "@/lib/types";
import { Spice, Stars, VegDot } from "./ui";

export default function DishCard({ dish }: { dish: Dish }) {
  const { go, openDish, favs, toggleFav, toast } = useHB();
  const fav = favs.includes(dish.id);

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="hb-card group flex cursor-pointer flex-col overflow-hidden rounded-3xl"
      onClick={() => dish.restaurantSlug && go({ name: "restaurant", slug: dish.restaurantSlug })}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && dish.restaurantSlug && go({ name: "restaurant", slug: dish.restaurantSlug })}
      aria-label={`${dish.name}, ₹${dish.price}`}
    >
      <div className="hb-imgwrap relative h-36 shrink-0">
        <img src={dish.image} alt={dish.name} className="h-full w-full object-cover" loading="lazy" />
        <button
          onClick={(e) => { e.stopPropagation(); toggleFav(dish.id); toast(fav ? "Removed from favorites" : `Saved ${dish.name} ♥`); }}
          className="hb-tap absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-black/35 backdrop-blur transition-transform hover:scale-110"
          aria-label={fav ? `Unfavorite ${dish.name}` : `Favorite ${dish.name}`}
        >
          <Heart size={14} className={fav ? "fill-[var(--hb-ember)] text-[var(--hb-ember)]" : "text-white"} />
        </button>
        {dish.bestseller && (
          <span className="absolute left-2 top-2 rounded-full bg-black/45 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-white backdrop-blur">Bestseller</span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-3.5">
        <div className="flex items-center gap-2">
          <VegDot veg={dish.veg} size={12} />
          <h3 className="line-clamp-1 flex-1 text-[14px] font-bold leading-tight">{dish.name}</h3>
        </div>
        <p className="mt-1 line-clamp-2 flex-1 text-[12px] leading-relaxed text-[var(--hb-ink2)]">{dish.desc}</p>
        <div className="mt-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[14.5px] font-extrabold">₹{dish.price}</span>
            <Stars value={dish.rating} />
          </div>
          <Spice level={dish.spice} />
        </div>
        <div className="mt-3 flex items-center justify-between gap-2">
          <p className="line-clamp-1 text-[11px] font-semibold text-[var(--hb-ink3)]">{dish.restaurantName}</p>
          <button
            onClick={(e) => { e.stopPropagation(); openDish(dish); }}
            className="hb-btn hb-btn-primary h-8 rounded-xl px-3 text-[12px]"
            aria-label={`Customise ${dish.name}`}
          >
            <Plus size={13} /> Add
          </button>
        </div>
      </div>
    </motion.article>
  );
}
