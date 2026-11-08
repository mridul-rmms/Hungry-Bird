"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, SlidersHorizontal, Store, UtensilsCrossed, X } from "lucide-react";
import { useHB } from "@/lib/store";
import { useData } from "../data";
import { EmptyState, SectionHead, SkelCard } from "../ui";
import { RestaurantCard } from "./Home";
import DishCard from "../DishCard";

type Sort = "relevance" | "rating" | "fast" | "cheap";

export default function SearchView() {
  const initial = useHB((s) => (s.view.name === "search" ? s.view.q : undefined)) ?? "";
  const { restaurants, loading } = useData();
  const { go } = useHB();
  const [q, setQ] = useState(initial);
  const [sort, setSort] = useState<Sort>("relevance");
  const [vegOnly, setVegOnly] = useState(false);
  const [topRated, setTopRated] = useState(false);
  const [fast, setFast] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setQ(initial); }, [initial]);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const query = q.trim().toLowerCase();

  const { restos, dishes } = useMemo(() => {
    let rs = restaurants.filter((r) =>
      !query ||
      r.name.toLowerCase().includes(query) ||
      r.cuisines.some((c) => c.toLowerCase().includes(query)) ||
      r.tagline.toLowerCase().includes(query) ||
      r.menu.some((d) => d.name.toLowerCase().includes(query)),
    );
    let ds = restaurants.flatMap((r) => r.menu).filter((d) =>
      !query ||
      d.name.toLowerCase().includes(query) ||
      d.desc.toLowerCase().includes(query) ||
      (d.restaurantName ?? "").toLowerCase().includes(query),
    );
    if (vegOnly) {
      ds = ds.filter((d) => d.veg);
      rs = rs.filter((r) => r.pureVeg || r.menu.some((d) => d.veg));
    }
    if (topRated) {
      ds = ds.filter((d) => d.rating >= 4.7);
      rs = rs.filter((r) => r.rating >= 4.7);
    }
    if (fast) {
      rs = rs.filter((r) => r.etaMax <= 30);
    }
    const bySort: Record<Sort, (a: { rating: number; price?: number }, b: { rating: number; price?: number }) => number> = {
      relevance: () => 0,
      rating: (a, b) => b.rating - a.rating,
      fast: () => 0,
      cheap: (a, b) => (a.price ?? 0) - (b.price ?? 0),
    };
    if (sort === "rating") {
      rs = [...rs].sort((a, b) => b.rating - a.rating);
      ds = [...ds].sort((a, b) => b.rating - a.rating);
    } else if (sort === "cheap") {
      ds = [...ds].sort((a, b) => a.price - b.price);
      rs = [...rs].sort((a, b) => a.costForTwo - b.costForTwo);
    } else if (sort === "fast") {
      rs = [...rs].sort((a, b) => a.etaMax - b.etaMax);
    }
    return { restos: rs, dishes: ds };
  }, [restaurants, query, vegOnly, topRated, fast, sort]);

  const chips: { label: string; on: boolean; run: () => void }[] = [
    { label: "Veg only", on: vegOnly, run: () => setVegOnly((v) => !v) },
    { label: "Rated 4.7+", on: topRated, run: () => setTopRated((v) => !v) },
    { label: "Fast delivery", on: fast, run: () => setFast((v) => !v) },
  ];

  return (
    <div className="hb-container pt-8">
      {/* search bar */}
      <div className="sticky top-16 z-30 -mx-1 bg-[linear-gradient(var(--hb-bg),transparent)] px-1 pb-4 pt-1 md:top-[72px]">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--hb-ink3)]" />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search dishes, kitchens, cravings…"
              className="hb-input !rounded-2xl !py-3.5 pl-11 pr-10"
              aria-label="Search dishes and kitchens"
            />
            {q && (
              <button onClick={() => setQ("")} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-[var(--hb-ink3)] hover:text-[var(--hb-ink)]" aria-label="Clear search">
                <X size={15} />
              </button>
            )}
          </div>
        </div>
        <div className="no-scrollbar mt-3 flex items-center gap-2 overflow-x-auto pb-1">
          <span className="flex shrink-0 items-center gap-1.5 text-[12px] font-bold text-[var(--hb-ink3)]"><SlidersHorizontal size={13} /> Filters</span>
          {chips.map((c) => (
            <button key={c.label} data-on={c.on ? "1" : "0"} onClick={c.run} className="hb-chip">{c.label}</button>
          ))}
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="hb-chip !py-2 outline-none" aria-label="Sort results">
            <option value="relevance">Sort: Relevance</option>
            <option value="rating">Sort: Top rated</option>
            <option value="fast">Sort: Fastest</option>
            <option value="cheap">Sort: Budget first</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <SkelCard key={i} h={300} />)}</div>
      ) : !query && !vegOnly && !topRated && !fast ? (
        <>
          <section className="mt-4" aria-label="Popular searches">
            <SectionHead eyebrow="Try something" title="Popular right now" />
            <div className="flex flex-wrap gap-2">
              {["Butter chicken", "Biryani", "Ramen", "Margherita", "Pancakes", "Sushi", "Cold brew", "Momos"].map((t) => (
                <button key={t} onClick={() => setQ(t)} className="hb-chip">{t}</button>
              ))}
            </div>
          </section>
          <section className="mt-10" aria-label="All kitchens">
            <SectionHead eyebrow="Browse" title="All kitchens around you" />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {restaurants.map((r) => <RestaurantCard key={r.id} r={r} />)}
            </div>
          </section>
        </>
      ) : restos.length === 0 && dishes.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={Search}
            title="Nothing matched that craving"
            sub={`We couldn't find "${q}". Try a dish name, a cuisine — or clear your filters.`}
            action={
              <button onClick={() => { setQ(""); setVegOnly(false); setTopRated(false); setFast(false); }} className="hb-btn hb-btn-primary h-10 rounded-xl px-4 text-sm">
                Reset search
              </button>
            }
          />
        </div>
      ) : (
        <div className="mt-2 space-y-10">
          {restos.length > 0 && (
            <section aria-label="Matching kitchens">
              <SectionHead eyebrow={`${restos.length} result${restos.length > 1 ? "s" : ""}`} title="Kitchens" sub="Restaurants matching your search" />
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {restos.map((r) => <RestaurantCard key={r.id} r={r} />)}
              </div>
            </section>
          )}
          {dishes.length > 0 && (
            <section aria-label="Matching dishes">
              <SectionHead eyebrow={`${dishes.length} plate${dishes.length > 1 ? "s" : ""}`} title="Dishes" sub="Straight to your plate" />
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {dishes.slice(0, 16).map((d) => <DishCard key={d.id} dish={d} />)}
              </div>
            </section>
          )}
          <p className="flex items-center justify-center gap-2 pb-4 text-[12.5px] font-medium text-[var(--hb-ink3)]">
            <Store size={13} /> {restos.length} kitchens <span aria-hidden>·</span> <UtensilsCrossed size={13} /> {dishes.length} dishes
            {" "}<button className="underline underline-offset-2 hover:text-[var(--hb-ink)]" onClick={() => go({ name: "home" })}>back home</button>
          </p>
        </div>
      )}
    </div>
  );
}
