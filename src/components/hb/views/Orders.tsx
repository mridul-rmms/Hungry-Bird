"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, PackageOpen, Receipt } from "lucide-react";
import { useHB } from "@/lib/store";
import { api, money } from "@/lib/api";
import { useData } from "../data";
import { EmptyState, SkelCard, StatusPill } from "../ui";
import type { Order } from "@/lib/types";

export default function OrdersView() {
  const { go, user } = useHB();
  const { restaurants } = useData();
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    let alive = true;
    api.orders(user?.email)
      .then((d) => alive && setOrders(d.orders))
      .catch(() => alive && setOrders([]));
    return () => { alive = false; };
  }, [user?.email]);

  const imgFor = (o: Order) =>
    o.restaurantImage || restaurants.find((r) => r.name === o.restaurantName)?.image || "/img/plate-empty.jpg";

  return (
    <div className="hb-container max-w-3xl pb-16 pt-8">
      <p className="hb-eyebrow mb-1 text-[var(--hb-accent)]">Your history</p>
      <h1 className="hb-h1">Orders</h1>

      <div className="mt-8 space-y-4">
        {orders === null ? (
          Array.from({ length: 3 }).map((_, i) => <SkelCard key={i} h={120} />)
        ) : orders.length === 0 ? (
          <EmptyState
            icon={PackageOpen}
            title="No orders yet"
            sub="Your first Hungry Bird story starts with one tap."
            action={<button onClick={() => go({ name: "home" })} className="hb-btn hb-btn-primary h-10 rounded-xl px-4 text-sm">Find something delicious</button>}
          />
        ) : (
          orders.map((o, idx) => {
            const active = o.status !== "delivered";
            return (
              <motion.button
                key={o.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => go({ name: "tracking", code: o.code })}
                className={`hb-card flex w-full items-center gap-4 rounded-3xl p-4 text-left transition-shadow hover:shadow-lg ${active ? "ring-1 ring-[var(--hb-accent)]" : ""}`}
                aria-label={`Order ${o.code}, status ${o.status}`}
              >
                <div className="hb-imgwrap h-16 w-16 shrink-0 overflow-hidden rounded-2xl">
                  <img src={imgFor(o)} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate font-display text-[16px] font-semibold">{o.restaurantName}</p>
                    <StatusPill status={o.status} />
                  </div>
                  <p className="mt-0.5 truncate text-[12.5px] font-medium text-[var(--hb-ink2)]">
                    {o.items.map((i) => `${i.name} × ${i.qty}`).join(", ")}
                  </p>
                  <p className="mt-0.5 text-[12px] font-semibold text-[var(--hb-ink3)]">
                    {o.code} · {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · {money(o.total)}
                  </p>
                </div>
                <span className="flex shrink-0 items-center gap-1 text-[12.5px] font-bold text-[var(--hb-accent)]">
                  {active ? "Track" : "View"} <ChevronRight size={14} />
                </span>
              </motion.button>
            );
          })
        )}
        {orders !== null && orders.length > 0 && (
          <p className="flex items-center justify-center gap-1.5 pt-2 text-[12px] font-medium text-[var(--hb-ink3)]">
            <Receipt size={13} /> {user ? `Signed in as ${user.email}` : "Sign in to keep every order safe across devices"}
          </p>
        )}
      </div>
    </div>
  );
}
