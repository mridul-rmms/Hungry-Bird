"use client";
/* Hungry Bird — account cluster: History, Favorites, Offers, Rate, Profile, Notifications, States gallery */
import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ChevronRight, Heart, RotateCcw, Star, X } from "lucide-react";
import { useHB, dishById, rupee } from "@/lib/store";
import { PAST_ORDERS, NOTIFS, COUPONS, DISHES, MOODS, type Dish, type Order } from "@/lib/data";
import { BackBar, Glass, SoftBtn, Price, RatePill, Skel, spring, springSoft } from "../ui";

/* ---------- shared motion tokens ---------- */
const EASE: [number, number, number, number] = [0.22, 0.8, 0.24, 1];
const GLOW_BTN = "linear-gradient(135deg, var(--hb-accent-hi), var(--hb-accent))";

/* scroll reveal — blur + rise, matching the home feed idiom */
function Reveal({ children, delay = 0, className = "", style }: { children: React.ReactNode; delay?: number; className?: string; style?: React.CSSProperties }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: EASE }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* ============================================================
   HISTORY — order history & one-tap reorder
   ============================================================ */
export function History() {
  const { navigate, addToCart, showToast } = useHB();

  const reorder = (o: Order) => {
    o.items.forEach((it) =>
      addToCart({ dishId: it.dishId, qty: it.qty, size: it.size, spice: it.spice, addons: [...it.addons], note: it.note, unitPrice: it.unitPrice })
    );
    showToast("On your plate · 1-tap reorder");
    navigate("cart");
  };

  return (
    <div className="no-scrollbar h-full overflow-y-auto pb-32" style={{ background: "var(--hb-bg)" }}>
      <BackBar title="Your orders" />
      <p className="-mt-1.5 px-5 pb-1 text-[12.5px] text-[var(--hb-ink2)]">24 orders · you feed well 🪽</p>

      {/* one-tap reorder strip */}
      <section className="mt-4" aria-label="One-tap reorder">
        <p className="hb-eyebrow px-5" style={{ color: "var(--hb-accent)" }}>One-tap reorder</p>
        <div className="no-scrollbar mt-3 flex gap-4 overflow-x-auto px-5 pb-1">
          {PAST_ORDERS.map((o, i) => {
            const d = dishById(o.items[0].dishId);
            return (
              <motion.button
                key={o.id}
                initial={{ opacity: 0, y: 22, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.06, ease: EASE }}
                onClick={() => reorder(o)}
                aria-label={`Reorder ${d.name} from ${o.restoName}`}
                className="hb-tap hb-press hb-focus relative shrink-0 text-center"
              >
                <img
                  src={d.img}
                  alt=""
                  className="h-[88px] w-[88px] rounded-full object-cover"
                  style={{ boxShadow: "var(--hb-shadow), 0 0 0 3px var(--hb-card), 0 0 0 4.5px var(--hb-line)" }}
                />
                <span
                  aria-hidden
                  className="absolute -bottom-0.5 -right-0.5 grid h-7 w-7 place-items-center rounded-full text-[15px] font-bold"
                  style={{ background: GLOW_BTN, color: "var(--hb-accent-ink)", boxShadow: "0 6px 16px -4px var(--hb-glow)" }}
                >
                  ↻
                </span>
                <p className="mt-2 max-w-[88px] truncate text-[11px] font-semibold">{d.name.split(" ").slice(0, 2).join(" ")}</p>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* order cards */}
      <section className="mt-7 space-y-4 px-5" aria-label="Past orders">
        {PAST_ORDERS.map((o, i) => (
          <Reveal key={o.id} delay={0.05 + (i % 3) * 0.06}>
            <div className="rounded-[24px] p-4" style={{ background: "var(--hb-card)", boxShadow: "var(--hb-shadow)" }}>
              <div className="flex items-center justify-between gap-3">
                <p className="truncate font-display text-[16.5px] font-semibold">{o.restoName}</p>
                <span
                  className="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em]"
                  style={{ background: "var(--hb-glow)", color: "var(--hb-accent)" }}
                >
                  delivered
                </span>
              </div>
              <p className="mt-1 text-[11.5px] text-[var(--hb-ink2)]">{o.placedAt} · {o.id} · {rupee(o.total)}</p>

              <div className="mt-3 flex items-center gap-2">
                {o.items.map((it) => {
                  const d = dishById(it.dishId);
                  return (
                    <span key={it.key} className="relative">
                      <img src={d.img} alt={d.name} className="h-11 w-11 rounded-[12px] object-cover" />
                      {it.qty > 1 && (
                        <span className="absolute -bottom-1 -right-1 grid h-4 min-w-4 place-items-center rounded-full px-1 text-[9px] font-bold" style={{ background: "var(--hb-ink)", color: "var(--hb-card)" }}>
                          {it.qty}
                        </span>
                      )}
                    </span>
                  );
                })}
                <p className="ml-1 flex-1 text-[12px] text-[var(--hb-ink2)]">
                  {o.items.reduce((a, x) => a + x.qty, 0)} item{o.items.length > 1 ? "s" : ""}
                </p>
              </div>

              <div className="mt-4 flex items-center gap-2.5">
                <SoftBtn variant="soft" onClick={() => reorder(o)} className="h-10 flex-1 rounded-[14px] text-[13px]">
                  <RotateCcw size={13} /> Reorder
                </SoftBtn>
                <SoftBtn variant="ghost" onClick={() => navigate("rate")} className="h-10 rounded-[14px] px-5 text-[13px]">
                  Rate
                </SoftBtn>
              </div>
            </div>
          </Reveal>
        ))}
      </section>

      {/* tip footer */}
      <div className="mt-6 px-5">
        <Reveal delay={0.1}>
          <Glass className="flex items-center gap-3.5 rounded-[22px] p-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] text-[20px]" style={{ background: "var(--hb-glow)" }}>🤍</span>
            <div className="min-w-0">
              <p className="text-[13.5px] font-semibold">Cooked 38 meals with you</p>
              <p className="mt-0.5 text-[11.5px] text-[var(--hb-ink2)]">6 chef compliments 🤍</p>
            </div>
          </Glass>
        </Reveal>
      </div>
    </div>
  );
}

/* ============================================================
   FAVORITES — collections & living grid
   ============================================================ */
type ColId = "feasts" | "green" | "midnight";
const COLLECTIONS: { id: ColId; label: string; emoji: string; mood: string; match: (d: Dish) => boolean }[] = [
  { id: "feasts", label: "Weekend Feasts", emoji: "🍗", mood: "celebrate", match: (d) => d.price > 400 },
  { id: "green", label: "Green Days", emoji: "🌿", mood: "healthy", match: (d) => d.veg },
  { id: "midnight", label: "Midnight", emoji: "🌙", mood: "late", match: (d) => d.restoId === "r2" || d.cat === "Desserts" },
];

export function Favorites() {
  const { favorites, toggleFav, navigate } = useHB();
  const [col, setCol] = useState<ColId | null>(null);

  const favs = useMemo(() => DISHES.filter((d) => favorites.includes(d.id)), [favorites]);
  const colDef = COLLECTIONS.find((c) => c.id === col);
  const shown = col && colDef ? favs.filter(colDef.match) : favs;

  return (
    <div className="no-scrollbar h-full overflow-y-auto pb-32" style={{ background: "var(--hb-bg)" }}>
      <BackBar title="Favorites" />

      {/* collections */}
      <section className="mt-1" aria-label="Collections">
        <div className="grid grid-cols-3 gap-3 px-5">
          {COLLECTIONS.map((c, i) => {
            const hue = MOODS.find((m) => m.id === c.mood)?.hue ?? "var(--hb-accent)";
            const active = col === c.id;
            const n = favs.filter(c.match).length;
            return (
              <motion.button
                key={c.id}
                initial={{ opacity: 0, y: 22, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.06, ease: EASE }}
                onClick={() => setCol(active ? null : c.id)}
                aria-pressed={active}
                aria-label={`${c.label} collection, ${n} saved`}
                className="hb-tap hb-press hb-focus relative overflow-hidden rounded-[18px] p-3 text-left"
                style={{
                  background: `linear-gradient(140deg, ${hue}, color-mix(in srgb, ${hue} 42%, transparent))`,
                  boxShadow: active ? `0 12px 26px -8px ${hue}aa, inset 0 0 0 2px rgba(255,255,255,0.5)` : "var(--hb-shadow)",
                }}
              >
                <span className="text-[19px]">{c.emoji}</span>
                <p className="mt-1.5 text-[11px] font-bold leading-tight text-white">{c.label}</p>
                <p className="text-[9.5px] font-semibold text-white/75">{n} saved</p>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* saved dishes grid */}
      <section className="mt-6 px-5" aria-label="Saved dishes">
        {favs.length === 0 ? (
          <div className="grid place-items-center py-16 text-center">
            <p className="hb-anim-float-slow text-[56px]" aria-hidden>🍽️</p>
            <p className="hb-h3 mt-4">No favorites yet</p>
            <p className="mt-1 text-[13px] text-[var(--hb-ink2)]">Tap 🤍 on any dish.</p>
          </div>
        ) : shown.length === 0 ? (
          <p className="rounded-[18px] p-5 text-center text-[12.5px] text-[var(--hb-ink2)]" style={{ background: "var(--hb-muted)" }}>
            Nothing in this collection yet — save a matching dish.
          </p>
        ) : (
          <motion.div layout className="grid grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {shown.map((d) => (
                <motion.div
                  key={d.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.82 }}
                  transition={springSoft}
                  className="relative"
                >
                  <button
                    onClick={() => navigate("dish", { dishId: d.id })}
                    aria-label={`Open ${d.name}`}
                    className="hb-press hb-focus block w-full text-left"
                  >
                    <img src={d.img} alt={d.name} className="h-[130px] w-full rounded-[18px] object-cover" style={{ boxShadow: "var(--hb-shadow)" }} />
                    <p className="mt-2 truncate text-[13px] font-bold">{d.name}</p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-[12px] text-[var(--hb-ink2)]">
                      <Price v={d.price} /> <RatePill v={d.rating} />
                    </p>
                  </button>
                  <button
                    onClick={() => toggleFav(d.id)}
                    aria-label={`Remove ${d.name} from favorites`}
                    className="hb-glass hb-tap hb-press absolute right-1.5 top-1.5 grid h-11 w-11 place-items-center rounded-full"
                  >
                    <motion.span initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ ...spring, stiffness: 500, damping: 14 }}>
                      <Heart size={17} strokeWidth={1.6} fill="#d6482b" color="#d6482b" />
                    </motion.span>
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>
    </div>
  );
}

/* ============================================================
   OFFERS — wings loyalty, torn tickets, perks
   ============================================================ */
const TONE: Record<string, string> = { gold: "var(--hb-accent)", sage: "#7ba05b", plum: "#c445c9" };
const PERKS = [
  { e: "🎂", t: "Birthday dessert on us", s: "During your birthday week" },
  { e: "🚀", t: "Priority rider", s: "When the minutes matter" },
  { e: "🍫", t: "Secret menu access", s: "Off-menu dishes, quiet drops" },
];

export function Offers() {
  const { showToast } = useHB();
  const pct = Math.round((1240 / 2000) * 100);

  return (
    <div className="no-scrollbar h-full overflow-y-auto pb-32" style={{ background: "var(--hb-bg)" }}>
      <BackBar title="Offers & rewards" />

      {/* wings loyalty hero */}
      <div className="px-5">
        <Reveal>
          <Glass className="relative overflow-hidden rounded-[26px] p-5">
            <div aria-hidden className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full opacity-40 blur-2xl" style={{ background: "var(--hb-accent)" }} />
            <p className="hb-eyebrow" style={{ color: "var(--hb-accent)" }}>wings · loyalty</p>
            <p className="font-display mt-2 text-[30px] font-semibold leading-none">1,240 wings 🪽</p>
            <div className="mt-4">
              <div className="h-2.5 w-full overflow-hidden rounded-full" style={{ background: "var(--hb-muted)" }}>
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.1, delay: 0.25, ease: EASE }}
                  className="relative h-full rounded-full"
                  style={{ background: GLOW_BTN, boxShadow: "0 0 14px var(--hb-glow)" }}
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-full"
                    style={{ backgroundImage: "linear-gradient(100deg, transparent 25%, rgba(255,255,255,0.65) 50%, transparent 75%)", backgroundSize: "200px 100%", animation: "hb-shimmer 1.7s linear infinite" }}
                  />
                </motion.div>
              </div>
              <div className="mt-2 flex justify-between text-[9.5px] font-bold uppercase tracking-[0.14em] text-[var(--hb-ink3)]">
                <span>ember wing</span>
                <span>golden wing · 2,000</span>
              </div>
            </div>
            <p className="mt-3 text-[12.5px] text-[var(--hb-ink2)]">120 wings to golden · 2× wings on weekends</p>
          </Glass>
        </Reveal>
      </div>

      {/* coupon tickets */}
      <section className="mt-7 px-5" aria-label="Coupons">
        <p className="hb-eyebrow px-1 text-[var(--hb-ink2)]">Coupons</p>
        <div className="mt-3 space-y-4">
          {COUPONS.map((c, i) => (
            <Reveal key={c.code} delay={0.05 + i * 0.06}>
              <div className="relative rounded-[20px] p-4" style={{ background: "var(--hb-card)", border: "1.5px dashed var(--hb-line)", boxShadow: "var(--hb-shadow)" }}>
                <span aria-hidden className="absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full" style={{ background: "var(--hb-bg)" }} />
                <span aria-hidden className="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full" style={{ background: "var(--hb-bg)" }} />
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-display text-[17px] font-semibold">{c.title}</p>
                    <p className="mt-0.5 text-[12px] text-[var(--hb-ink2)]">{c.sub}</p>
                  </div>
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ background: TONE[c.tone] ?? "var(--hb-accent)" }} />
                </div>
                <button
                  onClick={() => showToast(`Code copied · ${c.code}`)}
                  aria-label={`Copy code ${c.code}`}
                  className="hb-tap hb-press hb-focus mt-3 inline-flex items-center rounded-[12px] px-3 py-2 text-[12.5px] font-black tracking-[0.1em]"
                  style={{ border: "1.5px dashed", color: TONE[c.tone] ?? "var(--hb-accent)" }}
                >
                  {c.code}
                  <span className="ml-2 text-[9px] font-bold uppercase tracking-[0.14em] opacity-60">tap to copy</span>
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* perks */}
      <section className="mt-7 px-5" aria-label="Perks">
        <Reveal>
          <div className="rounded-[22px] p-2" style={{ background: "var(--hb-card)", boxShadow: "var(--hb-shadow)" }}>
            {PERKS.map((p, i) => (
              <div key={p.t} className="flex items-center gap-3.5 px-3 py-3" style={i > 0 ? { borderTop: "1px solid var(--hb-line)" } : undefined}>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[12px] text-[17px]" style={{ background: "var(--hb-muted)" }}>{p.e}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13.5px] font-semibold">{p.t}</p>
                  <p className="text-[11px] text-[var(--hb-ink2)]">{p.s}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>
    </div>
  );
}

/* ============================================================
   RATE — stars, quick tags, photo, review
   ============================================================ */
const RATE_TAGS = ["Portion generous", "Arrived hot", "Great packaging", "Worth the price"];

function TagChip({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className="hb-tap hb-press hb-focus whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-semibold"
      style={active ? { background: GLOW_BTN, color: "var(--hb-accent-ink)" } : { background: "var(--hb-muted)", color: "var(--hb-ink2)" }}
    >
      {children}
    </button>
  );
}

export function Rate() {
  const { back, showToast } = useHB();
  const [stars, setStars] = useState(0);
  const [tag, setTag] = useState<string | null>(null);
  const [photo, setPhoto] = useState(false);
  const [note, setNote] = useState("");

  const label = stars === 0 ? "Tap a star" : stars <= 3 ? "Tell us more" : stars === 4 ? "Lovely!" : "Chef's kiss!";

  const submit = () => {
    showToast("Thanks! 25 wings added 🪽");
    setTimeout(back, 600);
  };

  return (
    <div className="no-scrollbar h-full overflow-y-auto pb-32" style={{ background: "var(--hb-bg)" }}>
      <BackBar title="Rate your feast" />

      {/* dish hero */}
      <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={springSoft} className="px-5 pt-1 text-center">
        <img
          src="/img/hero-butter.jpg"
          alt="Old Delhi Butter Chicken"
          className="hb-anim-float-slow mx-auto h-28 w-28 rounded-full object-cover"
          style={{ boxShadow: "var(--hb-shadow-lg), 0 0 0 4px var(--hb-card), 0 0 0 5px var(--hb-line)" }}
        />
        <p className="hb-h3 mt-4">Old Delhi Butter Chicken</p>
        <p className="mt-0.5 text-[12px] text-[var(--hb-ink2)]">Ember &amp; Smoke · HB-2841</p>
      </motion.div>

      {/* stars */}
      <div className="mt-5 flex justify-center gap-1.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <button key={s} onClick={() => setStars(s)} aria-label={`${s} star${s > 1 ? "s" : ""}`} aria-pressed={stars >= s} className="hb-tap hb-press hb-focus grid place-items-center p-1">
            <motion.span
              key={s <= stars ? "on" : "off"}
              initial={{ scale: 0.3, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 480, damping: 15, delay: (s - 1) * 0.05 }}
            >
              <Star size={34} strokeWidth={1.6} fill={s <= stars ? "var(--hb-accent)" : "none"} color={s <= stars ? "var(--hb-accent)" : "var(--hb-ink3)"} />
            </motion.span>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={label}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
          className="mt-2 font-display text-[15px]"
          style={{ color: stars >= 4 ? "var(--hb-accent)" : "var(--hb-ink2)" }}
        >
          {label}
        </motion.p>
      </AnimatePresence>

      {/* quick tags */}
      <section className="mt-6 px-5" aria-label="Quick tags">
        <p className="hb-eyebrow px-1 text-[var(--hb-ink2)]">Quick tags</p>
        <div className="no-scrollbar mt-2.5 flex gap-2 overflow-x-auto pb-1">
          {RATE_TAGS.map((t) => (
            <TagChip key={t} active={tag === t} onClick={() => setTag(tag === t ? null : t)}>{t}</TagChip>
          ))}
        </div>
      </section>

      {/* photo */}
      <section className="mt-5 px-5" aria-label="Photos">
        <p className="hb-eyebrow px-1 text-[var(--hb-ink2)]">Photos</p>
        <div className="mt-2.5">
          {!photo ? (
            <motion.button
              layout
              onClick={() => setPhoto(true)}
              aria-label="Add photos"
              className="hb-tap hb-press hb-focus flex h-24 w-full flex-col items-center justify-center gap-1 rounded-[20px]"
              style={{ border: "1.5px dashed var(--hb-line)", color: "var(--hb-accent)" }}
            >
              <Camera size={18} />
              <span className="text-[12.5px] font-semibold">Add photos</span>
            </motion.button>
          ) : (
            <motion.div
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={springSoft}
              className="flex items-center gap-3 rounded-[20px] p-3"
              style={{ border: "1.5px dashed var(--hb-line)" }}
            >
              <img src="/img/dish-lava.jpg" alt="Attached photo of molten lava cake" className="h-16 w-16 rounded-[14px] object-cover" />
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold">1 photo attached</p>
                <p className="text-[11px] text-[var(--hb-ink2)]">Looks tasty already</p>
              </div>
              <button onClick={() => setPhoto(false)} aria-label="Remove photo" className="hb-tap hb-press grid h-11 w-11 place-items-center rounded-full" style={{ background: "var(--hb-muted)" }}>
                <X size={16} />
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* review + submit */}
      <section className="mt-5 px-5" aria-label="Your review">
        <p className="hb-eyebrow px-1 text-[var(--hb-ink2)]">Your words</p>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="How was it? Tell the kitchen…"
          aria-label="Your review"
          rows={4}
          className="mt-2.5 w-full resize-none rounded-[20px] p-4 text-[14px] leading-relaxed placeholder:text-[var(--hb-ink3)] focus:outline-none"
          style={{ background: "var(--hb-bg2)", boxShadow: "var(--hb-neu-in)" }}
        />
        <SoftBtn onClick={submit} className="mt-3 h-14 w-full rounded-[20px] text-[15px]">Submit · earn 25 wings 🪽</SoftBtn>
      </section>
    </div>
  );
}

/* ============================================================
   PROFILE — identity, stats, address, theme, settings
   ============================================================ */
export function Profile() {
  const { navigate, addresses, activeAddr, favorites, mode, setMode } = useHB();
  const addr = addresses.find((a) => a.id === activeAddr) ?? addresses[0];

  const rows: { e: string; t: string; go: () => void }[] = [
    { e: "📍", t: "Addresses", go: () => navigate("location") },
    { e: "🎟️", t: "Offers", go: () => navigate("offers") },
    { e: "🤍", t: "Favorites", go: () => navigate("favorites") },
    { e: "🔔", t: "Notifications", go: () => navigate("notifications") },
    { e: "⭐", t: "Rate past orders", go: () => navigate("rate") },
    { e: "🧾", t: "Order history", go: () => navigate("history") },
    { e: "🎨", t: "Design system", go: () => navigate("design-system") },
    { e: "🧩", t: "States gallery", go: () => navigate("states") },
  ];

  return (
    <div className="no-scrollbar h-full overflow-y-auto pb-32" style={{ background: "var(--hb-bg)" }}>
      <div className="px-5 pt-[72px]">
        {/* identity */}
        <Reveal className="flex items-center gap-4">
          <div
            className="grid h-16 w-16 shrink-0 place-items-center rounded-full font-display text-[24px] font-bold"
            style={{ background: GLOW_BTN, color: "var(--hb-accent-ink)", boxShadow: "0 12px 26px -8px var(--hb-glow)" }}
          >
            A
          </div>
          <div className="min-w-0">
            <p className="hb-h2">Anaya</p>
            <p className="mt-0.5 truncate text-[12.5px] text-[var(--hb-ink2)]">+91 98765 43210 · Gold member 🥇</p>
          </div>
        </Reveal>

        {/* stats */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          {([["24", "orders"], ["1,240", "wings"], [String(favorites.length), "favorites"]] as const).map(([v, l], i) => (
            <Reveal key={l} delay={0.05 + i * 0.05}>
              <div
                className="rounded-[18px] p-3 text-center"
                style={{ background: "var(--hb-glass)", border: "1px solid var(--hb-line)", boxShadow: "var(--hb-shadow)" }}
              >
                <p className="font-display text-[18px] font-semibold tabular-nums">{v}</p>
                <p className="mt-0.5 text-[9.5px] font-bold uppercase tracking-[0.14em] text-[var(--hb-ink2)]">{l}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* default address */}
        <div className="mt-4">
          <Reveal delay={0.08}>
            <div className="flex items-center gap-3.5 rounded-[20px] p-4" style={{ background: "var(--hb-card)", boxShadow: "var(--hb-shadow)" }}>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[12px] text-[16px]" style={{ background: "var(--hb-glow)" }}>{addr.icon}</span>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--hb-ink3)]">default · {addr.label}</p>
                <p className="mt-0.5 truncate text-[12.5px] font-medium">{addr.line}</p>
              </div>
              <button onClick={() => navigate("location")} className="hb-tap hb-press hb-focus shrink-0 rounded-[12px] px-1 text-[12.5px] font-bold" style={{ color: "var(--hb-accent)" }}>
                Change
              </button>
            </div>
          </Reveal>
        </div>

        {/* theme & mood */}
        <div className="mt-4">
          <Reveal delay={0.1}>
            <div className="rounded-[20px] p-4" style={{ background: "var(--hb-card)", boxShadow: "var(--hb-shadow)" }}>
              <div className="flex items-center justify-between">
                <p className="text-[13.5px] font-semibold">Theme &amp; mood</p>
                <div className="flex rounded-full p-1" style={{ background: "var(--hb-muted)" }}>
                  {(["light", "dark"] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      aria-pressed={mode === m}
                      aria-label={`${m} mode`}
                      className="hb-tap hb-press relative rounded-full px-4 py-1.5 text-[12px] font-bold capitalize"
                      style={{ color: mode === m ? "var(--hb-accent-ink)" : "var(--hb-ink2)" }}
                    >
                      {mode === m && (
                        <motion.span layoutId="modePill" transition={spring} className="absolute inset-0 rounded-full" style={{ background: GLOW_BTN }} />
                      )}
                      <span className="relative">{m}</span>
                    </button>
                  ))}
                </div>
              </div>
              <p className="mt-2.5 text-[11.5px] text-[var(--hb-ink2)]">
                UI follows your clock: <span style={{ color: "var(--hb-accent)" }}>dawn · noon · dusk · midnight</span>
              </p>
            </div>
          </Reveal>
        </div>

        {/* settings rows */}
        <div className="mt-4 space-y-2.5">
          {rows.map((r, i) => (
            <motion.button
              key={r.t}
              initial={{ opacity: 0, y: 22, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-24px" }}
              transition={{ duration: 0.45, delay: (i % 4) * 0.045, ease: EASE }}
              onClick={r.go}
              aria-label={r.t}
              className="hb-press hb-focus flex w-full items-center gap-3.5 rounded-[18px] px-4 py-3.5 text-left"
              style={{ background: "var(--hb-card)", boxShadow: "var(--hb-shadow)" }}
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[11px] text-[16px]" style={{ background: "var(--hb-muted)" }}>{r.e}</span>
              <span className="flex-1 text-[14px] font-semibold">{r.t}</span>
              <ChevronRight size={17} className="text-[var(--hb-ink3)]" />
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   NOTIFICATIONS — grouped, unread ring, live tracking
   ============================================================ */
const NOTIF_EMOJI: Record<string, string> = { live: "🔥", offer: "🎟️", order: "📦" };
type Notif = (typeof NOTIFS)[number];

export function Notifications() {
  const { navigate } = useHB();
  const fresh = NOTIFS.filter((n) => n.unread);
  const earlier = NOTIFS.filter((n) => !n.unread);

  const card = (n: Notif, i: number) => {
    const live = n.type === "live";
    const cls = "flex w-full gap-3.5 rounded-[20px] p-4 text-left";
    const style: React.CSSProperties = {
      background: "var(--hb-card)",
      boxShadow: n.unread ? "var(--hb-shadow), 0 0 0 1.5px var(--hb-accent)" : "var(--hb-shadow)",
    };
    const motionProps = {
      initial: { opacity: 0, y: 22, filter: "blur(6px)" },
      whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
      viewport: { once: true, margin: "-24px" },
      transition: { duration: 0.45, delay: 0.05 + i * 0.06, ease: EASE },
    };
    const inner = (
      <>
        <span
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-[14px] text-[19px] ${live ? "hb-anim-breathe" : ""}`}
          style={{ background: "var(--hb-glow)", boxShadow: live ? "0 0 18px var(--hb-glow)" : undefined }}
        >
          {NOTIF_EMOJI[n.type] ?? "🔔"}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13.5px] font-bold">{n.title}</span>
          <span className="mt-0.5 block text-[12px] leading-relaxed text-[var(--hb-ink2)]">{n.body}</span>
        </span>
        <span className="flex shrink-0 flex-col items-end gap-1.5">
          <span className="text-[10.5px] text-[var(--hb-ink3)]">{n.ago}</span>
          {n.unread && <span className="h-2 w-2 rounded-full" style={{ background: "var(--hb-accent)" }} />}
        </span>
      </>
    );
    return live ? (
      <motion.button key={n.id} {...motionProps} onClick={() => navigate("tracking")} aria-label={`Open live tracking · ${n.title}`} className={`hb-press hb-focus ${cls}`} style={style}>
        {inner}
      </motion.button>
    ) : (
      <motion.div key={n.id} {...motionProps} className={cls} style={style}>
        {inner}
      </motion.div>
    );
  };

  return (
    <div className="no-scrollbar h-full overflow-y-auto pb-32" style={{ background: "var(--hb-bg)" }}>
      <BackBar title="Notifications" />
      <section className="mt-1 px-5" aria-label="New notifications">
        <p className="hb-eyebrow" style={{ color: "var(--hb-accent)" }}>New · {fresh.length}</p>
        <div className="mt-3 space-y-3">{fresh.map((n, i) => card(n, i))}</div>
      </section>
      <section className="mt-6 px-5" aria-label="Earlier notifications">
        <p className="hb-eyebrow text-[var(--hb-ink2)]">Earlier</p>
        <div className="mt-3 space-y-3">{earlier.map((n, i) => card(n, i))}</div>
      </section>
    </div>
  );
}

/* ============================================================
   STATES GALLERY — every state, illustrated
   ============================================================ */
export function StatesGallery() {
  const { showToast } = useHB();

  return (
    <div className="no-scrollbar h-full overflow-y-auto pb-32" style={{ background: "var(--hb-bg)" }}>
      <BackBar title="States gallery" />
      <p className="-mt-1.5 px-5 text-[13px] text-[var(--hb-ink2)]">Every state, illustrated — nothing generic.</p>

      <div className="mt-5 space-y-7 px-5">
        {/* 01 · EMPTY · CART */}
        <Reveal>
          <section aria-label="Empty cart state">
            <p className="hb-eyebrow px-1" style={{ color: "var(--hb-accent)" }}>01 · empty · cart</p>
            <div className="hb-card mt-3 grid place-items-center rounded-[24px] p-5 text-center">
              <div className="relative">
                <img
                  src="/img/plate-empty.jpg"
                  alt="An empty ceramic plate"
                  className="hb-anim-float-slow h-[200px] w-[200px] rounded-full object-cover"
                  style={{ boxShadow: "var(--hb-shadow-lg)" }}
                />
                <div aria-hidden className="absolute -bottom-4 left-1/2 h-5 w-40 -translate-x-1/2 rounded-full opacity-50 blur-lg" style={{ background: "var(--hb-vignette)" }} />
              </div>
              <p className="hb-h3 mt-6">Nothing on the plate yet</p>
              <p className="mt-1 text-[12.5px] text-[var(--hb-ink2)]">Your next craving is one scroll away.</p>
              <SoftBtn variant="ghost" onClick={() => showToast("Browsing the menu")} className="mt-2 h-11 rounded-[14px] px-5 text-[13px]">Browse dishes</SoftBtn>
            </div>
          </section>
        </Reveal>

        {/* 02 · EMPTY · SEARCH */}
        <Reveal>
          <section aria-label="Empty search state">
            <p className="hb-eyebrow px-1" style={{ color: "var(--hb-accent)" }}>02 · empty · search</p>
            <div className="hb-card mt-3 grid place-items-center rounded-[24px] p-5 py-9 text-center">
              <p className="text-[52px]" aria-hidden>🥄</p>
              <p className="hb-h3 mt-3">{"Nothing sizzling for 'kangaroo biryani'"}</p>
              <p className="mt-1 text-[12.5px] text-[var(--hb-ink2)]">Try a shorter craving — or browse moods.</p>
              <SoftBtn variant="ghost" onClick={() => showToast("Search cleared")} className="mt-2 h-11 rounded-[14px] px-5 text-[13px]">Clear search</SoftBtn>
            </div>
          </section>
        </Reveal>

        {/* 03 · ERROR · KITCHEN CLOSED */}
        <Reveal>
          <section aria-label="Kitchen closed state">
            <p className="hb-eyebrow px-1" style={{ color: "var(--hb-accent)" }}>03 · error · kitchen closed</p>
            <div className="hb-card mt-3 grid place-items-center rounded-[24px] p-5 py-8 text-center">
              <div className="relative grid h-[110px] w-[150px] place-items-center">
                <span
                  aria-hidden
                  className="hb-steam-puff"
                  style={{ left: 48, bottom: 64, background: "radial-gradient(ellipse at center, rgba(148,138,126,0.42), transparent 70%)", animationDuration: "3.6s" }}
                />
                <span
                  aria-hidden
                  className="hb-steam-puff"
                  style={{ left: 84, bottom: 68, background: "radial-gradient(ellipse at center, rgba(148,138,126,0.32), transparent 70%)", animationDuration: "4.2s", animationDelay: "1.4s" }}
                />
                <span className="text-[54px]" aria-hidden>🍳</span>
                <span
                  className="absolute -right-1 top-1 rounded-[10px] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em]"
                  style={{ background: "var(--hb-ink)", color: "var(--hb-card)", transform: "rotate(-6deg)", boxShadow: "var(--hb-shadow)" }}
                >
                  closed
                </span>
              </div>
              <p className="hb-h3 mt-3">This kitchen dozed off</p>
              <p className="mt-1 text-[12.5px] text-[var(--hb-ink2)]">Back at 11 am — the pans need sleep too.</p>
              <SoftBtn variant="soft" onClick={() => showToast("Finding similar fires")} className="mt-3 h-11 rounded-[16px] px-5 text-[13px]">Find similar fires</SoftBtn>
            </div>
          </section>
        </Reveal>

        {/* 04 · ERROR · OFFLINE */}
        <Reveal>
          <section aria-label="Offline state">
            <p className="hb-eyebrow px-1" style={{ color: "var(--hb-accent)" }}>04 · error · offline</p>
            <div className="hb-card mt-3 grid place-items-center rounded-[24px] p-5 py-9 text-center">
              <p className="text-[52px]" aria-hidden>📴</p>
              <p className="hb-h3 mt-3">{"You're off the grid"}</p>
              <p className="mt-1 text-[12.5px] text-[var(--hb-ink2)]">{"Food can't fly without wifi."}</p>
              <SoftBtn onClick={() => showToast("Reconnecting…")} className="mt-3 h-11 rounded-[16px] px-7 text-[13.5px]">Retry</SoftBtn>
            </div>
          </section>
        </Reveal>

        {/* 05 · LOADING · SKELETONS */}
        <Reveal>
          <section aria-label="Loading skeletons">
            <p className="hb-eyebrow px-1" style={{ color: "var(--hb-accent)" }}>05 · loading · skeletons</p>
            <div className="hb-card mt-3 rounded-[24px] p-5">
              <div className="grid grid-cols-2 gap-4">
                {/* dish card skeleton */}
                <div>
                  <Skel h={110} r={18} />
                  <Skel h={14} w="75%" className="mt-3" />
                  <Skel h={12} w="50%" className="mt-2" />
                </div>
                {/* resto row skeleton */}
                <div className="flex items-start gap-3">
                  <Skel w={56} h={56} r={28} className="shrink-0" />
                  <div className="flex-1 pt-1">
                    <Skel h={14} />
                    <Skel h={12} w="66%" className="mt-2" />
                    <Skel h={12} w="33%" className="mt-2" />
                  </div>
                </div>
              </div>
              <p className="hb-serif-i mt-4 text-center text-[12px] text-[var(--hb-ink2)]">200–400ms — shimmer, never spinners</p>
            </div>
          </section>
        </Reveal>

        {/* 06 · SUCCESS · TOAST */}
        <Reveal>
          <section aria-label="Toast success state">
            <p className="hb-eyebrow px-1" style={{ color: "var(--hb-accent)" }}>06 · success · toast</p>
            <div className="hb-card mt-3 grid place-items-center rounded-[24px] p-5 py-10">
              <div className="hb-glass-strong flex items-center gap-2 rounded-full px-5 py-3 text-[13px] font-semibold" style={{ boxShadow: "var(--hb-shadow-lg)" }}>
                <span style={{ color: "var(--hb-accent)" }}>✓</span> Added · sizzling
              </div>
              <p className="mt-3.5 text-[11px] text-[var(--hb-ink3)]">bottom-center · spring 420/28 · 2.2s</p>
            </div>
          </section>
        </Reveal>
      </div>
    </div>
  );
}
