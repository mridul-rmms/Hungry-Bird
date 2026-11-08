"use client";

import { Star, MapPin, Bike, Clock, type LucideIcon } from "lucide-react";
import type { OrderStatus } from "@/lib/types";

export const fmtK = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k` : String(n));

export function Stars({ value, count, className = "" }: { value: number; count?: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[13px] font-bold ${className}`} aria-label={`Rated ${value} of 5`}>
      <Star size={12} className="fill-[var(--hb-accent)] text-[var(--hb-accent)]" />
      {value.toFixed(1)}
      {count !== undefined && <span className="font-medium text-[var(--hb-ink3)]">({fmtK(count)})</span>}
    </span>
  );
}

export function VegDot({ veg, size = 14 }: { veg: boolean; size?: number }) {
  const c = veg ? "var(--hb-veg)" : "var(--hb-nonveg)";
  return (
    <span
      aria-label={veg ? "Vegetarian" : "Non-vegetarian"}
      style={{ width: size, height: size, borderColor: c }}
      className="inline-flex shrink-0 items-center justify-center rounded-[3px] border-[1.5px] bg-transparent"
    >
      <span style={{ width: size * 0.45, height: size * 0.45, background: c, borderRadius: veg ? "50%" : "20%" }} />
    </span>
  );
}

export function Spice({ level }: { level: number }) {
  if (!level) return null;
  return (
    <span className="inline-flex items-center gap-[1px] text-[10px]" aria-label={`Spice level ${level} of 3`}>
      {[1, 2, 3].map((i) => (
        <span key={i} style={{ opacity: i <= level ? 1 : 0.18 }}>🌶️</span>
      ))}
    </span>
  );
}

export function Meta({ eta, distance, fee }: { eta: string; distance: number; fee: number }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] font-medium text-[var(--hb-ink2)]">
      <span className="inline-flex items-center gap-1"><Clock size={12} /> {eta}</span>
      <span className="inline-flex items-center gap-1"><MapPin size={12} /> {distance} km</span>
      <span className="inline-flex items-center gap-1"><Bike size={12} /> {fee === 0 ? "Free" : `₹${fee}`}</span>
    </div>
  );
}

const STATUS_META: Record<OrderStatus, { label: string; cls: string }> = {
  placed: { label: "Order placed", cls: "bg-[var(--hb-muted)] text-[var(--hb-ink2)]" },
  confirmed: { label: "Confirmed", cls: "bg-[color-mix(in_srgb,var(--hb-basil)_14%,transparent)] text-[var(--hb-basil)]" },
  cooking: { label: "Cooking now", cls: "bg-[color-mix(in_srgb,var(--hb-saffron)_18%,transparent)] text-[color-mix(in_srgb,var(--hb-saffron)_70%,var(--hb-ink))]" },
  picked: { label: "On the way", cls: "bg-[color-mix(in_srgb,var(--hb-accent)_16%,transparent)] text-[var(--hb-accent)]" },
  delivered: { label: "Delivered", cls: "bg-[color-mix(in_srgb,var(--hb-veg)_15%,transparent)] text-[var(--hb-veg)]" },
};

export function StatusPill({ status, className = "" }: { status: OrderStatus; className?: string }) {
  const m = STATUS_META[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-bold ${m.cls} ${className}`}>
      {status !== "delivered" && <span className="relative flex h-1.5 w-1.5"><span className="absolute h-full w-full animate-ping rounded-full bg-current opacity-60" /><span className="h-1.5 w-1.5 rounded-full bg-current" /></span>}
      {m.label}
    </span>
  );
}

export function EmptyState({ icon: Icon, title, sub, action }: { icon: LucideIcon; title: string; sub: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-[var(--hb-line)] px-6 py-16 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[var(--hb-muted)]">
        <Icon size={24} className="text-[var(--hb-ink3)]" />
      </div>
      <div>
        <p className="hb-h3">{title}</p>
        <p className="mt-1 max-w-sm text-sm text-[var(--hb-ink2)]">{sub}</p>
      </div>
      {action}
    </div>
  );
}

export function SkelCard({ h = 260 }: { h?: number }) {
  return <div className="hb-skeleton w-full" style={{ height: h }} aria-hidden />;
}

export function SectionHead({ eyebrow, title, sub, right }: { eyebrow?: string; title: string; sub?: string; right?: ReactNode }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="hb-eyebrow mb-1.5 text-[var(--hb-accent)]">{eyebrow}</p>}
        <h2 className="hb-h2">{title}</h2>
        {sub && <p className="mt-1 text-sm text-[var(--hb-ink2)]">{sub}</p>}
      </div>
      {right}
    </div>
  );
}
