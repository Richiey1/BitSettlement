"use client";

import { useState, useCallback } from 'react';
import { Cl, fetchCallReadOnlyFunction, cvToJSON } from '@stacks/transactions';
import { CONTRACTS, STACKS_NETWORK_CONFIG } from '../constants/contracts';
import { useStacks } from './use-stacks';
import { executeContractAction } from '../stacks-actions';

// ─── Voting & Governance ──────────────────────────────────────────────────

export function useVoting() {
  const { stxAddress } = useStacks();
  const [loading, setLoading] = useState(false);
  const [addr, name] = CONTRACTS.VOTING.split('.');

  const getProposal = useCallback(async (proposalId: number) => {
    try {
      const result = await fetchCallReadOnlyFunction({
        contractAddress: addr,
        contractName: name,
        functionName: 'get-proposal',
        functionArgs: [Cl.uint(proposalId)],
        network: STACKS_NETWORK_CONFIG as any,
        senderAddress: stxAddress || addr,
      });
      return cvToJSON(result);
    } catch (e) {
      console.error('get-proposal error', e);
      return null;
    }
  }, [addr, name, stxAddress]);

  const getGovernanceStats = useCallback(async () => {
    try {
      const result = await fetchCallReadOnlyFunction({
        contractAddress: addr,
        contractName: name,
        functionName: 'get-governance-stats',
        functionArgs: [],
        network: STACKS_NETWORK_CONFIG as any,
        senderAddress: stxAddress || addr,
      });
      return cvToJSON(result);
    } catch (e) {
      console.error('get-governance-stats error', e);
      return null;
    }
  }, [addr, name, stxAddress]);

  const hasUserVoted = useCallback(async (proposalId: number, voter: string) => {
    try {
      const result = await fetchCallReadOnlyFunction({
        contractAddress: addr,
        contractName: name,
        functionName: 'has-user-voted',
        functionArgs: [Cl.uint(proposalId), Cl.principal(voter)],
        network: STACKS_NETWORK_CONFIG as any,
        senderAddress: stxAddress || addr,
      });
      return cvToJSON(result);
    } catch (e) {
      console.error('has-user-voted error', e);
      return null;
    }
  }, [addr, name, stxAddress]);

  const createProposal = async (
    title: string,
    description: string,
    category: string,
    durationBlocks: number,
    quorum: number,
    onFinish: (data: any) => void
  ) => {
    setLoading(true);
    await executeContractAction(
      addr, name,
      'create-proposal',
      [
        Cl.stringAscii(title),
        Cl.stringAscii(description),
        Cl.stringAscii(category),
        Cl.uint(durationBlocks),
        Cl.uint(quorum),
      ],
      (data) => { setLoading(false); onFinish(data); },
      () => setLoading(false)
    );
  };

  const vote = async (
    proposalId: number,
    support: boolean,
    onFinish: (data: any) => void
  ) => {
    setLoading(true);
    await executeContractAction(
      addr, name,
      'vote',
      [Cl.uint(proposalId), Cl.bool(support)],
      (data) => { setLoading(false); onFinish(data); },
      () => setLoading(false)
    );
  };

  const voteAbstain = async (proposalId: number, onFinish: (data: any) => void) => {
    setLoading(true);
    await executeContractAction(
      addr, name,
      'vote-abstain',
      [Cl.uint(proposalId)],
      (data) => { setLoading(false); onFinish(data); },
      () => setLoading(false)
    );
  };

  const finalizeProposal = async (proposalId: number, onFinish: (data: any) => void) => {
    setLoading(true);
    await executeContractAction(
      addr, name,
      'finalize-proposal',
      [Cl.uint(proposalId)],
      (data) => { setLoading(false); onFinish(data); },
      () => setLoading(false)
    );
  };

  const cancelProposal = async (proposalId: number, onFinish: (data: any) => void) => {
    setLoading(true);
    await executeContractAction(
      addr, name,
      'cancel-proposal',
      [Cl.uint(proposalId)],
      (data) => { setLoading(false); onFinish(data); },
      () => setLoading(false)
    );
  };

  return {
    getProposal,
    getGovernanceStats,
    hasUserVoted,
    createProposal,
    vote,
    voteAbstain,
    finalizeProposal,
    cancelProposal,
    loading,
  };
}

// ─── Crowdfunding Campaign ────────────────────────────────────────────────

export function useCrowdfunding() {
  const { stxAddress } = useStacks();
  const [loading, setLoading] = useState(false);
  const [addr, name] = CONTRACTS.CROWDFUNDING.split('.');

  const getCampaign = useCallback(async (campaignId: number) => {
    try {
      const result = await fetchCallReadOnlyFunction({
        contractAddress: addr,
        contractName: name,
        functionName: 'get-campaign',
        functionArgs: [Cl.uint(campaignId)],
        network: STACKS_NETWORK_CONFIG as any,
        senderAddress: stxAddress || addr,
      });
      return cvToJSON(result);
    } catch (e) {
      console.error('get-campaign error', e);
      return null;
    }
  }, [addr, name, stxAddress]);

  const getFundingStats = useCallback(async () => {
    try {
      const result = await fetchCallReadOnlyFunction({
        contractAddress: addr,
        contractName: name,
        functionName: 'get-funding-stats',
        functionArgs: [],
        network: STACKS_NETWORK_CONFIG as any,
        senderAddress: stxAddress || addr,
      });
      return cvToJSON(result);
    } catch (e) {
      console.error('get-funding-stats error', e);
      return null;
    }
  }, [addr, name, stxAddress]);

  const getContribution = useCallback(async (campaignId: number, contributor: string) => {
    try {
      const result = await fetchCallReadOnlyFunction({
        contractAddress: addr,
        contractName: name,
        functionName: 'get-contribution',
        functionArgs: [Cl.uint(campaignId), Cl.principal(contributor)],
        network: STACKS_NETWORK_CONFIG as any,
        senderAddress: stxAddress || addr,
      });
      return cvToJSON(result);
    } catch (e) {
      console.error('get-contribution error', e);
      return null;
    }
  }, [addr, name, stxAddress]);

  const createCampaign = async (
    title: string,
    description: string,
    category: string,
    goal: number,
    durationBlocks: number,
    onFinish: (data: any) => void
  ) => {
    setLoading(true);
    await executeContractAction(
      addr, name,
      'create-campaign',
      [
        Cl.stringAscii(title),
        Cl.stringAscii(description),
        Cl.stringAscii(category),
        Cl.uint(goal),
        Cl.uint(durationBlocks),
      ],
      (data) => { setLoading(false); onFinish(data); },
      () => setLoading(false)
    );
  };

  const contribute = async (
    campaignId: number,
    amount: number,
    onFinish: (data: any) => void
  ) => {
    setLoading(true);
    await executeContractAction(
      addr, name,
      'contribute',
      [Cl.uint(campaignId), Cl.uint(amount)],
      (data) => { setLoading(false); onFinish(data); },
      () => setLoading(false)
    );
  };

  const withdrawFunds = async (campaignId: number, onFinish: (data: any) => void) => {
    setLoading(true);
    await executeContractAction(
      addr, name,
      'withdraw-funds',
      [Cl.uint(campaignId)],
      (data) => { setLoading(false); onFinish(data); },
      () => setLoading(false)
    );
  };

  const claimRefund = async (campaignId: number, onFinish: (data: any) => void) => {
    setLoading(true);
    await executeContractAction(
      addr, name,
      'claim-refund',
      [Cl.uint(campaignId)],
      (data) => { setLoading(false); onFinish(data); },
      () => setLoading(false)
    );
  };

  const cancelCampaign = async (campaignId: number, onFinish: (data: any) => void) => {
    setLoading(true);
    await executeContractAction(
      addr, name,
      'cancel-campaign',
      [Cl.uint(campaignId)],
      (data) => { setLoading(false); onFinish(data); },
      () => setLoading(false)
    );
  };

  return {
    getCampaign,
    getFundingStats,
    getContribution,
    createCampaign,
    contribute,
    withdrawFunds,
    claimRefund,
    cancelCampaign,
    loading,
  };
}

// ─── Milestone Tracker ────────────────────────────────────────────────────

export function useMilestoneTracker() {
  const { stxAddress } = useStacks();
  const [loading, setLoading] = useState(false);
  const [addr, name] = CONTRACTS.MILESTONE_TRACKER.split('.');

  const getMilestone = useCallback(async (campaignId: number, milestoneId: number) => {
    try {
      const result = await fetchCallReadOnlyFunction({
        contractAddress: addr,
        contractName: name,
        functionName: 'get-milestone',
        functionArgs: [Cl.uint(campaignId), Cl.uint(milestoneId)],
        network: STACKS_NETWORK_CONFIG as any,
        senderAddress: stxAddress || addr,
      });
      return cvToJSON(result);
    } catch (e) {
      console.error('get-milestone error', e);
      return null;
    }
  }, [addr, name, stxAddress]);

  const getMilestoneCount = useCallback(async (campaignId: number) => {
    try {
      const result = await fetchCallReadOnlyFunction({
        contractAddress: addr,
        contractName: name,
        functionName: 'get-milestone-count',
        functionArgs: [Cl.uint(campaignId)],
        network: STACKS_NETWORK_CONFIG as any,
        senderAddress: stxAddress || addr,
      });
      return cvToJSON(result);
    } catch (e) {
      console.error('get-milestone-count error', e);
      return null;
    }
  }, [addr, name, stxAddress]);

  const getTrackerStats = useCallback(async () => {
    try {
      const result = await fetchCallReadOnlyFunction({
        contractAddress: addr,
        contractName: name,
        functionName: 'get-milestone-tracker-stats',
        functionArgs: [],
        network: STACKS_NETWORK_CONFIG as any,
        senderAddress: stxAddress || addr,
      });
      return cvToJSON(result);
    } catch (e) {
      console.error('get-milestone-tracker-stats error', e);
      return null;
    }
  }, [addr, name, stxAddress]);

  const addMilestone = async (
    campaignId: number,
    description: string,
    amountRelease: number,
    approvalThreshold: number,
    onFinish: (data: any) => void
  ) => {
    setLoading(true);
    await executeContractAction(
      addr, name,
      'add-milestone',
      [
        Cl.uint(campaignId),
        Cl.stringAscii(description),
        Cl.uint(amountRelease),
        Cl.uint(approvalThreshold),
      ],
      (data) => { setLoading(false); onFinish(data); },
      () => setLoading(false)
    );
  };

  const startMilestone = async (
    campaignId: number,
    milestoneId: number,
    onFinish: (data: any) => void
  ) => {
    setLoading(true);
    await executeContractAction(
      addr, name,
      'start-milestone',
      [Cl.uint(campaignId), Cl.uint(milestoneId)],
      (data) => { setLoading(false); onFinish(data); },
      () => setLoading(false)
    );
  };

  const submitEvidence = async (
    campaignId: number,
    milestoneId: number,
    evidenceHash: string,
    evidenceDesc: string,
    onFinish: (data: any) => void
  ) => {
    setLoading(true);
    await executeContractAction(
      addr, name,
      'submit-evidence',
      [
        Cl.uint(campaignId),
        Cl.uint(milestoneId),
        Cl.buffer(Buffer.from(evidenceHash.replace('0x', ''), 'hex')),
        Cl.stringAscii(evidenceDesc),
      ],
      (data) => { setLoading(false); onFinish(data); },
      () => setLoading(false)
    );
  };

  const approveMilestone = async (
    campaignId: number,
    milestoneId: number,
    onFinish: (data: any) => void
  ) => {
    setLoading(true);
    await executeContractAction(
      addr, name,
      'approve-milestone',
      [Cl.uint(campaignId), Cl.uint(milestoneId)],
      (data) => { setLoading(false); onFinish(data); },
      () => setLoading(false)
    );
  };

  const rejectMilestone = async (
    campaignId: number,
    milestoneId: number,
    onFinish: (data: any) => void
  ) => {
    setLoading(true);
    await executeContractAction(
      addr, name,
      'reject-milestone',
      [Cl.uint(campaignId), Cl.uint(milestoneId)],
      (data) => { setLoading(false); onFinish(data); },
      () => setLoading(false)
    );
  };

  return {
    getMilestone,
    getMilestoneCount,
    getTrackerStats,
    addMilestone,
    startMilestone,
    submitEvidence,
    approveMilestone,
    rejectMilestone,
    loading,
  };
}
