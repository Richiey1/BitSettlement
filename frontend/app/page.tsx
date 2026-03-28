"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Rocket, Vote, CheckSquare, Shield, Users, TrendingUp, Award, ChevronRight, BarChart2, MessageSquare, CheckCircle, UserCheck, Sprout } from "lucide-react";
import { HeroIllustration } from "./components/hero-illustration";
import { useStacks } from "@/lib/hooks/use-stacks";

function Counter({ target, prefix = "", suffix = "" }: { target: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let n = 0;
    const step = target / 80;
    const timer = setInterval(() => {
      n = Math.min(n + step, target);
      setCount(Math.floor(n));
      if (n >= target) clearInterval(timer);
    }, 25);
    return () => clearInterval(timer);
  }, [inView, target]);
  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

const features = [
  { icon: Rocket, colorClass: "text-primary", bgClass: "bg-primary/10", title: "Crowdfunding", sub: "Fund Projects", desc: "Launch your project and receive community backing. Funds held in smart contract escrow and released only when verified milestones are completed.", href: "/campaigns", stat: "124 Campaigns" },
  { icon: Vote, colorClass: "text-companion", bgClass: "bg-companion/10", title: "Governance Voting", sub: "Shape the Protocol", desc: "Vote on proposals that shape the platform. Token-weighted voting with configurable quorum protection. Every voice counts, anchored to Bitcoin.", href: "/governance", stat: "847 Proposals" },
  { icon: CheckSquare, colorClass: "text-primary", bgClass: "bg-primary/10", title: "Milestone Tracker", sub: "Accountable Delivery", desc: "Break projects into milestones. Community reviewers vote to approve each fund release. Full accountability — zero rug-pulls, zero undelivered promises.", href: "/milestones", stat: "2,400+ Tracked" },
];

const stats = [
  { icon: BarChart2, label: "Active Campaigns", target: 124 },
  { icon: TrendingUp, label: "Total Funded", prefix: "$", target: 3200000 },
  { icon: MessageSquare, label: "Proposals Voted", target: 847 },
  { icon: UserCheck, label: "Community Members", target: 2400, suffix: "+" },
];

const steps = [
  { num: "01", title: "Connect Wallet", desc: "Link your Stacks wallet. Your on-chain identity grants you voting power and the ability to back or create campaigns." },
  { num: "02", title: "Fund or Govern", desc: "Back a campaign you believe in, create your own, or vote on governance proposals that affect the protocol." },
  { num: "03", title: "Milestones Release Funds", desc: "Reviewers vote to approve milestones. Funds flow automatically when consensus is reached — transparent and trustless." },
];

export default function Home() {
  const { connect, isConnected } = useStacks();
  const featuresRef = useRef(null);
  const inView = useInView(featuresRef, { once: true, margin: "-80px" });

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#030d06] min-h-[95vh] flex items-center">
        {/* Organic dot pattern */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle, #10B981 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        {/* Glow orbs */}
        <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-companion/8 rounded-full blur-[140px] pointer-events-none animate-breathe" />
        <div className="absolute bottom-[20%] right-[15%] w-[400px] h-[400px] bg-primary/6 rounded-full blur-[120px] pointer-events-none" />
        {/* Vine-like SVG accent */}
        <svg className="absolute right-0 top-0 h-full w-32 opacity-[0.05] pointer-events-none" viewBox="0 0 100 800" preserveAspectRatio="none">
          <path d="M80,0 Q20,100 80,200 Q20,300 80,400 Q20,500 80,600 Q20,700 80,800" fill="none" stroke="#10B981" strokeWidth="2" />
          <circle cx="80" cy="200" r="6" fill="#10B981" />
          <circle cx="80" cy="400" r="4" fill="#F97316" />
          <circle cx="80" cy="600" r="5" fill="#10B981" />
        </svg>

        <div className="relative mx-auto max-w-7xl px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          <div>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-companion/10 border border-companion/20 mb-8">
              <Sprout className="w-4 h-4 text-companion" />
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-companion">Community-Powered &middot; Bitcoin-Secured</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}
              className="text-5xl md:text-7xl font-light leading-[1.02] tracking-tight text-white mb-6" style={{ fontFamily: "var(--font-heading), sans-serif" }}>
              Fund the<br />
              <span className="font-bold text-companion text-emerald-glow">Future.</span><br />
              Govern <span className="text-primary font-bold">Together.</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className="text-lg text-emerald-200/50 leading-relaxed mb-10 max-w-lg">
              On-chain crowdfunding, transparent governance, and milestone-based fund release — all on Stacks L2, secured by Bitcoin. The community decides. The blockchain enforces.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
              className="flex flex-wrap items-center gap-4">
              {isConnected ? (
                <Link href="/campaigns" className="group inline-flex items-center gap-3 rounded-2xl bg-primary px-9 py-4 text-sm font-bold text-white hover:bg-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.25)] transition-all hover:scale-105 active:scale-95">
                  Explore Campaigns <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <button onClick={connect} className="group inline-flex items-center gap-3 rounded-2xl bg-primary px-9 py-4 text-sm font-bold text-white hover:bg-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.25)] transition-all hover:scale-105 active:scale-95">
                  Connect &amp; Fund <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              )}
              <Link href="/governance" className="inline-flex items-center gap-2 rounded-2xl border border-companion/20 px-9 py-4 text-sm font-semibold text-companion hover:bg-companion/5 hover:border-companion/30 transition-all">
                View Proposals <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
              className="flex items-center gap-8 mt-12 pt-8 border-t border-companion/10">
              {[{ icon: Shield, label: "Bitcoin Finality" }, { icon: Users, label: "Community-Governed" }, { icon: Award, label: "Milestone-Based" }].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-emerald-300/40">
                  <Icon className="w-4 h-4 text-companion/60" />
                  <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.3 }}
            className="hidden lg:block">
            <HeroIllustration />
          </motion.div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="bg-secondary/40 border-y border-border backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(({ icon: Icon, label, target, prefix, suffix }) => (
            <div key={label} className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-companion/10 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-companion" />
              </div>
              <div>
                <p className="text-xl font-bold" style={{ fontFamily: "var(--font-heading), sans-serif" }}><Counter target={target} prefix={prefix} suffix={suffix} /></p>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section ref={featuresRef} className="py-28 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <motion.p initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              className="text-xs font-semibold uppercase tracking-[0.3em] text-companion mb-4">Platform Features</motion.p>
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-light tracking-tight" style={{ fontFamily: "var(--font-heading), sans-serif" }}>
              Fund. Vote. Build.<br />
              <span className="font-bold text-companion text-emerald-glow">Transparently on Bitcoin.</span>
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <motion.div key={feat.href} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.15 * i + 0.2 }}>
                  <Link href={feat.href} className="group flex flex-col h-full p-8 rounded-2xl border border-border bg-card/50 backdrop-blur-sm hover:border-companion/40 hover:-translate-y-2 transition-all duration-300 cursor-pointer hover:shadow-[0_0_30px_rgba(16,185,129,0.06)]">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-companion/20 to-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Icon className={`w-6 h-6 ${feat.colorClass}`} />
                    </div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary mb-2">{feat.sub}</p>
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-companion transition-colors" style={{ fontFamily: "var(--font-heading), sans-serif" }}>{feat.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1">{feat.desc}</p>
                    <div className="mt-6 flex items-center justify-between pt-4 border-t border-border/50">
                      <span className="text-[10px] font-bold text-companion bg-companion/10 px-3 py-1.5 rounded-md uppercase tracking-wider">{feat.stat}</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-companion group-hover:translate-x-2 transition-all" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-6 bg-secondary/20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-companion mb-4">How It Works</p>
            <h2 className="text-3xl md:text-5xl font-light" style={{ fontFamily: "var(--font-heading), sans-serif" }}>Three steps to build<br /><span className="font-bold">with community backing.</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div key={step.num} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="flex flex-col gap-4 p-8 rounded-2xl bg-card/50 border border-border backdrop-blur-sm">
                <span className="text-7xl font-light text-companion/15 leading-none" style={{ fontFamily: "var(--font-heading), sans-serif" }}>{step.num}</span>
                <h3 className="text-xl font-semibold -mt-2" style={{ fontFamily: "var(--font-heading), sans-serif" }}>{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-companion via-emerald-500 to-companion p-14 text-center shadow-[0_0_60px_rgba(16,185,129,0.2)]">
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: "radial-gradient(circle at 15% 50%,white 1.5px,transparent 1.5px),radial-gradient(circle at 85% 50%,white 1px,transparent 1px)", backgroundSize: "48px 48px" }} />
            <h2 className="relative text-4xl md:text-5xl font-bold text-white mb-5" style={{ fontFamily: "var(--font-heading), sans-serif" }}>Start Building with Community Backing.</h2>
            <p className="relative text-white/80 mb-10 max-w-lg mx-auto text-lg">Connect your Stacks wallet and launch your project or start voting on governance proposals today.</p>
            <button onClick={connect} className="group inline-flex items-center gap-3 rounded-2xl bg-white px-10 py-4 text-sm font-bold text-emerald-700 hover:bg-white/95 transition-all hover:scale-105 active:scale-95 shadow-lg">
              Connect Wallet <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
