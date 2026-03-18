// StacksFund Contract Addresses
// Dummy addresses — update these after mainnet deployment
export const CONTRACTS = {
  CROWDFUNDING: "SP3STACKSFUND000000000000000000000000.crowdfunding-campaign",
  VOTING: "SP3STACKSFUND000000000000000000000000.voting",
  MILESTONE_TRACKER: "SP3STACKSFUND000000000000000000000000.milestone-tracker",
} as const;

export const STACKS_NETWORK_CONFIG = {
  chainId: 1, // Mainnet
  coreApiUrl: "https://api.hiro.so",
} as const;

export const PLATFORM_CONFIG = {
  name: "StacksFund",
  tagline: "Community Funding & Governance",
  version: "1.0.0",
  deployer: "SP3STACKSFUND000000000000000000000000",
} as const;
