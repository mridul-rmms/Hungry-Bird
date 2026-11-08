"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Gift, Sparkles } from "lucide-react";
import { useHB } from "@/lib/store";

const CARDS = [
  { code: "WELCOME50", title: "₹50 off", sub: "your next order above ₹199", emoji: "🎁", bg: "linear-gradient(135deg,var(--hb-basil),#0a4f42)" },
  { code: "HUNGRY20", title: "20% off", sub: "up to ₹120 · above ₹299", emoji: "🔥", bg: "linear-gradient(135deg,var(--hb-ember),#b23410)" },
  { code: "FREEDEL", title: "Free delivery", sub: "on orders above ₹149", emoji: "🛵", bg: "linear-gradient(135deg,var(--hb-saffron),#c97f14)" },
];

const STAMPS = ["☕", "🍜", "🍕", "🥗", "🍣", "🍰"];

export default function RewardsView() {
  const { toast, go } = useHB();
  const [revealed, setRevealed] = useState<Set<number>>(new Set());

  const reveal = (i: number) => {
    setRevealed((s) => new Set(s).add(i));
    if (navigator.vibrate) navigator.vibrate(12);
  };

  const copy = (code: string) => {
    navigator.clipboard?.writeText(code).catch(() => undefined);
    toast(`${code} copied — see you at checkout`);
  };

  return (
    <div className="hb-container max-w-4xl pb-16 pt-8">
      <p className="hb-eyebrow mb-1 flex items-center gap-2 text-[var(--hb-accent)]"><Sparkles size={13} /> Bird Club</p>
      <h1 className="hb-h1">Rewards</h1>
      <p className="mt-2 max-w-lg text-[14.5px] text-[var(--hb-ink2)]">
        Every order earns stamps. Scratch a card, copy a code, feast on the savings.
      </p>

      {/* stamps */}
      <section className="hb-card mt-8 rounded-3xl p-5" aria-label="Loyalty stamps">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[14px] font-bold">Your flight log</p>
            <p className="text-[12.5px] font-medium text-[var(--hb-ink2)]">2 of 6 stamps — next card unlocks at 6</p>
          </div>
          <p className="font-display text-[24px] font-bold text-[var(--hb-accent)]">120 <span className="text-[13px] font-semibold text-[var(--hb-ink3)]">wings pts</span></p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2.5">
          {STAMPS.map((s, i) => (
            <span
              key={i}
              className={`grid h-12 w-12 place-items-center rounded-2xl text-[20px] ${i < 2 ? "bg-[color-mix(in_srgb,var(--hb-basil)_14%,transparent)] ring-2 ring-[var(--hb-basil)]" : "bg-[var(--hb-muted)] opacity-40 grayscale"}`}
              aria-label={i < 2 ? "Stamp earned" : "Stamp locked"}
            >
              {i < 2 ? s : "🔒"}
            </span>
          ))}
        </div>
      </section>

      {/* scratch cards */}
      <div className="mt-6 grid gap-5 sm:grid-cols-3" aria-label="Scratch cards">
        {CARDS.map((c, i) => {
          const open = revealed.has(i);
          return (
            <motion.div key={c.code} whileHover={{ y: -4 }} className="relative h-48 cursor-pointer overflow-hidden rounded-3xl shadow-lg" style={{ background: c.bg }} onClick={() => !open && reveal(i)} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && reveal(i)} aria-label={`Scratch card: ${c.title}`}>
              {/* shimmering foil cover */}
              <motion.div
                animate={open ? { scale: 1.6, opacity: 0, rotate: 12 } : { scale: 1, opacity: 1 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="absolute inset-0 z-10 grid place-items-center bg-[linear-gradient(120deg,rgba(255,255,255,.14),rgba(255,255,255,.04)_30%,rgba(255,255,255,.18))] backdrop-blur-[2px]"
              >
                <div className="text-center">
                  <p className="text-[34px]">{c.emoji}</p>
                  <p className="mt-1 text-[11px] font-black uppercase tracking-[0.2em] text-white/85">tap to scratch</p>
                </div>
              </motion.div>
              {/* reward */}
              <div className="flex h-full flex-col items-center justify-center gap-1.5 p-5 text-center text-white">
                <p className="font-display text-[26px] font-bold">{c.title}</p>
                <p className="text-[12.5px] font-medium text-white/80">{c.sub}</p>
                <button
                  onClick={(e) => { e.stopPropagation(); copy(c.code); }}
                  className={`hb-btn mt-3 gap-1.5 rounded-xl px-3.5 py-2 text-[12.5px] font-black transition-opacity ${open ? "bg-white/20 opacity-100" : "pointer-events-none opacity-0"}`}
                >
                  <Copy size={13} /> {c.code}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <button onClick={() => go({ name: "home" })} className="hb-btn hb-btn-ghost mt-8 h-11 rounded-2xl px-5 text-sm">
        <Gift size={15} /> Earn more — start an order
      </button>
    </div>
  );
}
