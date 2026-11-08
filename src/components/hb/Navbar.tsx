"use client";

import { useState } from "react";
import { Search, ShoppingBag, Menu, X, Receipt, Heart, Gift, User, ChevronLeft, Home } from "lucide-react";
import { useHB, cartCount } from "@/lib/store";

function Logo({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="hb-press flex items-center gap-2.5" aria-label="Hungry Bird home">
      <span className="grid h-9 w-9 place-items-center rounded-[13px] bg-[linear-gradient(135deg,var(--hb-ember),var(--hb-accent-hi))] text-white shadow-[0_8px_20px_-6px_var(--hb-glow)]">
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M3 12c4-7 12-9 18-7-1.5 3-4 5-7 5.5 3 .5 5 2 6 4.5-4.5 2-9.5 1.5-12.5-1L3 12z" fill="currentColor" />
          <circle cx="16.2" cy="8.2" r="1.15" fill="var(--hb-basil)" />
        </svg>
      </span>
      <span className="font-display text-[19px] font-semibold tracking-tight">
        Hungry&nbsp;Bird<span className="text-[var(--hb-accent)]">.</span>
      </span>
    </button>
  );
}

export default function Navbar({ ThemeToggle }: { ThemeToggle: () => React.ReactNode }) {
  const { go, view, back, setCartOpen, setAuthOpen, user, toast } = useHB();
  const cart = useHB((s) => s.cart);
  const [q, setQ] = useState("");
  const [drawer, setDrawer] = useState(false);
  const n = cartCount(cart);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    go({ name: "search", q: q.trim() });
  };

  const links = [
    { label: "Orders", icon: Receipt, run: () => go({ name: "orders" }) },
    { label: "Favorites", icon: Heart, run: () => go({ name: "favorites" }) },
    { label: "Rewards", icon: Gift, run: () => go({ name: "rewards" }) },
  ];

  return (
    <>
      <header className="relative z-[60]">
        <div className="hb-container pt-4 md:pt-5">
          <div className="hb-navpill flex h-16 items-center gap-3 px-4 md:h-[72px] md:px-6">
            {/* back (mobile) */}
            {view.name !== "home" && (
              <button onClick={back} className="hb-tap hb-press -ml-1 grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[var(--hb-line)] bg-[var(--hb-card)] md:hidden" aria-label="Go back">
                <ChevronLeft size={17} />
              </button>
            )}

            <Logo onClick={() => go({ name: "home" })} />

            {/* back — desktop (mobile has its own arrow above) */}
            {view.name !== "home" && (
              <button
                onClick={back}
                className="hb-press ml-1 hidden shrink-0 items-center gap-1 rounded-full border border-[var(--hb-line)] bg-[var(--hb-card)] py-2 pl-2.5 pr-3.5 text-[13px] font-bold text-[var(--hb-ink2)] transition-all hover:-translate-x-0.5 hover:text-[var(--hb-ink)] hover:shadow-[0_6px_18px_-8px_var(--hb-glow)] md:flex"
                aria-label="Go back to previous page"
              >
                <ChevronLeft size={15} className="text-[var(--hb-accent)]" />
                Back
              </button>
            )}

            {/* search — desktop */}
            <form onSubmit={submitSearch} className="relative ml-4 hidden max-w-md flex-1 md:block" role="search">
              <Search size={15} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--hb-ink3)]" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search dishes, restaurants, cuisines…"
                className="hb-input !rounded-full !py-2.5 !pl-11 !pr-4"
                aria-label="Search dishes and restaurants"
              />
            </form>

            <div className="ml-auto flex items-center gap-2">
              <nav className="mr-1 hidden items-center gap-1 lg:flex" aria-label="Sections">
                {links.map((l) => (
                  <button key={l.label} onClick={l.run} className="hb-press flex items-center gap-1.5 rounded-xl px-3 py-2 text-[13.5px] font-semibold text-[var(--hb-ink2)] hover:bg-[var(--hb-muted)] hover:text-[var(--hb-ink)]">
                    <l.icon size={15} />
                    {l.label}
                  </button>
                ))}
              </nav>

              <ThemeToggle />

              {/* cart */}
              <button onClick={() => setCartOpen(true)} className="hb-btn hb-btn-primary relative h-9 rounded-xl px-3.5 text-[13px]" aria-label={`Open cart with ${n} items`}>
                <ShoppingBag size={15} />
                <span className="hidden sm:inline">{n > 0 ? `${n} item${n > 1 ? "s" : ""}` : "Cart"}</span>
                {n > 0 && <span className="absolute -right-1.5 -top-1.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[var(--hb-ember)] px-1 text-[10px] font-black text-white ring-2 ring-[var(--hb-bg)]">{n}</span>}
              </button>

              {/* user */}
              {user ? (
                <button onClick={() => go({ name: "profile" })} className="hb-press grid h-9 w-9 place-items-center rounded-full bg-[var(--hb-ink)] text-[13px] font-black uppercase text-[var(--hb-bg)]" aria-label={`Profile of ${user.name}`} title={user.name}>
                  {user.name.slice(0, 2)}
                </button>
              ) : (
                <button onClick={() => setAuthOpen(true)} className="hb-btn hb-btn-ghost h-9 rounded-xl px-3.5 text-[13px]">
                  <User size={14} /> <span className="hidden sm:inline">Sign in</span>
                </button>
              )}

              {/* hamburger — mobile */}
              <button onClick={() => setDrawer(true)} className="hb-tap hb-press grid h-9 w-9 place-items-center rounded-xl border border-[var(--hb-line)] bg-[var(--hb-card)] lg:hidden" aria-label="Open menu">
                <Menu size={17} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* mobile drawer */}
      {drawer && (
        <div className="fixed inset-0 z-[95] lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" onClick={() => setDrawer(false)} />
          <div className="hb-glass-strong absolute right-3 top-3 w-64 rounded-3xl p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="hb-eyebrow text-[var(--hb-ink3)]">Menu</p>
              <button onClick={() => setDrawer(false)} className="hb-tap grid h-8 w-8 place-items-center rounded-lg" aria-label="Close menu"><X size={16} /></button>
            </div>
            {[
              { label: "Home", icon: Home, run: () => go({ name: "home" }) },
              ...links,
              { label: user ? "Profile" : "Sign in", icon: User, run: () => (user ? go({ name: "profile" }) : setAuthOpen(true)) },
            ].map((l) => (
              <button key={l.label} onClick={() => { l.run(); setDrawer(false); }} className="hb-press flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold hover:bg-[var(--hb-muted)]">
                <l.icon size={16} className="text-[var(--hb-accent)]" /> {l.label}
              </button>
            ))}
            <button
              onClick={() => { toast("Hungry Bird is a concept build — partner onboarding soon ✨"); setDrawer(false); }}
              className="hb-press mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-[var(--hb-ink2)] hover:bg-[var(--hb-muted)]"
            >
              🍽️ Add your restaurant
            </button>
          </div>
        </div>
      )}
    </>
  );
}
