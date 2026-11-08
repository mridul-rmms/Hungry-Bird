"use client";
/* Hungry Bird — ORDER FLOW
   Cart ("cart as a plate"), Checkout, Success (celebration), Tracking (live map), Rider (chat) */
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Clock, MessageCircle, Phone, SendHorizontal, Ticket } from "lucide-react";
import { useHB, dishById, rupee } from "@/lib/store";
import { COUPONS, RIDER_MSGS } from "@/lib/data";
import { BackBar, SoftBtn, Stepper, Price, Chip, Glass, IconBtn, Steam, SpiceConfetti, spring, springSoft } from "../ui";

/* ---------- shared bill math (tip travels via navigate params) ---------- */
function bill(subtotal: number, coupon: string | null, tip: number) {
  const discount = coupon === "EMBER50" && subtotal >= 249 ? 120 : 0;
  const delivery = coupon === "LATENIGHT" ? 0 : 30;
  const tax = Math.round(Math.max(0, subtotal - discount) * 0.05);
  const total = Math.max(0, subtotal - discount + delivery + tax + tip);
  return { discount, delivery, tax, total };
}

/* ================================================================
   CART — "cart as a plate"
   ================================================================ */
export function Cart() {
  const { cart, updateQty, cartTotal, cartCount, navigate, showToast } = useHB();
  const [coupon, setCoupon] = useState<string | null>(null);
  const [tip, setTip] = useState(0);
  const [customOpen, setCustomOpen] = useState(false);
  const [customTip, setCustomTip] = useState("60");
  const { discount, delivery, tax, total } = bill(cartTotal, coupon, tip);
  const ember = COUPONS.find((c) => c.code === "EMBER50") ?? COUPONS[0];

  const toggleCoupon = () => {
    if (coupon) { setCoupon(null); showToast("EMBER50 removed"); return; }
    if (cartTotal >= 249) { setCoupon("EMBER50"); showToast("EMBER50 applied · ₹120 off"); }
    else showToast(`Add ₹${249 - cartTotal} more to unlock`);
  };

  return (
    <div className="relative h-full overflow-hidden">
      <div className="no-scrollbar h-full overflow-y-auto pb-32" style={{ background: "var(--hb-bg)" }}>
        <BackBar title="Your plate" />

        {cart.length === 0 ? (
          /* ---------- cinematic empty state ---------- */
          <div className="grid min-h-[70%] place-items-center px-8 pt-6 text-center">
            <div>
              <div className="relative mx-auto h-[240px] w-[240px]">
                <div aria-hidden className="absolute inset-0 rounded-full opacity-70" style={{ background: "radial-gradient(closest-side, var(--hb-glow), transparent 72%)" }} />
                <img src="/img/plate-empty.jpg" alt="An empty ceramic plate" className="hb-anim-float-slow relative h-[240px] w-[240px] rounded-full object-cover" style={{ boxShadow: "var(--hb-shadow-lg)" }} />
              </div>
              <h2 className="hb-h2 mt-7">Nothing on the plate yet</h2>
              <p className="mt-1.5 text-[13.5px] text-[var(--hb-ink2)]">Every great meal starts with one dish.</p>
              <SoftBtn onClick={() => navigate("home")} className="mt-6 h-12 rounded-[18px] px-7 text-[14px]">Start craving</SoftBtn>
            </div>
          </div>
        ) : (
          <>
            {/* ---------- THE PLATE VIEW ---------- */}
            <section aria-label={`Plate with ${cartCount} items`} className="relative mx-auto h-[320px] w-full">
              <div aria-hidden className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-2xl" style={{ background: "radial-gradient(closest-side, var(--hb-glow), transparent 75%)" }} />
              <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full" style={{ boxShadow: "var(--hb-shadow-lg)" }}>
                <img src="/img/plate-empty.jpg" alt="Ceramic plate" className="h-full w-full object-cover" />
                <div aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 40%, transparent 52%, rgba(64,42,16,0.16))" }} />
              </div>
              {cart.slice(0, 7).map((item, i) => {
                const n = Math.min(cart.length, 7);
                const a = ((i / n) * 360 - 90) * (Math.PI / 180);
                const x = Math.cos(a) * 105;
                const y = Math.sin(a) * 105;
                const d = dishById(item.dishId);
                return (
                  <motion.div key={item.key} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ ...spring, delay: i * 0.05 }}
                    className="absolute" style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}>
                    <div className="-translate-x-1/2 -translate-y-1/2">
                      <span className="hb-anim-float-slow block" style={{ animationDelay: `${i * 0.45}s` }}>
                        <img src={d.img} alt={d.name} className="h-[84px] w-[84px] rounded-full object-cover ring-2 ring-white/70" style={{ boxShadow: "0 6px 16px rgba(48,32,14,0.25)" }} />
                      </span>
                    </div>
                  </motion.div>
                );
              })}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <p className="font-display text-[20px] font-semibold leading-none">{cartCount} item{cartCount === 1 ? "" : "s"}</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--hb-ink3)]">on your plate</p>
              </div>
            </section>

            {/* ---------- ORDER LINES ---------- */}
            <section aria-label="Order lines" className="mt-2 space-y-3 px-5">
              {cart.map((item, i) => {
                const d = dishById(item.dishId);
                return (
                  <motion.div key={item.key} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04, ...springSoft }}
                    className="hb-press flex items-center gap-3.5 rounded-[20px] p-3" style={{ background: "var(--hb-card)", boxShadow: "var(--hb-shadow)" }}>
                    <img src={d.img} alt="" className="h-[56px] w-[56px] shrink-0 rounded-[16px] object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-bold">{d.name}</p>
                      <p className="mt-0.5 truncate text-[11.5px] text-[var(--hb-ink2)]">{item.size}{item.spice ? ` · spice ${item.spice}/3` : " · mild"} · {rupee(item.unitPrice)} each</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      <Price v={item.qty * item.unitPrice} className="text-[13.5px]" />
                      <Stepper size="sm" qty={item.qty} onDelta={(x) => updateQty(item.key, x)} />
                    </div>
                  </motion.div>
                );
              })}
            </section>

            {/* ---------- COUPON TICKET ---------- */}
            <section aria-label="Coupon" className="mt-5 px-5">
              <button onClick={toggleCoupon} aria-pressed={!!coupon}
                className="hb-press hb-focus relative w-full overflow-hidden rounded-[18px] border-2 border-dashed p-4 text-left"
                style={{ borderColor: coupon ? "var(--hb-accent)" : "var(--hb-line)", background: "var(--hb-card)" }}>
                <span aria-hidden className="absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full" style={{ background: "var(--hb-bg)" }} />
                <span aria-hidden className="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full" style={{ background: "var(--hb-bg)" }} />
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-[17px]" style={{ background: "var(--hb-muted)" }}><Ticket size={18} style={{ color: "var(--hb-accent)" }} /></span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-bold">{ember.code} · {ember.title}</p>
                    <p className="mt-0.5 truncate text-[11.5px] text-[var(--hb-ink2)]">{ember.sub} · today only</p>
                  </div>
                  {coupon ? (
                    <span className="shrink-0 rounded-full px-2.5 py-1.5 text-[11px] font-bold" style={{ background: "color-mix(in srgb, var(--hb-accent) 15%, transparent)", color: "var(--hb-accent)" }}>✓ Saved ₹120</span>
                  ) : (
                    <span className="shrink-0 text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: "var(--hb-accent)" }}>Apply</span>
                  )}
                </div>
              </button>
            </section>

            {/* ---------- TIP ---------- */}
            <section aria-label="Tip your rider" className="mt-5 px-5">
              <div className="hb-press rounded-[20px] p-4" style={{ background: "var(--hb-card)", boxShadow: "var(--hb-shadow)" }}>
                <div className="flex items-center justify-between">
                  <p className="text-[13.5px] font-bold">Tip your rider</p>
                  <p className="text-[11px] font-semibold" style={{ color: "var(--hb-accent)" }}>🪽 100% goes to the rider</p>
                </div>
                <div className="mt-3 flex items-center gap-2.5">
                  {[20, 30, 50].map((v) => {
                    const on = tip === v && !customOpen;
                    return (
                      <button key={v} onClick={() => { setCustomOpen(false); setTip(v); }} aria-pressed={on}
                        className={`hb-tap hb-press hb-focus flex-1 rounded-full py-2.5 text-[13px] font-bold ${on ? "" : "hb-neu"}`}
                        style={on ? { background: "linear-gradient(135deg, var(--hb-accent-hi), var(--hb-accent))", color: "var(--hb-accent-ink)" } : { color: "var(--hb-ink)" }}>
                        ₹{v}
                      </button>
                    );
                  })}
                  <button onClick={() => { setCustomOpen((o) => !o); setTip(60); }} aria-pressed={customOpen}
                    className={`hb-tap hb-press hb-focus flex-1 rounded-full py-2.5 text-[13px] font-bold ${customOpen ? "" : "hb-neu"}`}
                    style={customOpen ? { background: "linear-gradient(135deg, var(--hb-accent-hi), var(--hb-accent))", color: "var(--hb-accent-ink)" } : { color: "var(--hb-ink)" }}>
                    Custom
                  </button>
                </div>
                <AnimatePresence>
                  {customOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={springSoft} className="overflow-hidden">
                      <div className="mt-3 flex items-center gap-2.5">
                        <input value={customTip} inputMode="numeric" aria-label="Custom tip amount" placeholder="60"
                          onChange={(e) => {
                            const raw = e.target.value.replace(/[^0-9]/g, "");
                            setCustomTip(raw);
                            const v = parseInt(raw, 10);
                            setTip(Number.isFinite(v) && v > 0 ? Math.min(v, 500) : 60);
                          }}
                          className="hb-focus h-10 w-24 rounded-xl px-3 text-center text-[13px] font-bold focus:outline-none"
                          style={{ background: "var(--hb-bg2)", boxShadow: "var(--hb-neu-in)" }} />
                        <span className="text-[11.5px] text-[var(--hb-ink2)]">Defaults to ₹60 — Arjun feels the love.</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>

            {/* ---------- BILL ---------- */}
            <section aria-label="Bill details" className="mt-5 px-5">
              <div className="rounded-[20px] p-4" style={{ background: "var(--hb-card)", boxShadow: "var(--hb-shadow)" }}>
                <div className="space-y-2.5 text-[13px]">
                  <div className="flex justify-between"><span className="text-[var(--hb-ink2)]">Item total</span><Price v={cartTotal} /></div>
                  <div className="flex justify-between">
                    <span className="text-[var(--hb-ink2)]">Delivery fee</span>
                    {coupon === "LATENIGHT" ? (
                      <span className="font-semibold"><s className="text-[var(--hb-ink3)]">₹49</s> <span style={{ color: "var(--hb-accent)" }}>FREE</span></span>
                    ) : <Price v={delivery} />}
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between"><span className="font-semibold" style={{ color: "var(--hb-accent)" }}>Coupon · EMBER50</span><span className="font-bold" style={{ color: "var(--hb-accent)" }}>−{rupee(discount)}</span></div>
                  )}
                  <div className="flex justify-between"><span className="text-[var(--hb-ink2)]">Taxes &amp; charges</span><Price v={tax} /></div>
                  <div className="flex justify-between"><span className="text-[var(--hb-ink2)]">Rider tip</span><Price v={tip} /></div>
                </div>
                <div className="mt-3.5 flex items-center justify-between border-t pt-3.5" style={{ borderColor: "var(--hb-line)" }}>
                  <span className="font-display text-[18px] font-semibold">To pay</span>
                  <Price v={total} className="font-display text-[18px]" />
                </div>
              </div>
            </section>
            <div className="h-2" />
          </>
        )}
      </div>

      {/* ---------- sticky CTA ---------- */}
      {cart.length > 0 && (
        <div className="absolute inset-x-0 bottom-0 z-30 px-5 pb-24 pt-8" style={{ background: "linear-gradient(180deg, transparent, var(--hb-bg) 58%)" }}>
          <SoftBtn onClick={() => navigate("checkout", { tip })} className="h-14 w-full rounded-[20px] text-[15.5px]">Feast it · {rupee(total)}</SoftBtn>
        </div>
      )}
    </div>
  );
}

/* ================================================================
   CHECKOUT
   ================================================================ */
const PAYMENTS = [
  { id: "upi", emoji: "🟣", title: "UPI", sub: "Google Pay · PhonePe · Pei" },
  { id: "card", emoji: "💳", title: "Card", sub: "•••• 4242 · Visa" },
  { id: "wallet", emoji: "🐦", title: "Bird Wallet", sub: "Balance ₹640" },
  { id: "cod", emoji: "💵", title: "Cash on delivery", sub: "Pay when it lands" },
] as const;

export function Checkout() {
  const { cartTotal, navigate, placeOrder, addresses, activeAddr, params } = useHB();
  const [pay, setPay] = useState("upi");
  const [etaStr, setEtaStr] = useState("");
  const couponOn = cartTotal >= 249;
  const tipParam = params.tip;
  const tip = typeof tipParam === "number" ? tipParam : 0;
  const { discount, total } = bill(cartTotal, couponOn ? "EMBER50" : null, tip);
  const addr = addresses.find((a) => a.id === activeAddr) ?? addresses[0];

  useEffect(() => {
    const t = window.setTimeout(() => {
      setEtaStr(new Date(Date.now() + 45 * 60000).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }));
    }, 0);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="relative h-full overflow-hidden">
      <div className="no-scrollbar h-full overflow-y-auto pb-36" style={{ background: "var(--hb-bg)" }}>
        <BackBar title="Checkout" />

        {/* ---------- address ---------- */}
        <div className="flex items-center justify-between px-5">
          <p className="hb-eyebrow text-[var(--hb-ink2)]">Deliver to</p>
          <span className="hb-glass flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold"><Clock size={12} style={{ color: "var(--hb-accent)" }} /> Arrives ~45 min{etaStr ? ` · by ${etaStr}` : ""}</span>
        </div>
        <Glass className="mx-5 mt-3 flex items-center gap-3 rounded-[22px] p-4">
          <span aria-hidden className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-[18px]" style={{ background: "var(--hb-muted)" }}>📍</span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13.5px] font-bold">{addr.icon} {addr.label}</p>
            <p className="mt-0.5 truncate text-[11.5px] text-[var(--hb-ink2)]">{addr.line}</p>
          </div>
          <button onClick={() => navigate("location")} className="hb-tap hb-press hb-focus shrink-0 rounded-full px-3 py-2 text-[12px] font-bold" style={{ color: "var(--hb-accent)" }}>Change</button>
        </Glass>

        {/* ---------- payment ---------- */}
        <p className="hb-eyebrow mt-6 px-5 text-[var(--hb-ink2)]">Pay with</p>
        <div className="mt-3 space-y-3 px-5">
          {PAYMENTS.map((p) => {
            const on = pay === p.id;
            return (
              <motion.button key={p.id} onClick={() => setPay(p.id)} role="radio" aria-checked={on} animate={{ y: on ? -2 : 0 }} transition={springSoft}
                className="hb-press hb-focus block w-full rounded-[20px] p-4 text-left"
                style={{ background: "var(--hb-card)", boxShadow: on ? "var(--hb-shadow-lg), 0 0 0 2px var(--hb-accent)" : "var(--hb-shadow)" }}>
                <div className="flex items-center gap-3.5">
                  <span aria-hidden className="text-[20px]">{p.emoji}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14px] font-bold">{p.title}</span>
                    <span className="mt-0.5 block truncate text-[11.5px] text-[var(--hb-ink2)]">
                      {p.id === "wallet" ? <>Balance ₹640{total > 640 && <span style={{ color: "#d6482b" }}> · Low balance</span>}</> : p.sub}
                    </span>
                  </span>
                  <span aria-hidden className="grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full border-2" style={{ borderColor: on ? "var(--hb-accent)" : "var(--hb-line)" }}>
                    {on && <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--hb-accent)" }} />}
                  </span>
                </div>
                <AnimatePresence>
                  {p.id === "upi" && on && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={springSoft} className="overflow-hidden">
                      <div className="mt-3 flex gap-2 pl-[34px]">
                        {[["GPay", "#7ba05b"], ["PhonePe", "#c445c9"], ["Pei", "#d6482b"]].map(([app, hue]) => (
                          <span key={app} className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold" style={{ background: "var(--hb-muted)", color: "var(--hb-ink)" }}>
                            <span className="h-1.5 w-1.5 rounded-full" style={{ background: hue }} /> {app}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>

        {/* ---------- note + bill line ---------- */}
        <div className="mt-6 px-5">
          <label htmlFor="cook-note" className="hb-eyebrow text-[var(--hb-ink2)]">Cooking instructions</label>
          <input id="cook-note" placeholder="Less spicy, extra crispy…" aria-label="Cooking instructions"
            className="hb-focus mt-2.5 h-11 w-full rounded-[14px] px-4 text-[12.5px] focus:outline-none" style={{ background: "var(--hb-bg2)", boxShadow: "var(--hb-neu-in)" }} />
        </div>
        <div className="mt-4 flex items-center justify-between rounded-[16px] px-4 py-3.5 mx-5" style={{ background: "var(--hb-muted)" }}>
          <span className="flex items-center gap-2 text-[13px] font-semibold">
            Bill summary
            {couponOn && <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: "color-mix(in srgb, var(--hb-accent) 15%, transparent)", color: "var(--hb-accent)" }}>EMBER50 applied</span>}
          </span>
          <span className="text-[13.5px] font-bold tabular-nums">{rupee(total)} · incl. taxes</span>
        </div>
        {discount > 0 && <p className="mt-2 px-5 text-[11.5px] text-[var(--hb-ink2)]">You saved {rupee(discount)} with EMBER50 — nice.</p>}
      </div>

      {/* ---------- sticky CTA ---------- */}
      <div className="absolute inset-x-0 bottom-0 z-30 px-5 pb-24 pt-8" style={{ background: "linear-gradient(180deg, transparent, var(--hb-bg) 58%)" }}>
        <SoftBtn onClick={() => { placeOrder(total); navigate("success"); }} className="h-14 w-full rounded-[20px] text-[15.5px]">Pay {rupee(total)}</SoftBtn>
      </div>
    </div>
  );
}

/* ================================================================
   SUCCESS — order placed celebration
   ================================================================ */
const HOPS = [
  { e: "🍳", l: "kitchen" },
  { e: "🛵", l: "on the way" },
  { e: "🏠", l: "your door" },
];

export function Success() {
  const { navigate, lastOrder } = useHB();
  const o = lastOrder ?? { id: "HB-2901", total: 640, eta: 26, restoName: "Copper Handi" };
  return (
    <div className="hb-grain relative grid h-full place-items-center overflow-hidden px-8" style={{ background: "radial-gradient(100% 70% at 50% 30%, #33220e, #14100a 75%)" }}>
      <SpiceConfetti n={30} />
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full opacity-50 blur-[80px]" style={{ background: "radial-gradient(closest-side, rgba(240,165,46,0.5), transparent)" }} />

      <div className="w-full text-center">
        {/* check mark + steam */}
        <div className="relative mx-auto h-[128px] w-[128px]">
          <Steam className="bottom-10 left-1/2 -translate-x-1/2" count={3} delay={0.9} />
          <motion.div initial={{ scale: 0.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 280, damping: 15 }}
            className="relative grid h-[112px] w-[112px] place-items-center rounded-full"
            style={{ background: "linear-gradient(135deg, #ffc45e, #c87f1e)", boxShadow: "0 18px 50px -10px rgba(240,165,46,0.55)" }}>
            <motion.span initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 380, damping: 14, delay: 0.18 }}>
              <Check size={52} strokeWidth={3.2} color="#1b1206" />
            </motion.span>
          </motion.div>
        </div>

        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, ...springSoft }} className="hb-h1 mt-7 text-[#f7f1e6]">Order flying!</motion.h1>
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, ...springSoft }} className="mt-2 text-[14px] text-[#c9bda9]">
          {o.id} · {rupee(o.total)} · ETA {o.eta} min
        </motion.p>

        {/* kitchen → door mini progress */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }} className="mt-8 flex items-start justify-center">
          {HOPS.map((h, i) => (
            <React.Fragment key={h.l}>
              {i > 0 && (
                <motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.95 + i * 0.4, duration: 0.4, ease: "easeOut" }}
                  aria-hidden className="mt-[21px] h-[2px] w-8 origin-left rounded-full" style={{ background: "rgba(240,165,46,0.5)" }} />
              )}
              <div className="flex w-14 flex-col items-center">
                <motion.span initial={{ scale: 0.4, opacity: 0.2 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.7 + i * 0.4, ...spring }}
                  className="grid h-11 w-11 place-items-center rounded-full text-[19px]"
                  style={{ background: "rgba(240,165,46,0.12)", boxShadow: "inset 0 0 0 1.5px rgba(240,165,46,0.45)" }}>{h.e}</motion.span>
                <span className="mt-1.5 text-[9.5px] font-semibold uppercase tracking-[0.12em] text-[#c9bda9]">{h.l}</span>
              </div>
            </React.Fragment>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.7, ...springSoft }} className="mx-auto mt-9 w-full max-w-[260px]">
          <SoftBtn onClick={() => navigate("tracking")} className="h-[52px] w-full rounded-[20px] text-[15px]">Track it live</SoftBtn>
          <button onClick={() => navigate("home")} className="hb-tap hb-press hb-focus mt-4 text-[13px] font-semibold text-[#c9bda9] underline-offset-4 hover:underline">Back to home</button>
        </motion.div>
      </div>
    </div>
  );
}

/* ================================================================
   TRACKING — cinematic live map + bottom sheet
   ================================================================ */
const ROUTE = "M60 400 C 120 372, 110 300, 186 266 S 306 210, 330 96";

const STAGES = [
  { label: "Order confirmed", detail: "Copper Handi accepted your order" },
  { label: "Fire in the kitchen", detail: "Chef Ravi is tossing the naan" },
  { label: "Rider picked up", detail: "Arjun grabbed it hot off the pass" },
  { label: "Arriving at your door", detail: "Meet him at Gate 2 🛵" },
];

const BLOCKS = [
  { x: 16, y: 22, w: 100, h: 66 }, { x: 150, y: 16, w: 86, h: 56 }, { x: 270, y: 38, w: 96, h: 42 },
  { x: 20, y: 128, w: 74, h: 84 }, { x: 128, y: 122, w: 108, h: 66 }, { x: 262, y: 148, w: 102, h: 62 },
  { x: 24, y: 250, w: 92, h: 60 }, { x: 150, y: 244, w: 88, h: 76 }, { x: 268, y: 254, w: 96, h: 62 },
  { x: 112, y: 352, w: 116, h: 54 }, { x: 258, y: 356, w: 104, h: 50 },
];

/* rider marker riding the route via rAF + getPointAtLength (~40s leg) */
function RiderMarker({ routeRef }: { routeRef: React.RefObject<SVGPathElement | null> }) {
  const [pos, setPos] = useState({ x: 60, y: 400 });
  useEffect(() => {
    const path = routeRef.current;
    if (!path) return;
    const L = path.getTotalLength();
    let raf = 0;
    const start = performance.now();
    const DUR = 40000;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / DUR);
      const at = path.getPointAtLength(p * L);
      setPos({ x: at.x, y: at.y });
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [routeRef]);
  return (
    <g transform={`translate(${pos.x}, ${pos.y})`}>
      <ellipse cy="15" rx="10" ry="3" fill="rgba(20,16,12,0.2)" />
      <circle r="13" fill="var(--hb-card)" style={{ filter: "drop-shadow(0 4px 10px var(--hb-glow))" }} />
      <circle r="11" fill="var(--hb-accent)" opacity="0.2" />
      <text y="4.5" textAnchor="middle" fontSize="13">🛵</text>
    </g>
  );
}

export function Tracking() {
  const { navigate, lastOrder, showToast } = useHB();
  const [stage, setStage] = useState(1);
  const [etaLeft, setEtaLeft] = useState(lastOrder?.eta ?? 26);
  const routeRef = useRef<SVGPathElement | null>(null);
  const stripDish = dishById("d6");

  useEffect(() => {
    const t = window.setInterval(() => setStage((s) => Math.min(s + 1, STAGES.length - 1)), 6000);
    return () => window.clearInterval(t);
  }, []);
  useEffect(() => {
    const t = window.setInterval(() => setEtaLeft((v) => (v > 0 ? v - 1 : 0)), 1000);
    return () => window.clearInterval(t);
  }, []);

  return (
    <div className="relative h-full overflow-hidden" style={{ background: "var(--hb-bg)" }}>
      {/* ---------- live map ---------- */}
      <div className="relative h-[52%] w-full">
        <svg viewBox="0 0 390 460" preserveAspectRatio="xMidYMid slice" className="h-full w-full" style={{ background: "var(--hb-bg2)" }} aria-hidden>
          <defs>
            <radialGradient id="hb-night" cx="50%" cy="35%" r="95%">
              <stop offset="55%" stopColor="rgba(20,16,12,0)" />
              <stop offset="100%" stopColor="rgba(20,16,12,0.24)" />
            </radialGradient>
          </defs>
          {/* road grid */}
          <g stroke="var(--hb-line)" strokeWidth="4">{[104, 216, 330].map((y) => <line key={y} x1="0" y1={y} x2="390" y2={y} />)}</g>
          <g stroke="var(--hb-line)" strokeWidth="3">{[116, 244, 372].map((x) => <line key={x} x1={x} y1="0" x2={x} y2="460" />)}</g>
          <line x1="0" y1="430" x2="390" y2="430" stroke="var(--hb-line)" strokeWidth="4" />
          {/* city blocks */}
          {BLOCKS.map((b, i) => <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} rx="12" fill="var(--hb-card)" opacity="0.5" />)}
          {/* landmark dots */}
          <g fill="var(--hb-ink3)" opacity="0.55">
            <circle cx="70" cy="60" r="3" /><circle cx="196" cy="176" r="3" /><circle cx="318" cy="300" r="3" /><circle cx="70" cy="300" r="3" /><circle cx="206" cy="70" r="3" />
          </g>
          <circle cx="320" cy="248" r="3.5" fill="var(--hb-accent)" opacity="0.6" />
          <text x="182" y="336" fontSize="12" opacity="0.7">🌳</text>
          {/* route */}
          <path d={ROUTE} stroke="var(--hb-line)" strokeWidth="7" fill="none" strokeLinecap="round" opacity="0.6" />
          <path ref={routeRef} d={ROUTE} stroke="var(--hb-accent)" strokeWidth="5" fill="none" strokeLinecap="round" strokeDasharray="14 10"
            style={{ animation: "hb-dash 5s linear infinite", filter: "drop-shadow(0 0 8px var(--hb-glow))" }} />
          {/* kitchen end — pulsing dot */}
          <circle cx="60" cy="400" r="7" fill="var(--hb-accent)" style={{ transformBox: "fill-box", transformOrigin: "center", animation: "hb-breathe 1.8s ease-in-out infinite" }} />
          <text x="60" y="424" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--hb-ink2)">Kitchen</text>
          {/* home end — glass house + staggered ETA rings */}
          <circle cx="330" cy="96" r="17" fill="none" stroke="var(--hb-accent)" strokeWidth="2" style={{ transformBox: "fill-box", transformOrigin: "center", animation: "hb-ring 2.4s ease-out infinite" }} />
          <circle cx="330" cy="96" r="17" fill="none" stroke="var(--hb-accent)" strokeWidth="2" style={{ transformBox: "fill-box", transformOrigin: "center", animation: "hb-ring 2.4s ease-out 1.2s infinite" }} />
          <circle cx="330" cy="96" r="16" fill="var(--hb-card)" stroke="var(--hb-line)" />
          <text x="330" y="101" textAnchor="middle" fontSize="14">🏠</text>
          <text x="330" y="130" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--hb-ink2)">You</text>
          {/* rider */}
          <RiderMarker routeRef={routeRef} />
          <rect x="0" y="0" width="390" height="460" fill="url(#hb-night)" />
        </svg>

        {/* ETA countdown cluster */}
        <div className="absolute right-4 top-16 z-20 flex flex-col items-center gap-1.5">
          <span className="hb-glass rounded-full px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-[0.16em] text-[var(--hb-ink2)]">arriving</span>
          <div className="hb-glass-strong grid h-[68px] w-[68px] place-items-center rounded-full" style={{ border: "2px solid var(--hb-accent)" }}>
            <span className="font-display text-[22px] font-semibold leading-none tabular-nums">{etaLeft}<span className="text-[11px] font-bold"> min</span></span>
          </div>
        </div>
      </div>

      {/* ---------- bottom sheet ---------- */}
      <div className="relative -mt-6 flex max-h-[calc(48%+24px)] flex-col rounded-t-[28px] px-6 pt-6" style={{ background: "var(--hb-bg)", boxShadow: "0 -12px 32px -18px rgba(20,16,12,0.35)" }}>
        <span aria-hidden className="mx-auto mb-3 block h-1 w-10 shrink-0 rounded-full" style={{ background: "var(--hb-line)" }} />
        <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto pb-8">
          <p className="hb-eyebrow" style={{ color: "var(--hb-accent)" }}>Live order · {lastOrder?.id ?? "HB-2912"}</p>

          {/* stage timeline */}
          <div className="mt-3.5">
            {STAGES.map((s, i) => {
              const done = i < stage;
              const active = i === stage;
              return (
                <div key={s.label} className="flex gap-3.5">
                  <div className="flex flex-col items-center">
                    <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px] font-bold ${active ? "hb-anim-breathe" : ""}`}
                      style={{ background: done || active ? "var(--hb-accent)" : "var(--hb-muted)", color: done || active ? "var(--hb-accent-ink)" : "var(--hb-ink3)" }}>{done ? "✓" : i + 1}</span>
                    {i < STAGES.length - 1 && <span className="my-1 w-[2px] flex-1 rounded-full" style={{ background: done ? "var(--hb-accent)" : "var(--hb-line)" }} />}
                  </div>
                  <div className="min-w-0 flex-1 pb-3.5">
                    <p className="text-[13.5px]" style={{ fontWeight: active ? 700 : 600, color: done || active ? "var(--hb-ink)" : "var(--hb-ink3)" }}>{s.label}</p>
                    <AnimatePresence>
                      {active && (
                        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="mt-0.5 text-[11.5px] text-[var(--hb-ink2)]">{s.detail}</motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>

          {/* rider card */}
          <Glass className="mt-2 flex items-center gap-3 rounded-[20px] p-3">
            <img src="/img/rider.jpg" alt="Arjun, your rider" className="h-[52px] w-[52px] rounded-full object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-bold">Arjun · Honda Activa</p>
              <p className="mt-0.5 truncate text-[11.5px] text-[var(--hb-ink2)]">KA-01 HJ 4592 · ★ 4.9</p>
            </div>
            <IconBtn label="Chat with Arjun" onClick={() => navigate("rider")} glass={false} className="h-11 w-11 shrink-0"><MessageCircle size={19} /></IconBtn>
            <button onClick={() => showToast("Calling Arjun…")} aria-label="Call Arjun"
              className="hb-tap hb-press hb-focus grid h-11 w-11 shrink-0 place-items-center rounded-full"
              style={{ background: "linear-gradient(135deg, var(--hb-accent-hi), var(--hb-accent))", color: "var(--hb-accent-ink)", boxShadow: "0 8px 22px -6px var(--hb-glow)" }}>
              <Phone size={18} />
            </button>
          </Glass>

          {/* order strip */}
          <div className="mt-3 flex items-center gap-3 rounded-[18px] p-2.5" style={{ background: "var(--hb-card)", boxShadow: "var(--hb-shadow)" }}>
            <img src={stripDish.img} alt={stripDish.name} className="h-11 w-11 shrink-0 rounded-[12px] object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12.5px] font-bold">{stripDish.name} × 1</p>
              <Price v={lastOrder?.total ?? 640} className="text-[11.5px] text-[var(--hb-ink2)]" />
            </div>
            <button onClick={() => showToast("Support will reach out shortly")} className="hb-tap hb-press hb-focus shrink-0 rounded-full px-3 py-2 text-[11.5px] font-bold" style={{ color: "var(--hb-accent)" }}>Need help?</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   RIDER — chat & call
   ================================================================ */
type Msg = { from: string; text: string; t: string };
const REPLIES = ["On my way, 2 mins! 🛵", "Almost there, coming to Gate 2.", "Got it, see you! 👍"];
const QUICK = ["Call when you reach", "Leave at door", "Coming down!"];

export function Rider() {
  const { showToast } = useHB();
  const [msgs, setMsgs] = useState<Msg[]>([...RIDER_MSGS]);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const replyIdx = useRef(0);
  const scRef = useRef<HTMLDivElement>(null);

  const stamp = () => new Date().toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });

  useEffect(() => {
    scRef.current?.scrollTo({ top: scRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    setMsgs((m) => [...m, { from: "you", text: t, t: stamp() }]);
    setDraft("");
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { from: "rider", text: REPLIES[replyIdx.current % REPLIES.length], t: stamp() }]);
      replyIdx.current += 1;
    }, 1200);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden" style={{ background: "var(--hb-bg)" }}>
      <BackBar title="Arjun · your rider" right={<IconBtn label="Call Arjun" onClick={() => showToast("Calling Arjun…")} className="h-11 w-11"><Phone size={19} style={{ color: "var(--hb-accent)" }} /></IconBtn>} />

      {/* messages */}
      <div ref={scRef} className="no-scrollbar flex-1 space-y-3 overflow-y-auto px-5 pb-3 pt-2">
        {msgs.map((m, i) => (
          <motion.div key={`${i}-${m.text}`} initial={{ opacity: 0, y: 12, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={springSoft}
            className={`flex ${m.from === "you" ? "justify-end" : "justify-start"}`}>
            <div className="max-w-[76%] rounded-[20px] px-4 py-3 text-[13.5px] leading-relaxed"
              style={m.from === "you"
                ? { background: "linear-gradient(135deg, var(--hb-accent-hi), var(--hb-accent))", color: "var(--hb-accent-ink)", boxShadow: "0 8px 22px -8px var(--hb-glow)" }
                : { background: "var(--hb-card)", boxShadow: "var(--hb-shadow)" }}>
              {m.text}
              <span className="mt-1 block text-right text-[9.5px] opacity-60">{m.t}</span>
            </div>
          </motion.div>
        ))}
        <AnimatePresence>
          {typing && (
            <motion.div key="typing" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={springSoft} className="flex justify-start">
              <div className="hb-card flex items-center gap-1.5 rounded-[20px] px-4 py-3.5" style={{ boxShadow: "var(--hb-shadow)" }} aria-label="Arjun is typing">
                {[0, 1, 2].map((d) => <span key={d} className="h-1.5 w-1.5 rounded-full bg-[var(--hb-ink3)]" style={{ animation: `hb-typing 1.1s ease-in-out ${d * 0.18}s infinite` }} />)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* quick replies + input */}
      <div className="shrink-0 px-5 pb-24 pt-1" style={{ background: "linear-gradient(180deg, transparent, var(--hb-bg) 30%)" }}>
        <div className="no-scrollbar -mx-5 mb-3 flex gap-2 overflow-x-auto px-5">
          {QUICK.map((q) => <Chip key={q} onClick={() => send(q)}>{q}</Chip>)}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); send(draft); }} className="flex items-center gap-2.5">
          <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Message Arjun…" aria-label="Message Arjun"
            className="hb-focus h-12 min-w-0 flex-1 rounded-full px-5 text-[14px] focus:outline-none" style={{ background: "var(--hb-card)", boxShadow: "var(--hb-neu)" }} />
          <button type="submit" aria-label="Send message" className="hb-tap hb-press hb-focus grid h-12 w-12 shrink-0 place-items-center rounded-full"
            style={{ background: "linear-gradient(135deg, var(--hb-accent-hi), var(--hb-accent))", color: "var(--hb-accent-ink)", boxShadow: "0 8px 22px -6px var(--hb-glow)" }}>
            <SendHorizontal size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
