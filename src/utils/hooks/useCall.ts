import { useQuery } from "@tanstack/react-query";
import { useThor, executeMultipleClausesCall } from "@vechain/vechain-kit";
import { Interface } from "ethers";
import { useMemo } from "react";

// Define a type to infer method names from the function definition
type MethodName<T> = T extends (nameOrSignature: infer U) => any ? U : never;

// Backward-compatible response type that matches the old Connex format
export type CallResponse = {
  decoded: unknown[];
};

/**
 * Parameters for the useCall hook.
 */
export type UseCallParams<T extends Interface> = {
  contractInterface: T; // The contract interface
  contractAddress: string; // The contract address
  method: MethodName<T["getFunction"]>; // The method name
  args?: unknown[]; // Optional arguments for the method
  keyArgs?: unknown[]; // Optional key arguments for the query key
  enabled?: boolean; // Whether the query should be enabled
  mapResponse?: (_res: CallResponse) => unknown; // Optional function to map the response (backward compatible)
  refetchInterval?: number; // Optional interval for polling in milliseconds
  refetchOnWindowFocus?: boolean; // Whether to refetch on window focus
  staleTime?: number; // How long data remains fresh in milliseconds
  queryKeyPrefix?: string; // Add unique prefix
  callTimeoutMs?: number; // Timeout for the call to resolve/reject
};

/**
 * Custom hook for making contract calls using VeChain Kit v2 SDK.
 * @param contractInterface - The contract interface.
 * @param contractAddress - The contract address.
 * @param method - The method name.
 * @param args - Optional arguments for the method.
 * @param keyArgs - Optional key arguments for the query key.
 * @param enabled - Whether the query should be enabled.
 * @param mapResponse - Optional function to map the response.
 * @returns The query result.
 */
export const useCall = <T extends Interface>({
  contractInterface,
  contractAddress,
  method,
  args = [],
  keyArgs,
  enabled = true,
  mapResponse,
  refetchInterval,
  refetchOnWindowFocus,
  staleTime,
  queryKeyPrefix,
  callTimeoutMs = 15000,
}: UseCallParams<T>) => {
  const thor = useThor();

  // Get the ABI as an array for the SDK, filtered for the specific function overload
  const abi = useMemo(() => {
    // Parse the JSON ABI back to an array
    const fullAbi = JSON.parse(contractInterface.formatJson());
    const argsCount = args.length;

    // Filter ABI to find the specific function overload that matches our args count
    // This handles cases where there are multiple functions with the same name but different parameters
    return fullAbi.filter((item: any) => {
      if (item.type !== "function") return true; // Keep non-function items
      if (item.name !== method) return true; // Keep other functions
      // For the target function, only keep the one with matching input count
      return (item.inputs?.length ?? 0) === argsCount;
    });
  }, [contractInterface, method, args.length]);

  const queryKey = useMemo(() => {
    const baseKey = getCallKey({ method, keyArgs: keyArgs || args });
    return queryKeyPrefix ? [queryKeyPrefix, ...baseKey] : baseKey;
  }, [method, keyArgs, args, queryKeyPrefix]);

  const enableQuery = useMemo(() => !!thor && enabled, [enabled, thor]);

  return useQuery({
    queryFn: async () => {
      if (!thor) throw new Error("Thor client not available");

      try {
        const callPromise = executeMultipleClausesCall({
          thor,
          calls: [
            {
              abi,
              functionName: method as string,
              address: contractAddress as `0x${string}`,
              args: args as unknown[],
            },
          ],
        });

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(
            () => reject(new Error(`Contract call timed out after ${callTimeoutMs}ms`)),
            callTimeoutMs
          )
        );

        const results = await Promise.race([callPromise, timeoutPromise]);

        // executeMultipleClausesCall returns an array of results
        // Each result is the decoded value directly
        const rawResult = results[0];

        // ALWAYS wrap in array for backward-compatible response format
        // Old Connex format was decoded = [returnValue], so mapResponse functions expect res.decoded[0]
        const response: CallResponse = {
          decoded: [rawResult],
        };

        if (mapResponse) return mapResponse(response);

        // Return the raw result directly when no mapResponse
        return rawResult;
      } catch (error) {
        console.error(
          `Error calling ${method}: ${(error as Error)?.message} with args: ${JSON.stringify(args)}`,
          (error as Error)?.stack
        );
        throw error;
      }
    },
    queryKey,
    enabled: enableQuery,
    refetchInterval,
    refetchOnWindowFocus,
    staleTime,
  });
};

export type GetCallKeyParams = {
  method: string;
  keyArgs?: unknown[];
};

/**
 * Recursively converts BigInt values to strings for safe serialization
 */
const serializableValue = (value: unknown): unknown => {
  if (typeof value === "bigint") {
    return value.toString();
  }
  if (Array.isArray(value)) {
    return value.map(serializableValue);
  }
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, serializableValue(v)]));
  }
  return value;
};

export const getCallKey = ({ method, keyArgs = [] }: GetCallKeyParams) => {
  // Convert BigInt values to strings for safe serialization in query keys
  const safeArgs = keyArgs.map(serializableValue);
  return [method, ...safeArgs];
};
