import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Stethoscope,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing — ParaCompanion",
  description:
    "Choose the plan that fits your career stage. Free, Learner, and Practitioner tiers for UK paramedics.",
};

const tiers = [
  {
    name: "Free",
    price: "£0",
    period: "forever",
    description: "Get started with core clinical tools — no card required.",
    highlight: false,
    features: [
      "NEWS2 calculator",
      "Basic session history (last 5)",
      "Airlock PII protection",
      "Offline support",
      "Community support",
    ],
    cta: "Get Started",
    href: "https://app.paracompanion.co.uk/onboarding",
  },
  {
    name: "Learner",
    price: "£3.99",
    period: "/month",
    description:
      "For student paramedics building clinical confidence with guided learning.",
    highlight: true,
    badge: "Most Popular",
    features: [
      "Everything in Free",
      "All 9 clinical tools",
      "Unlimited session history",
      "CPD Academy access",
      "Structured learning modules",
      "Quiz engine with feedback",
      "Portfolio-ready CPD hours log",
      "Priority support",
    ],
    cta: "Start Free Trial",
    href: "https://app.paracompanion.co.uk/onboarding?plan=learner",
  },
  {
    name: "Practitioner",
    price: "£7.99",
    period: "/month",
    description:
      "For qualified clinicians who need the full suite plus advanced analytics.",
    highlight: false,
    features: [
      "Everything in Learner",
      "Handover document export (PDF)",
      "Advanced session analytics",
      "Multi-device sync",
      "Team sharing (coming soon)",
      "SBAR & ATMISTER export",
      "Dedicated clinical support",
      "Early access to new tools",
    ],
    cta: "Start Free Trial",
    href: "https://app.paracompanion.co.uk/onboarding?plan=practitioner",
  },
];

export default function PricingPage() {
  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Stethoscope size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Para<span className="gradient-text">Companion</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <a
              href="https://app.paracompanion.co.uk/login"
              className="hidden sm:inline-flex text-sm font-medium text-text-muted hover:text-foreground transition"
            >
              Log in
            </a>
            <a
              href="https://app.paracompanion.co.uk/onboarding"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-white text-sm font-semibold hover:bg-foreground/90 transition shadow-sm"
            >
              Get Started
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-24 bg-surface-container min-h-screen">
        <div className="max-w-7xl mx-auto px-6">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-text-muted hover:text-foreground transition mb-12"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          {/* Header */}
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">
              Pricing
            </p>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight">
              Choose the plan that fits your
              <br />
              <span className="gradient-text">career stage</span>
            </h1>
            <p className="mt-4 text-lg text-text-muted max-w-xl mx-auto">
              Start free, upgrade when you&apos;re ready. All plans include
              offline support and Airlock PII protection.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-2xl p-8 flex flex-col transition-all duration-300 ${
                  tier.highlight
                    ? "bg-white border-2 border-primary shadow-xl shadow-primary/10 scale-[1.03]"
                    : "bg-white border border-border/60 hover:shadow-lg"
                }`}
              >
                {tier.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary text-white text-xs font-bold uppercase tracking-wider shadow-lg">
                      <Sparkles size={14} />
                      {tier.badge}
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-bold">{tier.name}</h3>
                  <p className="text-sm text-text-muted mt-1">
                    {tier.description}
                  </p>
                </div>

                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-black tracking-tight">
                    {tier.price}
                  </span>
                  <span className="text-sm text-text-muted font-medium">
                    {tier.period}
                  </span>
                </div>

                <ul className="space-y-3 mb-8 flex-grow">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <CheckCircle2
                        size={18}
                        className={`mt-0.5 flex-shrink-0 ${
                          tier.highlight ? "text-primary" : "text-emerald-500"
                        }`}
                      />
                      <span className="text-sm text-foreground/80">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <a
                  href={tier.href}
                  className={`w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm tracking-wide transition ${
                    tier.highlight
                      ? "bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/20"
                      : "bg-surface-dim text-foreground hover:bg-border"
                  }`}
                >
                  {tier.cta}
                  <ArrowRight size={16} />
                </a>
              </div>
            ))}
          </div>

          {/* FAQ tease */}
          <div className="text-center mt-20">
            <p className="text-sm text-text-muted">
              All plans include a 14-day free trial. Cancel anytime. No clinical data is stored on our servers — ever.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-foreground text-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} ParaCompanion. All rights reserved. Not a
          replacement for clinical judgement.
        </div>
      </footer>
    </>
  );
}
