# Tanmatra

**D2C RD-Verified Healthy Food Delivery Platform**

A production-ready food delivery web application for Noida/Gurgaon households, featuring a Zomato-style customer experience, an internal kitchen operations dashboard, and 83 RD-verified menu items across 14 categories.

---

## Live Demo

- **Customer App**: [https://ubeqa7mpx6fva.kimi.show](https://ubeqa7mpx6fva.kimi.show)
- **Admin Dashboard**: [https://ubeqa7mpx6fva.kimi.show/#/admin](https://ubeqa7mpx6fva.kimi.show/#/admin)
- **Kitchen KDS**: [https://ubeqa7mpx6fva.kimi.show/#/admin/kds](https://ubeqa7mpx6fva.kimi.show/#/admin/kds)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite + TypeScript |
| Styling | Tailwind CSS |
| Router | React Router (HashRouter for static hosting) |
| State | Centralized localStorage store (cart, orders, locations) |
| Icons | Lucide React |
| Build Tool | Vite |

---

## Customer App Pages

| Route | Page | Features |
|-------|------|----------|
| `/` | **Home** | Address bar, search, promo carousel, 6 Quick Access tiles, 2 feature tiles, featured dish grid |
| `/menu` | **Menu** | 14 category pills, veg toggle, 6 filter banners (unique colors/icons), search, add-to-cart |
| `/dish/:id` | **Dish Detail** | Full image, macros (protein/carbs/fat/fiber), ingredients, RD note, related items, qty stepper |
| `/basket` | **Cart** | Zomato-style layout with savings banner, qty steppers, cross-sell carousel, bill breakdown, Place Order CTA |
| `/checkout` | **Checkout** | 2 saved addresses, coupon input, bill details, Pay & Place Order, confirmation screen |
| `/orders` | **Orders** | Order list with status badges, time ago, totals, Track links |
| `/track/:id` | **Track** | Visual timeline (Confirmed → Preparing → Ready → Out → Delivered) |
| `/profile` | **Profile** | User card, 7 menu items (Gold, Health, Addresses, Payments, Notifications, Privacy, Support) |
| `/wellness` | **Wellness Hub** | 6 health pillars, daily tip, Take Quiz + Talk to RD CTAs |
| `/gold` | **Tanmatra Gold** | 5 benefits, 3 subscription plans (1/3/12 month) |
| `/consult-rd` | **Consult RD** | 2 RD profiles, date picker, 7 time slots, health concern textarea, booking confirmation |
| `/health-quiz` | **Health Quiz** | 4-question quiz with progress bar, personalized segment result, recommended dishes |
| `/subscriptions` | **Subscriptions** | 3 meal plans (Everyday Wellness, Athlete Fuel, Family Pack) |
| `/notifications` | **Notifications** | 6 notification types, unread badges, mark-as-read |
| `/support` | **Support** | Chat/Call cards, 5 FAQs with expand/collapse, Terms/Privacy links |
| `/settings` | **Settings** | Edit Profile, Addresses, notification toggles, dark mode toggle, Privacy |

## Internal Ops Dashboard

| Route | Page | Features |
|-------|------|----------|
| `/admin` | **Operations Command** | 4 stat cards with badge breakdowns, 4 operation cards, active orders list |
| `/admin/orders` | **All Orders** | Search by ID/address, 6 status filter chips, color-coded status badges, order cards |
| `/admin/kds` | **Kitchen Display** | 4-column stats, order tickets with item lists + advance buttons (Start Preparing → Mark Ready → Hand to Rider) |
| `/admin/staff` | **Staff Management** | 5 staff members, on/off duty toggle, clock in/out, shifts, phone numbers |
| `/admin/riders` | **Rider Logistics** | 4 riders, free/busy status, assign button, zones, active deliveries |
| `/admin/analytics` | **Analytics** | 4 metric cards, 24-hour bar chart, status distribution bars, top 5 selling items |

---

## Architecture

### Centralized Foundation Modules

```
src/lib/
├── store.ts       # Typed localStorage: cartStore + orderStore (add, update, subscribe)
├── routes.ts      # Route constants: ROUTES.home, ROUTES.dish(id), etc.
├── format.ts      # Currency formatting, savings calculator, delivery fee, tax
└── filters.ts     # NAMED_FILTERS + TILE_META for 6 Quick Access tiles
```

### Data

- **83 menu items** across 14 categories with realistic `prep_time`, `discount`, `protein`, `calories`, `tags`
- All items include `rd_verified: true` and `is_rd_verified: true`

### State Management

- No Redux/Context — uses a typed `localStorage` store with `window.dispatchEvent("cartUpdated")` for cross-component sync
- Cart persists across sessions
- Orders are stored in `localStorage` and sync to the KDS in real-time

### Performance

- Admin routes code-split with `React.lazy()` + `Suspense` (4–6KB chunks)
- Main bundle: ~327KB gzipped
- Category images use `fetchPriority="low"` and `loading="lazy"`

---

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Build

```bash
npm run build
```

Output goes to `dist/` — ready for static hosting (Netlify, Vercel, Cloudflare Pages, etc.)

### Preview Production Build

```bash
npm run preview
```

---

## Deployment

### Option 1: Netlify (Easiest)

1. Go to [app.netlify.com](https://app.netlify.com)
2. Drag and drop the `dist/` folder
3. Add custom domain in **Domain Settings**

### Option 2: Cloudflare Pages (Best Performance in India)

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Pages → Create project → Upload `dist/` as ZIP
3. Add custom domain → Auto SSL

### Option 3: Vercel (Best for React)

```bash
npm i -g vercel
vercel --prod
```

---

## Domain Setup

If you own `tanmatra.food` on GoDaddy:

### Path A: Cloudflare Pages (Recommended)

1. Add site on Cloudflare → select **Free Plan**
2. Change GoDaddy nameservers to Cloudflare's
3. Pages → Upload `dist/` → Add `tanmatra.food` as custom domain
4. SSL auto-provisions in ~2 minutes

### Path B: Netlify

1. Deploy on Netlify
2. Add custom domain → copy CNAME record
3. Add CNAME in GoDaddy DNS
4. SSL auto-provisions

---

## Menu Data

83 items across 14 categories with realistic prep times:

| Category | Count | Prep Time |
|----------|-------|-----------|
| Drinks | 8 | 5–7 min |
| Detox | 3 | 5–6 min |
| Smoothies | 5 | 5–6 min |
| Soups | 8 | 10–12 min |
| Omelettes | 5 | 8–10 min |
| Wraps | 6 | 8–10 min |
| Salads | 6 | 10–14 min |
| Sandwiches | 5 | 10–12 min |
| Pasta | 5 | 18–20 min |
| Burrito Bowls | 5 | 15–18 min |
| Healthy Meals | 5 | 20–24 min |
| Breakfast | 6 | 12–18 min |
| Meal Boxes | 8 | 15–20 min |
| Desserts | 8 | 8–12 min |

---

## Coupon Codes

| Code | Value | Min Order | Type |
|------|-------|-----------|------|
| FIRST100 | ₹100 off | ₹299 | fixed |
| TAN100 | ₹100 off | ₹299 | fixed |
| FIRST20 | 20% off | ₹199 | percent |
| GOLD50 | ₹50 off | ₹399 | fixed |

---

## Project Structure

```
src/
├── components/
│   ├── Header.tsx        # Sticky header with back button, cart count
│   ├── BottomNav.tsx     # 4-tab navigation (Home, Wellness, Cart, Profile)
│   └── Toast.tsx         # Toast notification system
├── lib/
│   ├── store.ts          # cartStore + orderStore
│   ├── routes.ts         # route constants
│   ├── format.ts         # currency + savings formatting
│   └── filters.ts        # filter predicates + tile metadata
├── pages/
│   ├── Home.tsx          # Landing page
│   ├── Menu.tsx          # Menu with filters
│   ├── Dish.tsx          # Dish detail
│   ├── Cart.tsx          # Zomato-style cart
│   ├── Checkout.tsx      # Checkout flow
│   ├── Orders.tsx        # Order history
│   ├── Track.tsx         # Order tracking timeline
│   ├── Profile.tsx       # User profile
│   ├── Admin.tsx         # Operations dashboard
│   ├── KDS.tsx           # Kitchen Display System
│   ├── AllOrders.tsx     # Full orders table
│   ├── Analytics.tsx     # Charts + metrics
│   ├── Staff.tsx         # Staff management
│   ├── Riders.tsx        # Rider logistics
│   └── ...               # Wellness, Gold, ConsultRD, etc.
├── data/
│   └── menu.ts           # 83 menu items + 14 categories
├── hooks/
│   └── useTheme.ts       # Dark/light mode
├── App.tsx               # Router + lazy loading
├── index.css             # Design system (CSS variables + Tailwind)
└── main.tsx               # Entry point
```

---

## Future Roadmap

- [ ] Backend API (Node.js/FastAPI) with real database
- [ ] Razorpay payment integration
- [ ] Real-time order updates via WebSocket
- [ ] Push notifications
- [ ] Rider mobile app
- [ ] Multi-location support
- [ ] Subscription billing
- [ ] Admin role-based access control

---

## License

MIT

---

## Contact

Built for **Tanmatra** — RD-verified healthy meals delivered to your doorstep.
