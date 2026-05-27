import Stripe from 'stripe';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

// We export a getter or just instantiate with a fallback so Next.js static builds don't fail
export const stripe = new Stripe(STRIPE_SECRET_KEY || 'sk_test_mock_for_build', {
  apiVersion: '2024-04-10' as '2026-02-25.clover',
  typescript: true,
});
