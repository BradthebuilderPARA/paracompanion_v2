import Stripe from 'stripe';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is required in environment variables');
}

export const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2024-04-10' as '2026-02-25.clover',
  typescript: true,
});
