# 🐦 Hungry Bird — Food Delivery Web App

**Food that matches your mood, not just your address.**
A full-stack, production-grade food delivery web application: mood-led discovery, dish customisation, a cart that becomes a plate, coupon logic, and a cinematic live-tracking screen where your order genuinely advances from *kitchen → rider → doorstep* in real time.

> Companion piece: the award-style **mobile UI concept** (21 screens, 390×844) lives at [`public/prototype/index.html`](public/prototype/index.html) and is linked from the app footer.

---

## ✨ Highlights

| | |
|---|---|
| 🛋️ **Mood-first home** | Six mood chips (Comfort, Spicy, Late-night, Healthy, Celebration, Quick bite) instantly reshuffle the kitchen grid |
| 🔍 **Live search & filters** | Debounced-free instant filtering across restaurants, cuisines and dishes — with veg-only, 4.7+, fast-delivery and sort controls |
| 🍽️ **Restaurant pages** | Hero cover, sticky section nav, bestseller badges, spice indicators, one-tap quick-add |
| 🌶️ **Dish customiser** | Portions (+₹79/+₹159), add-ons with veg markers, spice level, cook's notes — price updates live |
| 🥘 **Cart = a real plate** | Your items land on an animated ceramic plate (with steam) — a cart you can *feel* |
| 🎟️ **Coupons** | `HUNGRY20` (20% up to ₹120), `WELCOME50` (flat ₹50), `FREEDEL` — with minimum-order rules |
| 🛵 **Cinematic live tracking** | SVG city map, glowing route, rider riding the actual path (`getPointAtLength` sampling), kitchen milestones, live ETA countdown |
| ⏱️ **Self-advancing orders** | Orders move `placed → confirmed → cooking → picked → delivered` on a real server-side timeline (~6.5 min demo lifecycle) — polled every 4 s |
| 🔐 **Demo OTP auth** | Email + 4-digit code (shown in-app for the demo), users persisted in SQLite, orders linked to accounts |
| 🎁 **Rewards** | Loyalty stamps, wings-points, scratch-to-reveal coupon cards with haptics |
| 🌗 **Light / dark + dayparts** | Full dark theme, plus a subtle sky that shifts with your local time (dawn / noon / dusk / midnight) |
| 📱 **Responsive everything** | Desktop nav, mobile bottom tab bar, drawers and modals that adapt to any width |

## 🧱 Tech stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS 4** with a bespoke design-token system (`--hb-*`: glass, grain, neumorphic cards, keyframes)
- **Prisma ORM + SQLite** (`User`, `Restaurant`, `Dish`, `Order`)
- **Zustand** (view router, cart, favorites, session — persisted to `localStorage`)
- **Framer Motion** (view transitions, plate physics, scratch cards)
- **Lucide icons**, Fraunces + Instrument Sans typography

## 🚀 Run it

```bash
bun install            # or npm install / pnpm install
bun run db:push        # create SQLite schema
bun run scripts/seed.ts  # 6 kitchens, 17 dishes (local AI-generated food photography)
bun run dev            # http://localhost:3000
```

Environment: `DATABASE_URL=file:./db/custom.db` (`.env`).

> Try the golden path: pick 🌶️ Spicy → open **Ember & Smoke** → quick-add two dishes → apply `HUNGRY20` → place order → watch the rider fly. Orders advance automatically every ~45–150 s.

## 📁 Structure

```
src/
  app/
    page.tsx                 # SPA shell
    api/restaurants/         # GET all kitchens + menus
    api/orders/              # GET list · POST place order
    api/orders/[code]/       # GET one order (live status)
    api/auth/otp/            # demo OTP issue + verify
  components/hb/
    App.tsx  Navbar  Footer  CartDrawer  DishModal  AuthModal  DishCard  ui.tsx
    views/  Home · Search · Restaurant · Checkout · Orders · Tracking · Favorites · Rewards · Profile
  lib/  store.tsx (Zustand) · api.ts · types.ts · db.ts
prisma/schema.prisma
scripts/seed.ts
public/img/                 # food & restaurant photography
public/prototype/           # the 21-screen mobile UI concept (bonus)
```

## 📝 Notes

- Concept project — payments are simulated, kitchens are deliciously fictional.
- Order lifecycle timing is intentionally compressed for demos (`effectiveStatus()` in `src/app/api/orders/route.ts`).
- Fonts are served via `next/font`; food images are bundled locally (no CDN dependency).

---

Built with too much love and slightly too much chai. 🐦✨
