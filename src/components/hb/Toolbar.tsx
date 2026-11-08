"use client";
/* Hungry Bird — floating design toolbar: theme mode, daypart, screen index, notes */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Sunrise, Sunset, Sparkles, Map, Wand2, ChevronDown } from "lucide-react";
import { useHB, ScreenId, Daypart } from "@/lib/store";

const SCREEN_INDEX: { id: ScreenId; label: string; group: string }[] = [
  { id: "splash", label: "Splash", group: "01 · Intro" },
  { id: "onboard", label: "Onboarding ×3", group: "01 · Intro" },
  { id: "login", label: "Login", group: "02 · Auth" },
  { id: "otp", label: "OTP", group: "02 · Auth" },
  { id: "signup", label: "Sign up", group: "02 · Auth" },
  { id: "location", label: "Location & addresses", group: "03 · Location" },
  { id: "home", label: "Home · Mood dial", group: "04 · Discover" },
  { id: "search", label: "Search & filters", group: "04 · Discover" },
  { id: "restaurant", label: "Restaurant page", group: "04 · Discover" },
  { id: "dish", label: "Dish detail", group: "04 · Discover" },
  { id: "cart", label: "Cart · plate view", group: "05 · Order" },
  { id: "checkout", label: "Checkout & payment", group: "05 · Order" },
  { id: "success", label: "Order placed", group: "05 · Order" },
  { id: "tracking", label: "Live tracking", group: "06 · Live" },
  { id: "rider", label: "Rider chat & call", group: "06 · Live" },
  { id: "history", label: "Order history", group: "07 · Account" },
  { id: "favorites", label: "Favorites", group: "07 · Account" },
  { id: "offers", label: "Offers & rewards", group: "07 · Account" },
  { id: "rate", label: "Rate & review", group: "07 · Account" },
  { id: "profile", label: "Profile & settings", group: "07 · Account" },
  { id: "notifications", label: "Notifications", group: "07 · Account" },
  { id: "states", label: "States gallery", group: "08 · System" },
  { id: "design-system", label: "Design system", group: "08 · System" },
];

const PARTS: { id: Daypart | "auto"; label: string; icon: React.ElementType }[] = [
  { id: "auto", label: "Auto (real time)", icon: Wand2 },
  { id: "dawn", label: "Dawn 5–11", icon: Sunrise },
  { id: "noon", label: "Noon 11–17", icon: Sun },
  { id: "dusk", label: "Dusk 17–22", icon: Sunset },
  { id: "midnight", label: "Midnight 22–5", icon: Sparkles },
];

export function Toolbar() {
  const { mode, setMode, part, setPart, navigate, screen } = useHB();
  const [open, setOpen] = useState<"screens" | "part" | null>(null);

  return (
    <div className="absolute right-6 top-6 z-[80] flex flex-col items-end gap-3">
      <div className="flex gap-2">
        {/* mode */}
        <button onClick={() => setMode(mode === "dark" ? "light" : "dark")} aria-label="Toggle light / dark" className="hb-press flex h-11 items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 text-[12px] font-semibold text-white/80 backdrop-blur hover:bg-white/10">
          {mode === "dark" ? <Moon size={15} /> : <Sun size={15} />} {mode}
        </button>
        {/* daypart */}
        <div className="relative">
          <button onClick={() => setOpen(open === "part" ? null : "part")} className="hb-press flex h-11 items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 text-[12px] font-semibold text-white/80 backdrop-blur hover:bg-white/10">
            <Wand2 size={15} /> daypart: {part} <ChevronDown size={13} />
          </button>
          <AnimatePresence>
            {open === "part" && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="absolute right-0 top-[52px] w-56 overflow-hidden rounded-2xl border border-white/10 bg-[#171310]/95 p-1.5 backdrop-blur-xl">
                {PARTS.map((p) => (
                  <button key={p.id} onClick={() => { setPart(p.id); setOpen(null); }} className={`flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-left text-[12.5px] ${part === p.id ? "bg-white/10 text-amber-300" : "text-white/70 hover:bg-white/5"}`}>
                    <p.icon size={15} /> {p.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* screens */}
        <div className="relative">
          <button onClick={() => setOpen(open === "screens" ? null : "screens")} className="hb-press flex h-11 items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 text-[12px] font-semibold text-white/80 backdrop-blur hover:bg-white/10">
            <Map size={15} /> 23 screens <ChevronDown size={13} />
          </button>
          <AnimatePresence>
            {open === "screens" && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="hb-scroll absolute right-0 top-[52px] max-h-[70vh] w-64 overflow-y-auto rounded-2xl border border-white/10 bg-[#171310]/95 p-1.5 backdrop-blur-xl">
                {SCREEN_INDEX.map((s) => (
                  <button key={s.id} onClick={() => { navigate(s.id); setOpen(null); }} className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2 text-left text-[12.5px] ${screen === s.id ? "bg-white/10 text-amber-300" : "text-white/70 hover:bg-white/5"}`}>
                    <span>{s.label}</span>
                    <span className="text-[10px] tracking-wider text-white/30">{s.group}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <p className="max-w-[300px] text-right text-[11px] leading-relaxed text-white/35">
        Every screen ships in <b className="text-white/60">light & dark</b> · the palette shifts with the <b className="text-white/60">daypart</b>. Try the golden flow: Home → Restaurant → Dish → Cart → Checkout → Tracking.
      </p>
    </div>
  );
}
