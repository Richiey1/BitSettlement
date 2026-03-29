// StacksFund Contract Addresses
export const CONTRACTS = {
  CROWDFUNDING: "SP258BY8D71JCTV73A4V3ADPHCVWSBEM6G4FETPYF.SF-crowdfunding-campaign",
  VOTING: "SP258BY8D71JCTV73A4V3ADPHCVWSBEM6G4FETPYF.SF-voting",
  MILESTONE_TRACKER: "SP258BY8D71JCTV73A4V3ADPHCVWSBEM6G4FETPYF.SF-milestone-tracker",
} as const;

export const STACKS_NETWORK_CONFIG = {
  chainId: 1, // Mainnet
  coreApiUrl: "https://api.hiro.so",
} as const;

export const PLATFORM_CONFIG = {
  name: "StacksFund",
  tagline: "Community Funding & Governance",
  version: "1.0.0",
  deployer: "SP258BY8D71JCTV73A4V3ADPHCVWSBEM6G4FETPYF",
} as const;
