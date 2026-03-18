"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Rocket, TrendingUp, Users, Clock, Plus, Filter, CheckCircle2, XCircle } from "lucide-react";
import { useStacks } from "@/lib/hooks/use-stacks";

const CAMPAIGNS = [
  {
    id: "FUND-001",
    title: "Decentralized Bitcoin Oracle Network",
    creator: "SP2X...4K9Q",
    goal: 50000,
    raised: 41200,
    backers: 214,
    daysLeft: 12,
    status: "ACTIVE",
    category: "Infrastructure",
    description: "Building a trustless price oracle for BTC/USD feeds secured by Stacks validators.",
  },
  {
    id: "FUND-002",
    title: "Stacks Education DAO",
    creator: "SP3M...8WRZ",
    goal: 20000,
    raised: 20000,
    backers: 388,
    daysLeft: 0,
    status: "SUCCESSFUL",
    category: "Education",
    description: "Fund content creators, translators, and developers teaching Clarity.",
  },
  {
    id: "FUND-003",
    title: "sBTC Yield Aggregator",
    creator: "SP1L...2TFN",
    goal: 75000,
    raised: 18000,
    backers: 97,
    daysLeft: 28,
    status: "ACTIVE",
    category: "DeFi",
    description: "Auto-compound sBTC positions across Stacks DeFi protocols.",
  },
  {
    id: "FUND-004",
    title: "Bitcoin NFT Marketplace SDK",
    creator: "SP5R...9VKH",
    goal: 30000,
    raised: 4200,
    backers: 31,
    daysLeft: 0,
    status: "CANCELLED",
    category: "Tooling",
    description: "SDK for building NFT marketplaces on Bitcoin via Stacks.",
  },
  {
    id: "FUND-005",
    title: "Stacks Mobile Wallet",
    creator: "SP4C...6QPL",
    goal: 60000,
    raised: 60000,
    backers: 512,
    daysLeft: 0,
    status: "SUCCESSFUL",
    category: "Wallet",
    description: "Open-source iOS and Android Stacks wallet with sBTC support.",
  },
  {
    id: "FUND-006",
    title: "Clarity Auditing Tool",
    creator: "SP7N...1BXA",
    goal: 15000,
    raised: 8900,
    backers: 76,
    daysLeft: 18,
    status: "ACTIVE",
    category: "Security",
    description: "Static analysis and formal verification tool for Clarity smart contracts.",
  },
];

const STATUS_META: Record<string, { icon: React.ReactNode; style: string }> = {
  ACTIVE: {
    icon: <Clock className="w-3.5 h-3.5" />,
    style: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  },
  SUCCESSFUL: {
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    style: "bg-green-500/10 text-green-400 border border-green-500/20",
  },
  CANCELLED: {
    icon: <XCircle className="w-3.5 h-3.5" />,
    style: "bg-red-500/10 text-red-400 border border-red-500/20",
  },
};

const CATEGORY_COLORS: Record<string, string> = {
  Infrastructure: "bg-violet-500/10 text-violet-400",
  Education: "bg-yellow-500/10 text-yellow-400",
  DeFi: "bg-emerald-500/10 text-emerald-400",
  Tooling: "bg-orange-500/10 text-orange-400",
  Wallet: "bg-cyan-500/10 text-cyan-400",
  Security: "bg-red-500/10 text-red-400",
};

export default function CampaignsPage() {
  const { isConnected, connect } = useStacks();
  const [filter, setFilter] = useState("ALL");

  const filters = ["ALL", "ACTIVE", "SUCCESSFUL", "CANCELLED"];
  const filtered =
    filter === "ALL" ? CAMPAIGNS : CAMPAIGNS.filter((c) => c.status === filter);

  const handleFund = (id: string) => {
    if (!isConnected) {
      connect();
      return;
    }
    alert(`Funding campaign ${id}`);
  };

  const handleCreate = () => {
    if (!isConnected) {
      connect();
      return;
    }
    alert("Campaign creation coming soon.");
  };

  return (
    <main className="min-h-screen bg-[var(--background)] pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 border border-[var(--primary)]/20 flex items-center justify-center">
                <Rocket className="w-5 h-5 text-[var(--primary)]" />
              </div>
              <span className="text-sm font-medium text-[var(--primary)]">
                Fund the Future
              </span>
            </div>
            <h1 className="text-4xl font-bold text-[var(--foreground)] mb-2">
              Active Campaigns
            </h1>
            <p className="text-[var(--muted-foreground)]">
              Back Bitcoin-native projects. Funds released only on milestone completion.
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--primary)] text-white text-sm font-semibold hover:opacity-90 transition-opacity w-fit"
          >
            <Plus className="w-4 h-4" />
            Launch Campaign
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: "Total Raised", value: "152.3K STX", icon: <TrendingUp className="w-4 h-4" /> },
            { label: "Active Campaigns", value: "3", icon: <Rocket className="w-4 h-4" /> },
            { label: "Total Backers", value: "1,318", icon: <Users className="w-4 h-4" /> },
            { label: "Success Rate", value: "67%", icon: <CheckCircle2 className="w-4 h-4" /> },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-5 py-4 flex items-center gap-3"
            >
              <span className="text-[var(--companion)]">{stat.icon}</span>
              <div>
                <p className="text-xs text-[var(--muted-foreground)]">{stat.label}</p>
                <p className="text-lg font-bold text-[var(--foreground)]">{stat.value}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Filter */}
        <div className="flex items-center gap-2 mb-6">
          <Filter className="w-4 h-4 text-[var(--muted-foreground)]" />
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filter === f
                  ? "bg-[var(--primary)] text-white"
                  : "bg-[var(--card)] text-[var(--muted-foreground)] border border-[var(--border)] hover:border-[var(--primary)]/40"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Campaign cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((campaign, idx) => {
            const meta = STATUS_META[campaign.status];
            const pct = Math.min(100, Math.round((campaign.raised / campaign.goal) * 100));
            return (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.07, duration: 0.4 }}
                className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 hover:border-[var(--companion)]/40 transition-all flex flex-col"
              >
                <div className="flex items-start justify-between mb-3">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[campaign.category]}`}
                  >
                    {campaign.category}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${meta.style}`}
                  >
                    {meta.icon}
                    {campaign.status}
                  </span>
                </div>

                <h3 className="font-bold text-[var(--foreground)] text-base mb-1">
                  {campaign.title}
                </h3>
                <p className="text-xs text-[var(--muted-foreground)] mb-4 flex-1">
                  {campaign.description}
                </p>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-[var(--foreground)] font-semibold">
                      {campaign.raised.toLocaleString()} STX
                    </span>
                    <span className="text-[var(--muted-foreground)]">
                      of {campaign.goal.toLocaleString()} goal
                    </span>
                  </div>
                  <div className="h-2 bg-[var(--background)] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: idx * 0.07 + 0.3, duration: 0.8, ease: "easeOut" }}
                      className="h-full rounded-full bg-[var(--companion)]"
                    />
                  </div>
                  <p className="text-xs text-[var(--muted-foreground)] mt-1">{pct}% funded</p>
                </div>

                {/* Meta row */}
                <div className="flex justify-between text-xs text-[var(--muted-foreground)] mb-4">
                  <span>{campaign.backers} backers</span>
                  {campaign.daysLeft > 0 ? (
                    <span>{campaign.daysLeft} days left</span>
                  ) : (
                    <span>Ended</span>
                  )}
                </div>

                <button
                  onClick={() => handleFund(campaign.id)}
                  disabled={campaign.status !== "ACTIVE"}
                  className="w-full py-2.5 rounded-xl bg-[var(--companion)] text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {campaign.status === "ACTIVE" ? "Back This Campaign" : campaign.status}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
