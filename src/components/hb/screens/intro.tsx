"use client";
/* Hungry Bird — intro: splash, onboarding ×3, login, OTP, sign-up, location */
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, MapPin, Navigation2, Check, Home as HomeIcon, Building2, Dumbbell, Plus, ShieldCheck, Phone } from "lucide-react";
import { useHB } from "@/lib/store";
import { SoftBtn, IconBtn, Steam, Parallax, spring } from "../ui";

/* ================= SPLASH — logo mark rises, dish glows behind ================= */
export function Splash() {
  const { navigate } = useHB();
  useEffect(() => {
    const t = setTimeout(() => navigate("onboard"), 2600);
    return () => clearTimeout(t);
  }, [navigate]);
  return (
    <div className="hb-vignette relative flex h-full flex-col items-center justify-end overflow-hidden" style={{ background: "radial-gradient(120% 85% at 50% 20%, #2c1f10 0%, #16100a 60%, #0c0805 100%)" }}>
      {/* glowing dish */}
      <motion.div initial={{ scale: 0.6, opacity: 0, y: 60 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.2 }} className="absolute left-1/2 top-[26%] -translate-x-1/2">
        <Parallax intensity={14}>
          <div className="hb-anim-float relative">
            <img src="/img/hero-butter.jpg" alt="Butter chicken hero dish" className="h-[290px] w-[290px] rounded-full object-cover" style={{ boxShadow: "0 60px 120px -20px rgba(232,155,47,0.45), 0 20px 50px rgba(0,0,0,0.6)" }} />
            <Steam className="-top-16 left-1/2 -translate-x-1/2" count={4} />
          </div>
        </Parallax>
      </motion.div>
      {/* wordmark */}
      <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7, ...spring }} className="relative z-10 mb-24 text-center">
        <div className="mb-3 flex items-center justify-center gap-2.5">
          <svg width="34" height="34" viewBox="0 0 34 34" fill="none"><path d="M17 2 L30 14 L24 14 L24 30 L10 30 L10 14 L4 14 Z" fill="url(#g)" /><path d="M17 9c3 1.5 5 4 5 7a5 5 0 0 1-10 0c0-3 2-5.5 5-7z" fill="#1b1206" opacity="0.85" /><defs><linearGradient id="g" x1="0" y1="0" x2="34" y2="34"><stop stopColor="#ffc45e" /><stop offset="1" stopColor="#d9821f" /></linearGradient></defs></svg>
          <h1 className="font-display text-[40px] font-semibold leading-none text-[#f4ecdf]" style={{ letterSpacing: "-0.02em" }}>hungry<span className="hb-serif-i" style={{ color: "#f0a52e" }}> bird</span></h1>
        </div>
        <p className="text-[13px] tracking-[0.22em] text-[#b3a48e] uppercase">food that flies to you</p>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }} className="mb-10 text-[11px] text-[#7d6f5b]">next · onboarding</motion.div>
    </div>
  );
}

/* ================= ONBOARDING — 3 animated screens ================= */
const SLIDES = [
  {
    img: "/img/hero-butter.jpg", kicker: "Welcome to hungry",
    title: "Food you can\nfeel before you taste",
    body: "Macro-lit dishes, real steam, real texture. Scroll slow — get hungry fast.",
    cta: "Continue",
  },
  {
    img: "/img/dish-ramen.jpg", kicker: "Mood-first discovery",
    title: "Tell us your mood.\nWe set the table.",
    body: "A living dial — comfort, spicy, late-night, healthy — reshapes everything you see.",
    cta: "Continue",
  },
  {
    img: "/img/dish-biryani.jpg", kicker: "From fire to door",
    title: "Watch it travel,\nglow by glow",
    body: "A cinematic map, a pulsing ETA, a rider you can talk to. Dinner as theatre.",
    cta: "Start ordering",
  },
];

export function Onboard() {
  const { navigate } = useHB();
  const [i, setI] = useState(0);
  const s = SLIDES[i];
  const next = () => (i < 2 ? setI(i + 1) : navigate("login"));
  return (
    <div className="relative h-full overflow-hidden bg-[#100b07]">
      {/* full-bleed dish imagery with ken-burns */}
      <AnimatePresence mode="wait">
        <motion.div key={i} initial={{ opacity: 0, scale: 1.12 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.04 }} transition={{ duration: 0.65, ease: [0.32, 0.72, 0, 1] }} className="absolute inset-0">
          <img src={s.img} alt="" className="h-full w-full object-cover" style={{ animation: "hb-breathe 12s ease-in-out infinite" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(12,8,5,0.25) 0%, rgba(12,8,5,0.05) 35%, rgba(12,8,5,0.88) 78%, #0c0805 100%)" }} />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 flex h-full flex-col justify-end px-7 pb-12">
        {/* progress dots */}
        <div className="mb-6 flex gap-2">
          {SLIDES.map((_, d) => (
            <button key={d} onClick={() => setI(d)} aria-label={`Slide ${d + 1}`} className="h-1.5 overflow-hidden rounded-full transition-all duration-300" style={{ width: d === i ? 26 : 7, background: d === i ? "var(--hb-accent)" : "rgba(255,255,255,0.28)" }} />
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={i} initial={{ y: 26, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -18, opacity: 0 }} transition={{ ...spring, damping: 26 }}>
            <p className="hb-eyebrow mb-3" style={{ color: "#f0a52e" }}>{s.kicker}</p>
            <h2 className="hb-h1 whitespace-pre-line text-[32px] text-[#f7f1e6]">{s.title}</h2>
            <p className="mt-3 max-w-[300px] text-[14.5px] leading-relaxed text-[#c9bda9]">{s.body}</p>
          </motion.div>
        </AnimatePresence>
        <div className="mt-8 flex items-center gap-3">
          <SoftBtn onClick={next} className="h-14 flex-1 rounded-[20px] text-[16px]">
            {s.cta} <ChevronRight size={18} />
          </SoftBtn>
          {i < 2 && <button onClick={() => navigate("login")} className="hb-tap hb-focus text-[13px] font-semibold text-white/60">Skip</button>}
        </div>
      </div>
    </div>
  );
}

/* ================= LOGIN — one-thumb, glass over hero ================= */
export function Login() {
  const { navigate } = useHB();
  const [phone, setPhone] = useState("");
  const valid = phone.length === 10;
  return (
    <div className="relative h-full overflow-hidden">
      <img src="/img/dish-coldbrew.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,7,5,0.3), rgba(10,7,5,0.82) 60%, #0d0906 100%)" }} />
      <div className="relative z-10 flex h-full flex-col justify-end px-7 pb-10">
        <div className="mb-8 flex items-center gap-2.5">
          <svg width="26" height="26" viewBox="0 0 34 34" fill="none"><path d="M17 2 L30 14 L24 14 L24 30 L10 30 L10 14 L4 14 Z" fill="#f0a52e" /><path d="M17 9c3 1.5 5 4 5 7a5 5 0 0 1-10 0c0-3 2-5.5 5-7z" fill="#1b1206" /></svg>
          <span className="font-display text-[22px] font-semibold text-[#f7f1e6]">hungry bird</span>
        </div>
        <h2 className="hb-h1 text-[30px] text-[#f7f1e6]">Your table<br /><span className="hb-serif-i" style={{ color: "#f0a52e" }}>is waiting.</span></h2>
        <p className="mt-2 text-[14px] text-[#c9bda9]">Enter your number — we&apos;ll fly in a code.</p>
        <div className="mt-7 flex items-center gap-3 rounded-[22px] border border-white/12 bg-white/8 p-2.5 pl-4 backdrop-blur-xl">
          <span className="flex items-center gap-2 text-[15px] font-semibold text-white/90"><Phone size={16} style={{ color: "#f0a52e" }} /> +91</span>
          <span className="h-6 w-px bg-white/15" />
          <input inputMode="numeric" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="98765 43210" aria-label="Phone number" className="w-full bg-transparent text-[16px] font-medium tracking-wide text-white placeholder:text-white/35 focus:outline-none" />
        </div>
        <SoftBtn disabled={!valid} onClick={() => navigate("otp")} className="mt-4 h-14 w-full rounded-[20px] text-[16px] opacity-100" style={!valid ? { filter: "grayscale(0.4) brightness(0.75)" } : {}}>Send code</SoftBtn>
        <div className="mt-5 flex items-start gap-2 text-[11.5px] leading-relaxed text-white/45">
          <ShieldCheck size={14} className="mt-0.5 shrink-0" style={{ color: "#f0a52e" }} />
          By continuing you agree to our Terms. We never share your number. Ever.
        </div>
      </div>
    </div>
  );
}

/* ================= OTP — 4 glowing cells ================= */
export function Otp() {
  const { navigate } = useHB();
  const [digits, setDigits] = useState<string[]>(["", "", "", ""]);
  const [focus, setFocus] = useState(0);
  const full = digits.every((d) => d !== "");
  useEffect(() => {
    if (!full) return;
    const t = setTimeout(() => navigate("signup"), 650);
    return () => clearTimeout(t);
  }, [full, navigate]);
  const setDigit = (i: number, v: string) => {
    const d = v.replace(/\D/g, "").slice(-1);
    setDigits((a) => a.map((x, j) => (j === i ? d : x)));
    if (d && i < 3) setFocus(i + 1);
  };
  return (
    <div className="relative flex h-full flex-col px-7" style={{ background: "var(--hb-bg)" }}>
      <div className="mt-24"><BackArrowless /></div>
      <h2 className="hb-h1 mt-2 text-[30px]">Code check 🔐</h2>
      <p className="mt-2 text-[14px] text-[var(--hb-ink2)]">Sent to +91 98765 43210 · <button onClick={() => navigate("login")} className="font-semibold text-[var(--hb-accent)]">change</button></p>
      <div className="mt-9 flex gap-3.5">
        {digits.map((d, i) => (
          <motion.div key={i} animate={{ scale: focus === i ? 1.06 : 1 }} transition={spring} className="grid h-16 flex-1 place-items-center rounded-[18px]" style={{ background: "var(--hb-card)", boxShadow: d ? "var(--hb-shadow), 0 0 0 2px var(--hb-accent)" : "var(--hb-neu)" }} onClick={() => setFocus(i)}>
            <span className="font-display text-[26px] font-semibold" style={{ color: d ? "var(--hb-ink)" : "var(--hb-ink3)" }}>{d || "·"}</span>
            <input value={d} onChange={(e) => setDigit(i, e.target.value)} onFocus={() => setFocus(i)} inputMode="numeric" maxLength={1} aria-label={`Digit ${i + 1}`} className="absolute h-0 w-0 opacity-0" />
          </motion.div>
        ))}
      </div>
      <p className="mt-6 text-[13px] text-[var(--hb-ink2)]">Resend in 0:24 · <span className="text-[var(--hb-accent)]">autofilled in demo</span></p>
      <div className="mt-auto pb-12">
        <SoftBtn disabled={!full} onClick={() => navigate("signup")} className="h-14 w-full rounded-[20px] text-[16px]" style={!full ? { filter: "grayscale(0.4) brightness(0.75)" } : {}}>{full ? "Verifying…" : "Verify & continue"}</SoftBtn>
      </div>
    </div>
  );
}
function BackArrowless() { return <p className="hb-eyebrow text-[var(--hb-accent)]">STEP 2 OF 3</p>; }

/* ================= SIGN-UP — name + done ================= */
export function Signup() {
  const { navigate } = useHB();
  const [name, setName] = useState("");
  return (
    <div className="relative flex h-full flex-col px-7" style={{ background: "var(--hb-bg)" }}>
      <div className="mt-24"><p className="hb-eyebrow text-[var(--hb-accent)]">STEP 3 OF 3</p></div>
      <h2 className="hb-h1 mt-2 text-[30px]">What should the<br /><span className="hb-serif-i" style={{ color: "var(--hb-accent)" }}>chef</span> call you?</h2>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your first name" aria-label="First name" className="mt-9 w-full rounded-[20px] px-5 py-4.5 text-[17px] font-medium placeholder:text-[var(--hb-ink3)] focus:outline-none" style={{ background: "var(--hb-card)", boxShadow: "var(--hb-neu)", paddingTop: 18, paddingBottom: 18 }} />
      <div className="mt-auto pb-12">
        <SoftBtn disabled={!name.trim()} onClick={() => navigate("location")} className="h-14 w-full rounded-[20px] text-[16px]" style={!name.trim() ? { filter: "grayscale(0.4) brightness(0.75)" } : {}}>Set my table 🍽️</SoftBtn>
      </div>
    </div>
  );
}

/* ================= LOCATION — map + address cards ================= */
export function LocationScreen() {
  const { addresses, activeAddr, setActiveAddr, navigate } = useHB();
  return (
    <div className="relative h-full overflow-hidden" style={{ background: "var(--hb-bg)" }}>
      {/* stylized map */}
      <div className="relative h-[46%]">
        <svg viewBox="0 0 390 380" className="h-full w-full" style={{ background: "var(--hb-bg2)" }} aria-hidden>
          <g stroke="var(--hb-line)" strokeWidth="2">
            {[60, 130, 200, 270, 340].map((y) => <line key={y} x1="0" y1={y} x2="390" y2={y} />)}
            {[50, 140, 230, 320].map((x) => <line key={x} x1={x} y1="0" x2={x} y2="380" />)}
          </g>
          <path d="M0 240 C90 200 150 260 230 220 S 340 180 390 200" stroke="var(--hb-accent)" strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="10 8" style={{ animation: "hb-dash 6s linear infinite" }} opacity="0.65" />
          <circle cx="205" cy="215" r="46" fill="var(--hb-glow)" />
          <circle cx="205" cy="215" r="16" fill="var(--hb-accent)" style={{ filter: "drop-shadow(0 6px 14px var(--hb-glow))" }} />
          <circle cx="205" cy="215" r="5" fill="var(--hb-accent-ink)" />
          {[ [80, 120, "🍜"], [300, 100, "🍕"], [320, 300, "🍗"], [90, 320, "🥗"] ].map(([x, y, e], i) => (
            <g key={i} transform={`translate(${x} ${y})`}>
              <circle r="20" fill="var(--hb-card)" stroke="var(--hb-line)" />
              <text y="6" textAnchor="middle" fontSize="16">{e}</text>
            </g>
          ))}
        </svg>
        <div className="absolute left-5 right-5 top-14">
          <div className="hb-glass-strong flex items-center gap-3 rounded-[20px] px-4 py-3.5">
            <Search2Icon />
            <span className="text-[14px] text-[var(--hb-ink2)]">Search area, street or landmark…</span>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-4 flex justify-center">
          <span className="hb-glass flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-semibold"><Navigation2 size={13} style={{ color: "var(--hb-accent)" }} /> Use my location</span>
        </div>
      </div>
      {/* addresses */}
      <div className="relative z-10 -mt-5 rounded-t-[28px] px-6 pt-7" style={{ background: "var(--hb-bg)" }}>
        <h2 className="hb-h2">Deliver to</h2>
        <div className="mt-4 space-y-3">
          {addresses.map((a) => {
            const active = activeAddr === a.id;
            const Icon = a.id === "home" ? HomeIcon : a.id === "work" ? Building2 : Dumbbell;
            return (
              <button key={a.id} onClick={() => setActiveAddr(a.id)} className="hb-press hb-focus flex w-full items-center gap-4 rounded-[20px] p-4 text-left transition-all" style={{ background: "var(--hb-card)", boxShadow: active ? "var(--hb-shadow), 0 0 0 2px var(--hb-accent)" : "var(--hb-shadow)" }}>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px]" style={{ background: "var(--hb-muted)" }}><Icon size={19} style={{ color: "var(--hb-accent)" }} /></span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5 text-[14.5px] font-bold">{a.label} {a.id === "home" && <span className="rounded-full px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wide" style={{ background: "var(--hb-glow)", color: "var(--hb-accent)" }}>default</span>}</span>
                  <span className="mt-0.5 block truncate text-[12.5px] text-[var(--hb-ink2)]">{a.line}</span>
                </span>
                {active && <Check size={18} style={{ color: "var(--hb-accent)" }} />}
              </button>
            );
          })}
          <button className="hb-press hb-focus flex w-full items-center justify-center gap-2 rounded-[20px] py-4 text-[14px] font-bold" style={{ border: "1.5px dashed var(--hb-line)", color: "var(--hb-accent)" }}>
            <Plus size={16} /> Add new address
          </button>
        </div>
        <div className="pb-10 pt-5">
          <SoftBtn onClick={() => navigate("home")} className="h-14 w-full rounded-[20px] text-[16px]"><MapPin size={17} /> Deliver here</SoftBtn>
        </div>
      </div>
    </div>
  );
}
function Search2Icon() { return <MapPin size={18} style={{ color: "var(--hb-accent)" }} />; }
