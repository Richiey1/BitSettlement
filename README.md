# BitAggregator 🌊

**The Advanced DEX Aggregator for the Stacks Ecosystem.**

BitAggregator optimises trade execution by splitting swaps across multiple liquidity sources (Alex, Arkadiko, Bitflow, Velar) to minimize slippage and maximize output for users.

## 🚀 Features

### 🧠 Smart Routing
- **Multi-Hop Paths:** Automatically finds the most efficient route (e.g., STX -> USDA -> sBTC).
- **Split Execution:** Divides large orders across multiple pools to reduce price impact.

### 🛡️ Safety First
- **Slippage Protection:** Reverts transactions if the output amount falls below the user's minimum limit.
- **Gas Optimization:** Estimates gas costs for complex routes to ensure profitability.

### 💰 Yield Integration
- **Idle Asset Optimization:** Optionally deposits idle assets into yield-bearing pools while waiting for target prices.

## 🏗️ Technical Architecture

### Smart Contracts (`/smartcontract`)
- **`liquidity-aggregator.clar`**: The core router contract. Interfaces with DEX traits to execute swaps.
- **Traits:** Implements `sip-010` and DEX-specific interface traits.

### Frontend (`/frontend`)
- **Interface:** Next.js dashboard for users to perform swaps.
- **Analytics:** Real-time chart of liquidity depth across Stacks DEXs.

## 📦 Deployment

### Prerequisites
- Clarinet
- Stacks Wallet (Leather/Xverse)

### Installation
```bash
git clone https://github.com/StacksTrench/BitAggregator.git
cd BitAggregator/smartcontract
clarinet check
```

## 🤝 Contributing
We follow a strict modular commit style. Please open an issue before submitting a PR.
