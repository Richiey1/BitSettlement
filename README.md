# Stacks Fund

**Bitcoin-Native Community Funding & Governance on Stacks L2**

Stacks Fund is a fully barrier-free governance and crowdfunding platform built on Bitcoin via the Stacks blockchain. Propose ideas, vote on them, fund the winners, and track delivery through community-verified milestones — all without admin gates, gatekeepers, or minimum financial requirements.

Any wallet can interact with every core function. No whitelists. No token-gating. Just connect and participate.

## How It Works

### Voting & Governance
Create proposals with titles, descriptions, and categories. The community votes yes, no, or abstain. After the voting period, anyone can finalize the result. Proposals pass if they meet quorum and have a yes majority.

**Open functions:** `create-proposal`, `vote`, `vote-abstain`, `finalize-proposal`, `cancel-proposal`

### Crowdfunding Campaigns
Launch campaigns with funding goals. Backers contribute any amount of STX (even 1 microSTX). If the goal is reached, the creator withdraws the funds. If the campaign fails or expires, backers claim full refunds.

**Open functions:** `create-campaign`, `contribute`, `withdraw-funds`, `claim-refund`, `cancel-campaign`

### Milestone Tracker
Add milestones to campaigns, submit evidence of completion, and let the community verify delivery. Milestones auto-approve when they reach the approval threshold. Rejected milestones can be reworked and resubmitted.

**Open functions:** `add-milestone`, `start-milestone`, `submit-evidence`, `approve-milestone`, `reject-milestone`

## Barrier-Free Design

Every write function in Stacks Fund is callable by any external wallet:

| Contract | Open Write Functions | Total |
|---|---|---|
| `voting.clar` | `create-proposal`, `vote`, `vote-abstain`, `finalize-proposal`, `cancel-proposal` | 5 |
| `crowdfunding-campaign.clar` | `create-campaign`, `contribute`, `withdraw-funds`, `claim-refund`, `cancel-campaign` | 5 |
| `milestone-tracker.clar` | `add-milestone`, `start-milestone`, `submit-evidence`, `approve-milestone`, `reject-milestone` | 5 |
| **Total** | | **15** |

## No Minimums

All STX-facing functions accept amounts from `u1` (0.000001 STX). There are no floor limits on:
- Campaign goals
- Contribution amounts
- Milestone release amounts

## The Full Flow

```
1. Community member creates a PROPOSAL (voting.clar)
2. Community VOTES on the proposal
3. Proposal is FINALIZED — if passed:
4. Creator launches a CAMPAIGN (crowdfunding-campaign.clar)
5. Backers CONTRIBUTE STX toward the goal
6. Creator adds MILESTONES (milestone-tracker.clar)
7. Creator SUBMITS EVIDENCE of completion
8. Community APPROVES milestones
9. Creator WITHDRAWS funds
```

## Technical Stack

- **Clarity 4** — Latest smart contract language for Stacks
- **Nakamoto / Epoch 3.3** — Full Nakamoto upgrade compatibility
- **Clarinet** — Development and testing framework
- **Next.js** — Frontend dashboard

## Quick Start

```bash
cd smartcontract
clarinet check
clarinet console
```

## Project Structure

```
BitAggregator/
  smartcontract/
    contracts/
      voting.clar                  # Governance proposals and voting
      crowdfunding-campaign.clar   # Campaign funding with refunds
      milestone-tracker.clar       # Community-verified milestones
    Clarinet.toml
    settings/
  frontend/
    # Next.js dashboard
```

## Deployment

### Testnet
```bash
cd smartcontract
clarinet deployments generate --testnet --low-cost
clarinet deployment apply -p deployments/default.testnet-plan.yaml
```

### Mainnet
```bash
cd smartcontract
clarinet deployments generate --mainnet --medium-cost
clarinet deployment apply -p deployments/default.mainnet-plan.yaml
```

## Clarity 4 Features Used

- `to-ascii?` — Human-readable on-chain summaries for proposals, campaigns, and milestones
- `stacks-block-height` — Block-based timing for voting periods and campaign deadlines
- `as-contract` — Proper contract-as-principal pattern for STX custody

---

**Built for community funding on Bitcoin.**
