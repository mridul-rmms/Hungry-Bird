"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Banknote, CreditCard, Loader2, MapPin, Smartphone, Wallet } from "lucide-react";
import { useHB, cartCount, cartSubtotal } from "@/lib/store";
import { api, COUPONS, money } from "@/lib/api";
import { EmptyState } from "../ui";
import { VegDot } from "../ui";

const PAYMENTS = [
  { id: "upi", label: "UPI", sub: "GPay · PhonePe · Paytm", icon: Smartphone },
  { id: "card", label: "Card", sub: "Visa · Mastercard · Rupay", icon: CreditCard },
  { id: "cash", label: "Cash", sub: "Pay on delivery", icon: Banknote },
];

export default function CheckoutView() {
  const { cart, cartRestaurant, clearCart, go, user, toast, setAuthOpen } = useHB();
  const [address, setAddress] = useState("Flat 402, Ember Heights, 5th Block, Koramangala, Bengaluru 560034");
  const [payment, setPayment] = useState("upi");
  const [coupon, setCoupon] = useState<(typeof COUPONS)[number] | null>(null);
  const [placing, setPlacing] = useState(false);

  const sub = cartSubtotal(cart);
  const count = cartCount(cart);
  const fee = sub > 0 ? 39 : 0;
  const taxes = Math.round(sub * 0.09);
  const freeDel = coupon?.code === "FREEDEL" && sub >= coupon.min;
  const discount = coupon && sub >= coupon.min ? coupon.off(sub, fee).discount : 0;
  const effectiveFee = freeDel ? 0 : fee;
  const total = Math.max(0, sub + effectiveFee + taxes - discount);

  if (count === 0) {
    return (
      <div className="hb-container pt-16">
        <EmptyState
          icon={Wallet}
          title="Your plate is empty"
          sub="Add something delicious before checking out."
          action={<button onClick={() => go({ name: "home" })} className="hb-btn hb-btn-primary h-10 rounded-xl px-4 text-sm">Browse kitchens</button>}
        />
      </div>
    );
  }

  const place = async () => {
    if (address.trim().length < 8) {
      toast("Please enter a full delivery address");
      return;
    }
    setPlacing(true);
    try {
      const { order } = await api.placeOrder({
        items: cart.map((i) => ({ id: i.dishId, name: i.name, price: i.price, qty: i.qty, opts: i.opts, note: i.note })),
        restaurantSlug: cartRestaurant?.slug ?? "",
        email: user?.email,
        subtotal: sub,
        delivery: effectiveFee,
        taxes,
        discount,
        total,
        coupon: coupon && discount > 0 ? coupon.code : undefined,
        address: address.trim(),
        payment,
      });
      localStorage.setItem("hb-last-order", JSON.stringify({ code: order.code, until: Date.now() + 420_000 }));
      clearCart();
      toast(`Order ${order.code} placed 🎉`);
      go({ name: "tracking", code: order.code });
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not place order");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="hb-container max-w-4xl pb-16 pt-8">
      <p className="hb-eyebrow mb-1 text-[var(--hb-accent)]">Almost there</p>
      <h1 className="hb-h1">Checkout</h1>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
        <div className="space-y-6">
          {/* address */}
          <section className="hb-card rounded-3xl p-5" aria-label="Delivery address">
            <p className="mb-3 flex items-center gap-2 text-[14px] font-bold"><MapPin size={15} className="text-[var(--hb-accent)]" /> Delivery address</p>
            <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={3} className="hb-input resize-none" aria-label="Delivery address" />
            <div className="mt-2 flex flex-wrap gap-2">
              {["Home · Koramangala", "Work · Indiranagar", "Gym · HSR Layout"].map((a, i) => (
                <button
                  key={a}
                  onClick={() => setAddress(`${a.split(" · ")[1]} — ${i === 0 ? "Flat 402, Ember Heights, 5th Block" : i === 1 ? "Desk 14, Prestige Atlas, 100 Ft Road" : "Front desk, Fitverse, 27th Main"}`, undefined)}
                  className="hb-chip !text-[11.5px]"
                >
                  {a}
                </button>
              ))}
            </div>
          </section>

          {/* payment */}
          <section className="hb-card rounded-3xl p-5" aria-label="Payment method">
            <p className="mb-3 text-[14px] font-bold">Payment method</p>
            <div className="grid gap-2 sm:grid-cols-3">
              {PAYMENTS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPayment(p.id)}
                  aria-pressed={payment === p.id}
                  className={`flex items-center gap-3 rounded-2xl border px-3.5 py-3.5 text-left transition-all ${payment === p.id ? "border-[var(--hb-accent)] bg-[color-mix(in_srgb,var(--hb-accent)_8%,transparent)] shadow-[0_0_0_3px_var(--hb-glow)]" : "border-[var(--hb-line)] hover:border-[var(--hb-accent)]"}`}
                >
                  <p.icon size={18} className={payment === p.id ? "text-[var(--hb-accent)]" : "text-[var(--hb-ink3)]"} />
                  <span>
                    <span className="block text-[13.5px] font-bold">{p.label}</span>
                    <span className="block text-[11px] font-medium text-[var(--hb-ink3)]">{p.sub}</span>
                  </span>
                </button>
              ))}
            </div>
            <p className="mt-3 text-[11.5px] font-medium text-[var(--hb-ink3)]">Demo checkout — no real payment is processed.</p>
          </section>

          {/* coupon */}
          <section className="hb-card rounded-3xl p-5" aria-label="Coupon">
            <p className="mb-3 text-[14px] font-bold">Apply coupon</p>
            <div className="flex flex-wrap gap-2">
              {COUPONS.map((c) => (
                <button key={c.code} data-on={coupon?.code === c.code ? "1" : "0"} onClick={() => setCoupon(coupon?.code === c.code ? null : c)} className="hb-chip">
                  {c.code} <span className="font-medium opacity-70">· {c.label}</span>
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* summary */}
        <aside className="hb-card h-fit rounded-3xl p-5 lg:sticky lg:top-24" aria-label="Order summary">
          <p className="mb-3 text-[14px] font-bold">Order summary <span className="font-medium text-[var(--hb-ink3)]">· {count} item{count > 1 ? "s" : ""}</span></p>
          <ul className="space-y-2">
            {cart.map((i) => (
              <li key={i.key} className="flex items-center gap-2.5 text-[13px]">
                <VegDot veg={i.veg} size={11} />
                <span className="min-w-0 flex-1 truncate font-semibold">{i.name} <span className="text-[var(--hb-ink3)]">× {i.qty}</span></span>
                <span className="font-bold">{money(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-1.5 border-t border-dashed border-[var(--hb-line)] pt-3 text-[13px] font-medium text-[var(--hb-ink2)]">
            <div className="flex justify-between"><dt>Item total</dt><dd className="font-semibold text-[var(--hb-ink)]">{money(sub)}</dd></div>
            <div className="flex justify-between"><dt>Delivery</dt><dd className="font-semibold text-[var(--hb-ink)]">{effectiveFee === 0 ? <span className="text-[var(--hb-veg)]">FREE</span> : money(effectiveFee)}</dd></div>
            <div className="flex justify-between"><dt>Taxes</dt><dd className="font-semibold text-[var(--hb-ink)]">{money(taxes)}</dd></div>
            {discount > 0 && <div className="flex justify-between text-[var(--hb-veg)]"><dt>{coupon?.code}</dt><dd className="font-bold">−{money(discount)}</dd></div>}
          </dl>
          <div className="mt-3 flex items-center justify-between border-t border-[var(--hb-line)] pt-3">
            <p className="font-display text-[15px] font-bold">To pay</p>
            <p className="font-display text-[21px] font-bold">{money(total)}</p>
          </div>

          {!user && (
            <button onClick={() => setAuthOpen(true)} className="mt-3 w-full text-center text-[12.5px] font-semibold text-[var(--hb-accent)] underline underline-offset-2">
              Sign in to save this order to your account
            </button>
          )}

          <motion.button whileTap={{ scale: 0.97 }} onClick={place} disabled={placing} className="hb-btn hb-btn-basil mt-4 h-13 w-full rounded-2xl text-[15px]" style={{ height: 52 }}>
            {placing ? <Loader2 size={17} className="animate-spin" /> : "Place order"}
            {!placing && <span className="font-extrabold">· {money(total)}</span>}
          </motion.button>
          <p className="mt-2.5 text-center text-[11px] font-medium text-[var(--hb-ink3)]">
            Placing simulates the full kitchen → rider → doorstep lifecycle in real time.
          </p>
        </aside>
      </div>
    </div>
  );
}
