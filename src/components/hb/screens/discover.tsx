"use client";
/* Hungry Bird — DISCOVER: Search (voice waveform + filters) · Restaurant (parallax hero, sticky menu tabs) · Dish (full customisation) */
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform, type MotionProps } from "framer-motion";
import { Check, ChevronLeft, Clock, Heart, MapPin, Mic, Plus, Search as SearchIcon, SlidersHorizontal, ShoppingBag, X } from "lucide-react";
import { useHB, dishById, rupee } from "@/lib/store";
import { ADDONS, DISHES, RESTOS, type Dish } from "@/lib/data";
import { Chip, Flames, Glass, IconBtn, Parallax, Price, RatePill, SectionTitle, Sizzle, SoftBtn, Steam, Stepper, VegMark, spring, springSoft } from "../ui";

/* ---------- shared scroll-reveal idiom (matches home.tsx: blur + rise) ---------- */
const reveal: MotionProps = {
  initial: { opacity: 0, y: 30, filter: "blur(6px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.5, ease: [0.22, 0.8, 0.24, 1] },
};

const TRENDING = ["butter chicken", "midnight ramen", "biryani", "lava cake", "tacos"] as const;
const RECENT = ["butter chicken", "midnight ramen", "momo"] as const;
const SORTS = [
  { id: "relevance", label: "Relevance" },
  { id: "rating", label: "Rating" },
  { id: "time", label: "Time" },
  { id: "price", label: "Price" },
] as const;
type SortId = (typeof SORTS)[number]["id"];
const BANDS = [
  { v: 1, sym: "₹", label: "easy on the wallet" },
  { v: 2, sym: "₹₹", label: "everyday treat" },
  { v: 3, sym: "₹₹₹", label: "fine dining" },
] as const;

const SIZES = [
  { name: "Regular", delta: 0, sub: "for one" },
  { name: "Large", delta: 120, sub: "feeds 1–2" },
  { name: "Serves 2", delta: 260, sub: "family style" },
] as const;

const SPICE = [
  { label: "Mild", em: "🌼" },
  { label: "Medium", em: "🌶️" },
  { label: "Hot", em: "🌶️🌶️" },
  { label: "Inferno", em: "🌶️🌶️🌶️" },
] as const;

/* ============================================================
   SEARCH — voice waveform, trending chips, sort + filter sheet
   ============================================================ */
export function Search() {
  const { navigate, addToCart, showToast } = useHB();
  const [query, setQuery] = useState("");
  const [listening, setListening] = useState(false);
  const [sort, setSort] = useState<SortId>("relevance");
  const [sheet, setSheet] = useState(false);
  const [veg, setVeg] = useState(false);
  const [rat45, setRat45] = useState(false);
  const [fast, setFast] = useState(false);
  const [bands, setBands] = useState<number[]>([]);
  const [sizzle, setSizzle] = useState(0);
  const micTimer = useRef<number | null>(null);

  useEffect(() => () => { if (micTimer.current) window.clearTimeout(micTimer.current); }, []);

  const toggleMic = () => {
    if (listening) { // cancel mid-listen
      if (micTimer.current) window.clearTimeout(micTimer.current);
      micTimer.current = null;
      setListening(false);
      return;
    }
    setListening(true);
    micTimer.current = window.setTimeout(() => {
      setListening(false);
      setQuery("butter chicken");
      showToast("Heard it · butter chicken 🔥");
    }, 2500);
  };

  const activeFilters = (veg ? 1 : 0) + (rat45 ? 1 : 0) + (fast ? 1 : 0) + bands.length;
  const isFiltering = activeFilters > 0 || sort !== "relevance";
  const browsing = query.trim() !== "" || isFiltering;

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = DISHES.filter((d) => !q || d.name.toLowerCase().includes(q) || d.tags.some((t) => t.toLowerCase().includes(q)));
    if (veg) list = list.filter((d) => d.veg);
    if (rat45) list = list.filter((d) => d.rating >= 4.5);
    if (fast) list = list.filter((d) => d.time < 25);
    if (bands.length) list = list.filter((d) => bands.includes(RESTOS.find((r) => r.id === d.restoId)?.price ?? 2));
    const out = [...list];
    if (sort === "rating") out.sort((a, b) => b.rating - a.rating);
    if (sort === "time") out.sort((a, b) => a.time - b.time);
    if (sort === "price") out.sort((a, b) => a.price - b.price);
    return out;
  }, [query, veg, rat45, fast, bands, sort]);

  const list = browsing ? results : results.slice(0, 6);

  const quickAdd = (id: string) => {
    const d = dishById(id);
    addToCart({ dishId: id, qty: 1, size: "Regular", spice: d.spice ?? 0, addons: [], unitPrice: d.price });
    setSizzle((s) => s + 1);
    showToast(`${d.name.split(" ").slice(0, 3).join(" ")} added · sizzling`);
  };

  const clearAll = () => { setQuery(""); setVeg(false); setRat45(false); setFast(false); setBands([]); setSort("relevance"); };
  const resetFilters = () => { setVeg(false); setRat45(false); setFast(false); setBands([]); };
  const toggleBand = (v: number) => setBands((b) => (b.includes(v) ? b.filter((x) => x !== v) : [...b, v]));

  return (
    <div className="relative h-full overflow-hidden" style={{ background: "var(--hb-bg)" }}>
      <Sizzle trigger={sizzle} />
      {/* ambient glow */}
      <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[130%] -translate-x-1/2 rounded-full opacity-60 blur-[70px]" style={{ background: "radial-gradient(closest-side, var(--hb-sky1), transparent)" }} />

      <div className="no-scrollbar relative h-full overflow-y-auto pb-32">
        {/* ---------- header ---------- */}
        <header className="relative z-10 px-5 pt-[62px]">
          <p className="hb-eyebrow" style={{ color: "var(--hb-accent)" }}>hungry bird · search</p>
          <h1 className="hb-h1 mt-1.5">Find your <span className="hb-serif-i" style={{ color: "var(--hb-accent)" }}>craving</span></h1>
          <p className="mt-1 text-[13px] text-[var(--hb-ink2)]">Type it, say it, or follow the fire.</p>
        </header>

        {/* ---------- glass search bar + mic ---------- */}
        <div className="relative z-10 mt-4 px-5">
          <Glass strong className="flex items-center gap-3 rounded-[22px] p-2 pl-4">
            <SearchIcon size={18} className="shrink-0 text-[var(--hb-ink2)]" />
            {listening ? (
              <div className="flex h-10 min-w-0 flex-1 items-center justify-center gap-[3px]" aria-label="Listening to your craving">
                {Array.from({ length: 18 }).map((_, i) => (
                  <motion.span key={i} className="w-[3px] origin-center rounded-full" style={{ height: 20, background: "var(--hb-accent)" }}
                    animate={{ scaleY: [0.3, 1, 0.45, 0.85, 0.3] }}
                    transition={{ duration: 1.05, repeat: Infinity, ease: "easeInOut", delay: i * 0.055 }} />
                ))}
              </div>
            ) : (
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Butter chicken, ramen, lava cake…" aria-label="Search dishes"
                className="h-10 w-full min-w-0 bg-transparent text-[15px] font-medium placeholder:text-[var(--hb-ink3)] focus:outline-none" />
            )}
            <motion.button whileTap={{ scale: 0.88 }} onClick={toggleMic} aria-label={listening ? "Stop listening" : "Search by voice"}
              className="hb-press hb-focus relative grid h-10 w-10 shrink-0 place-items-center rounded-full"
              style={{ background: "linear-gradient(135deg, var(--hb-accent-hi), var(--hb-accent))", color: "var(--hb-accent-ink)", boxShadow: "0 8px 22px -6px var(--hb-glow)" }}>
              <Mic size={17} />
              {listening && <span aria-hidden className="absolute inset-0 rounded-full border-2" style={{ borderColor: "var(--hb-accent)", animation: "hb-ring 1.1s ease-out infinite" }} />}
            </motion.button>
          </Glass>
        </div>

        {/* ---------- trending cravings ---------- */}
        <section className="relative z-10 mt-5" aria-label="Trending cravings">
          <p className="hb-eyebrow px-5 text-[var(--hb-ink2)]">Trending cravings</p>
          <div className="no-scrollbar mt-2.5 flex gap-2 overflow-x-auto px-5 pb-1">
            {TRENDING.map((t) => <Chip key={t} active={query === t} onClick={() => setQuery(t)}>🔥 {t}</Chip>)}
          </div>
        </section>

        {/* ---------- sort + filter ---------- */}
        <div className="no-scrollbar relative z-10 mt-3 flex items-center gap-2 overflow-x-auto px-5">
          {SORTS.map((s) => <Chip key={s.id} active={sort === s.id} onClick={() => setSort(s.id)}>{s.label}</Chip>)}
          <button onClick={() => setSheet(true)} aria-label={`Filters · ${activeFilters} active`} className="hb-press hb-focus relative grid h-9 w-11 shrink-0 place-items-center rounded-full"
            style={activeFilters ? { background: "linear-gradient(135deg, var(--hb-accent-hi), var(--hb-accent))", color: "var(--hb-accent-ink)" } : { background: "var(--hb-muted)", color: "var(--hb-ink2)" }}>
            <SlidersHorizontal size={15} />
            {activeFilters > 0 && <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[#d6482b] px-1 text-[9px] font-bold text-white">{activeFilters}</span>}
          </button>
        </div>

        {/* ---------- recent searches (only when idle) ---------- */}
        {query.trim() === "" && (
          <section className="relative z-10 mt-5" aria-label="Recent searches">
            <p className="hb-eyebrow px-5 text-[var(--hb-ink2)]">Recent searches</p>
            <div className="no-scrollbar mt-2.5 flex gap-2 overflow-x-auto px-5 pb-1">
              {RECENT.map((s) => (
                <button key={s} onClick={() => setQuery(s)} className="hb-press hb-focus flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-[12.5px] font-semibold" style={{ background: "var(--hb-card)", boxShadow: "var(--hb-shadow)" }}>
                  <Clock size={13} className="text-[var(--hb-ink3)]" /> {s}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ---------- results ---------- */}
        <section className="relative z-10 mt-6" aria-label="Search results">
          <SectionTitle action={browsing ? "clear all" : undefined} onAction={clearAll}>
            {browsing ? (query.trim() ? `“${query.trim()}”` : "Filtered cravings") : "Popular near you"}
          </SectionTitle>

          {list.length === 0 ? (
            <div className="mt-10 flex flex-col items-center px-8 text-center">
              <span className="text-[44px]">🥄</span>
              <p className="hb-h3 mt-3">Nothing sizzling for “{query.trim()}”</p>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-[var(--hb-ink2)]">Try a different craving, or loosen the filters a little.</p>
              <SoftBtn variant="soft" onClick={clearAll} className="mt-5 h-11 rounded-[16px] px-6 text-[13px]">Clear filters</SoftBtn>
            </div>
          ) : (
            <div className="mt-3.5 space-y-3 px-5">
              {list.map((d) => (
                <motion.button key={d.id} {...reveal} onClick={() => navigate("dish", { dishId: d.id })} aria-label={`Open ${d.name}`}
                  className="hb-press hb-focus flex w-full gap-3.5 rounded-[20px] p-3 text-left" style={{ background: "var(--hb-card)", boxShadow: "var(--hb-shadow)" }}>
                  <div className="relative shrink-0">
                    <img src={d.img} alt={d.name} className="h-[104px] w-[104px] rounded-[16px] object-cover" />
                    <span className="absolute left-1.5 top-1.5"><VegMark veg={d.veg} size={13} /></span>
                    <span role="button" aria-label={`Add ${d.name} to plate`} onClick={(e) => { e.stopPropagation(); quickAdd(d.id); }}
                      className="hb-press absolute -bottom-2 -right-2 grid h-10 w-10 place-items-center rounded-full"
                      style={{ background: "linear-gradient(135deg, var(--hb-accent-hi), var(--hb-accent))", color: "var(--hb-accent-ink)", boxShadow: "0 8px 22px -6px var(--hb-glow)" }}>
                      <Plus size={18} strokeWidth={2.6} />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 py-0.5">
                    <p className="truncate text-[14.5px] font-bold">{d.name}</p>
                    <p className="mt-0.5 truncate text-[11.5px] text-[var(--hb-ink2)]">{RESTOS.find((r) => r.id === d.restoId)?.name}</p>
                    <p className="mt-2 flex items-center gap-2 text-[11.5px] text-[var(--hb-ink2)]">
                      <RatePill v={d.rating} /> <span>{d.time} min</span> · <Price v={d.price} className="text-[12.5px] text-[var(--hb-ink)]" />
                    </p>
                    <p className="mt-1.5"><Flames level={d.spice ?? 0} /></p>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ---------- filter sheet ---------- */}
      <AnimatePresence>
        {sheet && (
          <motion.div key="sheet" className="absolute inset-0 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}>
            <button aria-label="Close filters" onClick={() => setSheet(false)} className="absolute inset-0 bg-black/45" />
            <motion.div initial={{ y: "102%" }} animate={{ y: 0 }} exit={{ y: "102%" }} transition={{ type: "spring", stiffness: 340, damping: 34 }}
              className="absolute inset-x-0 bottom-0 rounded-t-[28px] px-5 pb-28 pt-3" style={{ background: "var(--hb-glass-strong)", backdropFilter: "blur(28px) saturate(1.6)", WebkitBackdropFilter: "blur(28px) saturate(1.6)", boxShadow: "var(--hb-shadow-lg)" }}>
              <div aria-hidden className="mx-auto mb-3 h-1.5 w-10 rounded-full" style={{ background: "var(--hb-line)" }} />
              <div className="flex items-center justify-between">
                <h2 className="hb-h3">Filters</h2>
                <div className="flex items-center gap-2">
                  <button onClick={resetFilters} className="hb-focus text-[11.5px] font-bold uppercase tracking-[0.12em]" style={{ color: "var(--hb-accent)" }}>reset</button>
                  <IconBtn label="Close filters" onClick={() => setSheet(false)} glass={false} className="h-9 w-9"><X size={16} /></IconBtn>
                </div>
              </div>

              <div className="mt-4 overflow-hidden rounded-[18px]" style={{ background: "var(--hb-card)", boxShadow: "var(--hb-shadow)" }}>
                {([
                  { emoji: "🌿", label: "Pure Veg", sub: "No meat, no egg", on: veg, toggle: () => setVeg(!veg) },
                  { emoji: "⭐", label: "Rating 4.5+", sub: "Loved by the neighbourhood", on: rat45, toggle: () => setRat45(!rat45) },
                  { emoji: "⚡", label: "Fast delivery", sub: "Under 25 minutes", on: fast, toggle: () => setFast(!fast) },
                ] as const).map((f, i) => (
                  <div key={f.label} className="flex items-center justify-between gap-3 px-4 py-3.5" style={i < 2 ? { borderBottom: "1px solid var(--hb-line)" } : undefined}>
                    <span className="flex items-center gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[12px] text-[16px]" style={{ background: "var(--hb-bg2)" }}>{f.emoji}</span>
                      <span>
                        <span className="block text-[13.5px] font-bold">{f.label}</span>
                        <span className="block text-[11px] text-[var(--hb-ink2)]">{f.sub}</span>
                      </span>
                    </span>
                    <button role="switch" aria-checked={f.on} aria-label={f.label} onClick={f.toggle} className="hb-press hb-focus relative h-7 w-12 shrink-0 rounded-full"
                      style={{ background: f.on ? "linear-gradient(135deg, var(--hb-accent-hi), var(--hb-accent))" : "var(--hb-bg2)", boxShadow: f.on ? "0 6px 18px -4px var(--hb-glow)" : "var(--hb-neu-in)" }}>
                      <motion.span animate={{ x: f.on ? 22 : 0 }} transition={spring} className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white" style={{ boxShadow: "0 2px 6px rgba(0,0,0,0.22)" }} />
                    </button>
                  </div>
                ))}
              </div>

              <p className="hb-eyebrow mt-5" style={{ color: "var(--hb-accent)" }}>price for two</p>
              <div className="mt-2.5 flex gap-2">
                {BANDS.map((b) => <Chip key={b.v} active={bands.includes(b.v)} onClick={() => toggleBand(b.v)}>{b.sym} · {b.label}</Chip>)}
              </div>

              <SoftBtn onClick={() => setSheet(false)} className="mt-6 h-12 w-full rounded-[18px] text-[14.5px]">Show {results.length} {results.length === 1 ? "dish" : "dishes"}</SoftBtn>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============================================================
   RESTAURANT — parallax hero, sticky category tabs, menu
   ============================================================ */
export function Restaurant() {
  const { navigate, back, params, favorites, toggleFav, addToCart, showToast, cartCount, cartTotal } = useHB();
  const r = RESTOS.find((x) => x.id === (params.restoId as string)) ?? RESTOS[0];
  const menu = useMemo(() => DISHES.filter((d) => d.restoId === r.id), [r.id]);
  const cats = useMemo(() => [...new Set(menu.map((d) => d.cat))], [menu]);
  const groups = useMemo(() => {
    const m = new Map<string, Dish[]>();
    for (const d of menu) {
      const arr = m.get(d.cat);
      if (arr) arr.push(d); else m.set(d.cat, [d]);
    }
    return [...m.entries()];
  }, [menu]);

  const fav = favorites.includes(r.id);
  const [sizzle, setSizzle] = useState(0);
  const [stuck, setStuck] = useState(false);
  const [activeCat, setActiveCat] = useState<string>(cats[0] ?? "");
  const scrollRef = useRef<HTMLDivElement>(null);
  const secRefs = useRef<Record<string, HTMLElement | null>>({});
  const { scrollY } = useScroll({ container: scrollRef });
  const imgY = useTransform(scrollY, [0, 320], [0, 72]);
  const imgScale = useTransform(scrollY, [0, 320], [1, 1.15]);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setStuck(el.scrollTop > 236);
    let cur = cats[0] ?? "";
    for (const c of cats) {
      const s = secRefs.current[c];
      if (s && s.getBoundingClientRect().top - el.getBoundingClientRect().top <= 190) cur = c;
    }
    setActiveCat((prev) => (prev === cur ? prev : cur));
  };

  const jump = (c: string) => secRefs.current[c]?.scrollIntoView({ behavior: "smooth", block: "start" });

  const quickAdd = (id: string) => {
    const d = dishById(id);
    addToCart({ dishId: id, qty: 1, size: "Regular", spice: d.spice ?? 0, addons: [], unitPrice: d.price });
    setSizzle((s) => s + 1);
    showToast("Added to your plate");
  };

  return (
    <div className="relative h-full overflow-hidden" style={{ background: "var(--hb-bg)" }}>
      <Sizzle trigger={sizzle} />

      <div ref={scrollRef} onScroll={onScroll} className="no-scrollbar h-full overflow-y-auto">
        {/* ---------- parallax hero ---------- */}
        <div className="relative h-[310px] overflow-hidden">
          <motion.img src={r.img} alt={r.name} style={{ y: imgY, scale: imgScale }} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,7,4,0.45), transparent 36%, rgba(10,7,4,0.58) 68%, rgba(10,7,4,0.95))" }} />

          <div className="absolute inset-x-4 top-[60px] z-20 flex items-center justify-between">
            <IconBtn label="Back" onClick={back} className="h-11 w-11 text-white"><ChevronLeft size={22} strokeWidth={2.4} /></IconBtn>
            <motion.button whileTap={{ scale: 0.82 }} onClick={() => toggleFav(r.id)} aria-label="Save restaurant" aria-pressed={fav} className="hb-tap hb-press hb-focus hb-glass grid h-11 w-11 place-items-center rounded-full">
              <motion.span key={String(fav)} initial={{ scale: fav ? 0.4 : 1 }} animate={{ scale: 1 }} transition={spring}>
                <Heart size={19} fill={fav ? "#d6482b" : "none"} color={fav ? "#d6482b" : "#ffffff"} />
              </motion.span>
            </motion.button>
          </div>

          <div className="absolute inset-x-5 bottom-4 z-10">
            <h1 className="hb-h1 text-white" style={{ textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}>{r.name}</h1>
            <p className="mt-1 text-[12.5px] text-white/75">{r.cuisine}</p>
            <div className="mt-2.5 flex items-center gap-2">
              <RatePill v={r.rating} />
              <span className="hb-glass flex items-center gap-1 rounded-[10px] px-2 py-1 text-[11px] font-semibold text-white"><Clock size={11} /> {r.time} min</span>
              <span className="hb-glass flex items-center gap-1 rounded-[10px] px-2 py-1 text-[11px] font-semibold text-white"><MapPin size={11} /> {r.dist} km</span>
              <span className="hb-glass rounded-[10px] px-2 py-1 text-[11px] font-semibold text-white">{"₹".repeat(r.price)}</span>
            </div>
            {r.promo && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, ...springSoft }}
                className="mt-2.5 inline-flex items-center gap-1.5 rounded-[12px] px-3 py-1.5 text-[11.5px] font-bold"
                style={{ background: "linear-gradient(135deg, var(--hb-accent-hi), var(--hb-accent))", color: "var(--hb-accent-ink)", boxShadow: "0 10px 26px -8px rgba(0,0,0,0.5)" }}>
                🎟️ {r.promo} · applied at checkout
              </motion.div>
            )}
          </div>
        </div>

        {/* ---------- sticky category tabs ---------- */}
        <div className={`sticky top-[58px] z-30 mx-5 mt-4 flex items-center gap-2 overflow-x-auto no-scrollbar rounded-[18px] px-1.5 py-1.5 ${stuck ? "hb-glass-strong" : "hb-glass"}`}>
          {cats.map((c) => <Chip key={c} active={activeCat === c} onClick={() => jump(c)}>{c}</Chip>)}
        </div>

        {/* ---------- info strip ---------- */}
        <div className="mt-4 grid grid-cols-3 gap-2.5 px-5">
          {[
            { e: "🛵", t: "Free delivery", s: "over ₹199" },
            { e: "📦", t: "Paper-bag", s: "packed hot" },
            { e: "🕒", t: "Open till", s: "1 am" },
          ].map((x) => (
            <Glass key={x.t} className="rounded-[16px] p-3 text-center">
              <div className="text-[17px]">{x.e}</div>
              <p className="mt-1 text-[11px] font-bold leading-tight">{x.t}</p>
              <p className="text-[10px] leading-tight text-[var(--hb-ink2)]">{x.s}</p>
            </Glass>
          ))}
        </div>

        {/* ---------- menu sections ---------- */}
        {groups.map(([cat, dishes]) => (
          <section key={cat} ref={(el) => { secRefs.current[cat] = el; }} style={{ scrollMarginTop: 118 }} className="mt-7 px-5" aria-label={cat}>
            <div className="flex items-baseline justify-between">
              <h3 className="hb-h3">{cat}</h3>
              <span className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[var(--hb-ink3)]">{dishes.length} {dishes.length > 1 ? "dishes" : "dish"}</span>
            </div>
            <div className="mt-3 space-y-3.5">
              {dishes.map((d) => (
                <motion.button key={d.id} {...reveal} onClick={() => navigate("dish", { dishId: d.id })} aria-label={`Open ${d.name}`}
                  className="hb-press hb-focus flex w-full gap-3.5 rounded-[22px] p-3 text-left" style={{ background: "var(--hb-card)", boxShadow: "var(--hb-shadow)" }}>
                  <div className="min-w-0 flex-1 py-0.5">
                    <p className="flex items-center gap-2 text-[14.5px] font-bold">
                      <VegMark veg={d.veg} size={12} />
                      <span className="truncate">{d.name}</span>
                      {d.bestseller && <span className="shrink-0 rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wide" style={{ background: "color-mix(in srgb, var(--hb-accent) 14%, transparent)", color: "var(--hb-accent)" }}>★ best</span>}
                    </p>
                    <Price v={d.price} className="mt-1 block text-[13.5px]" />
                    <p className="mt-1 line-clamp-2 text-[11.5px] leading-relaxed text-[var(--hb-ink2)]">{d.desc}</p>
                    <p className="mt-2 flex items-center gap-2 text-[11px] text-[var(--hb-ink2)]"><RatePill v={d.rating} /> {d.time}′ <Flames level={d.spice ?? 0} /></p>
                  </div>
                  <div className="relative shrink-0">
                    <img src={d.img} alt={d.name} className="h-[104px] w-[104px] rounded-[16px] object-cover" />
                    <span role="button" aria-label={`Add ${d.name} to plate`} onClick={(e) => { e.stopPropagation(); quickAdd(d.id); }}
                      className="hb-press absolute -bottom-2 -right-2 grid h-9 w-9 place-items-center rounded-full"
                      style={{ background: "linear-gradient(135deg, var(--hb-accent-hi), var(--hb-accent))", color: "var(--hb-accent-ink)", boxShadow: "0 8px 20px -6px var(--hb-glow)" }}>
                      <Plus size={17} strokeWidth={2.6} />
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </section>
        ))}

        <div aria-hidden className="h-32" />
      </div>

      {/* ---------- floating plate bar ---------- */}
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.button initial={{ y: 90, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 90, opacity: 0 }} transition={springSoft}
            onClick={() => navigate("cart")} aria-label="View plate" className="hb-glass-strong absolute inset-x-5 bottom-24 z-40 flex items-center justify-between gap-3 rounded-[20px] px-4 py-3 text-left">
            <span className="flex min-w-0 items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full" style={{ background: "linear-gradient(135deg, var(--hb-accent-hi), var(--hb-accent))", color: "var(--hb-accent-ink)", boxShadow: "0 8px 20px -6px var(--hb-glow)" }}><ShoppingBag size={17} /></span>
              <span className="min-w-0">
                <span className="block truncate text-[13px] font-bold">{cartCount} {cartCount === 1 ? "item" : "items"} on your plate</span>
                <span className="block text-[11.5px] text-[var(--hb-ink2)]">{rupee(cartTotal)} · ready to fly</span>
              </span>
            </span>
            <span className="shrink-0 text-[12px] font-bold" style={{ color: "var(--hb-accent)" }}>View plate →</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============================================================
   DISH — hero tilt + steam, size / spice / add-ons / note
   ============================================================ */
export function Dish() {
  const { navigate, back, params, favorites, toggleFav, addToCart, showToast } = useHB();
  const d = dishById((params.dishId as string) ?? "d1");
  const [qty, setQty] = useState(1);
  const [sizeIdx, setSizeIdx] = useState(0);
  const [spiceIdx, setSpiceIdx] = useState<number>(d.spice ?? 0);
  const [addons, setAddons] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [sizzle, setSizzle] = useState(0);
  const navTimer = useRef<number | null>(null);
  const fav = favorites.includes(d.id);

  useEffect(() => () => { if (navTimer.current) window.clearTimeout(navTimer.current); }, []);

  const addonSum = ADDONS.filter((a) => addons.includes(a.id)).reduce((s, a) => s + a.price, 0);
  const unit = d.price + SIZES[sizeIdx].delta + addonSum;
  const total = unit * qty;

  const toggleAddon = (id: string) => setAddons((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));

  const add = () => {
    addToCart({ dishId: d.id, qty, size: SIZES[sizeIdx].name, spice: spiceIdx, addons, note: note.trim() || undefined, unitPrice: unit });
    setSizzle((s) => s + 1);
    showToast("Added · sizzling hot");
    if (navTimer.current) window.clearTimeout(navTimer.current);
    navTimer.current = window.setTimeout(() => navigate("cart"), 450);
  };

  return (
    <div className="relative h-full overflow-hidden" style={{ background: "var(--hb-bg)" }}>
      <Sizzle trigger={sizzle} />

      <div className="no-scrollbar h-full overflow-y-auto">
        {/* ---------- hero ---------- */}
        <div className="relative h-[350px] overflow-hidden">
          <Parallax intensity={12} className="h-full w-full">
            <motion.img initial={{ scale: 1.1, opacity: 0.65 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.65, ease: [0.22, 0.8, 0.24, 1] }}
              src={d.img} alt={d.name} className="h-full w-full object-cover" />
          </Parallax>
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,7,4,0.4), transparent 42%, rgba(10,7,4,0.6))" }} />
          <Steam className="bottom-9 right-8" count={3} delay={0.3} />

          <div className="absolute inset-x-4 top-[60px] z-20 flex items-center justify-between">
            <IconBtn label="Back" onClick={back} className="h-11 w-11 text-white"><ChevronLeft size={22} strokeWidth={2.4} /></IconBtn>
            <motion.button whileTap={{ scale: 0.82 }} onClick={() => toggleFav(d.id)} aria-label="Save dish" aria-pressed={fav} className="hb-tap hb-press hb-focus hb-glass grid h-11 w-11 place-items-center rounded-full">
              <motion.span key={String(fav)} initial={{ scale: fav ? 0.4 : 1 }} animate={{ scale: 1 }} transition={spring}>
                <Heart size={19} fill={fav ? "#d6482b" : "none"} color={fav ? "#d6482b" : "#ffffff"} />
              </motion.span>
            </motion.button>
          </div>
        </div>

        {/* ---------- content card ---------- */}
        <motion.div initial={{ y: 44 }} animate={{ y: 0 }} transition={{ duration: 0.5, ease: [0.22, 0.8, 0.24, 1] }}
          className="relative z-10 -mt-6 rounded-t-[28px] px-5 pb-44" style={{ background: "var(--hb-bg)", boxShadow: "0 -18px 40px -24px rgba(0,0,0,0.5)" }}>
          {/* eyebrow tags */}
          <motion.div {...reveal} className="flex flex-wrap items-center gap-2 pt-6">
            {d.tags.map((t) => (
              <span key={t} className="rounded-full px-2.5 py-1 text-[10.5px] font-bold" style={{ background: "color-mix(in srgb, var(--hb-accent) 13%, transparent)", color: "var(--hb-accent)" }}>✦ {t}</span>
            ))}
            <VegMark veg={d.veg} size={14} />
          </motion.div>

          <motion.h1 {...reveal} className="hb-h1 mt-2.5">{d.name}</motion.h1>

          <motion.div {...reveal} className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[12.5px] text-[var(--hb-ink2)]">
            <RatePill v={d.rating} />
            <span className="flex items-center gap-1"><Clock size={12} /> {d.time} min</span>
            <span>{d.kcal} kcal</span>
            <Flames level={d.spice ?? 0} size={13} />
          </motion.div>

          <motion.p {...reveal} className="mt-3 text-[15px] leading-relaxed text-[var(--hb-ink2)]">{d.desc}</motion.p>

          {/* ---------- SIZE ---------- */}
          <motion.div {...reveal} className="mt-7">
            <p className="hb-eyebrow" style={{ color: "var(--hb-accent)" }}>size</p>
            <h2 className="hb-h3 mt-1">How hungry are you?</h2>
            <div className="mt-3 grid grid-cols-3 gap-2.5" role="radiogroup" aria-label="Portion size">
              {SIZES.map((s, i) => {
                const on = sizeIdx === i;
                return (
                  <motion.button key={s.name} role="radio" aria-checked={on} onClick={() => setSizeIdx(i)} whileTap={{ scale: 0.96 }} animate={{ scale: on ? 1.04 : 1 }} transition={springSoft}
                    className={`hb-tap hb-press hb-focus rounded-[18px] p-3 text-left ${on ? "" : "hb-neu"}`}
                    style={on ? { background: "var(--hb-card)", boxShadow: "0 0 0 2px var(--hb-accent), var(--hb-shadow-lg)" } : undefined}>
                    <p className="text-[12.5px] font-bold leading-tight">{s.name}</p>
                    <p className="mt-0.5 text-[10px] leading-tight text-[var(--hb-ink2)]">{s.sub}</p>
                    <p className="mt-2 text-[12px] font-bold" style={{ color: on ? "var(--hb-accent)" : "var(--hb-ink)" }}>{s.delta === 0 ? rupee(d.price) : `+₹${s.delta}`}</p>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* ---------- SPICE ---------- */}
          <motion.div {...reveal} className="mt-7">
            <p className="hb-eyebrow" style={{ color: "var(--hb-accent)" }}>spice</p>
            <h2 className="hb-h3 mt-1">Turn up the heat</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {SPICE.map((s, i) => {
                const on = spiceIdx === i;
                return (
                  <button key={s.label} aria-pressed={on} onClick={() => setSpiceIdx(i)} className="hb-press hb-focus rounded-full px-4 py-2.5 text-[12.5px] font-semibold"
                    style={on ? { background: "linear-gradient(135deg, var(--hb-accent-hi), var(--hb-accent))", color: "var(--hb-accent-ink)", boxShadow: "0 8px 22px -6px var(--hb-glow)" } : { background: "var(--hb-muted)", color: "var(--hb-ink2)" }}>
                    {s.label} <span style={{ filter: on ? "brightness(1.15)" : "grayscale(0.2)" }}>{s.em}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* ---------- ADD-ONS ---------- */}
          <motion.div {...reveal} className="mt-7">
            <p className="hb-eyebrow" style={{ color: "var(--hb-accent)" }}>add-ons</p>
            <h2 className="hb-h3 mt-1">Make it a feast</h2>
            <div className="mt-3 overflow-hidden rounded-[18px]" style={{ background: "var(--hb-card)", boxShadow: "var(--hb-shadow)" }}>
              {ADDONS.map((a, i) => {
                const on = addons.includes(a.id);
                return (
                  <button key={a.id} role="checkbox" aria-checked={on} onClick={() => toggleAddon(a.id)} className="hb-press hb-focus flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
                    style={i < ADDONS.length - 1 ? { borderBottom: "1px solid var(--hb-line)" } : undefined}>
                    <span className="flex items-center gap-3">
                      <motion.span animate={{ scale: on ? 1.06 : 1 }} transition={spring} className="grid h-6 w-6 shrink-0 place-items-center rounded-full"
                        style={on ? { background: "linear-gradient(135deg, var(--hb-accent-hi), var(--hb-accent))", color: "var(--hb-accent-ink)" } : { background: "var(--hb-bg2)", boxShadow: "var(--hb-neu-in)" }}>
                        <AnimatePresence>
                          {on && (
                            <motion.span key="check" initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} transition={spring}>
                              <Check size={13} strokeWidth={3.2} />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.span>
                      <span className="text-[13.5px] font-semibold">{a.name}</span>
                    </span>
                    <span className="text-[13px] font-bold text-[var(--hb-ink2)]">+{rupee(a.price)}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* ---------- KITCHEN NOTE ---------- */}
          <motion.div {...reveal} className="mt-7">
            <p className="hb-eyebrow" style={{ color: "var(--hb-accent)" }}>kitchen note</p>
            <h2 className="hb-h3 mt-1">Word to the chef</h2>
            <div className="relative mt-3 rounded-[18px] p-3.5 pb-7" style={{ background: "var(--hb-bg2)", boxShadow: "var(--hb-neu-in)" }}>
              <textarea value={note} onChange={(e) => setNote(e.target.value.slice(0, 120))} maxLength={120} rows={3} placeholder="Extra crispy? Less onion? Tell the chef…" aria-label="Kitchen note"
                className="w-full resize-none bg-transparent text-[13.5px] leading-relaxed text-[var(--hb-ink)] placeholder:text-[var(--hb-ink3)] focus:outline-none" />
              <span className="absolute bottom-3 right-3.5 text-[10.5px] font-bold tabular-nums text-[var(--hb-ink3)]">{note.length}/120</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ---------- sticky add bar ---------- */}
      <div className="absolute inset-x-0 bottom-0 z-40 px-5 pb-24 pt-12" style={{ background: "linear-gradient(180deg, transparent, var(--hb-bg) 58%)" }}>
        <div className="flex items-center gap-3">
          <Stepper qty={qty} onDelta={(x) => setQty((q) => Math.max(1, q + x))} />
          <SoftBtn onClick={add} className="h-14 flex-1 rounded-[20px] text-[15px]">Add to plate · {rupee(total)}</SoftBtn>
        </div>
      </div>
    </div>
  );
}
