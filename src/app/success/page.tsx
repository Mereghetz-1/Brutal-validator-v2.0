'use client';

import Link from 'next/link';
import { CheckCircle, Mail, ArrowLeft } from 'lucide-react';

export default function SuccessPage() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f5f0e8', padding: 24, fontFamily: "'Arial Black', Arial, sans-serif" }}>

      <div className="anim-stripe-left" style={{ width: '100%', height: 12, background: 'black', position: 'fixed', top: 0 }} />

      <div className="brutal-card anim-slide-up" style={{ width: '100%', maxWidth: 560 }}>

        <div style={{ background: '#111', padding: '20px 28px', borderBottom: '3px solid black' }}>
          <div style={{ background: '#FFE500', display: 'inline-block', padding: '4px 12px', marginBottom: 10, fontSize: 11, fontWeight: 900, letterSpacing: 2, textTransform: 'uppercase' }}>
            Payment Confirmed
          </div>
          <h1 style={{ margin: 0, color: 'white', fontSize: 26, fontWeight: 900, textTransform: 'uppercase', letterSpacing: -1 }}>
            Your plan is on its way
          </h1>
        </div>

        <div style={{ padding: 32 }}>
          <div className="anim-pop-in delay-2" style={{ textAlign: 'center', marginBottom: 28, opacity: 0 }}>
            <CheckCircle size={64} strokeWidth={2} color="#22c55e" />
          </div>

          <p className="anim-fade-in delay-3" style={{ opacity: 0, fontSize: 17, lineHeight: 1.7, color: '#222', textAlign: 'center', fontFamily: 'Georgia, serif', fontWeight: 400, margin: '0 0 24px' }}>
            Your personalized <strong>Survival &amp; Execution Plan</strong> is being generated right now.
          </p>

          <div className="anim-slide-up delay-4" style={{ opacity: 0, background: '#f5f0e8', border: '2px solid black', padding: '16px 20px', marginBottom: 28, display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <Mail size={22} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontWeight: 900, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Check your email</div>
              <div style={{ fontSize: 14, fontFamily: 'Georgia, serif', color: '#555', lineHeight: 1.6 }}>
                Two emails: confirmation now, full strategy within minutes. Check spam if it doesn&apos;t arrive.
              </div>
            </div>
          </div>

          <div className="anim-fade-in delay-5" style={{ opacity: 0, marginBottom: 28 }}>
            <div style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2, color: '#888', marginBottom: 12 }}>What you&apos;ll receive</div>
            {[
              'Market reality check & real competitors',
              'Top 3 risks with mitigation strategies',
              'Your unfair advantage',
              'Exact revenue model & pricing',
              'First 3 customers: where + exact scripts',
              '30-day launch plan with daily actions',
              'Honest 1–10 verdict with reasoning',
            ].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 0', borderBottom: '1px solid #f0f0f0', fontSize: 14, color: '#333', fontFamily: 'Georgia, serif', lineHeight: 1.5 }}>
                <span style={{ color: '#22c55e', fontWeight: 900, flexShrink: 0 }}>✓</span>
                {item}
              </div>
            ))}
          </div>

          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1, color: '#888', textDecoration: 'none' }}>
            <ArrowLeft size={14} /> Roast another idea
          </Link>
        </div>
      </div>

      <div style={{ width: '100%', height: 12, background: 'black', position: 'fixed', bottom: 0 }} />
    </main>
  );
}
