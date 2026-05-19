import Stripe from 'stripe';
import OpenAI from 'openai';
import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export const maxDuration = 60;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const resend = new Resend(process.env.RESEND_API_KEY);

async function generateStrategy(idea: string): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 2000,
    messages: [
      {
        role: 'system',
        content: `You are a world-class startup strategist. A founder just paid $9 for brutally honest, actionable advice.

Write a complete Survival & Execution Plan using this structure:

## 1. Market Reality Check
Who actually buys this? Real market size (specific numbers). 3 real competitors.

## 2. Top 3 Risks That Will Kill This
For each: name, why it's real, % chance it kills the business, how to mitigate.

## 3. Unfair Advantage
ONE specific thing this founder could do that's very hard to copy.

## 4. Revenue Model
Exact pricing. Who pays, how much, when. Monthly revenue at 100 customers.

## 5. First 3 Customers — Where & What to Say
3 specific places (subreddit, Slack, LinkedIn search) + exact cold message to send.

## 6. 30-Day Launch Plan
- **Days 1–7:** 3 specific actions
- **Days 8–14:** 3 specific actions
- **Days 15–30:** 3 specific actions

## 7. Honest Verdict
Score: X/10. Two sentences why. One sentence on what makes it an 8+.

Zero fluff. This is a battle plan.`,
      },
      { role: 'user', content: `Business idea: "${idea}"` },
    ],
  });
  return completion.choices[0]?.message?.content ?? '';
}

function confirmHtml(idea: string) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{margin:0;padding:0;background:#f5f0e8;font-family:Arial,sans-serif}.w{max-width:600px;margin:40px auto}.h{background:#111;padding:24px 32px}.h h1{margin:0;color:#FFE500;font-size:26px;font-weight:900;text-transform:uppercase}.badge{background:#FF6B9D;color:#000;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:2px;padding:4px 12px;display:inline-block;margin-bottom:12px}.b{background:white;border:3px solid #111;border-top:none;padding:32px;box-shadow:6px 6px 0 #111}.idea{background:#f5f0e8;border:2px solid #111;padding:16px;margin:20px 0;font-family:Georgia,serif;font-size:16px;line-height:1.6;color:#333}p{color:#333;font-size:16px;line-height:1.7;margin:16px 0}.hi{background:#FFE500;padding:2px 6px;font-weight:900}.ft{margin-top:32px;font-size:11px;color:#999;text-transform:uppercase;letter-spacing:1px;text-align:center;padding-top:16px;border-top:1px solid #e0e0e0}</style></head><body><div class="w"><div class="h"><div class="badge">Payment confirmed</div><h1>Your plan is being generated</h1></div><div class="b"><p>Payment received. Your <span class="hi">Survival &amp; Execution Plan</span> arrives in a separate email within minutes.</p><div class="idea">${idea}</div><p>Market reality check, top risks, unfair advantage, revenue model, first 3 customers with exact scripts, 30-day launch plan.</p><p>No fluff. A real battle plan.</p><div class="ft">Brutal Validator — Built with brutality. No feelings were spared.</div></div></div></body></html>`;
}

function strategyHtml(idea: string, md: string) {
  const html = md
    .replace(/^## (.+)$/gm, '<h2 style="font-size:17px;font-weight:900;text-transform:uppercase;color:#111;margin:28px 0 8px;padding-top:20px;border-top:2px solid #eee;">$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^- (.+)$/gm, '<li style="margin:6px 0;color:#333;font-size:15px;">$1</li>')
    .replace(/\n\n/g, '</p><p style="color:#333;font-size:15px;line-height:1.7;margin:10px 0;">');
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{margin:0;padding:0;background:#f5f0e8;font-family:Arial,sans-serif}.w{max-width:600px;margin:40px auto}.h{background:#111;padding:24px 32px}.h h1{margin:0;color:#FFE500;font-size:26px;font-weight:900;text-transform:uppercase}.badge{background:#FFE500;color:#000;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:2px;padding:4px 12px;display:inline-block;margin-bottom:12px}.b{background:white;border:3px solid #111;border-top:none;padding:32px;box-shadow:6px 6px 0 #111}.idea{background:#f5f0e8;border-left:4px solid #FFE500;padding:12px 16px;margin:0 0 24px;font-family:Georgia,serif;font-size:14px;line-height:1.6;color:#555;font-style:italic}h2{font-size:17px;font-weight:900;text-transform:uppercase;color:#111;margin:28px 0 8px;padding-top:20px;border-top:2px solid #eee}p{color:#333;font-size:15px;line-height:1.7;margin:10px 0}li{margin:6px 0;color:#333;font-size:15px}.ft{margin-top:32px;font-size:11px;color:#999;text-transform:uppercase;letter-spacing:1px;text-align:center;padding-top:16px;border-top:1px solid #e0e0e0}</style></head><body><div class="w"><div class="h"><div class="badge">Your Strategy</div><h1>Survival &amp; Execution Plan</h1></div><div class="b"><div class="idea">"${idea}"</div><div>${html}</div><div class="ft">Brutal Validator — No feelings were spared. Reply with questions.</div></div></div></body></html>`;
}

export async function POST(req: Request) {
  const body = await req.text();
  const sig = (await headers()).get('stripe-signature');
  if (!sig) return NextResponse.json({ error: 'No signature.' }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('[webhook] Bad signature:', err);
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 });
  }

  if (event.type !== 'checkout.session.completed') return NextResponse.json({ received: true });

  const session = event.data.object as Stripe.Checkout.Session;
  const idea = session.metadata?.idea;
  const email = session.customer_details?.email;

  if (!idea || !email) {
    console.error('[webhook] Missing idea or email');
    return NextResponse.json({ error: 'Missing data.' }, { status: 400 });
  }

  try {
    await resend.emails.send({
      from: process.env.FROM_EMAIL ?? 'Brutal Validator <noreply@brutalvalidator.com>',
      to: email,
      subject: '✅ Payment confirmed — your plan is being generated',
      html: confirmHtml(idea),
    });

    const strategy = await generateStrategy(idea);

    await resend.emails.send({
      from: process.env.FROM_EMAIL ?? 'Brutal Validator <noreply@brutalvalidator.com>',
      to: email,
      subject: '🔥 Your Brutal Survival & Execution Plan is here',
      html: strategyHtml(idea, strategy),
    });
  } catch (err) {
    console.error('[webhook] Error:', err);
    return NextResponse.json({ error: 'Processing failed.' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
