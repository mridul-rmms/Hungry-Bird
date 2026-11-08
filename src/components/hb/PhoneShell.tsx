"use client";
/* Hungry Bird — phone shell: 390×844 device frame, status bar, floating nav, steam wipe */
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Search, ShoppingBag, ReceiptText, User, Moon, SunMedium } from "lucide-react";
import { useHB, ScreenId } from "@/lib/store";
import { Toast, spring } from "./ui";
import { SCREENS } from "./registry";
import { Toolbar } from "./Toolbar";

/* ---------- iOS status bar ---------- */
function StatusBar({ dark }: { dark: boolean }) {
  const [now, setNow] = useState("");
  useEffect(() => {
    const f = () => setNow(new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: false }));
    f(); const t = setInterval(f, 30_000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className={`pointer-events-none absolute inset-x-0 top-0 z-40 flex h-[54px] items-center justify-between px-8 pt-2 text-[14px] font-semibold ${dark ? "text-white" : "text-[var(--hb-ink)]"}`}>
      <span className="tracking-wide">{now}</span>
      {/* dynamic island */}
      <div className="absolute left-1/2 top-2.5 h-[30px] w-[108px] -translate-x-1/2 rounded-full bg-black" />
      <span className="flex items-center gap-1.5">
        {/* signal */}
        <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="0.8" /><rect x="4.5" y="5" width="3" height="6" rx="0.8" /><rect x="9" y="2.5" width="3" height="8.5" rx="0.8" /><rect x="13.5" y="0" width="3" height="11" rx="0.8" /></svg>
        {/* wifi */}
        <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor"><path d="M8 9.6a1.3 1.3 0 1 0 0 1.4 1.3 1.3 0 0 0 0-1.4zM8 6.2c-1.3 0-2.5.5-3.4 1.4l1 1a3.4 3.4 0 0 1 4.8 0l1-1A4.8 4.8 0 0 0 8 6.2zM8 2.8A8.2 8.2 0 0 0 2.2 5.1l1 1A6.8 6.8 0 0 1 8 4.2c1.8 0 3.5.7 4.8 1.9l1-1A8.2 8.2 0 0 0 8 2.8z" transform="translate(0 -2.5)" /></svg>
        {/* battery */}
        <svg width="25" height="12" viewBox="0 0 25 12"><rect x="0.5" y="0.5" width="21" height="11" rx="3.5" fill="none" stroke="currentColor" opacity="0.4" /><rect x="2" y="2" width="15" height="8" rx="2" fill="currentColor" /><path d="M23 4v4a2.2 2.2 0 0 0 0-4z" fill="currentColor" opacity="0.4" /></svg>
      </span>
    </div>
  );
}

/* ---------- Floating bottom nav with morphing active pill ---------- */
const TABS = [
  { id: "home", icon: Home, label: "Home" },
  { id: "search", icon: Search, label: "Search" },
  { id: "cart", icon: ShoppingBag, label: "Plate" },
  { id: "orders", icon: ReceiptText, label: "Orders" },
  { id: "profile", icon: User, label: "You" },
] as const;

export function BottomNav() {
  const { tab, setTab, cartCount, screen } = useHB();
  if (["splash", "onboard", "login", "otp", "signup", "location", "success", "tracking", "rider", "design-system", "states"].includes(screen)) return null;
  return (
    <nav aria-label="Primary" className="absolute inset-x-0 bottom-0 z-40 flex justify-center pb-[22px]">
      <div className="hb-glass-strong relative flex items-center gap-1 rounded-[28px] px-2.5 py-2">
        {TABS.map((t) => {
          const active = tab === t.id;
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} aria-label={t.label} aria-current={active ? "page" : undefined} className="hb-tap hb-focus relative grid h-12 w-[58px] place-items-center rounded-[22px]">
              {active && (
                <motion.span layoutId="navPill" transition={spring} className="absolute inset-0 rounded-[22px]" style={{ background: "linear-gradient(135deg, var(--hb-accent-hi), var(--hb-accent))", boxShadow: "0 8px 22px -6px var(--hb-glow)" }} />
              )}
              <span className={`relative ${active ? "text-[var(--hb-accent-ink)]" : "text-[var(--hb-ink2)]"}`}>
                <Icon size={21} strokeWidth={active ? 2.5 : 2} fill={active ? "currentColor" : "none"} />
                {t.id === "cart" && cartCount > 0 && (
                  <span className="absolute -right-2 -top-1.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[#d6482b] px-1 text-[10px] font-bold text-white" style={{ animation: "hb-pop 0.35s cubic-bezier(0.34,1.56,0.64,1)" }}>{cartCount}</span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/* ---------- Steam wipe transition overlay ---------- */
function SteamWipe() {
  const { wipe } = useHB();
  const [done, setDone] = useState(0);
  const active = wipe > 0 && wipe > done;
  return (
    <AnimatePresence>
      {active && (
        <motion.div key={wipe} aria-hidden initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.28 }} onAnimationComplete={() => setDone(wipe)} className="pointer-events-none absolute inset-0 z-[65]">
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0.55), rgba(255,255,255,0.16))", backdropFilter: "blur(26px)", WebkitBackdropFilter: "blur(26px)", clipPath: "circle(0% at 50% 112%)", animation: "hb-wipe-in 0.5s cubic-bezier(0.5,0,0.3,1) forwards, hb-fadeout 0.28s ease 0.34s forwards" }} />
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className="hb-steam-puff" style={{ left: `${12 + i * 19}%`, bottom: 40, width: 22, height: 46, animationDelay: `${0.05 + i * 0.06}s`, animationDuration: "0.7s" }} />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- Home indicator ---------- */
function HomeIndicator({ dark }: { dark: boolean }) {
  return <div aria-hidden className={`pointer-events-none absolute bottom-2 left-1/2 z-50 h-[5px] w-[134px] -translate-x-1/2 rounded-full ${dark ? "bg-white/85" : "bg-black/70"}`} />;
}

/* ---------- Ambient desktop stage + device ---------- */
export default function PhoneShell() {
  const { screen, mode } = useHB();
  const dark = mode === "dark";
  const showStatusBar = !["splash"].includes(screen);
  const statusDark = dark || ["splash", "onboard", "restaurant", "dish", "success", "tracking"].includes(screen);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0d0a08] hb-grain" style={{ background: "radial-gradient(140% 110% at 50% 0%, #2a2015 0%, #120d09 55%, #0a0705 100%)" }}>
      {/* ambient glows */}
      <div aria-hidden className="pointer-events-none absolute -left-40 top-1/4 h-[480px] w-[480px] rounded-full opacity-25 blur-[120px]" style={{ background: "var(--hb-accent)" }} />
      <div aria-hidden className="pointer-events-none absolute -right-40 bottom-0 h-[420px] w-[420px] rounded-full opacity-15 blur-[120px]" style={{ background: "#c445c9" }} />

      <Toolbar />

      {/* device */}
      <div className="relative" style={{ filter: "drop-shadow(0 60px 120px rgba(0,0,0,0.6))" }}>
        {/* physical buttons */}
        <div aria-hidden className="absolute -left-[3px] top-[168px] h-[30px] w-[3px] rounded-l bg-[#3a332b]" />
        <div aria-hidden className="absolute -left-[3px] top-[220px] h-[52px] w-[3px] rounded-l bg-[#3a332b]" />
        <div aria-hidden className="absolute -left-[3px] top-[284px] h-[52px] w-[3px] rounded-l bg-[#3a332b]" />
        <div aria-hidden className="absolute -right-[3px] top-[240px] h-[76px] w-[3px] rounded-r bg-[#3a332b]" />
        <div className="relative h-[844px] w-[390px] rounded-[54px] p-[11px]" style={{ background: "linear-gradient(160deg, #4d453a, #1a1611 30%, #2e2820 70%, #0c0a08)" }}>
          <div className={`relative h-full w-full overflow-hidden rounded-[44px] ${dark ? "dark" : ""}`} data-part={undefined} style={{ background: "var(--hb-bg)", color: "var(--hb-ink)" }}>
            <ScreenViewport />
            {showStatusBar && <StatusBar dark={statusDark} />}
            <SteamWipe />
            <BottomNav />
            <Toast />
            <HomeIndicator dark={statusDark} />
          </div>
        </div>
      </div>

      {/* caption */}
      <p className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 text-[11px] tracking-[0.3em] text-white/25 uppercase">hungry bird · ui 1.0 · 390×844</p>
    </div>
  );
}

/* ---------- Screen viewport w/ transition ---------- */
function ScreenViewport() {
  const { screen, mode, activePart } = useHB();
  const Screen = SCREENS[screen] ?? SCREENS.home;
  return (
    <div className={`hb-grain h-full w-full ${mode === "dark" ? "dark" : ""}`} data-part={activePart} style={{ background: "var(--hb-bg)", color: "var(--hb-ink)" }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={screen} initial={{ opacity: 0, y: 14, scale: 0.992 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.996 }} transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }} className="h-full w-full">
          <Screen />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
