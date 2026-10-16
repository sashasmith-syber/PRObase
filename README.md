<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# AIT PROfessor

A multimodal AI chat assistant powered by **Google Gemini**, gated behind a **Stripe subscription** via a **Cloudflare Worker**.

```
Browser (React) → Cloudflare Worker (Stripe check + Gemini proxy) → Gemini API
```

---

## Features

- 12 specialist AI modes (Professor, Coder, Troubleshooter, Security Analyst, and more)
- Multimodal input — text, images, audio files, and text file attachments
- Persistent conversation history (localStorage)
- Stripe subscription paywall — no active subscription → `402 Payment Required`
- Cloudflare Worker sits between the frontend and Gemini so your API key is never exposed in the browser

---

## Setup Instructions

### 1. Clone & install frontend dependencies

```bash
git clone <repo-url>
cd AIT-PROfessor
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
# Edit .env.local:
#   GEMINI_API_KEY=your_gemini_api_key_here
#   VITE_WORKER_URL=http://localhost:8787
```

### 3. Stripe Setup

1. Log in to [dashboard.stripe.com](https://dashboard.stripe.com)
2. Create a **Product** (e.g. "AIT PROfessor Subscription") with a **recurring Price** (e.g. $9.99/month)
3. Note the **Price ID** (looks like `price_xxxxxxxxxxxxxx`)

### 4. Worker Setup

```bash
cd worker
npm install

# Set secrets (you will be prompted to paste the value for each):
wrangler secret put STRIPE_SECRET_KEY   # sk_test_... or sk_live_...
wrangler secret put STRIPE_PRICE_ID     # price_...
wrangler secret put GEMINI_API_KEY      # your Gemini API key
```

Edit `worker/wrangler.toml` and set `ALLOWED_ORIGIN` to your production frontend URL:

```toml
[vars]
ALLOWED_ORIGIN = "https://your-production-domain.com"
```

### 5. Run locally

```bash
# Terminal 1 — start the Cloudflare Worker on port 8787
cd worker && npm run dev

# Terminal 2 — start the React frontend on port 3000
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). On first visit you will be prompted to enter your **Stripe Customer ID** (found in your Stripe confirmation email, e.g. `cus_xxxxxxxxxxxxxx`).

### 6. Deploy

```bash
# Deploy the Worker to Cloudflare
cd worker && npm run deploy

# Build and deploy the frontend (Cloudflare Pages, Vercel, Netlify, etc.)
npm run build
# upload the dist/ folder to your hosting provider
```

---

## Environment Variables Reference

| Variable | Where | Description |
|---|---|---|
| `GEMINI_API_KEY` | `.env.local` | Google Gemini API key (frontend) |
| `VITE_WORKER_URL` | `.env.local` | URL of the Cloudflare Worker |
| `STRIPE_SECRET_KEY` | Worker secret | Stripe secret key (`sk_test_...` / `sk_live_...`) |
| `STRIPE_PRICE_ID` | Worker secret | Stripe Price ID for the subscription |
| `GEMINI_API_KEY` | Worker secret | Google Gemini API key used by the Worker |
| `ALLOWED_ORIGIN` | `worker/wrangler.toml` | Production frontend URL (CORS) |

---

## Architecture

```
┌─────────────────────────────────┐
│        Browser (React)          │
│  - Reads stripe_customer_id     │
│    from localStorage            │
│  - Sends Authorization: Bearer  │
│    <stripe_customer_id>         │
└────────────┬────────────────────┘
             │ HTTPS POST /api/chat
             ▼
┌─────────────────────────────────┐
│    Cloudflare Worker            │
│  1. Parse customer ID           │
│  2. Call Stripe REST API        │
│     GET /v1/subscriptions       │
│  3a. Active → proxy to Gemini   │
│  3b. No sub → 402 + checkout URL│
└────────┬────────────────────────┘
         │ HTTPS POST (SSE)
         ▼
┌─────────────────────────────────┐
│        Gemini API               │
│  generativelanguage.googleapis  │
└─────────────────────────────────┘
```

---

## Monitoring Costs

| Service | Where to check |
|---|---|
| Gemini API | [aistudio.google.com](https://aistudio.google.com) → **Usage** tab |
| Cloudflare Worker | [dash.cloudflare.com](https://dash.cloudflare.com) → Account → Billing → Subscriptions |
| Stripe revenue | [dashboard.stripe.com](https://dashboard.stripe.com) |
