import { NextResponse } from 'next/server';
import { stripe } from '../../../../lib/stripe';
import { STRIPE_PRICES } from '@paracompanion/types';

export async function POST(req: Request) {
  try {
    const { priceId, userId, email, successUrl, cancelUrl } = await req.json();

    if (!priceId || !userId) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Create Checkout Sessions from body params
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/onboarding?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/onboarding`,
      customer_email: email,
      client_reference_id: userId,
      subscription_data: {
        metadata: {
          userId: userId,
        },
      },
      // UK VAT (20%) compliance
      automatic_tax: { enabled: true },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe Checkout Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
