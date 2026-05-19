import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { idea } = await req.json();
    if (!idea) return NextResponse.json({ error: 'Missing idea.' }, { status: 400 });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Brutal Validator — Survival & Execution Plan',
            description: 'Personalized AI strategy: market analysis, risks, revenue model, 30-day launch plan.',
          },
          unit_amount: 900,
        },
        quantity: 1,
      }],
      mode: 'payment',
      customer_creation: 'always',
      metadata: { idea: idea.slice(0, 490) },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('[/api/checkout]', err);
    return NextResponse.json({ error: 'Checkout failed.' }, { status: 500 });
  }
}
