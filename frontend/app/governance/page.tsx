"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Vote, CheckCircle2, XCircle, Clock, TrendingUp, Users } from "lucide-react";
import { useStacks } from "@/lib/hooks/use-stacks";

const PROPOSALS = [
  {
    id: "PROP-001",
    title: "Increase Max Campaign Goal to 200K STX",
    author: "SP2X...4K9Q",
    status: "ACTIVE",
    yesVotes: 14200,
    noVotes: 3800,
    totalVotes: 18000,
    quorum: 20000,
    endsIn: "3d 14h",
    description:
      "Raise the per-campaign fundraising ceiling from 100K STX to 200K STX to support larger infrastructure projects.",
  },
  {
    id: "PROP-002",
    title: "Add Milestone Veto by Backers",
    author: "SP3M...8WRZ",
    status: "PASSED",
    yesVotes: 28400,
    noVotes: 2100,
    totalVotes: 30500,
    quorum: 20000,
    endsIn: "—",
    description:
      "Allow backers holding >5% of a campaign's tokens to veto a milestone release.",
  },
  {
    id: "PROP-003",
    title: "Reduce Platform Fee from 2% to 1%",
    author: "SP1L...2TFN",
    status: "ACTIVE",
    yesVotes: 9100,
    noVotes: 7300,
    totalVotes: 16400,
    quorum: 20000,
    endsIn: "1d 6h",
    description: "Lower the protocol fee on successful fundraises to improve campaign viability.",
  },
  {
    id: "PROP-004",
    title: "Launch StacksFund Grant Program",
    author: "SP5R...9VKH",
    status: "REJECTED",
    yesVotes: 5000,
    noVotes: 22000,
    totalVotes: 27000,
    quorum: 20000,
    endsIn: "—",
    description: "Allocate 10K STX from treasury monthly for community grants.",
  },
  {
    id: "PROP-005",
    title: "Integrate sBTC as Funding Token",
    author: "SP4C...6QPL",
    status: "PASSED",
    yesVotes: 32000,
    noVotes: 4000,
    totalVotes: 36000,
    quorum: 20000,
    endsIn: "—",
    description: "Allow campaigns to raise and distribute sBTC in addition to STX.",
  },
  {
    id: "PROP-006",
    title: "Open Creator Verification Program",
    author: "SP7N...1BXA",
    status: "ACTIVE",
    yesVotes: 6200,
    noVotes: 2100,
    totalVotes: 8300,
    quorum: 20000,
    endsIn: "5d 2h",
    description:
      "Introduce a voluntary KYC-lite badge for campaign creators to increase backer trust.",
  },
];

const STATUS_META: Record<string, { icon: React.ReactNode; style: string; label: string }> = {
  ACTIVE: {
    label: "Active",
    icon: <Clock className="w-3.5 h-3.5" />,
    style: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  },
  PASSED: {
    label: "Passed",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    style: "bg-green-500/10 text-green-400 border border-green-500/20",
  },
  REJECTED: {
    label: "Rejected",
    icon: <XCircle className="w-3.5 h-3.5" />,
    style: "bg-red-500/10 text-red-400 border border-red-500/20",
  },
};

export default function GovernancePage() {
  const { isConnected, connect } = useStacks();
  const [filter, setFilter] = useState("ALL");
  const [voted, setVoted] = useState<Record<string, "yes" | "no">>({});

  const filters = ["ALL", "ACTIVE", "PASSED", "REJECTED"];
  const filtered =
    filter === "ALL" ? PROPOSALS : PROPOSALS.filter((p) => p.status === filter);

  const handleVote = (id: string, side: "yes" | "no") => {
    if (!isConnected) {
      connect();
      return;
    }
    setVoted((prev) => ({ ...prev, [id]: side }));
  };

  return (
    <main className="min-h-screen bg-[var(--background)] pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--companion)]/10 border border-[var(--companion)]/20 flex items-center justify-center">
              <Vote className="w-5 h-5 text-[var(--companion)]" />
            </div>
            <span className="text-sm font-medium text-[var(--companion)]">
              On-Chain Governance
            </span>
          </div>
          <h1 className="text-4xl font-bold text-[var(--foreground)] mb-2">
            Governance Proposals
          </h1>
          <p className="text-[var(--muted-foreground)]">
            Shape the future of StacksFund. Your STX stake is your vote.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: "Active Proposals", value: "3", icon: <Vote className="w-4 h-4" /> },
            { label: "Total Proposals", value: "6", icon: <TrendingUp className="w-4 h-4" /> },
            { label: "Quorum Required", value: "20K STX", icon: <Users className="w-4 h-4" /> },
            { label: "Pass Rate", value: "50%", icon: <CheckCircle2 className="w-4 h-4" /> },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-5 py-4 flex items-center gap-3"
            >
              <span className="text-[var(--companion)]">{s.icon}</span>
              <div>
                <p className="text-xs text-[var(--muted-foreground)]">{s.label}</p>
                <p className="text-lg font-bold text-[var(--foreground)]">{s.value}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Filter */}
        <div className="flex gap-2 mb-6">
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

        {/* Proposals */}
        <div className="flex flex-col gap-5">
          {filtered.map((proposal, idx) => {
            const meta = STATUS_META[proposal.status];
            const yesPct =
              proposal.totalVotes > 0
                ? Math.round((proposal.yesVotes / proposal.totalVotes) * 100)
                : 0;
            const noPct = 100 - yesPct;
            const quorumPct = Math.min(100, Math.round((proposal.totalVotes / proposal.quorum) * 100));
            const hasVoted = !!voted[proposal.id];

            return (
              <motion.div
                key={proposal.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.4 }}
                className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 hover:border-[var(--companion)]/40 transition-all"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-mono text-[var(--muted-foreground)]">
                        {proposal.id}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${meta.style}`}
                      >
                        {meta.icon}
                        {meta.label}
                      </span>
                    </div>
                    <h3 className="font-bold text-[var(--foreground)] text-lg mb-1">
                      {proposal.title}
                    </h3>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      {proposal.description}
                    </p>
                  </div>
                  {proposal.status === "ACTIVE" && (
                    <div className="text-right shrink-0">
                      <p className="text-xs text-[var(--muted-foreground)]">Ends in</p>
                      <p className="text-sm font-bold text-[var(--foreground)]">{proposal.endsIn}</p>
                    </div>
                  )}
                </div>

                {/* Vote bars */}
                <div className="space-y-2 mb-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-green-400 font-medium">Yes — {yesPct}%</span>
                      <span className="text-[var(--muted-foreground)]">
                        {proposal.yesVotes.toLocaleString()} STX
                      </span>
                    </div>
                    <div className="h-2 bg-[var(--background)] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${yesPct}%` }}
                        transition={{ delay: idx * 0.08 + 0.2, duration: 0.7 }}
                        className="h-full bg-green-500 rounded-full"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-red-400 font-medium">No — {noPct}%</span>
                      <span className="text-[var(--muted-foreground)]">
                        {proposal.noVotes.toLocaleString()} STX
                      </span>
                    </div>
                    <div className="h-2 bg-[var(--background)] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${noPct}%` }}
                        transition={{ delay: idx * 0.08 + 0.3, duration: 0.7 }}
                        className="h-full bg-red-500 rounded-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Quorum bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[var(--muted-foreground)]">Quorum: {quorumPct}%</span>
                    <span className="text-[var(--muted-foreground)]">
                      {proposal.totalVotes.toLocaleString()} / {proposal.quorum.toLocaleString()} STX
                    </span>
                  </div>
                  <div className="h-1.5 bg-[var(--background)] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${quorumPct}%` }}
                      transition={{ delay: idx * 0.08 + 0.4, duration: 0.7 }}
                      className="h-full bg-[var(--companion)] rounded-full"
                    />
                  </div>
                </div>

                {/* Vote buttons */}
                {proposal.status === "ACTIVE" && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleVote(proposal.id, "yes")}
                      disabled={hasVoted}
                      className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                        voted[proposal.id] === "yes"
                          ? "bg-green-500 text-white"
                          : "bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20"
                      } disabled:cursor-default`}
                    >
                      {voted[proposal.id] === "yes" ? "✓ Voted Yes" : "Vote Yes"}
                    </button>
                    <button
                      onClick={() => handleVote(proposal.id, "no")}
                      disabled={hasVoted}
                      className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                        voted[proposal.id] === "no"
                          ? "bg-red-500 text-white"
                          : "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
                      } disabled:cursor-default`}
                    >
                      {voted[proposal.id] === "no" ? "✓ Voted No" : "Vote No"}
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
