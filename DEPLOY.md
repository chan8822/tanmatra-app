# Tanmatra — Deployment Guide

## Option 1: Render.com (Recommended — Easiest)

### Step 1: Create a Render account
Go to https://dashboard.render.com and sign up with GitHub.

### Step 2: Push your code to GitHub
```bash
cd /mnt/agents/output/app
git init
git add .
git commit -m "Tanmatra production build"
git remote add origin https://github.com/YOUR_USERNAME/tanmatra.git
git push -u origin main
```

### Step 3: Deploy on Render
1. In Render dashboard, click **"New +"** → **"Blueprint"**
2. Connect your GitHub repo
3. Render reads `render.yaml` and creates:
   - **PostgreSQL database** (starter plan)
   - **Web service** (Docker build)
4. Go to Environment tab, add these:
   - `RAZORPAY_KEY_ID` — from https://dashboard.razorpay.com/app/keys
   - `RAZORPAY_KEY_SECRET` — same page
   - `GEMINI_API_KEY` — from https://aistudio.google.com/app/apikey
   - `TWILIO_SID` — from https://console.twilio.com
   - `TWILIO_TOKEN` — same page
   - `TWILIO_PHONE` — your Twilio phone number
   - `ENATEGA_API_KEY` — contact Enatega
5. Click **Deploy**
6. Your backend URL will be: `https://tanmatra-backend.onrender.com`

### Step 4: Connect Frontend to Backend
In your deployed frontend (or before deploying), set:
```bash
# In render.yaml or as build env var
VITE_API_BASE=https://tanmatra-backend.onrender.com
```

---

## Option 2: Docker (Any Cloud Provider)

```bash
cd /mnt/agents/output/app
docker build -t tanmatra:latest .
docker run -p 8000:8000 \
  -e DATABASE_URL="postgresql://..." \
  -e RAZORPAY_KEY_ID="rzp_test_..." \
  -e RAZORPAY_KEY_SECRET="..." \
  -e GEMINI_API_KEY="AI..." \
  tanmatra:latest
```

---

## Option 3: Railway.app

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
cd /mnt/agents/output/app
railway login
railway init
railway add --database postgres
railway up
```

---

## After Deployment: Verify

Test your backend is live:
```bash
curl https://YOUR_BACKEND_URL/health
# Should return {"status":"ok"}

curl https://YOUR_BACKEND_URL/api/menu/categories
# Should return 14 categories
```

---

## Enabling Real Features (Paste Your Keys)

| Feature | File | What to paste |
|---------|------|---------------|
| Real OTP SMS | `api/integrations/twilio_client.py` | Twilio SID + Token + Phone |
| Real Payments | `api/integrations/razorpay_client.py` | Razorpay Key ID + Secret |
| Real AI | `api/integrations/gemini_client.py` | Gemini API Key |
| Real Delivery | `api/integrations/enatega_client.py` | Enatega API Key |

Each integration file has a clearly marked `TODO` where you paste the key. Once pasted, restart the backend.

---

## Monitoring

- Health check: `GET /health`
- API docs: `GET /api/docs` (dev only)
- Database: Check Render dashboard PostgreSQL metrics
- Logs: `railway logs` or Render dashboard → Logs
