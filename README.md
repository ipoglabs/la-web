# La-Web

Frontend web application for **Lokalads** — a multi-country classifieds platform.

## Tech Stack

- **Framework:** Next.js
- **Database:** MongoDB Atlas
- **Auth:** JWT-based authentication
- **Real-time:** WebSocket (Socket.IO)
- **Payments:** Razorpay (India/INR), Stripe (Singapore/SGD, UK/GBP)

## Getting Started

1. Clone the repo
2. Install dependencies:
```bash
   npm install
```
3. Set up environment variables (see `.env.example` if available):
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `COMING_SOON_SECRET`
   - SMTP credentials for email

4. Run the dev server:
```bash
   npm run dev
```

## Branches

- `main` — production-ready code
- `develop` — active development branch

## WebSocket Server

A separate WebSocket server lives in `ws-server/` and runs on port 4000 for real-time messaging.
