# Tanmatra — Premium D2C Healthy Food Delivery

> Dark luxury meets nutrition science. A Zomato-inspired food delivery app built for health-conscious Noida households.

## Live Demo

https://ubeqa7mpx6fva.kimi.show

## Screenshots

| Homepage | Menu | Cart | Checkout |
|----------|------|------|----------|
| Dark theme, gold accents, RD-verified badges | 83 dishes across 14 categories | Quantity controls, coupon, bill breakdown | Address selector, Razorpay payment |

## Features (All 5 Phases Complete)

### Phase 1 — The Money Path
- [x] ADD to Cart from dish cards with toast feedback
- [x] Cart page with items, images, quantity controls
- [x] Bill breakdown (subtotal, discount, delivery, tax, total)
- [x] Coupon code input (try **FIRST20**)
- [x] Checkout with address selector
- [x] Razorpay Payment Button integration
- [x] Order placement with TAN-XXXX order ID
- [x] Empty cart state with CTA

### Phase 2 — Navigation & Display
- [x] Profile page (Gold badge, menu sections, referral card)
- [x] VEG toggle filters the entire dish grid
- [x] 6 filter chips (Gourmet, New to you, Great offers, Under 30 min, Free delivery)
- [x] Location modal with saved addresses and zone indicators
- [x] Search modal with recent searches, trending, real-time results
- [x] Fixed BottomNav with cart badge (Home, Wellness, Cart, Profile)

### Phase 3 — Revenue Features
- [x] **Meal Subscriptions** — Weekly (₹1,399), Monthly (₹4,999), Family (₹2,799)
- [x] **Combo Offers** — Power Lunch ₹299, Family Dinner ₹599, Protein Pack ₹399
- [x] **Tanmatra Gold Upsell** — Free delivery, 30% extra off, priority support
- [x] **"Save ₹X vs Swiggy"** price comparison on every dish card
- [x] **Countdown timer** on promo banners for urgency
- [x] **Loyalty Explainer** — 1 point per ₹10, 100pts = ₹50

### Phase 4 — UX Polish
- [x] Toast notifications (success/error/info)
- [x] Skeleton loading states on homepage
- [x] Active filter chip highlighting
- [x] Responsive category pills (14 categories, horizontal scroll)

### Phase 5 — Competitive Moats
- [x] **Talk to Our RD** — Book free 15-min nutrition consultation with Dr. Priya Sharma
- [x] **Health Quiz** — 4-question quiz with personalized track (Athlete/Wellness/Senior/Everyday)
- [x] Quick Access Tiles v2 with feature discovery

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS + shadcn/ui |
| Routing | React Router v6 (HashRouter) |
| State | localStorage (client-side persistence) |
| Backend | FastAPI + SQLAlchemy + SQLite (ready for PostgreSQL) |
| Payment | Razorpay Payment Button |

## Project Structure

```
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── BottomNav.tsx    # 4-tab navigation with cart badge
│   │   ├── DishCard.tsx     # Zomato-style dish card with ADD button
│   │   ├── FilterSheet.tsx  # Left-nav filter modal
│   │   ├── LocationModal.tsx # Address selector
│   │   ├── QuickAccessTiles.tsx # 6+2 feature tiles
│   │   ├── RevenueFeatures.tsx  # Subscriptions, combos, Gold, loyalty
│   │   ├── SearchModal.tsx  # Real-time search
│   │   ├── SectionHeader.tsx # "RECOMMENDED FOR YOU" style headers
│   │   ├── SkeletonCard.tsx  # Loading shimmer
│   │   └── Toast.tsx         # Notification system
│   ├── hooks/
│   │   ├── useCart.ts        # Cart state management
│   │   └── useLocation.ts    # Delivery zone management
│   ├── pages/               # Route-level pages
│   │   ├── Home.tsx          # Zomato-style homepage
│   │   ├── Menu.tsx          # Filterable menu grid
│   │   ├── Dish.tsx          # Dish detail with nutrition panel
│   │   ├── Cart.tsx          # Shopping cart
│   │   ├── Checkout.tsx      # Checkout with Razorpay
│   │   ├── ConsultRD.tsx     # RD consultation booking
│   │   ├── HealthQuiz.tsx    # 4-question health quiz
│   │   ├── Orders.tsx        # Order history
│   │   ├── Profile.tsx       # User profile
│   │   ├── Gold.tsx          # Gold membership page
│   │   └── Admin*.tsx        # Admin dashboard modules
│   ├── lib/
│   │   └── api.ts            # Backend-ready API client
│   └── data/
│       └── menu.ts           # 83 real menu items
├── api/                     # FastAPI backend
│   ├── main.py              # 42+ endpoints
│   ├── models.py            # 15 SQLAlchemy models
│   ├── schemas.py           # Pydantic schemas
│   └── seed.py              # Database seeding
├── public/dish/             # AI-generated food photography
├── dist/                    # Production build
└── index.html               # Entry point
```

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+ (for backend)

### Frontend

```bash
npm install
npm run dev      # Development server
npm run build    # Production build to dist/
```

### Backend (Optional — for full API mode)

```bash
cd api
pip install -r requirements.txt
uvicorn main:app --reload
```

### Environment Variables

Create `.env` in project root:

```env
# Razorpay (Live keys — replace with your own)
VITE_RAZORPAY_KEY=rzp_live_SieuqcS4jjjD79
VITE_RAZORPAY_BUTTON_ID=pl_QmhkGXh8X9yQc5

# Backend (optional — falls back to localStorage)
VITE_API_BASE=http://localhost:8000
```

## Deployment

### Static Hosting (Current)
The app is built as a static SPA. Deploy the `dist/` folder to any static host:

```bash
npm run build
# Deploy dist/ to Netlify, Vercel, Cloudflare Pages, etc.
```

### With Backend
For full API integration, set `VITE_API_BASE` to your FastAPI server URL.

## Razorpay Integration

- **Payment Button ID**: `pl_QmhkGXh8X9yQc5`
- **API Key**: `rzp_live_SieuqcS4jjjD79`
- **Webhook Endpoint**: `POST /api/payments/verify`

## Data Architecture

The frontend uses a **hybrid approach**:
- **Standalone mode**: All data baked into `src/data/menu.ts`, cart stored in localStorage
- **Backend mode**: When `VITE_API_BASE` is set, calls FastAPI endpoints with localStorage fallback

## Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| Primary BG | `#121212` | Page background |
| Secondary BG | `#1A1A1A` | Cards, panels |
| Accent | `#D4AF37` | Gold — buttons, prices, badges |
| Success | `#4CAF50` | Ratings, savings, veg badge |
| Error | `#FF6B6B` | Discount badges, alerts |

## Business Model

| Revenue Stream | Implementation |
|----------------|----------------|
| Direct orders | Core checkout flow |
| Meal subscriptions | Weekly/Monthly/Family plans |
| Combo bundles | Power Lunch/Family Dinner/Protein Pack |
| Gold membership | ₹199/month — free delivery + 30% off |
| Referrals | ₹200 per successful friend signup |
| RD consultations | Free 15-min calls (upsell to meal plans) |

## Credits

- **Design Inspiration**: Zomato app layout patterns
- **Brand**: Tanmatra — Noida's premium healthy food delivery
- **Nutrition**: RD-verified by certified clinical dietitians
- **Photography**: AI-generated food images for each category

## License

Proprietary — Tanmatra Foods Pvt. Ltd.
