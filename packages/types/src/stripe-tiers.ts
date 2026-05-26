/**
 * Stripe Tier & Price Constants
 * Unified source of truth for Web and Mobile billing.
 */

export const STRIPE_PRODUCTS = {
  LEARNER: 'prod_UDPSh3NnmVyJer',
  PRACTITIONER: 'prod_UDPS1Ndp3AS4bZ',
};

export const STRIPE_PRICES = {
  LEARNER_MONTHLY: 'price_1TEyeC4Dvhbs6Pjv9ECkDTAo',
  LEARNER_ANNUAL: 'price_1TEyeC4Dvhbs6PjvqrH7nUuj',
  PRACTITIONER_MONTHLY: 'price_1TEyeD4Dvhbs6PjvxtcMolKV',
  PRACTITIONER_ANNUAL: 'price_1TEyeD4Dvhbs6PjvzexZuXzK',
};

export const TIER_METADATA = {
  learner: {
    name: 'Learner (Student/Associate)',
    annual_price: 20,
    monthly_price: 2.99,
    savings_annual: '£15.88',
  },
  practitioner: {
    name: 'Practitioner (Professional)',
    annual_price: 30,
    monthly_price: 3.99,
    savings_annual: '£17.88',
  },
};
