"use client";
/* Hungry Bird — system: design system showcase */
import React from "react";
import { useHB } from "@/lib/store";
import { MOODS } from "@/lib/data";
import { BackBar, Glass, SoftBtn, Chip, Stepper, RatePill, VegMark, Skel } from "../ui";

const TYPE = [
  { c: "hb-h1", s: "30/34", n: "Display Bold", f: "Fraunces 620" },
  { c: "hb-h2", s: "23/26", n: "Heading", f: "Fraunces 600" },
  { c: "hb-h3", s: "18/22", n: "Subhead", f: "Fraunces 600" },
  { c: "text-[15px] font-semibold", s: "15/20", n: "Body strong", f: "Instrument Sans 600" },
  { c: "text-[14px] text-[var(--hb-ink2)]", s: "14/20", n: "Body", f: "Instrument Sans 400" },
  { c: "hb-eyebrow", s: "11/14", n: "Eyebrow", f: "Instrument Sans 600 +0.18em" },
];

const ELEV = [
  { n: "card", s: "var(--hb-shadow)" },
  { n: "raised", s: "var(--hb-shadow-lg)" },
  { n: "neumorphic", s: "var(--hb-neu)" },
  { n: "inset", s: "var(--hb-neu-in)" },
];

export function DesignSystem() {
  const { back, navigate } = useHB();
  return (
    <div className="no-scrollbar h-full overflow-y-auto pb-24" style={{ background: "var(--hb-bg)" }}>
      <BackBar title="Design system" />
      <div className="space-y-8 px-5 pt-2">
        <section>
          <p className="hb-eyebrow" style={{ color: "var(--hb-accent)" }}>01 · signature accent</p>
          <h2 className="hb-h2 mt-1.5">Ember — honey gold</h2>
          <p className="mt-1 text-[13px] text-[var(--hb-ink2)]">Ownable warmth: ghee, char-glow, late ovens. Never generic red/orange.</p>
          <div className="mt-4 flex gap-3">
            {["#ffc45e", "#f0a52e", "#c87f1e", "#8a5410", "#2a1c0d"].map((c) => (
              <div key={c} className="flex-1">
                <div className="h-16 rounded-[16px]" style={{ background: c, boxShadow: "var(--hb-shadow)" }} />
                <p className="mt-1.5 text-center text-[10px] font-semibold text-[var(--hb-ink2)]">{c}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-6 gap-2">
            {MOODS.map((m) => (
              <div key={m.id} className="text-center">
                <div className="mx-auto h-9 w-9 rounded-full" style={{ background: m.hue }} />
                <p className="mt-1 text-[8.5px] font-semibold text-[var(--hb-ink2)]">{m.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <p className="hb-eyebrow" style={{ color: "var(--hb-accent)" }}>02 · type scale</p>
          <div className="mt-3 space-y-3">
            {TYPE.map((t) => (
              <div key={t.n} className="flex items-baseline justify-between gap-3">
                <span className={`${t.c} truncate`}>Hungry Bird</span>
                <span className="shrink-0 text-right text-[10px] leading-tight text-[var(--hb-ink3)]">{t.s}<br />{t.f}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <p className="hb-eyebrow" style={{ color: "var(--hb-accent)" }}>03 · materials & elevation</p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Glass className="p-4"><p className="text-[12px] font-bold">Glass</p><p className="mt-0.5 text-[10.5px] text-[var(--hb-ink2)]">blur 20 · saturate 1.5</p></Glass>
            {ELEV.map((e) => (
              <div key={e.n} className="rounded-[18px] p-4" style={{ background: "var(--hb-card)", boxShadow: e.s }}>
                <p className="text-[12px] font-bold">{e.n}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <p className="hb-eyebrow" style={{ color: "var(--hb-accent)" }}>04 · components & states</p>
          <div className="mt-3 space-y-4 rounded-[22px] p-4" style={{ background: "var(--hb-card2)" }}>
            <div className="flex flex-wrap items-center gap-3">
              <SoftBtn className="h-11 px-5 text-[14px]">Primary</SoftBtn>
              <SoftBtn variant="soft" className="h-11 px-5 text-[14px]">Soft</SoftBtn>
              <SoftBtn variant="dark" className="h-11 px-5 text-[14px]">Dark</SoftBtn>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Chip active>Comfort</Chip><Chip>Spicy</Chip><Chip hue="#7ba05b" active>Healthy</Chip>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Stepper qty={2} onDelta={() => {}} />
              <RatePill v={4.8} />
              <span className="flex items-center gap-2 text-[12px]"><VegMark veg /> veg <VegMark veg={false} /> non-veg</span>
            </div>
            <div className="space-y-2"><Skel h={12} w="70%" /><Skel h={12} w="45%" /></div>
          </div>
        </section>

        <section>
          <p className="hb-eyebrow" style={{ color: "var(--hb-accent)" }}>05 · motion language</p>
          <div className="mt-3 space-y-2.5 text-[12.5px] leading-relaxed text-[var(--hb-ink2)]">
            {[
              ["Springs everywhere", "stiffness 260–420 · damping 22–30 · no linear"],
              ["Steam wipe", "page transitions dissolve through steam, 550 ms"],
              ["Sizzle burst", "add-to-cart throws ember sparks from the + button"],
              ["Spice confetti", "order success rains chili flakes & herbs"],
              ["Shared elements", "dish card → detail morphs via layoutId"],
              ["Scroll reveal", "cards rise from blur(6px) + y30 as you scroll"],
              ["Tilt parallax", "hero dishes tilt toward your cursor / gyroscope"],
            ].map(([t, d]) => (
              <div key={t} className="flex justify-between gap-4 rounded-[14px] px-4 py-3" style={{ background: "var(--hb-card)" }}>
                <b className="text-[var(--hb-ink)]">{t}</b><span className="text-right">{d}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <p className="hb-eyebrow" style={{ color: "var(--hb-accent)" }}>06 · accessibility</p>
          <ul className="mt-3 space-y-1.5 text-[12.5px] leading-relaxed text-[var(--hb-ink2)]">
            <li>· WCAG AA — ink #241b12 on cream (12.9:1) · #f4ecdf on espresso (13.4:1)</li>
            <li>· All tap targets ≥ 44×44 px (.hb-tap)</li>
            <li>· Press states scale to 0.955 as haptic proxy · focus-visible rings on all controls</li>
            <li>· 8pt grid: all spacing in 4/8 multiples · radii 12/16/20/28</li>
            <li>· Text scales with system settings (rem-based Tailwind defaults)</li>
          </ul>
        </section>

        <button onClick={() => navigate("states")} className="hb-press hb-focus w-full rounded-[18px] py-3.5 text-[13px] font-bold" style={{ border: "1.5px dashed var(--hb-line)", color: "var(--hb-accent)" }}>Next · states gallery →</button>
      </div>
    </div>
  );
}
