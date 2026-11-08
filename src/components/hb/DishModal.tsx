"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Flame, Minus, Plus, Timer, X } from "lucide-react";
import { useHB } from "@/lib/store";
import { money } from "@/lib/api";
import { Spice, Stars, VegDot } from "./ui";

const PORTIONS = [
  { id: "Regular", delta: 0 },
  { id: "Large", delta: 79 },
  { id: "Party size", delta: 159 },
];

const ADDONS = [
  { id: "Extra cheese", price: 49, veg: true },
  { id: "Extra chutney/dip", price: 25, veg: true },
  { id: "Make it a combo (fries + drink)", price: 99, veg: true },
  { id: "Double protein", price: 89, veg: false },
];

const SPICE = ["Mild", "Medium", "Hot", "Extra hot"];

export default function DishModal() {
  const { dishModal, closeDish, addToCart, setCartOpen, toast } = useHB();
  const dish = dishModal?.dish;
  const [portion, setPortion] = useState("Regular");
  const [addons, setAddons] = useState<string[]>([]);
  const [spice, setSpice] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [qty, setQty] = useState(1);

  const base = dish?.price ?? 0;
  const unit = useMemo(() => {
    const p = PORTIONS.find((x) => x.id === portion)?.delta ?? 0;
    const a = addons.reduce((n, id) => n + (ADDONS.find((x) => x.id === id)?.price ?? 0), 0);
    return base + p + a;
  }, [base, portion, addons]);

  if (!dish) return null;

  const reset = () => { setPortion("Regular"); setAddons([]); setSpice(null); setNote(""); setQty(1); };

  const add = () => {
    const opts = [portion !== "Regular" ? portion : "", ...addons, spice ? `${spice} spice` : ""].filter(Boolean);
    const res = addToCart({ ...dish }, qty, opts, note.trim() || undefined);
    if (res === "replaced") toast(`New plate started from ${dish.restaurantName}`, { label: "View", run: () => setCartOpen(true) });
    else toast(`${qty} × ${dish.name} added`, { label: "View cart", run: () => setCartOpen(true) });
    reset();
    closeDish();
  };

  return (
    <AnimatePresence>
      {dish && (
        <motion.div key="dish-modal" className="fixed inset-0 z-[92] flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-label={`Customise ${dish.name}`}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeDish} />
          <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 90, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-[28px] bg-[var(--hb-card)] shadow-2xl sm:rounded-[28px]"
          >
            {/* header image */}
            <div className="relative h-44 shrink-0">
              <img src={dish.image} alt={dish.name} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--hb-card)] via-transparent to-transparent" />
              <button onClick={closeDish} className="hb-tap absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-black/40 text-white backdrop-blur" aria-label="Close">
                <X size={16} />
              </button>
              <div className="absolute bottom-3 left-5 right-5 flex items-center gap-2">
                <VegDot veg={dish.veg} size={15} />
                {dish.bestseller && <span className="rounded-full bg-black/45 px-2 py-0.5 text-[10px] font-black uppercase text-white backdrop-blur">Bestseller</span>}
                <Stars value={dish.rating} className="ml-auto rounded-full bg-black/45 px-2 py-0.5 text-white backdrop-blur [&>span:last-child]:text-white/70" />
              </div>
            </div>

            {/* body */}
            <div className="hb-scroll flex-1 overflow-y-auto px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-[22px] font-semibold leading-tight">{dish.name}</h2>
                  <p className="mt-0.5 text-[12.5px] font-semibold text-[var(--hb-ink3)]">{dish.restaurantName}</p>
                </div>
                <p className="font-display text-[20px] font-bold">{money(base)}</p>
              </div>
              <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--hb-ink2)]">{dish.desc}</p>
              <p className="mt-2 flex items-center gap-3 text-[12px] font-semibold text-[var(--hb-ink3)]">
                <span className="inline-flex items-center gap-1"><Timer size={12} /> {dish.prepMin} min prep</span>
                {dish.kcal && <span className="inline-flex items-center gap-1"><Flame size={12} /> {dish.kcal} kcal</span>}
                <Spice level={dish.spice} />
              </p>

              {/* portion */}
              <fieldset className="mt-5">
                <legend className="mb-2 text-[13px] font-bold">Choose portion</legend>
                <div className="flex flex-wrap gap-2">
                  {PORTIONS.map((p) => (
                    <button key={p.id} data-on={portion === p.id ? "1" : "0"} onClick={() => setPortion(p.id)} className="hb-chip" aria-pressed={portion === p.id}>
                      {p.id}{p.delta > 0 && <span className="text-[11px] font-bold text-[var(--hb-accent)]">+₹{p.delta}</span>}
                    </button>
                  ))}
                </div>
              </fieldset>

              {/* spice — only where it matters */}
              {dish.spice > 0 && (
                <fieldset className="mt-5">
                  <legend className="mb-2 text-[13px] font-bold">Spice level <span className="font-medium text-[var(--hb-ink3)]">(optional)</span></legend>
                  <div className="flex flex-wrap gap-2">
                    {SPICE.map((s, i) => (
                      <button key={s} data-on={spice === s ? "1" : "0"} onClick={() => setSpice(spice === s ? null : s)} className="hb-chip" aria-pressed={spice === s}>
                        {"🌶".repeat(Math.max(1, i))}{i === 0 && " 🥛"} {s}
                      </button>
                    ))}
                  </div>
                </fieldset>
              )}

              {/* add-ons */}
              <fieldset className="mt-5">
                <legend className="mb-2 text-[13px] font-bold">Add-ons</legend>
                <ul className="space-y-2">
                  {ADDONS.map((a) => {
                    const on = addons.includes(a.id);
                    return (
                      <li key={a.id}>
                        <button
                          onClick={() => setAddons((s) => (on ? s.filter((x) => x !== a.id) : [...s, a.id]))}
                          className={`flex w-full items-center gap-3 rounded-2xl border px-3.5 py-3 text-left transition-all ${on ? "border-[var(--hb-accent)] bg-[color-mix(in_srgb,var(--hb-accent)_8%,transparent)]" : "border-[var(--hb-line)] bg-[var(--hb-card)]"}`}
                          aria-pressed={on}
                        >
                          <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 ${on ? "border-[var(--hb-accent)] bg-[var(--hb-accent)] text-[var(--hb-accent-ink)]" : "border-[var(--hb-line)]"}`} aria-hidden>
                            {on && <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                          </span>
                          <VegDot veg={a.veg} size={12} />
                          <span className="flex-1 text-[13.5px] font-semibold">{a.id}</span>
                          <span className="text-[13px] font-bold text-[var(--hb-accent)]">+₹{a.price}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </fieldset>

              {/* note */}
              <fieldset className="mt-5">
                <legend className="mb-2 text-[13px] font-bold">Cook’s note <span className="font-medium text-[var(--hb-ink3)]">(optional)</span></legend>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                  placeholder="e.g. crispy edges, less oil, pack cutlery…"
                  className="hb-input resize-none"
                  aria-label="Note for the kitchen"
                />
              </fieldset>
            </div>

            {/* footer */}
            <div className="flex shrink-0 items-center gap-3 border-t border-[var(--hb-line)] bg-[var(--hb-card)] px-5 py-4">
              <div className="flex items-center gap-1 rounded-2xl border border-[var(--hb-line)] px-1.5 py-1.5" role="group" aria-label="Quantity">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="hb-tap grid h-8 w-8 place-items-center rounded-xl hover:bg-[var(--hb-muted)]" aria-label="Decrease quantity"><Minus size={15} /></button>
                <span className="w-6 text-center text-[15px] font-black" aria-live="polite">{qty}</span>
                <button onClick={() => setQty((q) => Math.min(9, q + 1))} className="hb-tap grid h-8 w-8 place-items-center rounded-xl hover:bg-[var(--hb-muted)]" aria-label="Increase quantity"><Plus size={15} /></button>
              </div>
              <button onClick={add} className="hb-btn hb-btn-basil h-12 flex-1 rounded-2xl text-[15px]">
                Add to plate · {money(unit * qty)}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
