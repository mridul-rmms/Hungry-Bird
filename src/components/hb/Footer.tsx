"use client";

import { Phone, Mail, MapPin, Smartphone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--hb-line)] bg-[var(--hb-bg2)] pb-24 md:pb-0">
      <div className="hb-container grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="mb-3 flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-[13px] bg-[var(--hb-basil)] text-white">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M3 12c4-7 12-9 18-7-1.5 3-4 5-7 5.5 3 .5 5 2 6 4.5-4.5 2-9.5 1.5-12.5-1L3 12z" fill="currentColor" />
              </svg>
            </span>
            <span className="font-display text-[19px] font-semibold">Hungry&nbsp;Bird<span className="text-[var(--hb-accent)]">.</span></span>
          </div>
          <p className="max-w-xs text-[13.5px] leading-relaxed text-[var(--hb-ink2)]">
            Food-first delivery, done beautifully. Mood-led discovery, honest kitchens, and a tracking screen worth watching.
          </p>
          <a href="/prototype/index.html" className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[var(--hb-line)] bg-[var(--hb-card)] px-3 py-2 text-[12.5px] font-semibold text-[var(--hb-ink2)] transition-colors hover:text-[var(--hb-ink)]">
            <Smartphone size={14} /> See the mobile UI concept
          </a>
        </div>

        <nav aria-label="Company">
          <p className="hb-eyebrow mb-3 text-[var(--hb-ink3)]">Company</p>
          <ul className="space-y-2 text-[13.5px] font-medium text-[var(--hb-ink2)]">
            {["About us", "Careers", "Team", "Hungry Bird Blog"].map((x) => (
              <li key={x}><span className="cursor-pointer transition-colors hover:text-[var(--hb-ink)]">{x}</span></li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Contact">
          <p className="hb-eyebrow mb-3 text-[var(--hb-ink3)]">Contact</p>
          <ul className="space-y-2.5 text-[13.5px] font-medium text-[var(--hb-ink2)]">
            <li className="flex items-center gap-2"><Phone size={14} className="text-[var(--hb-accent)]" /> +91 80471 02244</li>
            <li className="flex items-center gap-2"><Mail size={14} className="text-[var(--hb-accent)]" /> hello@hungrybird.example</li>
            <li className="flex items-start gap-2"><MapPin size={14} className="mt-0.5 shrink-0 text-[var(--hb-accent)]" /> 4th Block, Koramangala,<br />Bengaluru 560034</li>
          </ul>
        </nav>

        <div>
          <p className="hb-eyebrow mb-3 text-[var(--hb-ink3)]">Delivery hours</p>
          <p className="text-[13.5px] font-medium leading-relaxed text-[var(--hb-ink2)]">
            Every day, 7 AM – 3 AM.<br />Late-night menu from 11 PM.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {["FSSAI certified", "Secure payments", "Live tracking"].map((l) => (
              <span key={l} className="hb-chip pointer-events-none !py-1.5 !text-[11.5px]">{l}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--hb-line)]">
        <div className="hb-container flex flex-col items-center justify-between gap-2 py-5 text-[12px] font-medium text-[var(--hb-ink3)] sm:flex-row">
          <p>© {new Date().getFullYear()} Hungry Bird — a concept application. All meals imaginary, cravings real.</p>
          <p>Next.js · Prisma · Framer Motion</p>
        </div>
      </div>
    </footer>
  );
}
