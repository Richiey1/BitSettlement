"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Rocket, Vote, CheckSquare, Shield, Users, TrendingUp, Award, ChevronRight, BarChart2, MessageSquare, CheckCircle, UserCheck } from "lucide-react";
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
      <section className="relative overflow-hidden bg-[#052e16] min-h-[92vh] flex items-center">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "radial-gradient(circle, #10B981 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-companion/6 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-primary/6 rounded-full blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-companion/15 border border-companion/30 mb-6">
              <div className="w-2 h-2 rounded-full bg-companion animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-companion">Community-Powered · Bitcoin-Secured</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight text-white mb-6">
              Fund the Future.<br />Govern<br /><span className="text-primary">Together.</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-lg text-green-200/70 leading-relaxed mb-8 max-w-lg">
              On-chain crowdfunding, transparent governance, and milestone-based fund release — all on Stacks L2, secured by Bitcoin. The community decides. The blockchain enforces.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center gap-4">
              {isConnected ? (
                <Link href="/campaigns" className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-bold text-white hover:bg-primary/90 shadow-xl shadow-primary/30 transition-all hover:scale-105 active:scale-95">
                  Explore Campaigns <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <button onClick={connect} className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-bold text-white hover:bg-primary/90 shadow-xl shadow-primary/30 transition-all hover:scale-105 active:scale-95">
                  Connect &amp; Fund <ArrowRight className="w-4 h-4" />
                </button>
              )}
              <Link href="/governance" className="inline-flex items-center gap-2 rounded-full border border-companion/30 px-8 py-3.5 text-sm font-bold text-companion hover:bg-companion/10 transition-all">
                View Proposals <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              className="flex items-center gap-6 mt-10">
              {[{ icon: Shield, label: "Bitcoin Finality" }, { icon: Users, label: "Community-Governed" }, { icon: Award, label: "Milestone-Based" }].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-green-300/60">
                  <Icon className="w-3.5 h-3.5 text-companion" />
                  <span className="text-xs font-medium">{label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <HeroIllustration />
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-secondary/50 border-y border-border">
        <div className="mx-auto max-w-7xl px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(({ icon: Icon, label, target, prefix, suffix }) => (
            <div key={label} className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-companion/10 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-companion" />
              </div>
              <div>
                <p className="text-2xl font-black"><Counter target={target} prefix={prefix} suffix={suffix} /></p>
                <p className="text-xs text-muted-foreground font-medium">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section ref={featuresRef} className="py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <motion.p initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              className="text-sm font-bold uppercase tracking-widest text-primary mb-3">Platform Features</motion.p>
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-black tracking-tight">
              Fund. Vote. Build.<br /><span className="text-primary">Transparently on Bitcoin.</span>
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <motion.div key={feat.href} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 * i + 0.2 }}>
                  <Link href={feat.href} className="group flex flex-col h-full p-8 rounded-3xl border border-border bg-card hover:border-companion/40 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer">
                    <div className={`w-14 h-14 ${feat.bgClass} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-6 h-6 ${feat.colorClass}`} />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">{feat.sub}</p>
                    <h3 className="text-xl font-black mb-3 group-hover:text-companion transition-colors">{feat.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1">{feat.desc}</p>
                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-xs font-bold text-companion bg-companion/10 px-3 py-1 rounded-full">{feat.stat}</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-companion group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-6 bg-secondary/30">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-sm font-bold uppercase tracking-widest text-companion mb-3">How It Works</p>
            <h2 className="text-3xl md:text-4xl font-black">Three steps to build<br />with community backing.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <motion.div key={step.num} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="flex flex-col gap-4 p-6 rounded-2xl bg-card border border-border">
                <span className="text-5xl font-black text-companion/20 leading-none">{step.num}</span>
                <h3 className="text-lg font-bold -mt-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-companion/90 to-companion p-12 text-center shadow-2xl shadow-companion/25">
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: "radial-gradient(circle at 20% 50%,white 1px,transparent 1px),radial-gradient(circle at 80% 50%,white 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
            <h2 className="relative text-3xl md:text-4xl font-black text-white mb-4">Start Building with Community Backing.</h2>
            <p className="relative text-white/80 mb-8 max-w-md mx-auto">Connect your Stacks wallet and launch your project or start voting on governance proposals today.</p>
            <button onClick={connect} className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-black text-companion hover:bg-white/90 transition-all hover:scale-105 active:scale-95 shadow-lg">
              Connect Wallet <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
