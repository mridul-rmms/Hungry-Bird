"use client";

import { useEffect, useState } from "react";
import { LogOut, MapPin, Moon, Smartphone, Sun, User } from "lucide-react";
import { useTheme } from "next-themes";
import { useHB } from "@/lib/store";
import { EmptyState } from "../ui";

export default function ProfileView() {
  const { user, signOut, setAuthOpen } = useHB();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [part, setPart] = useState("noon");

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setMounted(true);
      setPart(document.documentElement.dataset.part ?? "noon");
    });
    return () => cancelAnimationFrame(id);
  }, []);

  if (!user) {
    return (
      <div className="hb-container max-w-xl pt-16">
        <EmptyState
          icon={User}
          title="You’re browsing as a guest"
          sub="Sign in to keep orders, favorites and rewards across devices."
          action={<button onClick={() => setAuthOpen(true)} className="hb-btn hb-btn-primary h-10 rounded-xl px-4 text-sm">Sign in</button>}
        />
      </div>
    );
  }

  return (
    <div className="hb-container max-w-2xl pb-16 pt-8">
      <p className="hb-eyebrow mb-1 text-[var(--hb-accent)]">Your nest</p>
      <h1 className="hb-h1">Profile</h1>

      <section className="hb-card mt-8 flex items-center gap-4 rounded-3xl p-5" aria-label="Account">
        <span className="grid h-16 w-16 place-items-center rounded-3xl bg-[var(--hb-ink)] font-display text-[22px] font-bold uppercase text-[var(--hb-bg)]">
          {user.name.slice(0, 2)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-[19px] font-semibold">{user.name}</p>
          <p className="truncate text-[13px] font-medium text-[var(--hb-ink2)]">{user.email}</p>
        </div>
        <button
          onClick={() => {
            signOut();
            useHB.getState().toast("Signed out — come back hungry");
            useHB.getState().go({ name: "home" });
          }}
          className="hb-btn hb-btn-ghost h-10 shrink-0 rounded-xl px-4 text-[13px]"
        >
          <LogOut size={14} /> Sign out
        </button>
      </section>

      <section className="hb-card mt-4 rounded-3xl p-5" aria-label="Preferences">
        <p className="mb-3 text-[14px] font-bold">Appearance</p>
        <div className="grid gap-2 sm:grid-cols-2">
          <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="flex items-center gap-3 rounded-2xl border border-[var(--hb-line)] px-4 py-3.5 text-left transition-colors hover:border-[var(--hb-accent)]"
          >
            {mounted && resolvedTheme === "dark" ? <Moon size={17} className="text-[var(--hb-accent)]" /> : <Sun size={17} className="text-[var(--hb-accent)]" />}
            <span>
              <span className="block text-[13.5px] font-bold">{mounted && resolvedTheme === "dark" ? "Dark mode" : "Light mode"}</span>
              <span className="block text-[11.5px] font-medium text-[var(--hb-ink3)]">Tap to switch</span>
            </span>
          </button>
          <div className="flex items-center gap-3 rounded-2xl border border-[var(--hb-line)] px-4 py-3.5">
            <span className="text-[17px]" aria-hidden>{part === "dawn" ? "🌅" : part === "dusk" ? "🌆" : part === "midnight" ? "🌃" : "☀️"}</span>
            <span>
              <span className="block text-[13.5px] font-bold capitalize">Sky: {part}</span>
              <span className="block text-[11.5px] font-medium text-[var(--hb-ink3)]">The app follows your local time</span>
            </span>
          </div>
        </div>
      </section>

      <section className="hb-card mt-4 rounded-3xl p-5" aria-label="Saved addresses">
        <p className="mb-3 flex items-center gap-2 text-[14px] font-bold"><MapPin size={15} className="text-[var(--hb-accent)]" /> Saved addresses</p>
        <ul className="space-y-2 text-[13px] font-medium text-[var(--hb-ink2)]">
          <li className="rounded-2xl border border-[var(--hb-line)] px-4 py-3"><b className="text-[var(--hb-ink)]">Home</b> · Flat 402, Ember Heights, 5th Block, Koramangala</li>
          <li className="rounded-2xl border border-[var(--hb-line)] px-4 py-3"><b className="text-[var(--hb-ink)]">Work</b> · Desk 14, Prestige Atlas, Indiranagar</li>
        </ul>
      </section>

      <section className="hb-card mt-4 rounded-3xl p-5" aria-label="Extras">
        <p className="mb-3 text-[14px] font-bold">More from Hungry Bird</p>
        <a href="/prototype/index.html" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-2xl border border-[var(--hb-line)] px-4 py-3.5 transition-colors hover:border-[var(--hb-accent)]">
          <Smartphone size={17} className="text-[var(--hb-accent)]" />
          <span>
            <span className="block text-[13.5px] font-bold">Mobile UI concept — 21 screens</span>
            <span className="block text-[11.5px] font-medium text-[var(--hb-ink3)]">The 390×844 design study that started it all</span>
          </span>
        </a>
      </section>
    </div>
  );
}
