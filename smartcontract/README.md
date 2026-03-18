# Smart Contracts — Stacks Fund

This directory contains the Clarity 4 smart contracts for Stacks Fund, a  community funding and governance platform on Bitcoin L2.

## Contracts

### voting.clar
A fully open governance system. Any wallet can create proposals, vote, and finalize results.

**Data structures:**
- `proposals` — Full proposal config with yes/no/abstain tallies and category
- `has-voted` — Prevents double-voting
- `vote-records` — Transparent vote choice per voter (for auditing)
- `voter-stats` — Global voter participation stats

**Write functions (all ):**
- `create-proposal(title, description, category, duration-blocks, quorum)` — Start a governance proposal
- `vote(proposal-id, support)` — Vote yes or no
- `vote-abstain(proposal-id)` — Vote abstain (counts toward quorum)
- `finalize-proposal(proposal-id)` — Close voting and determine outcome
- `cancel-proposal(proposal-id)` — Creator cancels proposal

**Read functions:**
- `get-proposal`, `has-user-voted`, `get-vote-record`, `get-voter-stats-info`
- `get-governance-stats` — Global governance statistics
- `get-proposal-summary` — Clarity 4 `to-ascii?` human-readable proposal info

---

### crowdfunding-campaign.clar
A fully open crowdfunding system with auto-success detection and refund mechanics.

**Data structures:**
- `campaigns` — Full campaign config with goal, raised, deadline, category
- `contributions` — Per-contributor amount per campaign
- `campaign-contributors` — Indexed contributors for enumeration
- `backer-stats` — Global backer career stats
- `creator-stats` — Global creator career stats

**Write functions (all ):**
- `create-campaign(title, description, category, goal, duration-blocks)` — Launch a campaign
- `contribute(campaign-id, amount)` — Back a campaign with STX (any amount)
- `withdraw-funds(campaign-id)` — Creator claims after success
- `claim-refund(campaign-id)` — Backer reclaims if failed/expired/cancelled
- `cancel-campaign(campaign-id)` — Creator cancels (enables refunds)

**Read functions:**
- `get-campaign`, `get-contribution`, `get-contributor-at`
- `get-backer-stats-info`, `get-creator-stats-info`
- `get-funding-stats` — Global funding statistics
- `get-campaign-summary` — Clarity 4 `to-ascii?` human-readable campaign info

---

### milestone-tracker.clar
Community-verified milestone tracking for accountability and phased fund releases.

**Data structures:**
- `milestones` — Full milestone config with evidence, approvals, rejections, threshold
- `campaign-milestone-count` — Milestone count per campaign
- `milestone-votes` — Per-voter vote record (approve/reject with timestamp)
- `reviewer-stats` — Global reviewer reputation stats

**Write functions (all ):**
- `add-milestone(campaign-id, description, amount-release, approval-threshold)` — Add a milestone
- `start-milestone(campaign-id, milestone-id)` — Move to in-progress
- `submit-evidence(campaign-id, milestone-id, evidence-hash, evidence-desc)` — Submit proof of completion
- `approve-milestone(campaign-id, milestone-id)` — Vote to approve (auto-resolves at threshold)
- `reject-milestone(campaign-id, milestone-id)` — Vote to reject (auto-resolves at threshold)

**Read functions:**
- `get-milestone`, `get-milestone-count`, `get-vote`, `has-voted-on-milestone`
- `get-reviewer-stats-info` — Reviewer reputation data
- `get-milestone-tracker-stats` — Global milestone statistics
- `get-milestone-summary` — Clarity 4 `to-ascii?` human-readable milestone info

## Testing

```bash
npm install
npm run test
clarinet check
```

## Deployment

See root [README](../README.md) for deployment instructions.

---

**Clarity 4 | Nakamoto | Epoch 3.3**
