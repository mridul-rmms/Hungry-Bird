"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, Trash2, TicketPercent, X, ChevronRight, ShoppingBasket } from "lucide-react";
import { useHB, cartCount, cartSubtotal } from "@/lib/store";
import { COUPONS, money } from "@/lib/api";
import { VegDot } from "./ui";

/* signature: the cart IS a plate — items render as food on a ceramic plate */
function PlateVisual() {
  const cart = useHB((s) => s.cart);
  const items = cart.slice(0, 4);
  const pos = [
    "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-24 w-24 z-10",
    "left-[24%] top-[30%] h-16 w-16",
    "right-[22%] top-[34%] h-14 w-14",
    "left-[36%] bottom-[18%] h-12 w-12",
  ];
  return (
    <div className="relative mx-auto h-40 w-40" aria-hidden>
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_38%_32%,var(--hb-card),var(--hb-bg2))] shadow-[0_10px_30px_-10px_rgba(0,0,0,.25),inset_0_-4px_12px_rgba(0,0,0,.06)] ring-1 ring-[var(--hb-line)]" />
      <div className="absolute inset-4 rounded-full border border-[var(--hb-line)] opacity-60" />
      {items.length === 0 && <p className="absolute inset-0 grid place-items-center text-[11px] font-semibold text-[var(--hb-ink3)]">an empty plate</p>}
      {items.map((it, i) => (
        <motion.img
          key={it.key}
          src={it.image}
          alt=""
          initial={{ scale: 0, opacity: 0, rotate: -20 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 18, delay: i * 0.06 }}
          className={`absolute rounded-full object-cover ring-2 ring-[var(--hb-card)] shadow-lg ${pos[i]}`}
        />
      ))}
      {items.length > 0 && (
        <>
          <span className="hb-steam-puff left-[42%] top-2" />
          <span className="hb-steam-puff left-[56%] top-3" style={{ animationDelay: "1.1s" }} />
        </>
      )}
    </div>
  );
}

export default function CartDrawer() {
  const { cartOpen, setCartOpen, cart, cartRestaurant, setQty, clearCart, go, toast } = useHB();
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState<(typeof COUPONS)[number] | null>(null);

  const count = cartCount(cart);
  const sub = cartSubtotal(cart);
  const fee = cart?.length ? 39 : 0;
  const taxes = Math.round(sub * 0.09);

  const discount = useMemo(() => {
    if (!coupon) return 0;
    if (sub < coupon.min) return 0;
    const { discount: d } = coupon.off(sub, fee);
    return d; // free delivery is applied via effectiveFee, not here
  }, [coupon, sub, fee]);

  if (!cartOpen) return null;

  const applyCoupon = (c: (typeof COUPONS)[number]) => {
    if (sub < c.min) {
      toast(`${c.code} needs a minimum of ₹${c.min}`);
      return;
    }
    setCoupon(c);
    setCouponInput("");
    toast(`${c.code} applied — ${c.label}`);
  };

  const effectiveFee = coupon?.off(sub, fee).freeDel && sub >= coupon.min ? 0 : fee;

  return (
    <AnimatePresence>
      {cartOpen && (
        <motion.div key="cart" className="fixed inset-0 z-[93]" role="dialog" aria-modal="true" aria-label="Your plate (cart)">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-[var(--hb-bg)] shadow-2xl"
          >
            {/* header */}
            <div className="flex items-center justify-between border-b border-[var(--hb-line)] px-5 py-4">
              <div>
                <h2 className="font-display text-[19px] font-semibold">Your plate</h2>
                {cartRestaurant && <p className="text-[12px] font-semibold text-[var(--hb-ink3)]">from {cartRestaurant.name}</p>}
              </div>
              <button onClick={() => setCartOpen(false)} className="hb-tap grid h-9 w-9 place-items-center rounded-xl border border-[var(--hb-line)] bg-[var(--hb-card)]" aria-label="Close cart">
                <X size={16} />
              </button>
            </div>

            {count === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
                <PlateVisual />
                <div>
                  <p className="hb-h3">Nothing plated yet</p>
                  <p className="mt-1 text-[13.5px] text-[var(--hb-ink2)]">Pick a kitchen, choose a dish — it lands here like food on a plate.</p>
                </div>
                <button onClick={() => { setCartOpen(false); go({ name: "home" }); }} className="hb-btn hb-btn-primary h-11 rounded-2xl px-5">Browse kitchens</button>
              </div>
            ) : (
              <>
                <div className="hb-scroll flex-1 overflow-y-auto px-5 py-4">
                  <PlateVisual />

                  {/* items */}
                  <ul className="mt-4 space-y-2.5">
                    {cart.map((it) => (
                      <motion.li layout key={it.key} className="hb-card flex items-center gap-3 rounded-2xl p-2.5">
                        <div className="hb-imgwrap h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                          <img src={it.image} alt="" className="h-full w-full object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <VegDot veg={it.veg} size={11} />
                            <p className="truncate text-[13.5px] font-bold">{it.name}</p>
                          </div>
                          {it.opts.length > 0 && <p className="truncate text-[11px] font-medium text-[var(--hb-ink3)]">{it.opts.join(" · ")}</p>}
                          {it.note && <p className="truncate text-[11px] italic text-[var(--hb-ink3)]">“{it.note}”</p>}
                          <p className="mt-0.5 text-[13px] font-extrabold">{money(it.price * it.qty)}</p>
                        </div>
                        <div className="flex items-center gap-1 rounded-xl border border-[var(--hb-line)] px-1 py-1" role="group" aria-label={`Quantity of ${it.name}`}>
                          <button onClick={() => setQty(it.key, it.qty - 1)} className="grid h-7 w-7 place-items-center rounded-lg hover:bg-[var(--hb-muted)]" aria-label={`Remove one ${it.name}`}>
                            {it.qty === 1 ? <Trash2 size={13} className="text-[var(--hb-ember)]" /> : <Minus size={13} />}
                          </button>
                          <span className="w-5 text-center text-[13px] font-black">{it.qty}</span>
                          <button onClick={() => setQty(it.key, it.qty + 1)} className="grid h-7 w-7 place-items-center rounded-lg hover:bg-[var(--hb-muted)]" aria-label={`Add one ${it.name}`}><Plus size={13} /></button>
                        </div>
                      </motion.li>
                    ))}
                  </ul>

                  {/* coupons */}
                  <div className="mt-5">
                    <p className="mb-2 flex items-center gap-1.5 text-[13px] font-bold"><TicketPercent size={14} className="text-[var(--hb-accent)]" /> Offers for you</p>
                    <div className="flex gap-2">
                      <input value={couponInput} onChange={(e) => setCouponInput(e.target.value.toUpperCase())} placeholder="Enter code" className="hb-input !py-2.5 !text-[13px]" aria-label="Coupon code" />
                      <button
                        onClick={() => {
                          const c = COUPONS.find((x) => x.code === couponInput.trim());
                          if (c) applyCoupon(c); else toast("That code isn’t on the menu");
                        }}
                        className="hb-btn hb-btn-ghost h-[42px] shrink-0 rounded-xl px-4 text-[13px]"
                      >
                        Apply
                      </button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {COUPONS.map((c) => (
                        <button key={c.code} onClick={() => applyCoupon(c)} data-on={coupon?.code === c.code ? "1" : "0"} className="hb-chip !text-[11.5px]">
                          {c.code} <span className="font-medium opacity-70">· {c.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button onClick={() => { clearCart(); setCoupon(null); toast("Plate cleared"); }} className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-bold text-[var(--hb-ink3)] hover:text-[var(--hb-ember)]">
                    <Trash2 size={13} /> Clear plate
                  </button>
                </div>

                {/* totals */}
                <div className="border-t border-[var(--hb-line)] bg-[var(--hb-card)] px-5 py-4">
                  <dl className="space-y-1.5 text-[13px] font-medium text-[var(--hb-ink2)]">
                    <div className="flex justify-between"><dt>Item total</dt><dd className="font-semibold text-[var(--hb-ink)]">{money(sub)}</dd></div>
                    <div className="flex justify-between"><dt>Delivery fee</dt><dd className="font-semibold text-[var(--hb-ink)]">{effectiveFee === 0 ? <span className="text-[var(--hb-veg)]">FREE</span> : money(effectiveFee)}</dd></div>
                    <div className="flex justify-between"><dt>Taxes & charges</dt><dd className="font-semibold text-[var(--hb-ink)]">{money(taxes)}</dd></div>
                    {discount > 0 && (
                      <div className="flex justify-between text-[var(--hb-veg)]"><dt>Coupon {coupon?.code}</dt><dd className="font-bold">−{money(discount)}</dd></div>
                    )}
                  </dl>
                  <div className="mt-2 flex items-center justify-between border-t border-dashed border-[var(--hb-line)] pt-2.5">
                    <p className="font-display text-[16px] font-bold">To pay</p>
                    <p className="font-display text-[20px] font-bold">{money(Math.max(0, sub + effectiveFee + taxes - discount))}</p>
                  </div>
                  <button
                    onClick={() => { setCartOpen(false); go({ name: "checkout" }); }}
                    className="hb-btn hb-btn-basil mt-3 h-12 w-full rounded-2xl text-[15px]"
                  >
                    <ShoppingBasket size={17} /> Checkout <ChevronRight size={16} />
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
