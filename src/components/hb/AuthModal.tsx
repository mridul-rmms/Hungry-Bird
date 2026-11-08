"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Mail, ShieldCheck, X } from "lucide-react";
import { useHB } from "@/lib/store";
import { api } from "@/lib/api";

export default function AuthModal() {
  const { authOpen, setAuthOpen, signIn, toast } = useHB();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [devCode, setDevCode] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  if (!authOpen) return null;

  const close = () => {
    setAuthOpen(false);
    setStep("email");
    setCode("");
    setDevCode("");
    setErr("");
  };

  const sendOtp = async () => {
    setBusy(true);
    setErr("");
    try {
      const d = await api.otp(email.trim());
      setDevCode(d.devCode ?? "");
      setStep("otp");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not send code");
    } finally {
      setBusy(false);
    }
  };

  const verify = async () => {
    setBusy(true);
    setErr("");
    try {
      const d = await api.otp(email.trim(), code.trim(), name.trim() || undefined);
      signIn(d.user);
      toast(`Welcome to the nest, ${d.user.name.split(" ")[0]} 🪺`);
      close();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Wrong code");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AnimatePresence>
      {authOpen && (
        <motion.div key="auth" className="fixed inset-0 z-[94] grid place-items-center p-4" role="dialog" aria-modal="true" aria-label="Sign in">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={close} />
          <motion.div
            initial={{ y: 60, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="relative w-full max-w-sm overflow-hidden rounded-[28px] bg-[var(--hb-card)] p-6 shadow-2xl"
          >
            <button onClick={close} className="hb-tap absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-lg text-[var(--hb-ink3)]" aria-label="Close sign in">
              <X size={16} />
            </button>

            <div className="mb-1 grid h-12 w-12 place-items-center rounded-2xl bg-[var(--hb-basil)] text-white">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M3 12c4-7 12-9 18-7-1.5 3-4 5-7 5.5 3 .5 5 2 6 4.5-4.5 2-9.5 1.5-12.5-1L3 12z" fill="currentColor" />
              </svg>
            </div>
            <h2 className="font-display text-[22px] font-semibold">{step === "email" ? "Welcome back" : "Check your inbox"}</h2>
            <p className="mt-1 text-[13px] font-medium text-[var(--hb-ink2)]">
              {step === "email" ? "Sign in to save orders, favorites and rewards." : <>We sent a 4-digit code to <b>{email}</b></>}
            </p>

            {step === "email" ? (
              <form
                onSubmit={(e) => { e.preventDefault(); sendOtp(); }}
                className="mt-5 space-y-3"
              >
                <div>
                  <label htmlFor="hb-email" className="mb-1.5 block text-[12.5px] font-bold">Email</label>
                  <input id="hb-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="hb-input" autoComplete="email" />
                </div>
                <div>
                  <label htmlFor="hb-name" className="mb-1.5 block text-[12.5px] font-bold">Name <span className="font-medium text-[var(--hb-ink3)]">(optional)</span></label>
                  <input id="hb-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Aarav" className="hb-input" autoComplete="name" />
                </div>
                {err && <p className="text-[12.5px] font-semibold text-[var(--hb-ember)]">{err}</p>}
                <button type="submit" disabled={busy} className="hb-btn hb-btn-basil h-12 w-full rounded-2xl text-[14.5px]">
                  {busy ? <Loader2 size={16} className="animate-spin" /> : <><Mail size={15} /> Send code</>}
                </button>
              </form>
            ) : (
              <form
                onSubmit={(e) => { e.preventDefault(); verify(); }}
                className="mt-5 space-y-3"
              >
                {devCode && (
                  <p className="rounded-2xl border border-dashed border-[var(--hb-line)] bg-[var(--hb-bg2)] px-4 py-3 text-[12.5px] font-semibold text-[var(--hb-ink2)]">
                    Demo mode — your code is <b className="font-display text-[15px] tracking-widest text-[var(--hb-ink)]">{devCode}</b>
                  </p>
                )}
                <div>
                  <label htmlFor="hb-otp" className="mb-1.5 block text-[12.5px] font-bold">4-digit code</label>
                  <input
                    id="hb-otp"
                    inputMode="numeric"
                    autoFocus
                    maxLength={4}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="••••"
                    className="hb-input text-center font-display !text-[24px] font-bold tracking-[0.5em]"
                  />
                </div>
                {err && <p className="text-[12.5px] font-semibold text-[var(--hb-ember)]">{err}</p>}
                <button type="submit" disabled={busy || code.length !== 4} className="hb-btn hb-btn-basil h-12 w-full rounded-2xl text-[14.5px]">
                  {busy ? <Loader2 size={16} className="animate-spin" /> : <><ShieldCheck size={15} /> Verify & sign in</>}
                </button>
                <button type="button" onClick={() => setStep("email")} className="w-full text-center text-[12.5px] font-semibold text-[var(--hb-ink3)] hover:text-[var(--hb-ink)]">
                  Use a different email
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
