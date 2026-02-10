# Project Roadmap & Issues - BitAggregator 🌊

This document tracks the development of the BitAggregator DEX router, including smart contracts and frontend integration.

---

## 🚀 Priority: Critical

### Issue #1: Core Router Swap Function
**Status:** ✅ COMPLETED
**Description:** Implement the base router-swap function that accepts a DEX trait and executes a trade.
- **Tasks:**
  - [x] Define `dex-trait`.
  - [x] Implement `router-swap` function.
  - [x] Add slippage protection (`min-out`).

### Issue #2: Frontend Hook Setup
**Status:** ✅ COMPLETED
**Description:** Scaffold the `useAggregator` hook for frontend interactions.
- **Tasks:**
  - [x] Create `use-aggregator.ts`.
  - [x] Implement basic swap function stub.

### Issue #3: Multi-Hop Routing
**Status:** ❌ PENDING
**Description:** Enable routing trades through multiple pools (e.g., STX -> USDA -> sBTC).
- **Tasks:**
  - [ ] Update `router-swap` to accept a list of traits (or use a multi-hop contract pattern).
  - [ ] Implement path finding algorithm off-chain.

---

## 🛠️ Smart Contract Tasks

### Issue #4: Gas Estimation
**Status:** ❌ PENDING
**Description:** Estimate gas costs for complex routes to ensure profitability.
- **Tasks:**
  - [ ] Add `estimate-swap` read-only function.

### Issue #5: Fee Collection
**Status:** ❌ PENDING
**Description:** Collect a small protocol fee on each swap.
- **Tasks:**
  - [ ] Implement fee logic in `router-swap`.
  - [ ] Add `withdraw-fees` function for admin.

---

## 🎨 Frontend Tasks

### Issue #6: Swap Interface
**Status:** ❌ PENDING
**Description:** Create the main swap UI.
- **Tasks:**
  - [ ] Token selector modal.
  - [ ] Amount input with balance display.
  - [ ] Route visualization.

### Issue #7: Slippage Settings
**Status:** ❌ PENDING
**Description:** Allow users to configure slippage tolerance.
- **Tasks:**
  - [ ] Add settings modal.
  - [ ] Implement auto/custom slippage toggle.

---

## ✅ Completed Milestones
- [x] Project Scaffold (Frontend + Contracts)
- [x] Initial Contract Deployment Strategy
- [x] Basic Documentation
