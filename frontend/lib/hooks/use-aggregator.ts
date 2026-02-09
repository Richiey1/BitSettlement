import { useCallback } from "react";
import { openContractCall } from "@stacks/connect";
import { StacksMainnet } from "@stacks/network";

export function useAggregator() {
  const swap = useCallback(async (amount: number, minOut: number) => {
    // Placeholder for swap logic
    console.log("Swapping", amount, minOut);
  }, []);

  return { swap };
}
