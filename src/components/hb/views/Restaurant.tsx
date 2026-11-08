"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Info, Plus, TicketPercent } from "lucide-react";
import { useHB, cartCount, cartSubtotal } from "@/lib/store";
import { useData } from "../data";
import { EmptyState, Meta, SkelCard, Stars, VegDot, Spice } from "../ui";
import type { Dish } from "@/lib/types";

export default function RestaurantView() {
  const view = useHB((s) => s.view);
  const slug = view.name === "restaurant" ? view.slug : "";
  const { bySlug, loading } = useData();
  const { go, back, cart, cartRestaurant, addToCart, setCartOpen, openDish, toast } = useHB();
  const [section, setSection] = useState<string | null>(null);
  const [vegOnly, setVegOnly] = useState(false);

  const r = bySlug(slug);

  const sections = useMemo(() => {
    if (!r) return [];
    const map = new Map<string, Dish[]>();
    for (const d of r.menu) {
      if (vegOnly && !d.veg) continue;
      const list = map.get(d.section) ?? [];
      list.push(d);
      map.set(d.section, list);
    }
    return [...map.entries()];
  }, [r, vegOnly]);

  const inCart = cartRestaurant?.slug === slug;
  const count = cartCount(cart);
  const sub = cartSubtotal(cart);

  if (loading) {
    return (
      <div className="hb-container pt-6">
        <SkelCard h={280} />
        <div className="mt-8 space-y-4">{Array.from({ length: 4 }).map((_, i) => <SkelCard key={i} h={110} />)}</div>
      </div>
    );
  }

  if (!r) {
    return (
      <div className="hb-container pt-16">
        <EmptyState
          icon={Info}
          title="Kitchen not found"
          sub="This kitchen may have flown away. Head back and pick another."
          action={<button onClick={() => go({ name: "home" })} className="hb-btn hb-btn-primary h-10 rounded-xl px-4 text-sm">All kitchens</button>}
        />
      </div>
    );
  }

  const quickAdd = (d: Dish) => {
    const res = addToCart(d, 1, [], undefined);
    if (res === "replaced") {
      toast(`Started a new cart from ${r.name}`, { label: "Undo", run: () => undefined });
    } else {
      toast(`${d.name} added to your plate`);
    }
  };

  return (
    <div>
      {/* cover */}
      <div className="relative h-56 md:h-80">
        <img src={r.image} alt={r.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--hb-bg)] via-black/25 to-black/40" />
        <button onClick={back} className="hb-tap hb-press absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-2xl bg-black/40 text-white backdrop-blur md:hidden" aria-label="Go back">
          <ChevronLeft size={19} />
        </button>
        <div className="hb-container absolute inset-x-0 bottom-0 pb-5">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
            <div className="flex flex-wrap items-center gap-2">
              {r.promoted && <span className="rounded-full bg-[var(--hb-accent)] px-2.5 py-1 text-[10.5px] font-black uppercase tracking-wide text-[var(--hb-accent-ink)]">Promoted</span>}
              {r.pureVeg && <span className="rounded-full bg-[var(--hb-veg)] px-2.5 py-1 text-[10.5px] font-black uppercase tracking-wide text-white">Pure veg</span>}
            </div>
            <h1 className="mt-2 font-display text-[clamp(28px,4.5vw,44px)] font-semibold leading-none tracking-tight text-white drop-shadow-lg">{r.name}</h1>
            <p className="mt-1.5 text-[13.5px] font-medium text-white/85">{r.tagline}</p>
          </motion.div>
        </div>
      </div>

      <div className="hb-container pb-28 pt-5">
        {/* info bar */}
        <div className="hb-card grid grid-cols-2 gap-3 rounded-3xl p-4 sm:grid-cols-4">
          <div><p className="flex items-center gap-1.5 font-display text-[19px] font-bold"><Stars value={r.rating} /> <span className="text-[12px] font-semibold text-[var(--hb-ink3)]">{r.ratingCount} ratings</span></p><p className="text-[11.5px] font-medium text-[var(--hb-ink3)]">Taste & quality</p></div>
          <div><p className="font-display text-[19px] font-bold">{r.etaMin}–{r.etaMax} <span className="text-[12px] font-semibold text-[var(--hb-ink3)]">min</span></p><p className="text-[11.5px] font-medium text-[var(--hb-ink3)]">Delivery time</p></div>
          <div><p className="font-display text-[19px] font-bold">{r.distance} <span className="text-[12px] font-semibold text-[var(--hb-ink3)]">km</span></p><p className="text-[11.5px] font-medium text-[var(--hb-ink3)]">{r.cuisines.slice(0, 2).join(" · ")}</p></div>
          <div><p className="font-display text-[19px] font-bold">{r.fee === 0 ? "Free" : `₹${r.fee}`}</p><p className="text-[11.5px] font-medium text-[var(--hb-ink3)]">Delivery fee · ₹{r.costForTwo} for two</p></div>
        </div>

        {/* coupon strip */}
        <div className="mt-4 flex items-center gap-2.5 rounded-2xl border border-dashed border-[color-mix(in_srgb,var(--hb-accent)_45%,transparent)] bg-[color-mix(in_srgb,var(--hb-accent)_7%,transparent)] px-4 py-3">
          <TicketPercent size={16} className="text-[var(--hb-accent)]" />
          <p className="text-[13px] font-semibold">Use <b>HUNGRY20</b> for 20% off above ₹299 <span className="font-medium text-[var(--hb-ink2)]">· apply in cart</span></p>
        </div>

        {/* menu controls */}
        <div className="no-scrollbar sticky top-16 z-30 mt-6 flex items-center gap-2 overflow-x-auto bg-[linear-gradient(var(--hb-bg),transparent)] py-2 pointer-events-none md:top-[72px]">
          <button data-on={vegOnly ? "1" : "0"} onClick={() => setVegOnly((v) => !v)} className="hb-chip pointer-events-auto shrink-0">
            <VegDot veg size={12} /> Veg only
          </button>
          <span className="mx-1 h-5 w-px shrink-0 bg-[var(--hb-line)]" aria-hidden />
          {sections.map(([name]) => (
            <button
              key={name}
              data-on={section === name ? "1" : "0"}
              onClick={() => { setSection(name); document.getElementById(`sec-${name}`)?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
              className="hb-chip pointer-events-auto shrink-0"
            >
              {name}
            </button>
          ))}
        </div>

        {/* menu */}
        <div className="mt-4 space-y-10">
          {sections.map(([name, dishes]) => (
            <section key={name} id={`sec-${name}`} aria-label={name} className="scroll-mt-44">
              <div className="mb-3 flex items-end justify-between">
                <h2 className="hb-h3">{name}</h2>
                <p className="text-[12px] font-semibold text-[var(--hb-ink3)]">{dishes.length} item{dishes.length > 1 ? "s" : ""}</p>
              </div>
              <ul className="grid gap-3 md:grid-cols-2">
                {dishes.map((d) => (
                  <li key={d.id} className="scroll-mt-48">
                    <motion.div whileHover={{ y: -2 }} className="hb-card flex h-full cursor-pointer gap-4 rounded-3xl p-3.5" onClick={() => openDish(d)} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && openDish(d)} aria-label={`Customise ${d.name}`}>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <VegDot veg={d.veg} size={13} />
                          {d.bestseller && <span className="rounded bg-[color-mix(in_srgb,var(--hb-saffron)_22%,transparent)] px-1.5 py-0.5 text-[9.5px] font-black uppercase tracking-wide text-[color-mix(in_srgb,var(--hb-saffron)_75%,var(--hb-ink))]">Bestseller</span>}
                          <Spice level={d.spice} />
                        </div>
                        <h3 className="mt-1.5 text-[15px] font-bold leading-snug">{d.name}</h3>
                        <p className="mt-0.5 flex items-center gap-2 text-[14px] font-extrabold">₹{d.price} <Stars value={d.rating} /></p>
                        <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-[var(--hb-ink2)]">{d.desc}{d.kcal ? ` · ${d.kcal} kcal` : ""}</p>
                        <p className="mt-1 text-[11.5px] font-semibold text-[var(--hb-ink3)]">Prep {d.prepMin} min · customisable</p>
                      </div>
                      <div className="relative w-[104px] shrink-0 self-center sm:w-[120px]">
                        <div className="hb-imgwrap h-[104px] overflow-hidden rounded-2xl sm:h-[120px]">
                          <img src={d.image} alt={d.name} className="h-full w-full object-cover" loading="lazy" />
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); quickAdd(d); }}
                          className="hb-btn hb-btn-primary absolute -bottom-2 left-1/2 h-8 -translate-x-1/2 rounded-xl px-3 text-[12px] shadow-lg"
                          aria-label={`Quick add ${d.name}`}
                        >
                          <Plus size={14} /> Add
                        </button>
                      </div>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
          {sections.length === 0 && (
            <EmptyState icon={Info} title="No dishes match" sub="Turn off the veg filter to see the full menu." />
          )}
        </div>
      </div>

      {/* cart dock */}
      {inCart && count > 0 && (
        <motion.div initial={{ y: 90 }} animate={{ y: 0 }} className="fixed inset-x-3 bottom-[86px] z-[65] md:inset-x-0 md:bottom-6 md:flex md:justify-center">
          <button
            onClick={() => setCartOpen(true)}
            className="hb-btn hb-btn-basil h-14 w-full rounded-2xl px-5 text-[15px] shadow-2xl md:w-[520px]"
            aria-label={`View cart, ${count} items, ₹${sub + (r.fee ?? 0)}`}
          >
            <span className="flex w-full items-center justify-between">
              <span className="flex items-center gap-2"><span className="grid h-7 min-w-7 place-items-center rounded-lg bg-white/20 text-[12.5px] font-black">{count}</span> {count} item{count > 1 ? "s" : ""} on your plate</span>
              <span className="flex items-center gap-1.5 font-extrabold">₹{sub + (r.fee ?? 0)} <ChevronLeft size={15} className="rotate-180" /></span>
            </span>
          </button>
        </motion.div>
      )}
    </div>
  );
}
