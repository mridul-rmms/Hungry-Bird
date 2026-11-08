"use client";
/* Hungry Bird — HOME: radial mood dial, hero dish w/ parallax + steam, scroll-reveal feed */
import React, { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Bell, MapPin, ChevronDown, Plus, Clock, Flame, Sparkles, Zap } from "lucide-react";
import { useHB, rupee, dishById } from "@/lib/store";
import { DISHES, RESTOS, MOODS } from "@/lib/data";
import { Steam, RatePill, SoftBtn, Sizzle, Parallax, Price, VegMark, Flames, spring } from "../ui";

const R = 108; // dial radius

export function Home() {
  const { mood, setMood, navigate, addresses, activeAddr, addToCart, showToast, params } = useHB();
  const initialMood = (params?.mood as string) ?? mood;
  const [sel, setSel] = useState<string | null>(initialMood ?? null);
  const [sizzle, setSizzle] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: scrollRef });
  const heroY = useTransform(scrollY, [0, 300], [0, 70]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 1.12]);
  const heroBlur = useTransform(scrollY, [0, 260], ["blur(0px)", "blur(5px)"]);

  const selMood = MOODS.find((m) => m.id === sel);
  const greet = useMemo(() => {
    const h = new Date().getHours();
    if (h >= 5 && h < 11) return { t: "Good morning", s: "sunrise cravings" };
    if (h >= 11 && h < 17) return { t: "Good afternoon", s: "the lunch window" };
    if (h >= 17 && h < 22) return { t: "Good evening", s: "golden hour appetite" };
    return { t: "Up late?", s: "the midnight menu is on" };
  }, []);

  // feed ordering: mood picks first (dish tags + resto moods), rotation offset per mood
  const feed = useMemo(() => {
    if (!sel) return DISHES.slice(0, 6);
    const scored = [...DISHES].sort((a, b) => {
      const sa = (a.tags.some((t) => t.toLowerCase().includes(sel.slice(0, 4))) || (sel === "healthy" && a.veg) || (sel === "spicy" && (a.spice ?? 0) >= 2) || (sel === "quick" && a.time <= 20) || (sel === "late" && a.restoId === "r2") || (sel === "celebrate" && a.price > 400) || (sel === "comfort" && a.kcal > 500) ? 1 : 0);
      const sb = (b.tags.some((t) => t.toLowerCase().includes(sel.slice(0, 4))) || (sel === "healthy" && b.veg) || (sel === "spicy" && (b.spice ?? 0) >= 2) || (sel === "quick" && b.time <= 20) || (sel === "late" && b.restoId === "r2") || (sel === "celebrate" && b.price > 400) || (sel === "comfort" && b.kcal > 500) ? 1 : 0);
      return sb - sa;
    });
    const off = MOODS.findIndex((m) => m.id === sel);
    return [...scored.slice(off), ...scored.slice(0, off)].slice(0, 6);
  }, [sel]);

  const restos = useMemo(() => (sel ? [...RESTOS].sort((a, b) => (b.mood.includes(sel) ? 1 : 0) - (a.mood.includes(sel) ? 1 : 0)) : RESTOS).slice(0, 5), [sel]);
  const hero = feed[0];
  const dialAngle = sel ? -MOODS.findIndex((m) => m.id === sel) * (360 / MOODS.length) : 0;

  const quickAdd = (dishId: string) => {
    const d = dishById(dishId);
    addToCart({ dishId, qty: 1, size: "Regular", spice: d.spice ?? 0, addons: [], unitPrice: d.price });
    setSizzle((s) => s + 1);
    showToast(`${d.name.split(" ").slice(0, 3).join(" ")} added · sizzling`);
  };

  return (
    <div className="relative h-full overflow-hidden">
      <Sizzle trigger={sizzle} />
      {/* ambient daypart glow */}
      <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[130%] -translate-x-1/2 rounded-full opacity-60 blur-[70px]" style={{ background: "radial-gradient(closest-side, var(--hb-sky1), transparent)" }} />

      <div ref={scrollRef} className="no-scrollbar h-full overflow-y-auto pb-32">
        {/* ---------- header ---------- */}
        <header className="relative z-20 flex items-center justify-between px-5 pt-[62px]">
          <button onClick={() => navigate("location")} className="hb-tap hb-focus max-w-[62%] text-left">
            <p className="flex items-center gap-1 text-[10.5px] font-bold uppercase tracking-[0.16em] text-[var(--hb-ink2)]"><MapPin size={11} style={{ color: "var(--hb-accent)" }} /> {greet.t.toLowerCase()}</p>
            <p className="mt-0.5 flex items-center gap-1 truncate text-[14.5px] font-bold">{addresses.find((a) => a.id === activeAddr)?.label} · 5th Block <ChevronDown size={14} className="text-[var(--hb-ink2)]" /></p>
          </button>
          <div className="flex items-center gap-2.5">
            <button onClick={() => navigate("notifications")} aria-label="Notifications" className="hb-tap hb-press relative grid h-11 w-11 place-items-center rounded-full" style={{ background: "var(--hb-muted)" }}>
              <Bell size={19} />
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[#d6482b]" />
            </button>
            <button onClick={() => navigate("profile")} aria-label="Profile" className="hb-tap hb-press grid h-11 w-11 place-items-center rounded-full font-display text-[15px] font-bold" style={{ background: "linear-gradient(135deg, var(--hb-accent-hi), var(--hb-accent))", color: "var(--hb-accent-ink)" }}>A</button>
          </div>
        </header>

        {/* ---------- greeting ---------- */}
        <div className="relative z-10 px-5 pt-5">
          <h1 className="hb-h1">Hungry, <span className="hb-serif-i" style={{ color: "var(--hb-accent)" }}>Anaya?</span></h1>
          <p className="mt-1 text-[13.5px] text-[var(--hb-ink2)]">{greet.s} — the kitchen lights are on.</p>
        </div>

        {/* ---------- MOOD DIAL ---------- */}
        <section aria-label="Mood dial" className="relative z-10 mt-6">
          <div className="relative mx-auto h-[264px] w-[264px]">
            {/* halo */}
            <div className="absolute inset-0 rounded-full opacity-70" style={{ background: "radial-gradient(closest-side, var(--hb-glow), transparent 72%)" }} />
            {/* ring */}
            <motion.div className="absolute inset-[34px] rounded-full border" style={{ borderColor: "var(--hb-line)", background: "var(--hb-glass)", backdropFilter: "blur(8px)" }} animate={{ rotate: dialAngle }} transition={{ ...spring, damping: 22 }}>
              {MOODS.map((m, i) => {
                const a = (i * 360) / MOODS.length - 90;
                const x = Math.cos((a * Math.PI) / 180) * (R + 22);
                const y = Math.sin((a * Math.PI) / 180) * (R + 22);
                const active = sel === m.id;
                return (
                  <motion.button key={m.id} onClick={() => { setSel(active ? null : m.id); if (!active) showToast(`Mood set · ${m.word}`); }} aria-pressed={active} aria-label={m.label} className="hb-tap hb-press absolute left-1/2 top-1/2 grid h-[58px] w-[58px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-[22px]"
                    style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`, background: active ? m.hue : "var(--hb-card)", boxShadow: active ? `0 10px 26px -6px ${m.hue}88, inset 0 0 0 2px rgba(255,255,255,0.35)` : "var(--hb-shadow)" }}
                    whileTap={{ scale: 0.88 }} animate={{ rotate: -dialAngle }} transition={spring}>
                    <span style={{ filter: active ? "grayscale(0) brightness(1.15)" : "grayscale(0.15)" }}>{m.emoji}</span>
                    {active && <span className="absolute -bottom-5 whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-bold text-white" style={{ background: m.hue }}>{m.label}</span>}
                  </motion.button>
                );
              })}
            </motion.div>
            {/* center */}
            <button onClick={() => setSel(null)} className="absolute left-1/2 top-1/2 grid h-[104px] w-[104px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-center" style={{ background: "var(--hb-card)", boxShadow: "var(--hb-shadow-lg), inset 0 0 0 1px var(--hb-line)" }}>
              <AnimatePresence mode="wait">
                <motion.span key={sel ?? "none"} initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.7, opacity: 0 }} transition={{ duration: 0.18 }} className="px-3">
                  {selMood ? (
                    <>
                      <span className="block text-[24px]">{selMood.emoji}</span>
                      <span className="mt-0.5 block font-display text-[13px] font-semibold leading-tight">{selMood.label}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} style={{ color: "var(--hb-accent)" }} className="mx-auto" />
                      <span className="mt-1 block text-[10.5px] font-bold uppercase tracking-[0.14em] text-[var(--hb-ink2)]">set the<br />mood</span>
                    </>
                  )}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </section>

        {/* ---------- HERO DISH (of the moment) ---------- */}
        <section className="relative z-10 mt-5">
          <div className="flex items-end justify-between px-5">
            <div>
              <p className="hb-eyebrow" style={{ color: "var(--hb-accent)" }}>{selMood ? `for your ${selMood.label.toLowerCase()} mood` : "dish of the moment"}</p>
              <h2 className="hb-h2 mt-1">Cooked live, right now</h2>
            </div>
          </div>
          <motion.div style={{ y: heroY, scale: heroScale, filter: heroBlur }} className="px-5 pt-4">
            <Parallax intensity={16}>
              <motion.button onClick={() => navigate("restaurant", { restoId: hero.restoId })} whileTap={{ scale: 0.985 }} className="hb-focus relative block h-[236px] w-full overflow-hidden rounded-[28px] text-left" style={{ boxShadow: "var(--hb-shadow-lg)" }} aria-label={`Open ${hero.name}`}>
                <motion.img key={hero.id} src={hero.img} alt={hero.name} initial={{ opacity: 0.6, scale: 1.06 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="h-full w-full object-cover" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 30%, rgba(10,7,4,0.82) 88%)" }} />
                <Steam className="bottom-24 right-10" count={3} delay={0.4} />
                <div className="absolute left-4 top-4 flex gap-2">
                  {hero.tags.slice(0, 1).map((t) => <span key={t} className="hb-glass rounded-full px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-wider text-white">✦ {t}</span>)}
                  <span className="hb-glass flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-bold text-white"><Clock size={11} /> {hero.time}′</span>
                </div>
                <div className="absolute inset-x-4 bottom-4 flex items-end justify-between">
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white/70"><VegMark veg={hero.veg} size={11} /> {RESTOS.find((r) => r.id === hero.restoId)?.name}</p>
                    <h3 className="font-display mt-1 truncate text-[20px] font-semibold text-white">{hero.name}</h3>
                    <p className="mt-0.5 flex items-center gap-2 text-[13px] text-white/85"><Price v={hero.price} /> · <RatePill v={hero.rating} /> · <Flames level={hero.spice ?? 0} /></p>
                  </div>
                  <span onClick={(e) => { e.stopPropagation(); quickAdd(hero.id); }} role="button" aria-label={`Add ${hero.name} to plate`} className="hb-press grid h-12 w-12 shrink-0 place-items-center rounded-full" style={{ background: "linear-gradient(135deg, var(--hb-accent-hi), var(--hb-accent))", color: "var(--hb-accent-ink)", boxShadow: "0 10px 26px -6px var(--hb-glow)" }}><Plus size={22} strokeWidth={2.6} /></span>
                </div>
              </motion.button>
            </Parallax>
          </motion.div>
        </section>

        {/* ---------- REORDER STRIP ---------- */}
        <section className="mt-8" aria-label="Reorder">
          <div className="flex items-end justify-between px-5">
            <h2 className="hb-h2">Your usuals</h2>
            <button onClick={() => navigate("history")} className="hb-focus text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--hb-accent)]">history</button>
          </div>
          <div className="no-scrollbar mt-3.5 flex gap-3 overflow-x-auto px-5 pb-1">
            {[ "d1", "d6", "d9" ].map((id, i) => {
              const d = dishById(id);
              return (
                <motion.button key={id} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, ...spring }} onClick={() => { addToCart({ dishId: id, qty: 1, size: "Regular", spice: d.spice ?? 0, addons: [], unitPrice: d.price }); setSizzle((s) => s + 1); showToast("Reordered · 1 tap, that's it"); }} className="hb-press hb-focus relative w-[150px] shrink-0 overflow-hidden rounded-[20px] p-3 text-left" style={{ background: "var(--hb-card)", boxShadow: "var(--hb-shadow)" }}>
                  <img src={d.img} alt="" className="h-[74px] w-full rounded-[14px] object-cover" />
                  <p className="mt-2 truncate text-[12.5px] font-bold">{d.name}</p>
                  <p className="mt-0.5 flex items-center justify-between text-[11px] text-[var(--hb-ink2)]"><Price v={d.price} /> <span className="flex items-center gap-0.5 font-semibold" style={{ color: "var(--hb-accent)" }}><Zap size={10} /> 1-tap</span></p>
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* ---------- MOOD FEED ---------- */}
        <section className="mt-8" aria-label="Dishes for your mood">
          <div className="flex items-end justify-between px-5">
            <h2 className="hb-h2">{selMood ? `${selMood.emoji} ${selMood.word}` : "Tonight's cravings"}</h2>
          </div>
          <div className="no-scrollbar mt-4 flex gap-4 overflow-x-auto px-5 pb-2">
            <AnimatePresence mode="popLayout">
              {feed.map((d, i) => (
                <motion.button key={`${sel}-${d.id}`} layout initial={{ opacity: 0, y: 26, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -14, scale: 0.94 }} transition={{ delay: i * 0.045, ...spring }} onClick={() => navigate("dish", { dishId: d.id })} className="hb-focus w-[168px] shrink-0 text-left">
                  <div className="relative h-[150px] overflow-hidden rounded-[22px]" style={{ boxShadow: "var(--hb-shadow)" }}>
                    <img src={d.img} alt={d.name} className="h-full w-full object-cover" />
                    <span className="absolute right-2 top-2"><VegMark veg={d.veg} size={13} /></span>
                    {d.bestseller && <span className="hb-glass absolute left-2 top-2 rounded-full px-2 py-1 text-[9.5px] font-bold uppercase tracking-wider text-white">★ bestseller</span>}
                  </div>
                  <p className="mt-2 truncate text-[13.5px] font-bold">{d.name}</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-[11.5px] text-[var(--hb-ink2)]"><RatePill v={d.rating} /> {d.time}′ · <Price v={d.price} /></p>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* ---------- OFFERS MARQUEE ---------- */}
        <section className="mt-6 px-5" aria-label="Offers">
          <button onClick={() => navigate("offers")} className="hb-press hb-focus relative block w-full overflow-hidden rounded-[22px] p-4 text-left" style={{ background: "linear-gradient(120deg, #2a1c0d, #3a2510 55%, #241608)", boxShadow: "var(--hb-shadow)" }}>
            <div className="absolute -right-4 -top-8 h-28 w-28 rounded-full opacity-40 blur-2xl" style={{ background: "var(--hb-accent)" }} />
            <p className="hb-eyebrow" style={{ color: "#f0a52e" }}>ember week · today only</p>
            <p className="font-display mt-1.5 text-[19px] font-semibold text-[#f7f1e6]">50% off up to ₹120 <Flame size={16} className="inline" style={{ color: "#f0a52e" }} /></p>
            <p className="mt-1 text-[12px] text-[#c9bda9]">Code <b style={{ color: "#f0a52e" }}>EMBER50</b> · tap to collect</p>
          </button>
        </section>

        {/* ---------- RESTAURANTS ---------- */}
        <section className="mt-8" aria-label="Restaurants">
          <div className="flex items-end justify-between px-5">
            <h2 className="hb-h2">Flying from near you</h2>
            <button onClick={() => navigate("search")} className="hb-focus text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--hb-accent)]">see all</button>
          </div>
          <div className="mt-4 space-y-4 px-5">
            {restos.map((r, i) => (
              <motion.button key={r.id} initial={{ opacity: 0, y: 30, filter: "blur(6px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.5, delay: (i % 3) * 0.05, ease: [0.22, 0.8, 0.24, 1] }} onClick={() => navigate("restaurant", { restoId: r.id })} className="hb-press hb-focus flex w-full gap-4 rounded-[24px] p-3 text-left" style={{ background: "var(--hb-card)", boxShadow: "var(--hb-shadow)" }}>
                <div className="relative h-[92px] w-[104px] shrink-0 overflow-hidden rounded-[18px]">
                  <img src={r.img} alt={r.name} className="h-full w-full object-cover" />
                  {r.promo && <span className="absolute bottom-1.5 left-1.5 rounded-lg px-2 py-1 text-[9.5px] font-black uppercase text-white" style={{ background: "var(--hb-accent)" }}>{r.promo}</span>}
                </div>
                <div className="min-w-0 flex-1 py-0.5">
                  <p className="truncate font-display text-[16.5px] font-semibold">{r.name}</p>
                  <p className="mt-0.5 truncate text-[12px] text-[var(--hb-ink2)]">{r.cuisine}</p>
                  <p className="mt-2 flex items-center gap-2 text-[12px]"><RatePill v={r.rating} /> <span className="text-[var(--hb-ink2)]">{r.time}′ · {r.dist} km</span></p>
                  <p className="mt-1.5 flex gap-1.5">
                    {r.mood.slice(0, 2).map((m) => {
                      const mm = MOODS.find((x) => x.id === m);
                      return <span key={m} className="rounded-full px-2 py-0.5 text-[9.5px] font-bold" style={{ background: `color-mix(in srgb, ${mm?.hue} 16%, transparent)`, color: mm?.hue }}>{mm?.emoji} {mm?.label}</span>;
                    })}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
          <div className="px-5 pt-6">
            <SoftBtn variant="soft" onClick={() => navigate("offers")} className="h-12 w-full rounded-[18px] text-[14px]"><Sparkles size={15} style={{ color: "var(--hb-accent)" }} /> All offers & rewards</SoftBtn>
          </div>
        </section>
      </div>
    </div>
  );
}
