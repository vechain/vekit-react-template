import { useThor, useSendTransaction, useWallet, type EnhancedClause } from "@vechain/vechain-kit";
import type { TransactionReceipt } from "@vechain/sdk-network";
import { Interface, formatUnits } from "ethers";
import { useCallback, useEffect } from "react";

// Define a type to infer method names from the function definition
type MethodName<T> = T extends (nameOrSignature: infer U) => unknown ? U : never;

type SendArgs = {
  args: unknown[];
  value?: string;
  clauses?: EnhancedClause[]; // Add support for multiclause transactions
};

/**
 * Parameters for the useSend hook.
 */
export type UseSendParams<T extends Interface> = {
  contractInterface: T; // The contract interface
  contractAddress: string; // The contract address
  method: MethodName<T["getFunction"]>; // The method name
  onSuccess?: (receipt: TransactionReceipt) => void; // Callback for success
  onError?: (error: Error) => void; // Error callback
};

/**
 * Custom hook for sending transactions to smart contracts using VeChain Kit's useSendTransaction.
 * Provides built-in transaction status tracking and confirmation handling.
 */
export const useSend = <T extends Interface>({
  contractInterface,
  contractAddress,
  method,
  onSuccess,
  onError,
}: UseSendParams<T>) => {
  const { account } = useWallet();
  const thor = useThor();

  const { sendTransaction, status, txReceipt, resetStatus, isTransactionPending, error } =
    useSendTransaction({
      signerAccountAddress: account?.address ?? "",
    });

  // Call onSuccess when transaction succeeds
  useEffect(() => {
    if (status === "success" && txReceipt && onSuccess) {
      onSuccess(txReceipt);
    }
  }, [onSuccess, status, txReceipt]);

  // Prepare the base clause structure
  const prepareClause = useCallback(
    (input: unknown[] | SendArgs): EnhancedClause => {
      if (!thor) throw new Error("Thor client not available");

      const functionFragment = contractInterface.getFunction(method);
      if (!functionFragment) throw new Error(`ABI not found for method ${method}`);

      // Handle both array of args and SendArgs object
      const args = Array.isArray(input) ? input : input.args;
      const value = Array.isArray(input) ? "0x0" : (input.value ?? "0x0");

      // Use ethers.formatUnits to convert from WEI to VET for display
      const vetAmountInEth = value === "0x0" ? "0" : formatUnits(value, 18);

      // Get ABI as JSON string for EnhancedClause
      const abiJson = functionFragment.format("json");

      return {
        to: contractAddress,
        value,
        data: contractInterface.encodeFunctionData(method, args),
        comment:
          value === "0x0"
            ? `Executing ${method} on ${contractAddress}`
            : `Executing ${method} on ${contractAddress} with ${vetAmountInEth} VET`,
        abi: abiJson,
      };
    },
    [contractAddress, contractInterface, method, thor]
  );

  // Mutation function that handles both types of transactions
  const mutationFn = useCallback(
    async (input: unknown[] | SendArgs): Promise<void> => {
      try {
        // If input has clauses, use them directly
        const clauses =
          !Array.isArray(input) && input.clauses ? input.clauses : [prepareClause(input)];

        await sendTransaction(clauses);
      } catch (err) {
        const error = err as Error;
        console.error(`Error sending transaction to ${method}: ${error.message}`, error.stack);
        onError?.(error);
        throw error;
      }
    },
    [prepareClause, sendTransaction, onError, method]
  );

  return {
    mutate: mutationFn,
    status,
    isTransactionPending,
    txReceipt,
    resetStatus,
    error,
  };
};
