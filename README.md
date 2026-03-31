# sudo.supply — Storefront

Next.js 14 e-commerce storefront for the [sudo macro pad](https://sudo.supply).

## Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS with custom design tokens
- **Auth**: Clerk (admin role via `publicMetadata.role`)
- **Database**: Supabase (products, orders, settings)
- **Checkout**: Shopify Storefront API

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in Clerk, Supabase, Shopify keys
npm run dev                   # http://localhost:3000
```

## Features

- Terminal/cyberpunk design language with glassmorphism
- Product catalog with image upload, drag-and-drop reorder
- Draft/publish workflow for products
- Bulk ordering calculator with tiered pricing
- Admin dashboard (Clerk role-gated)
- Mobile-responsive design
- sudo command toasts on cart actions
- Live purchase feed (social proof)
- Pre-order support for out-of-stock products
- Product reviews and Q&A
- Public analytics dashboard (anonymous usage telemetry from the companion app)
- Telemetry API endpoint for opt-in usage data ingestion
- Bug reports API for in-app bug reporting from the companion app menu bar

## Design tokens

The visual language is defined in `packages/design-tokens/tokens.json` in the [sudo-supply monorepo](https://github.com/ibrue/sudo-supply). CSS variables are generated and used throughout — see `src/app/globals.css`.

## Testing

```bash
npm test          # Vitest + React Testing Library
npm run build     # type-check + production build
```
