# Construction Material Shop

A modern, full-stack e-commerce app for construction materials built on Next.js 15, React 19, TypeScript, Prisma, and PostgreSQL. It includes cart + checkout, order creation, payments (Stripe live-ready; ABA/ACLEDA placeholders), KHQR demo flow, admin tools, and notifications.

## Features

- E‑commerce core: products, server‑backed cart, checkout, order PDF
- Payments: Stripe Checkout + webhook, KHQR demo with polling and admin confirm
- Notifications: Email (SMTP) and Telegram on payment webhook and admin confirm
- Admin tools: list/confirm orders API + admin UI with SSR guard
- Security: cookie session, admin allowlist, middleware guards, rate limiting, CSP

## Quick Start

1. Install dependencies

```
npm install
```

2. Configure environment

```
cp .env.example .env.local
```

Fill at minimum:

- `DATABASE_URL`
- `NEXT_PUBLIC_APP_URL`
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- `EMAIL_SMTP_HOST/PORT/USER/PASS`, `EMAIL_FROM` (optional)
- `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` (optional)
- `ADMIN_EMAILS`

3. Database

```
npm run db:migrate
npm run db:seed
```

4. Develop

```
npm run dev
```

Open http://localhost:3000.

## Payments

- Stripe: `src/app/api/payments/stripe/route.ts` (create session),
  `src/app/api/payments/stripe/webhook/route.ts` (webhook updates + notifications)
- KHQR (demo): `src/app/api/payments/khqr/route.ts`, UI at `/checkout/khqr`
- Placeholders: ABA `src/app/api/payments/aba/route.ts`, AC `.../ac/route.ts`

Order confirmation screen: `/order-confirmation` with PDF download.

## Admin

- APIs: list orders, confirm order, whoami
- UI: `/admin/orders` with SSR guard; navbar shows link for admins

Admin emails are set via `ADMIN_EMAILS` (comma‑separated). Sessions use `construction_material_shop_session` cookie (SameSite=Strict).

## Notifications

- Email: `src/lib/mail.ts`
- Telegram: `src/lib/telegram.ts`

Triggered by Stripe webhook and admin confirmation.

## Repository & PRs

`master` is protected. Use branches and open PRs. See CONTRIBUTING.md for details. Line endings are normalized to LF via `.gitattributes`.

## Next Steps

- Integrate real ABA PayWay and ACLEDA (redirect + webhook + signatures)
- Optional: KHQR production payload + webhook
- Polish: status chips, spinners, toasts; README deep dive
