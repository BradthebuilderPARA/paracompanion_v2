This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/create-next-app).

## Environment Variables

This app requires several environment variables before it will start.  
A template with all required keys (and the dev Supabase values pre-filled) is provided at `apps/web/.env.example`.

### First-time setup

```bash
cp apps/web/.env.example apps/web/.env.local
```

Then open `apps/web/.env.local` and fill in your values:

| Variable | What it is | Where to get it |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public anon key | Same page as above |
| `NEXT_PUBLIC_APP_URL` | Base URL of this app | `http://localhost:3000` for local dev; your Vercel URL for deployments |
| `STRIPE_SECRET_KEY` | Stripe secret API key | [Stripe Dashboard → Developers → API keys](https://dashboard.stripe.com/test/apikeys) — use a **test** key (`sk_test_...`) for dev |

> **Security note:** `.env.local` is listed in `.gitignore` and will never be committed.  
> Never commit a live Stripe secret key (`sk_live_...`).

## Getting Started

This app is part of a [Turborepo](https://turbo.build/repo) monorepo managed with [pnpm](https://pnpm.io).  
Run all commands from the **monorepo root** unless stated otherwise.

### Install dependencies

```bash
pnpm install
```

### Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can also run only the web app in isolation:

```bash
cd apps/web
pnpm dev
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out the [Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

When importing into Vercel, set **Root Directory** to `apps/web` and add the same environment variables (from `.env.example`) in **Project → Settings → Environment Variables**.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
