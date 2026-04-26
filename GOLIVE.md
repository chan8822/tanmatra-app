# TANMATRA GO-LIVE CHECKLIST

## Phase 1: Stability & Testing (Days 1-3)

### API Testing
- [x] pytest suite created (`tests/test_api.py`) with 27 tests
- [x] All tests passing (27/27)
- [x] Coverage areas: Auth, Menu, Cart, Orders, Inventory, Admin, Payments, Delivery, AI, Webhooks

### Run Tests
```bash
cd app/
python -m pytest tests/test_api.py -v
```

---

## Phase 2: Production Readiness (Days 4-5)

### Configuration
- [x] Pydantic Settings (`api/config.py`) with env var loading
- [x] `.env.example` provided
- [x] CORS restricted to specific origins (not `*`)
- [x] Global exception handler with structured error responses
- [x] `/health` endpoint for monitoring
- [x] Startup checks for integrations (Razorpay, Gemini)

### Security
- [ ] JWT secret changed from default (min 32 chars)
- [ ] Database credentials rotated
- [ ] All API keys moved to environment variables
- [ ] CORS origins restricted to production domain
- [ ] Rate limiting enabled on payment endpoints
- [ ] HTTPS only (SSL certificate)
- [ ] Razorpay webhook signature verification implemented

### Logging
- [x] Structured logging with levels
- [x] Request IDs for traceability
- [ ] Production log aggregation (CloudWatch/DataDog)

---

## Phase 3: Deployment

### Render (Recommended)
```bash
# render.yaml included
# 1. Push to GitHub
# 2. Connect repo in Render dashboard
# 3. Set environment variables in Render dashboard
# 4. Deploy
```

### Railway Alternative
```bash
# railway.toml included
# 1. Install Railway CLI
# 2. railway up
```

---

## Phase 4: Critical Integrations

### Razorpay
- [x] Test mode order creation working
- [x] Payment verification endpoint
- [x] Webhook signature verification (HMAC-SHA256)
- [x] Webhook endpoint: `POST /api/payments/razorpay/webhook`
- [ ] Webhook registered in Razorpay Dashboard
- [ ] Payment failure recovery flow tested
- [ ] Subscription mandate flow tested
- [ ] Live mode credentials ready

### Gemini AI
- [x] API key verification on startup
- [x] Dish recommendations endpoint
- [x] Nutrition analysis endpoint
- [x] Chat widget responding
- [x] Fallback/demo mode when key unavailable
- [ ] Real API key configured in production

### Enatega Delivery
- [x] 5 Noida zones configured
- [x] Rider assignment simulation
- [x] Live GPS tracking simulation
- [x] Zone analytics endpoint
- [ ] Real Enatega API keys (if using production)

---

## Phase 5: Pre-Launch Verification

### Frontend
- [x] All API endpoints wired to backend
- [x] Mobile responsive (max-w-[450px] container)
- [x] Desktop responsive (lg: breakpoints)
- [x] Dark/light theme toggle
- [x] Loading states present
- [x] Error messages user-friendly
- [x] AI chat widget functional
- [x] Razorpay checkout flow integrated

### Database
- [x] SQLite for development
- [ ] PostgreSQL for production
- [ ] Database backups configured
- [ ] Indexes added for slow queries

### Operations
- [x] `/health` endpoint for uptime monitoring
- [ ] Error alerts (Sentry/LogRocket)
- [ ] Uptime monitoring (Pingdom/UptimeRobot)
- [ ] Daily backup schedule
- [ ] Rollback plan documented
- [ ] Support email configured

### Performance
- [ ] API response time <500ms (p99)
- [ ] Load testing passed (500+ concurrent orders/hour)
- [ ] CDN for static assets

### Compliance (India)
- [ ] GST registration number on invoices
- [ ] Privacy policy and T&Cs
- [ ] Data retention policy
- [ ] Payment disclaimer (Razorpay test/live mode)

---

## Quick Start Commands

```bash
# Install dependencies
pip install -r requirements.txt

# Run tests
pytest tests/test_api.py -v

# Start development server
uvicorn api.main:app --reload --port 8000

# Start production server
uvicorn api.main:app --host 0.0.0.0 --port 8000
```

## Environment Variables Required

| Variable | Dev | Prod | Description |
|----------|-----|------|-------------|
| DATABASE_URL | sqlite:///./tanmatra.db | postgresql://... | Database connection |
| RAZORPAY_KEY_ID | rzp_test_xxx | rzp_live_xxx | Razorpay public key |
| RAZORPAY_KEY_SECRET | test_secret | live_secret | Razorpay secret |
| GEMINI_API_KEY | empty | real_key | Gemini AI |
| JWT_SECRET | dev_secret | 32+ chars random | JWT signing |
| ENVIRONMENT | development | production | App mode |
| CORS_ORIGINS | localhost | yourdomain.com | Allowed origins |

## Deployment Files

- `render.yaml` — Render.com configuration
- `requirements.txt` — Python dependencies
- `.env.example` — Environment template
- `tests/test_api.py` — 27 API tests
