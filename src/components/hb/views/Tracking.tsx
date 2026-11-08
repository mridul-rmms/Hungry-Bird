"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Check, ChefHat, PackageCheck, Phone, ShoppingBag, Bike, Home as HomeIcon, Loader2 } from "lucide-react";
import { useHB } from "@/lib/store";
import { api, money } from "@/lib/api";
import { StatusPill } from "../ui";
import type { Order, OrderStatus } from "@/lib/types";

const STEPS: { id: OrderStatus; label: string; sub: string; icon: typeof ChefHat }[] = [
  { id: "placed", label: "Order placed", sub: "We’ve told the kitchen", icon: ShoppingBag },
  { id: "confirmed", label: "Kitchen confirmed", sub: "Your spot in the queue", icon: Check },
  { id: "cooking", label: "Cooking now", sub: "Fires are on", icon: ChefHat },
  { id: "picked", label: "Rider picked up", sub: "Flying to you", icon: Bike },
  { id: "delivered", label: "Delivered", sub: "Enjoy every bite", icon: HomeIcon },
];

const ORDER_INDEX: Record<OrderStatus, number> = { placed: 0, confirmed: 1, cooking: 2, picked: 3, delivered: 4 };

/* SVG route with a rider moving along it — sampled via getPointAtLength for reliability */
function RouteMap({ progress, done }: { progress: number; done: boolean }) {
  const pathRef = useRef<SVGPathElement>(null);
  const [pt, setPt] = useState({ x: 40, y: 210 });

  useEffect(() => {
    const p = pathRef.current;
    if (!p) return;
    const len = p.getTotalLength();
    const point = p.getPointAtLength(len * Math.min(1, Math.max(0, progress)));
    setPt({ x: point.x, y: point.y });
  }, [progress]);

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-[var(--hb-line)] bg-[var(--hb-bg2)]">
      <svg viewBox="0 0 600 260" className="h-auto w-full" role="img" aria-label="Live delivery route from kitchen to home">
        <defs>
          <linearGradient id="routeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--hb-basil)" />
            <stop offset="100%" stopColor="var(--hb-accent)" />
          </linearGradient>
          <radialGradient id="glowDot">
            <stop offset="0%" stopColor="var(--hb-accent)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--hb-accent)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* city blocks backdrop */}
        {[[40, 40, 90, 55], [170, 30, 70, 65], [420, 36, 110, 50], [60, 150, 70, 70], [250, 160, 90, 60], [470, 150, 90, 66], [180, 40, 30, 30]].map(([x, y, w, h], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} rx="10" fill="var(--hb-muted)" />
        ))}

        {/* route base + progress */}
        <path ref={pathRef} d="M 40 210 C 140 200 170 130 260 120 S 420 140 470 90 S 540 60 560 54" fill="none" stroke="var(--hb-line)" strokeWidth="5" strokeLinecap="round" />
        <path
          d="M 40 210 C 140 200 170 130 260 120 S 420 140 470 90 S 540 60 560 54"
          fill="none" stroke="url(#routeGrad)" strokeWidth="5" strokeLinecap="round" strokeDasharray="780"
          strokeDashoffset={780 - 780 * progress}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.22,1,.36,1)", filter: "drop-shadow(0 0 6px var(--hb-glow))" }}
        />

        {/* restaurant marker */}
        <g>
          <circle cx="40" cy="210" r="12" fill="var(--hb-basil)" />
          <text x="40" y="215" textAnchor="middle" fontSize="11" fill="#fff">🍳</text>
          <text x="40" y="240" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--hb-ink2)">Kitchen</text>
        </g>
        {/* home marker */}
        <g>
          <circle cx="560" cy="54" r="12" fill={done ? "var(--hb-veg)" : "var(--hb-ink)"} />
          <text x="560" y="59" textAnchor="middle" fontSize="11" fill="#fff">🏠</text>
          <text x="560" y="34" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--hb-ink2)">You</text>
        </g>

        {/* rider on route — position sampled from the path with a smooth CSS transform transition */}
        <g
          style={{
            transform: `translate(${pt.x}px, ${pt.y}px)`,
            transition: "transform 1.2s cubic-bezier(.22,1,.36,1)",
          }}
        >
          <circle r="26" fill="url(#glowDot)" />
          <circle r="13" fill="var(--hb-accent)" stroke="var(--hb-card)" strokeWidth="3" />
          <text y="4.5" textAnchor="middle" fontSize="12">🛵</text>
        </g>
      </svg>

      {/* ETA badge */}
      {!done && (
        <div className="absolute right-4 top-4 rounded-2xl bg-[var(--hb-card)]/90 px-3.5 py-2 text-center shadow-lg backdrop-blur">
          <p className="font-display text-[17px] font-bold text-[var(--hb-ember)]" aria-live="polite">{Math.max(1, Math.round((1 - progress) * 32))} min</p>
          <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--hb-ink3)]">arriving</p>
        </div>
      )}
      {done && (
        <div className="absolute inset-x-0 bottom-0 h-1.5 bg-[var(--hb-veg)]">
          <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} transition={{ duration: 1 }} className="h-full w-full bg-[var(--hb-veg)]" />
        </div>
      )}
    </div>
  );
}

export default function TrackingView() {
  const view = useHB((s) => s.view);
  const code = view.name === "tracking" ? view.code : "";
  const { go } = useHB();
  const [order, setOrder] = useState<Order | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (!code) return;
    let alive = true;
    const load = () =>
      api.order(code)
        .then((d) => { if (alive) { setOrder(d.order); setMissing(false); } })
        .catch(() => alive && setMissing(true));
    load();
    const t = setInterval(load, 4000);
    return () => { alive = false; clearInterval(t); };
  }, [code]);

  const stepIdx = order ? ORDER_INDEX[order.status] : 0;
  const progress = order ? Math.min(1, Math.max(0.04, stepIdx / 4)) : 0.04;

  /* minutes left, decaying over the order lifetime */
  const minsLeft = useMemo(() => {
    if (!order) return 0;
    if (order.status === "delivered") return 0;
    const elapsed = (Date.now() - new Date(order.createdAt).getTime()) / 60000;
    return Math.max(1, Math.round(order.eta - elapsed));
  }, [order]);

  if (missing) {
    return (
      <div className="hb-container max-w-xl pt-16 text-center">
        <p className="hb-h2">We lost sight of that order 👀</p>
        <p className="mt-2 text-sm text-[var(--hb-ink2)]">Order {code} doesn’t exist (maybe an old demo code).</p>
        <button onClick={() => go({ name: "orders" })} className="hb-btn hb-btn-primary mt-6 h-11 rounded-2xl px-5">Back to orders</button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="grid place-items-center py-32">
        <Loader2 size={26} className="animate-spin text-[var(--hb-accent)]" />
      </div>
    );
  }

  const done = order.status === "delivered";

  return (
    <div className="hb-container max-w-3xl pb-16 pt-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="hb-eyebrow mb-1 text-[var(--hb-accent)]">Live tracking · {order.code}</p>
          <h1 className="hb-h1">
            {done ? "Delivered — enjoy! 🎉" : order.status === "picked" ? "Your food is on the way" : "The kitchen is on it"}
          </h1>
        </div>
        <StatusPill status={order.status} className="!text-[12.5px] !px-3 !py-1.5" />
      </div>

      <div className="mt-6">
        <RouteMap progress={progress} done={done} />
      </div>

      {/* restaurant strip */}
      <div className="hb-card mt-5 flex items-center gap-3.5 rounded-3xl p-4">
        <div className="hb-imgwrap h-14 w-14 shrink-0 overflow-hidden rounded-2xl">
          <img src={order.restaurantImage} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-[16px] font-semibold">{order.restaurantName}</p>
          <p className="truncate text-[12.5px] font-medium text-[var(--hb-ink2)]">{order.items.map((i) => `${i.name} × ${i.qty}`).join(", ")}</p>
        </div>
        <p className="shrink-0 font-display text-[17px] font-bold">{money(order.total)}</p>
      </div>

      {/* timeline */}
      <ol className="relative mt-6 space-y-0">
        {STEPS.map((s, i) => {
          const reached = i <= stepIdx;
          const current = i === stepIdx && !done;
          return (
            <li key={s.id} className="relative flex gap-4 pb-7 last:pb-0">
              {/* connector */}
              {i < STEPS.length - 1 && (
                <span className={`absolute left-[21px] top-11 h-[calc(100%-40px)] w-[3px] rounded-full ${i < stepIdx ? "bg-[var(--hb-basil)]" : "bg-[var(--hb-line)]"}`} aria-hidden />
              )}
              <span className={`relative z-10 grid h-[44px] w-[44px] shrink-0 place-items-center rounded-2xl border transition-colors ${reached ? "border-transparent bg-[var(--hb-basil)] text-white shadow-[0_6px_18px_-6px_rgba(12,107,88,.55)]" : "border-[var(--hb-line)] bg-[var(--hb-card)] text-[var(--hb-ink3)]"}`}>
                <s.icon size={18} />
                {current && <span className="absolute inset-0 animate-ping rounded-2xl bg-[var(--hb-basil)] opacity-25" />}
              </span>
              <div className="pt-1">
                <p className={`text-[15px] font-bold ${reached ? "" : "text-[var(--hb-ink3)]"}`}>{s.label}{current && <span className="ml-2 rounded-full bg-[color-mix(in_srgb,var(--hb-basil)_14%,transparent)] px-2 py-0.5 text-[10.5px] font-black uppercase text-[var(--hb-basil)]">now</span>}</p>
                <p className="text-[12.5px] font-medium text-[var(--hb-ink2)]">{s.sub}</p>
                {current && !done && minsLeft > 0 && (
                  <p className="mt-1 text-[12px] font-bold text-[var(--hb-accent)]">About {minsLeft} min away · rider Tanmay · KA-01-HB-2209</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      {/* actions */}
      <div className="mt-6 flex flex-wrap gap-3">
        <button onClick={() => go({ name: "orders" })} className="hb-btn hb-btn-ghost h-11 rounded-2xl px-5 text-sm">All orders</button>
        <button
          onClick={() => useHB.getState().toast("Rider Tanmay: “On my way, see you in a bit! 🛵”")}
          className="hb-btn hb-btn-ghost h-11 rounded-2xl px-5 text-sm"
        >
          <Phone size={15} /> Call rider
        </button>
        {done && (
          <button onClick={() => go({ name: "rewards" })} className="hb-btn hb-btn-primary h-11 rounded-2xl px-5 text-sm">
            <PackageCheck size={15} /> Rate & grab your reward
          </button>
        )}
      </div>
    </div>
  );
}
