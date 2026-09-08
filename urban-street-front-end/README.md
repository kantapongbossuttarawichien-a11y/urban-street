This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## PWA and mobile navigation

The manifest installs Urban Street in standalone mode with generated 192/512px,
maskable, Apple touch, and favicon assets. Serve production over HTTPS. Service
worker registration is deliberately disabled during development.

The bottom tabs expose POS, dashboard, and menu management. Safe-area spacing
keeps the checkout above the navigation and iPhone home indicator. The current
cart survives route changes in session storage and is cleared by sign-out.

The service worker caches only public assets and a public offline fallback.
Authenticated HTML, RSC responses, API calls and order mutations are never cached.
Opening/reloading while offline displays the fallback; it does not bypass login
or reopen the full POS offline. The existing in-page offline order queue remains
unchanged. Reopen POS online to retry queued orders; background sync, conflict
resolution and server-side idempotency are not added by this change.

A waiting worker activates only after the user chooses Update; finish the current
sale first. Increment the `urban-street-static-v1` cache suffix when changing
pre-cached public assets. Check iOS Safari Add to Home Screen and Android Chrome
installation on real devices after deploying. Confirm tab navigation, cart
retention, expanded checkout, safe-area in portrait/landscape, offline reload,
and the update prompt with a subsequent cache version.

Validation: `npm run build`, `npx tsc --noEmit`, `node --test tests/pwa.test.mjs`.
PWA approach follows https://nextjs.org/docs/app/guides/progressive-web-apps.
