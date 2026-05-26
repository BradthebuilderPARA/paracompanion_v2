import Link from "next/link";
import {
  Activity,
  Baby,
  Heart,
  Shield,
  WifiOff,
  ArrowRight,
  Stethoscope,
  BookOpen,
  Clock,
  FileText,
  Lock,
  ListChecks,
} from "lucide-react";

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface-lowest/80 backdrop-blur-lg border-b border-border-ghost">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-[#003B9A] to-[#0050CB] flex items-center justify-center">
            <Stethoscope size={18} className="text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            Para<span className="gradient-text">Companion</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text-muted">
          <a href="#what-it-does" className="hover:text-foreground transition">What it does</a>
          <a href="#tools" className="hover:text-foreground transition">Tools</a>
          <Link href="/pricing" className="hover:text-foreground transition">Pricing</Link>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://app.paracompanion.co.uk/login"
            className="hidden sm:inline-flex text-sm font-medium text-text-muted hover:text-foreground transition"
          >
            Log in
          </a>
          <a
            href="https://app.paracompanion.co.uk/onboarding"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-foreground text-white text-sm font-semibold hover:bg-foreground/90 transition telemetry-shadow"
          >
            Try it free
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </nav>
  );
}

function HeroSection() {
  return (
    <section className="relative pt-32 pb-24 overflow-hidden animated-gradient">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative max-w-5xl mx-auto px-6 text-center">
        <p className="text-xs font-semibold tracking-[0.15em] uppercase text-slate-400 mb-8 font-technical">
          Built on shift. By a paramedic who needed it.
        </p>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.1] tracking-tight max-w-3xl mx-auto">
          You&apos;ve got a lot in your head.
          <br />
          <span className="text-sky-300">
            Put it somewhere safe.
          </span>
        </h1>

        <p className="mt-6 text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          ParaCompanion structures your observations, timelines, and handovers —
          so you can focus on the job, not the paperwork. Works offline. Data
          stays on your device.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://app.paracompanion.co.uk/onboarding"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-sm bg-white text-foreground font-bold text-base hover:bg-slate-100 transition telemetry-shadow"
          >
            Try it free
            <ArrowRight size={18} />
          </a>
          <a
            href="#what-it-does"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-sm bg-white/10 text-white font-semibold text-base backdrop-blur-sm border border-white/10 hover:bg-white/15 transition"
          >
            See how it works
          </a>
        </div>

        <div className="mt-16 flex items-center justify-center gap-8 text-xs text-slate-400 font-medium uppercase tracking-wider font-technical">
          <span className="flex items-center gap-1.5"><WifiOff size={14} /> Works offline</span>
          <span className="flex items-center gap-1.5"><Lock size={14} /> Data stays on device</span>
          <span className="flex items-center gap-1.5"><Shield size={14} /> DCB0129 assured</span>
        </div>
      </div>
    </section>
  );
}

function WhatItDoesSection() {
  const capabilities = [
    {
      icon: <WifiOff size={22} />,
      title: "Works without signal",
      description:
        "Everything runs locally on your device. No round-trips to a server, no outages. Enter your observations at the roadside, on the ambulance, wherever you are.",
    },
    {
      icon: <Lock size={22} />,
      title: "Nothing leaves your device",
      description:
        "Session data — observations, timelines, handover notes — lives in your browser only. You clear it when you're done. We never see it.",
    },
    {
      icon: <FileText size={22} />,
      title: "Structured documentation",
      description:
        "Enter what happened and when. ParaCompanion organises it into a consistent, structured account. Fewer details reconstructed from memory.",
    },
    {
      icon: <Clock size={22} />,
      title: "Session continuity",
      description:
        "Auto-saving means you don't lose your work if the app crashes or the browser closes mid-call. Pick up where you left off.",
    },
    {
      icon: <BookOpen size={22} />,
      title: "Reflective CPD",
      description:
        "Capture reflections while the incident is fresh. Guided prompts help structure your entries in a portfolio-ready format. Coming soon.",
    },
    {
      icon: <Shield size={22} />,
      title: "Built to DCB0129",
      description:
        "Clinical safety standard compliance is not an afterthought. Hazard log maintained. No patient identifiers collected. The interpretation stays with you.",
    },
  ];

  return (
    <section id="what-it-does" className="py-24 bg-surface-base">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-3 font-technical">
            What it does
          </p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">
            Structured support for the paperwork side
          </h2>
          <p className="mt-4 text-text-muted max-w-xl mx-auto">
            ParaCompanion organises what you enter. The clinical decisions remain
            entirely with you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border-ghost">
          {capabilities.map((c) => (
            <div
              key={c.title}
              className="bg-surface-lowest p-8 group hover:bg-white transition-colors duration-200"
            >
              <div className="w-10 h-10 rounded-sm bg-primary/8 text-primary flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-white transition-colors duration-200">
                {c.icon}
              </div>
              <h3 className="text-base font-bold mb-2">{c.title}</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                {c.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ToolsSection() {
  const tools = [
    {
      icon: <Activity size={24} />,
      name: "Observations reference",
      subtitle: "Adult vital signs",
      description:
        "Enter your patient's vital signs and see them displayed alongside standard reference ranges. The interpretation stays with you.",
      accentColor: "bg-adult-emerald",
    },
    {
      icon: <Baby size={24} />,
      name: "Paediatric reference",
      subtitle: "Age-specific ranges",
      description:
        "Enter paediatric observations and view them against age-specific normal values. NICE traffic light display for context.",
      accentColor: "bg-paediatric-blue",
    },
    {
      icon: <Heart size={24} />,
      name: "Maternity reference",
      subtitle: "Obstetric observations",
      description:
        "Display entered maternal observations alongside pregnancy-specific reference ranges.",
      accentColor: "bg-maternity-purple",
    },
    {
      icon: <ListChecks size={24} />,
      name: "Structured handover",
      subtitle: "ATMISTER / SBAR",
      description:
        "Organises your entered observations and events into a consistent handover structure. Fewer missed details at the critical moment.",
      accentColor: "bg-adult-emerald",
    },
    {
      icon: <Clock size={24} />,
      name: "Incident timeline",
      subtitle: "Timestamped events",
      description:
        "Record events as they happen. ParaCompanion logs what you enter with timestamps, giving you a structured account.",
      accentColor: "bg-emergency-red",
    },
    {
      icon: <Stethoscope size={24} />,
      name: "Clinical history",
      subtitle: "SAMPLE / SOCRATES",
      description:
        "Guided prompts help you capture a structured clinical history. Enter what you find — the tool organises the format.",
      accentColor: "bg-paediatric-blue",
    },
  ];

  return (
    <section id="tools" className="py-24 bg-surface-lowest">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-3 font-technical">
            Documentation tools
          </p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">
            Everything in one place
          </h2>
          <p className="mt-4 text-text-muted max-w-xl mx-auto">
            Each tool structures a different part of your clinical encounter.
            All work offline. All keep data on your device.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <div
              key={tool.name}
              className="relative bg-surface-base rounded-sm p-8 border border-border-ghost overflow-hidden group hover:telemetry-shadow transition-shadow duration-300"
            >
              {/* 4px accent bar per design system */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${tool.accentColor}`} />

              <div className="flex items-center gap-3 mb-4">
                <div className="text-text-muted group-hover:text-primary transition-colors">
                  {tool.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold leading-tight">{tool.name}</h3>
                  <p className="text-xs text-text-muted font-technical uppercase tracking-wider">
                    {tool.subtitle}
                  </p>
                </div>
              </div>
              <p className="text-sm text-text-muted leading-relaxed">
                {tool.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-24 animated-gradient">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
          Written by a paramedic. Used by paramedics.
        </h2>
        <p className="mt-4 text-lg text-slate-300 max-w-xl mx-auto">
          ParaCompanion is a PWA — no app store, no commission cut, no inflated
          subscription. Just a fair price for something that should exist.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://app.paracompanion.co.uk/onboarding"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-sm bg-white text-foreground font-bold text-base hover:bg-slate-100 transition telemetry-shadow"
          >
            Try it free
            <ArrowRight size={18} />
          </a>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-sm bg-white/10 text-white font-semibold text-base backdrop-blur-sm border border-white/10 hover:bg-white/15 transition"
          >
            See pricing
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-foreground text-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-[#003B9A] to-[#0050CB] flex items-center justify-center">
                <Stethoscope size={18} className="text-white" />
              </div>
              <span className="text-lg font-bold">ParaCompanion</span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              A documentation and handover aid built by a paramedic, for
              paramedics. Nothing you enter during a call ever leaves your device.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-slate-300 mb-4 font-technical">
              Product
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#what-it-does" className="hover:text-white transition">What it does</a></li>
              <li><a href="#tools" className="hover:text-white transition">Tools</a></li>
              <li><Link href="/pricing" className="hover:text-white transition">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-slate-300 mb-4 font-technical">
              Legal
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition">Clinical Safety</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-700 text-center">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} ParaCompanion. All rights reserved.
          </p>
          <p className="text-[10px] text-slate-600 mt-2 font-technical">
            ParaCompanion is a non-diagnostic cognitive aid. It does not detect, diagnose, predict,
            recommend treatment, or direct clinical management. All clinical decisions remain with
            the registered clinician using the tool.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <WhatItDoesSection />
      <ToolsSection />
      <CTASection />
      <Footer />
    </>
  );
}
