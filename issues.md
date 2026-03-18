# Project Roadmap & Issues - Stacks Fund

This document tracks the development of the Stacks Fund governance and crowdfunding platform.

---

## Phase 1: Core Contracts

### Issue #1: Voting & Governance Contract
**Status:** COMPLETED
**Description:** Implement  governance with proposals, voting, and finalization.
- **Tasks:**
  - [x] Implement `create-proposal` with category and quorum support
  - [x] Implement `vote` (yes/no) with double-vote prevention
  - [x] Implement `vote-abstain` for quorum contribution without yes/no
  - [x] Implement `finalize-proposal` with quorum and majority check
  - [x] Implement `cancel-proposal` for creator
  - [x] Add transparent vote records and voter stats tracking
  - [x] Add Clarity 4 `to-ascii?` proposal summaries

### Issue #2: Crowdfunding Campaign Contract
**Status:** COMPLETED
**Description:** Full crowdfunding lifecycle with auto-success and refund mechanics.
- **Tasks:**
  - [x] Implement `create-campaign` with goal and category support
  - [x] Implement `contribute` with auto-success on goal reached
  - [x] Implement `withdraw-funds` for successful campaigns
  - [x] Implement `claim-refund` for failed/expired/cancelled campaigns
  - [x] Implement `cancel-campaign` for creator
  - [x] Add backer and creator global stats tracking
  - [x] Add indexed contributor enumeration

### Issue #3: Milestone Tracker Contract
**Status:** COMPLETED
**Description:** Community-verified milestone system for campaign accountability.
- **Tasks:**
  - [x] Implement `add-milestone` with configurable approval threshold
  - [x] Implement `start-milestone` for progress tracking
  - [x] Implement `submit-evidence` with hash and description
  - [x] Implement `approve-milestone` with auto-resolve at threshold
  - [x] Implement `reject-milestone` with auto-resolve at threshold
  - [x] Add reviewer reputation stats tracking

---

## Phase 2: Frontend Integration

### Issue #4: Governance Dashboard
**Status:** PENDING
**Description:** Connect frontend to governance contracts.
- **Tasks:**
  - [ ] Proposal creation and browsing UI
  - [ ] Voting interface with real-time tallies
  - [ ] Proposal finalization view
  - [ ] Wallet connection (Leather/Xverse)

### Issue #5: Campaign Funding Interface
**Status:** PENDING
**Description:** Campaign creation, contribution, and progress tracking.
- **Tasks:**
  - [ ] Campaign listing with progress bars
  - [ ] Contribution flow with amount input
  - [ ] Milestone timeline with evidence display
  - [ ] Refund claim interface

---

## Phase 3: Deployment

### Issue #6: Testnet Deployment
**Status:** PENDING
- [ ] Deploy all 3 contracts to Stacks testnet
- [ ] Test full governance -> funding -> milestone flow
- [ ] Test refund mechanics on failed campaigns

### Issue #7: Mainnet Deployment
**Status:** PENDING
- [ ] Audit contracts
- [ ] Deploy to mainnet
- [ ] Register on Talent Protocol

---

## Completed Milestones
- [x] Project scaffold
- [x] All 3 core contracts written (, Clarity 4)
- [x] Clarinet configuration updated
- [x] Documentation updated
