"use client";

import { useEffect, useState } from "react";
import { ThemeProvider, useTheme } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import { Home, Search, ShoppingBag, Receipt, Moon, Sun, X, Bike } from "lucide-react";
import { useHB, cartCount } from "@/lib/store";
import type { View } from "@/lib/types";
import { DataProvider } from "./data";
import Navbar from "./Navbar";
import Footer from "./Footer";
import HomeView from "./views/Home";
import SearchView from "./views/Search";
import RestaurantView from "./views/Restaurant";
import CheckoutView from "./views/Checkout";
import OrdersView from "./views/Orders";
import TrackingView from "./views/Tracking";
import FavoritesView from "./views/Favorites";
import RewardsView from "./views/Rewards";
import ProfileView from "./views/Profile";
import CartDrawer from "./CartDrawer";
import DishModal from "./DishModal";
import AuthModal from "./AuthModal";

/* ---- time-of-day atmosphere (signature: the app sky shifts with your day) ---- */
function Daypart() {
  useEffect(() => {
    const apply = () => {
      const h = new Date().getHours();
      const part = h >= 5 && h < 10 ? "dawn" : h >= 10 && h < 16 ? "noon" : h >= 16 && h < 20 ? "dusk" : "midnight";
      document.documentElement.dataset.part = part;
    };
    apply();
    const t = setInterval(apply, 60_000);
    return () => clearInterval(t);
  }, []);
  return null;
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="hb-tap hb-press grid h-9 w-9 place-items-center rounded-xl border border-[var(--hb-line)] bg-[var(--hb-card)]"
      aria-label="Toggle light and dark mode"
    >
      <Sun size={16} className="hidden dark:block" />
      <Moon size={16} className="block dark:hidden" />
    </button>
  );
}

function Toasts() {
  const { toasts, dismissToast } = useHB();
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-20 z-[90] flex flex-col items-center gap-2 px-4 md:bottom-8">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ y: 24, opacity: 0, scale: 0.94 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 12, opacity: 0, scale: 0.96 }}
            className="hb-glass-strong pointer-events-auto flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold shadow-xl"
          >
            <span>{t.msg}</span>
            {t.action && (
              <button
                onClick={() => { t.action?.run(); dismissToast(t.id); }}
                className="hb-press rounded-lg bg-[var(--hb-accent)] px-2.5 py-1 text-xs font-bold text-[var(--hb-accent-ink)]"
              >
                {t.action.label}
              </button>
            )}
            <button onClick={() => dismissToast(t.id)} aria-label="Dismiss" className="text-[var(--hb-ink3)] hover:text-[var(--hb-ink)]">
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* floating pill that tracks your active order anywhere in the app */
function ActiveOrderPill() {
  const { view, go } = useHB();
  const [code, setCode] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    const check = () => {
      const raw = localStorage.getItem("hb-last-order");
      if (!raw) return setCode(null);
      try {
        const { code: c, until } = JSON.parse(raw) as { code: string; until: number };
        if (Date.now() > until) { localStorage.removeItem("hb-last-order"); return setCode(null); }
        if (alive) setCode(c);
      } catch { setCode(null); }
    };
    check();
    const t = setInterval(check, 10_000);
    return () => { alive = false; clearInterval(t); };
  }, []);

  if (!code || (view.name === "tracking" && view.code === code)) return null;
  return (
    <motion.button
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      onClick={() => go({ name: "tracking", code })}
      className="hb-btn hb-btn-basil fixed bottom-24 right-4 z-[80] px-4 py-3 text-sm shadow-2xl md:bottom-8 md:right-8"
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute h-full w-full animate-ping rounded-full bg-white opacity-70" />
        <span className="h-2 w-2 rounded-full bg-white" />
      </span>
      <Bike size={15} />
      Track order {code}
    </motion.button>
  );
}

/* Esc closes the top-most overlay (auth → dish → cart) */
function EscClose() {
  const { cartOpen, setCartOpen, authOpen, setAuthOpen, dishModal, closeDish } = useHB();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (authOpen) setAuthOpen(false);
      else if (dishModal) closeDish();
      else if (cartOpen) setCartOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [authOpen, cartOpen, dishModal, setAuthOpen, closeDish, setCartOpen]);
  return null;
}

const TABS: { view: View; icon: typeof Home; label: string }[] = [
  { view: { name: "home" }, icon: Home, label: "Home" },
  { view: { name: "search" }, icon: Search, label: "Search" },
  { view: { name: "orders" }, icon: Receipt, label: "Orders" },
];

function MobileTabs() {
  const { view, go, setCartOpen } = useHB();
  const cart = useHB((s) => s.cart);
  const n = cartCount(cart);
  return (
    <nav className="hb-glass-strong fixed inset-x-3 bottom-3 z-[70] flex items-center justify-around rounded-3xl px-2 py-2 md:hidden" aria-label="Primary">
      {TABS.map((t) => {
        const on = view.name === t.view.name;
        return (
          <button key={t.label} onClick={() => go(t.view)} className={`hb-press flex flex-1 flex-col items-center gap-1 rounded-2xl py-2 text-[10.5px] font-bold ${on ? "bg-[var(--hb-muted)] text-[var(--hb-accent)]" : "text-[var(--hb-ink3)]"}`} aria-current={on ? "page" : undefined}>
            <t.icon size={19} />
            {t.label}
          </button>
        );
      })}
      <button onClick={() => setCartOpen(true)} className="hb-press relative flex flex-1 flex-col items-center gap-1 rounded-2xl py-2 text-[10.5px] font-bold text-[var(--hb-ink3)]" aria-label={`Open cart, ${n} items`}>
        <ShoppingBag size={19} />
        Cart
        {n > 0 && (
          <span className="hb-anim-breathe absolute right-3 top-1 grid h-4.5 min-w-4.5 place-items-center rounded-full bg-[var(--hb-ember)] px-1 text-[9.5px] font-black text-white" style={{ height: 18, minWidth: 18 }}>
            {n}
          </span>
        )}
      </button>
    </nav>
  );
}

function CurrentView() {
  const view = useHB((s) => s.view);
  const map: Record<string, React.ReactNode> = {
    home: <HomeView />,
    search: <SearchView />,
    restaurant: <RestaurantView />,
    checkout: <CheckoutView />,
    orders: <OrdersView />,
    tracking: <TrackingView />,
    favorites: <FavoritesView />,
    rewards: <RewardsView />,
    profile: <ProfileView />,
  };
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={view.name + ("slug" in view ? view.slug : "") + ("code" in view ? view.code : "")}
        initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      >
        {map[view.name]}
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <DataProvider>
        <Daypart />
        <div className="hb-grain flex min-h-screen flex-col">
          <Navbar ThemeToggle={ThemeToggle} />
          <main className="flex-1 pb-24 md:pb-10">
            <CurrentView />
          </main>
          <Footer />
          <CartDrawer />
          <DishModal />
          <AuthModal />
          <Toasts />
          <ActiveOrderPill />
          <EscClose />
          <MobileTabs />
        </div>
      </DataProvider>
    </ThemeProvider>
  );
}
