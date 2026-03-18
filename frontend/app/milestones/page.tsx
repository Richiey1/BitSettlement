"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckSquare, Clock, Loader2, CheckCircle2, ThumbsUp, AlertCircle } from "lucide-react";
import { useStacks } from "@/lib/hooks/use-stacks";

const MILESTONES = [
  {
    id: "MS-001",
    campaign: "Decentralized Bitcoin Oracle Network",
    campaignId: "FUND-001",
    title: "Phase 1 — Oracle Node Architecture",
    description: "Design and document the oracle node communication protocol and fallback mechanisms.",
    amount: 12000,
    status: "APPROVED",
    approvals: 8,
    required: 5,
    dueDate: "2025-02-28",
    completedDate: "2025-02-20",
  },
  {
    id: "MS-002",
    campaign: "Decentralized Bitcoin Oracle Network",
    campaignId: "FUND-001",
    title: "Phase 2 — Testnet Deployment",
    description: "Deploy oracle contracts on Stacks testnet and run 30 days of validation.",
    amount: 18000,
    status: "IN_PROGRESS",
    approvals: 3,
    required: 5,
    dueDate: "2025-04-15",
    completedDate: null,
  },
  {
    id: "MS-003",
    campaign: "Stacks Mobile Wallet",
    campaignId: "FUND-005",
    title: "MVP Release — iOS",
    description: "Ship a working iOS app on TestFlight with STX send/receive and sBTC view.",
    amount: 20000,
    status: "APPROVED",
    approvals: 12,
    required: 5,
    dueDate: "2025-01-31",
    completedDate: "2025-01-28",
  },
  {
    id: "MS-004",
    campaign: "Stacks Mobile Wallet",
    campaignId: "FUND-005",
    title: "MVP Release — Android",
    description: "Ship Android APK on Google Play Beta with full feature parity to iOS.",
    amount: 20000,
    status: "APPROVED",
    approvals: 10,
    required: 5,
    dueDate: "2025-02-28",
    completedDate: "2025-02-25",
  },
  {
    id: "MS-005",
    campaign: "sBTC Yield Aggregator",
    campaignId: "FUND-003",
    title: "Smart Contract Audit",
    description: "Complete third-party security audit of all yield aggregator Clarity contracts.",
    amount: 8000,
    status: "PENDING",
    approvals: 0,
    required: 5,
    dueDate: "2025-05-01",
    completedDate: null,
  },
  {
    id: "MS-006",
    campaign: "Clarity Auditing Tool",
    campaignId: "FUND-006",
    title: "Static Analyzer — Alpha",
    description: "Release alpha version of the Clarity static analysis CLI tool to GitHub.",
    amount: 5000,
    status: "IN_PROGRESS",
    approvals: 2,
    required: 5,
    dueDate: "2025-04-30",
    completedDate: null,
  },
];

const STATUS_META: Record<string, { label: string; icon: React.ReactNode; style: string }> = {
  PENDING: {
    label: "Pending",
    icon: <Clock className="w-3.5 h-3.5" />,
    style: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  },
  IN_PROGRESS: {
    label: "In Progress",
    icon: <Loader2 className="w-3.5 h-3.5 animate-spin" />,
    style: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  },
  APPROVED: {
    label: "Approved",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    style: "bg-green-500/10 text-green-400 border border-green-500/20",
  },
};

export default function MilestonesPage() {
  const { isConnected, connect } = useStacks();
  const [filter, setFilter] = useState("ALL");

  const filters = ["ALL", "PENDING", "IN_PROGRESS", "APPROVED"];
  const filtered =
    filter === "ALL" ? MILESTONES : MILESTONES.filter((m) => m.status === filter);

  const handleApprove = (id: string) => {
    if (!isConnected) {
      connect();
      return;
    }
    alert(`Approving milestone ${id}`);
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
            <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 border border-[var(--primary)]/20 flex items-center justify-center">
              <CheckSquare className="w-5 h-5 text-[var(--primary)]" />
            </div>
            <span className="text-sm font-medium text-[var(--primary)]">
              Milestone Tracker
            </span>
          </div>
          <h1 className="text-4xl font-bold text-[var(--foreground)] mb-2">
            Milestones
          </h1>
          <p className="text-[var(--muted-foreground)]">
            Funds release only when community approvers validate delivery.
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
            { label: "Total Milestones", value: "6" },
            { label: "Approved", value: "3" },
            { label: "In Progress", value: "2" },
            { label: "Pending", value: "1" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-5 py-4"
            >
              <p className="text-xs text-[var(--muted-foreground)] mb-1">{s.label}</p>
              <p className="text-xl font-bold text-[var(--foreground)]">{s.value}</p>
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
              {f === "IN_PROGRESS" ? "In Progress" : f}
            </button>
          ))}
        </div>

        {/* Milestones list */}
        <div className="flex flex-col gap-5">
          {filtered.map((ms, idx) => {
            const meta = STATUS_META[ms.status];
            const approvalPct = Math.min(100, Math.round((ms.approvals / ms.required) * 100));
            return (
              <motion.div
                key={ms.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.4 }}
                className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 hover:border-[var(--companion)]/40 transition-all"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Left */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-mono text-[var(--muted-foreground)]">
                        {ms.id}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${meta.style}`}
                      >
                        {meta.icon}
                        {meta.label}
                      </span>
                    </div>
                    <h3 className="font-bold text-[var(--foreground)] text-base mb-0.5">
                      {ms.title}
                    </h3>
                    <p className="text-xs text-[var(--primary)] mb-2">{ms.campaign}</p>
                    <p className="text-sm text-[var(--muted-foreground)] mb-4">
                      {ms.description}
                    </p>

                    {/* Approval bar */}
                    <div className="mb-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[var(--muted-foreground)]">
                          Approvals: {ms.approvals} / {ms.required} required
                        </span>
                        <span className="text-[var(--muted-foreground)]">{approvalPct}%</span>
                      </div>
                      <div className="h-2 bg-[var(--background)] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${approvalPct}%` }}
                          transition={{ delay: idx * 0.08 + 0.3, duration: 0.7 }}
                          className="h-full rounded-full bg-[var(--companion)]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="flex flex-col items-end justify-between gap-3 shrink-0">
                    <div className="text-right">
                      <p className="text-xs text-[var(--muted-foreground)]">Release Amount</p>
                      <p className="text-2xl font-bold text-[var(--primary)]">
                        {ms.amount.toLocaleString()} STX
                      </p>
                    </div>

                    <div className="text-right text-xs text-[var(--muted-foreground)] space-y-0.5">
                      <p>Due: {ms.dueDate}</p>
                      {ms.completedDate && (
                        <p className="text-green-400">Completed: {ms.completedDate}</p>
                      )}
                    </div>

                    {ms.status !== "APPROVED" ? (
                      <button
                        onClick={() => handleApprove(ms.id)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--companion)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        Approve
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5 text-green-400 text-sm font-medium">
                        <CheckCircle2 className="w-4 h-4" />
                        Funds Released
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-[var(--muted-foreground)]">
            <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No milestones match the selected filter.</p>
          </div>
        )}
      </div>
    </main>
  );
}
