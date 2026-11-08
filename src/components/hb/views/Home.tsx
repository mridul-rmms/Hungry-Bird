"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Flame, Search, Timer, BadgeCheck, ChevronRight } from "lucide-react";
import { useHB } from "@/lib/store";
import { useData } from "../data";
import { Meta, SectionHead, SkelCard, Stars } from "../ui";
import DishCard from "../DishCard";

const MOODS = [
  { id: "comfort", e: "🛋️", n: "Comfort" },
  { id: "spicy", e: "🌶️", n: "Spicy" },
  { id: "latenight", e: "🌙", n: "Late-night" },
  { id: "healthy", e: "🥗", n: "Healthy" },
  { id: "celebration", e: "🎉", n: "Celebration" },
  { id: "quick", e: "⚡", n: "Quick bite" },
];

const MOOD_TITLES: Record<string, string> = {
  comfort: "Warm hug in a bowl",
  spicy: "Turn the heat up",
  latenight: "Midnight menu",
  healthy: "Clean and green",
  celebration: "Worthy of a toast",
  quick: "Fast, not furious",
};

export function RestaurantCard({ r, wide = false }: { r: ReturnType<typeof useData>["restaurants"][number]; wide?: boolean }) {
  const { go } = useHB();
  return (
    <motion.article
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      onClick={() => go({ name: "restaurant", slug: r.slug })}
      className="hb-card hb-imgwrap group cursor-pointer overflow-hidden rounded-3xl"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && go({ name: "restaurant", slug: r.slug })}
      aria-label={`${r.name}, ${r.cuisines.join(", ")}`}
    >
      <div className={`relative ${wide ? "h-44" : "h-40"}`}>
        <img src={r.image} alt={r.name} className="h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
        {r.promoted && (
          <span className="absolute left-3 top-3 rounded-full bg-[var(--hb-card)]/90 px-2.5 py-1 text-[10.5px] font-black uppercase tracking-wide text-[var(--hb-accent)] backdrop-blur">
            Promoted
          </span>
        )}
        <span className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-black/45 px-2.5 py-1 text-[11.5px] font-bold text-white backdrop-blur">
          <Timer size={11} /> {r.etaMin}–{r.etaMax} min
        </span>
        {r.pureVeg && (
          <span className="absolute right-3 top-3 rounded-full bg-[var(--hb-veg)] px-2 py-1 text-[10px] font-black uppercase text-white">Pure veg</span>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-[16.5px] font-semibold leading-tight">{r.name}</h3>
          <Stars value={r.rating} count={r.ratingCount} className="shrink-0 rounded-md bg-[color-mix(in_srgb,var(--hb-veg)_12%,transparent)] px-1.5 py-0.5 text-[var(--hb-veg)]" />
        </div>
        <p className="mt-1 line-clamp-1 text-[13px] text-[var(--hb-ink2)]">{r.cuisines.join(" · ")}</p>
        <div className="mt-2.5">
          <Meta eta={`${r.etaMin}–${r.etaMax} min`} distance={r.distance} fee={r.fee} />
        </div>
      </div>
    </motion.article>
  );
}

export default function HomeView() {
  const { restaurants, bestsellers, loading } = useData();
  const { go } = useHB();
  const [mood, setMood] = useState<string | null>(null);

  const filtered = useMemo(() => (mood ? restaurants.filter((r) => r.moods.includes(mood)) : restaurants), [restaurants, mood]);
  const promoted = restaurants.filter((r) => r.promoted);
  const hero = bestsellers[0];

  return (
    <div className="hb-container pt-8 md:pt-12">
      {/* ---------------- HERO ---------------- */}
      <section className="grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr]" aria-label="Welcome">
        <div>
          <p className="hb-eyebrow mb-3 flex items-center gap-2 text-[var(--hb-accent)]">
            <Flame size={13} /> Delivering across Koramangala · 7 AM – 3 AM
          </p>
          <h1 className="font-display text-[clamp(34px,5.4vw,58px)] font-semibold leading-[1.04] tracking-[-0.02em]">
            Food that matches<br />your <em className="hb-serif-i hb-grad-text">mood</em>, not just your address.
          </h1>
          <p className="mt-4 max-w-lg text-[15.5px] leading-relaxed text-[var(--hb-ink2)]">
            Hungry Bird learns the vibe — comfort, fire, midnight or green — then brings the kitchen to you. Customise every plate, watch every step home.
          </p>

          <form
            onSubmit={(e) => { e.preventDefault(); go({ name: "search", q: new FormData(e.currentTarget).get("q") as string }); }}
            className="mt-6 flex max-w-lg items-center gap-2"
            role="search"
          >
            <div className="relative flex-1">
              <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--hb-ink3)]" />
              <input name="q" placeholder="Craving something? Try “biryani”…" className="hb-input !rounded-2xl !py-3.5 !pl-12" aria-label="Search food" />
            </div>
            <button type="submit" className="hb-btn hb-btn-basil h-[50px] rounded-2xl px-5">Find food</button>
          </form>

          <div className="mt-7 flex flex-wrap gap-2" role="group" aria-label="Pick a mood">
            {MOODS.map((m) => (
              <button key={m.id} data-on={mood === m.id ? "1" : "0"} onClick={() => setMood(mood === m.id ? null : m.id)} className="hb-chip !py-2.5">
                <span className="text-[15px]">{m.e}</span> {m.n}
              </button>
            ))}
          </div>

          <dl className="mt-8 flex gap-8 border-t border-[var(--hb-line)] pt-5">
            {[[`${restaurants.length * 12}+`, "curated kitchens"], [`${Math.max(18, restaurants.length * 3)} min`, "average delivery"], ["4.8★", "across 9k ratings"]].map(([v, k]) => (
              <div key={k}>
                <dt className="sr-only">{k}</dt>
                <dd className="font-display text-[22px] font-semibold">{v}</dd>
                <dd className="text-[12px] font-medium text-[var(--hb-ink3)]">{k}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* hero visual collage */}
        <div className="relative hidden h-[480px] select-none lg:block" aria-hidden>
          <div className="hb-anim-blob absolute right-6 top-4 h-[380px] w-[380px] bg-[radial-gradient(circle_at_35%_35%,var(--hb-glow),transparent_65%)]" />
          {hero && (
            <motion.div
              initial={{ opacity: 0, y: 24, rotate: -3 }}
              animate={{ opacity: 1, y: 0, rotate: -3 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="hb-card absolute left-2 top-14 w-[320px] overflow-hidden rounded-[28px] p-3 shadow-2xl"
            >
              <div className="hb-imgwrap relative h-52 overflow-hidden rounded-3xl">
                <img src={hero.image} alt="" className="h-full w-full object-cover" />
                <span className="hb-steam-puff left-1/2 top-3" style={{ animationDelay: "0.4s" }} />
                <span className="hb-steam-puff left-[58%] top-4" style={{ animationDelay: "1.3s" }} />
                <span className="absolute bottom-3 left-3 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur">Chef’s fire pick</span>
              </div>
              <div className="flex items-center justify-between px-2 pb-1 pt-3">
                <div>
                  <p className="font-display text-[16px] font-semibold">{hero.name}</p>
                  <p className="text-[12px] text-[var(--hb-ink2)]">{hero.restaurantName}</p>
                </div>
                <p className="font-display text-[19px] font-bold text-[var(--hb-accent)]">₹{hero.price}</p>
              </div>
            </motion.div>
          )}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="hb-card hb-anim-float absolute bottom-16 right-2 w-[230px] rounded-3xl p-4 shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[color-mix(in_srgb,var(--hb-basil)_15%,transparent)] text-[var(--hb-basil)]"><BadgeCheck size={20} /></span>
              <div>
                <p className="text-[13.5px] font-bold">Order confirmed</p>
                <p className="text-[11.5px] text-[var(--hb-ink2)]">Rider Tanmay is on the way</p>
              </div>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--hb-muted)]">
              <motion.div initial={{ width: "12%" }} animate={{ width: "72%" }} transition={{ delay: 0.8, duration: 1.6, ease: "easeOut" }} className="h-full rounded-full bg-[var(--hb-basil)]" />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 18 }}
            className="hb-card absolute right-16 top-0 rounded-2xl px-4 py-3 text-center shadow-xl"
          >
            <p className="font-display text-[20px] font-bold text-[var(--hb-ember)]">🔥 25 min</p>
            <p className="text-[11px] font-semibold text-[var(--hb-ink2)]">fastest drop today</p>
          </motion.div>
        </div>
      </section>

      {/* ---------------- PROMOTED ---------------- */}
      {promoted.length > 0 && (
        <section className="mt-14" aria-label="Promoted kitchens">
          <SectionHead eyebrow="Handpicked tonight" title="Promoted kitchens" sub="Kitchens our curators keep going back to" />
          <div className="no-scrollbar -mx-1 flex snap-x snap-mandatory gap-5 overflow-x-auto px-1 pb-2">
            {promoted.map((r) => (
              <div key={r.id} className="w-[320px] shrink-0 snap-start md:w-[380px]">
                <RestaurantCard r={r} wide />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---------------- QUICK PICKS ---------------- */}
      <section className="mt-14" aria-label="Bestsellers near you">
        <SectionHead
          eyebrow="Blazing hot"
          title="Quick picks"
          sub="Most-reordered plates in your area"
          right={<button onClick={() => go({ name: "search" })} className="hb-btn hb-btn-ghost hidden h-9 rounded-xl px-3.5 text-[13px] sm:inline-flex">See all <ArrowRight size={14} /></button>}
        />
        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <SkelCard key={i} h={240} />)}</div>
        ) : (
          <div className="no-scrollbar -mx-1 flex snap-x gap-4 overflow-x-auto px-1 pb-2 lg:grid lg:grid-cols-4 lg:overflow-visible">
            {bestsellers.slice(0, 4).map((d) => (
              <div key={d.id} className="w-[240px] shrink-0 snap-start lg:w-auto"><DishCard dish={d} /></div>
            ))}
          </div>
        )}
      </section>

      {/* ---------------- ALL RESTAURANTS ---------------- */}
      <section className="mt-14" aria-label="All restaurants">
        <SectionHead
          eyebrow={mood ? MOOD_TITLES[mood] : "Explore"}
          title={mood ? `${MOODS.find((m) => m.id === mood)?.n} picks for you` : "All kitchens around you"}
          sub={mood ? "Curated for the vibe you picked" : `${restaurants.length} kitchens · sorted by distance`}
          right={mood ? <button onClick={() => setMood(null)} className="hb-btn hb-btn-ghost h-9 rounded-xl px-3.5 text-[13px]">Clear mood</button> : undefined}
        />
        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <SkelCard key={i} h={300} />)}</div>
        ) : filtered.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-[var(--hb-line)] p-10 text-center text-sm text-[var(--hb-ink2)]">No kitchens match that mood right now — try another vibe.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((r) => <RestaurantCard key={r.id} r={r} />)}
          </div>
        )}
      </section>

      {/* ---------------- HOW IT WORKS ---------------- */}
      <section className="mb-4 mt-16" aria-label="How Hungry Bird works">
        <div className="hb-card relative overflow-hidden rounded-[28px] p-8 md:p-10">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[radial-gradient(circle,var(--hb-glow),transparent_70%)]" aria-hidden />
          <SectionHead eyebrow="Why Hungry Bird" title="From craving to doorstep in three moves" />
          <ol className="grid gap-6 sm:grid-cols-3">
            {[
              { t: "Pick your mood", d: "Comfort, fire, midnight, green — the home page reshuffles around how you feel, not a boring category list.", i: "🛋️" },
              { t: "Build your plate", d: "Portions, spice, add-ons, notes. Your cart literally becomes a plate, so you see the meal before you pay.", i: "🍽️" },
              { t: "Watch it fly home", d: "A cinematic live map with your rider’s real route, kitchen milestones and a countdown that means it.", i: "🛵" },
            ].map((s, i) => (
              <li key={s.t} className="relative">
                <span className="font-display text-[34px] font-bold text-[var(--hb-accent)] opacity-25">0{i + 1}</span>
                <p className="font-display text-[17px] font-semibold"><span className="mr-1.5">{s.i}</span>{s.t}</p>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--hb-ink2)]">{s.d}</p>
              </li>
            ))}
          </ol>
          <button onClick={() => go({ name: "search" })} className="hb-btn hb-btn-primary mt-8 h-11 rounded-2xl px-5">
            Start an order <ChevronRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
}
