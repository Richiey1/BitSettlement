"use client";

import { motion } from "framer-motion";

export function HeroIllustration() {
  return (
    <div className="relative w-full h-[440px] flex items-center justify-center select-none">
      <motion.div className="absolute w-80 h-80 rounded-full border border-companion/15"
        animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.4, 0.15] }}
        transition={{ duration: 4, repeat: Infinity }} />
      <motion.div className="absolute w-56 h-56 rounded-full border border-primary/20"
        animate={{ scale: [1, 1.08, 1], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 3.5, repeat: Infinity, delay: 0.8 }} />

      {/* Center: growth chart */}
      <motion.div className="relative z-10 w-32 h-32"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
        <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-[0_0_24px_rgba(16,185,129,0.4)]">
          <rect width="64" height="64" rx="16" fill="#064E3B"/>
          <rect width="64" height="64" rx="16" stroke="#10B981" strokeWidth="2"/>
          <rect x="8" y="46" width="10" height="11" rx="2" fill="#10B981" opacity="0.5"/>
          <rect x="22" y="36" width="10" height="21" rx="2" fill="#10B981" opacity="0.75"/>
          <rect x="36" y="24" width="10" height="33" rx="2" fill="#F97316"/>
          <path d="M52 10 L57 19 L54.5 19 L54.5 38 L49.5 38 L49.5 19 L47 19 Z" fill="#F97316"/>
        </svg>
      </motion.div>

      {/* Campaign card */}
      <motion.div className="absolute top-6 right-8 bg-card border border-border rounded-2xl p-4 shadow-xl w-44"
        animate={{ y: [0, -10, 0], rotate: [0, 1, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase text-companion">Campaign</span>
          <span className="text-[10px] font-bold bg-companion/15 text-companion px-2 py-0.5 rounded-full">ACTIVE</span>
        </div>
        <p className="text-sm font-black text-foreground mb-2">DeFi Builder Fund</p>
        <div className="mb-1">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Raised</span>
            <span className="font-bold text-companion">73%</span>
          </div>
          <div className="h-1.5 bg-secondary rounded-full">
            <motion.div className="h-full bg-companion rounded-full"
              initial={{ width: "0%" }} animate={{ width: "73%" }}
              transition={{ duration: 2.5, delay: 0.5 }} />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1"><span className="font-bold text-foreground">14,600</span> / 20,000 STX</p>
      </motion.div>

      {/* Governance card */}
      <motion.div className="absolute bottom-10 right-4 bg-card border border-border rounded-2xl p-4 shadow-xl w-36"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}>
        <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="#F97316" strokeWidth="2">
            <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
          </svg>
        </div>
        <p className="text-[10px] text-muted-foreground">Proposal #24</p>
        <p className="text-xs font-bold text-companion">PASSED</p>
        <p className="text-xs mt-0.5 text-muted-foreground">84% Yes</p>
      </motion.div>

      {/* Milestone card */}
      <motion.div className="absolute top-14 left-4 bg-card border border-border rounded-2xl p-4 shadow-xl w-32"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}>
        <div className="w-8 h-8 rounded-xl bg-companion/10 flex items-center justify-center mb-2">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="#10B981" strokeWidth="2">
            <polyline points="9 11 12 14 22 4"/>
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
          </svg>
        </div>
        <p className="text-[10px] text-muted-foreground">Milestone</p>
        <p className="text-xs font-bold text-companion">APPROVED</p>
        <p className="text-xs font-black mt-0.5 text-primary">+2,500 STX</p>
      </motion.div>

      {/* Rising coins */}
      {[0, 1, 2].map((i) => (
        <motion.div key={i}
          className="absolute bottom-16 text-companion font-bold text-xs"
          style={{ left: `${36 + i * 11}%` }}
          animate={{ y: [0, -48, -80], opacity: [0, 1, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.8, ease: "easeOut" }}>
          ₿
        </motion.div>
      ))}
    </div>
  );
}
