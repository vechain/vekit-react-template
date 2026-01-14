import { useQuery } from "@tanstack/react-query";
import { useThor, executeMultipleClausesCall } from "@vechain/vechain-kit";
import { Interface } from "ethers";
import { useMemo } from "react";
import { getCallKey, CallResponse } from "./useCall";

/**
 * Parameters for a single call within useMultipleCalls
 */
export type CallConfig<T = unknown> = {
  contractInterface: Interface;
  contractAddress: string;
  method: string;
  args?: unknown[];
  mapResponse?: (res: CallResponse) => T;
};

/**
 * Result of a single call in useMultipleCalls
 */
export type CallResult<T = unknown> = {
  data: T | null;
  error: Error | null;
  success: boolean;
};

/**
 * Parameters for the useMultipleCalls hook
 */
export type UseMultipleCallsParams = {
  calls: CallConfig[];
  enabled?: boolean;
  refetchInterval?: number;
  refetchOnWindowFocus?: boolean;
  staleTime?: number;
  retry?: number;
  retryDelay?: number;
  queryKeyPrefix?: string;
  callTimeoutMs?: number;
};

/**
 * Hook for making multiple contract calls simultaneously using VeChain Kit v2 SDK
 * @param calls - Array of call configurations
 * @param enabled - Whether the queries should be enabled
 * @param refetchInterval - Optional interval for polling in milliseconds
 * @param refetchOnWindowFocus - Whether to refetch on window focus
 * @param staleTime - How long data remains fresh in milliseconds
 * @param retry - Number of times to retry failed queries
 * @param retryDelay - Delay between retries in milliseconds
 * @param queryKeyPrefix - Optional prefix to make query keys unique
 * @returns The combined query results with detailed error handling
 */
export const useMultipleCalls = ({
  calls,
  enabled = true,
  refetchInterval,
  refetchOnWindowFocus,
  staleTime,
  retry,
  retryDelay,
  queryKeyPrefix,
  callTimeoutMs = 15000,
}: UseMultipleCallsParams) => {
  const thor = useThor();
  const enableQueries = !!thor && enabled && calls.length > 0;

  // Create query key for all calls combined
  const queryKey = useMemo(() => {
    const baseKey = [
      "multipleCalls",
      ...calls.map((call, index) => [
        getCallKey({ method: call.method, keyArgs: call.args }),
        index,
      ]),
    ];
    return queryKeyPrefix ? [queryKeyPrefix, ...baseKey] : baseKey;
  }, [calls, queryKeyPrefix]);

  const result = useQuery({
    queryKey,

    queryFn: async (): Promise<any[]> => {
      if (!thor) {
        throw new Error("Thor not available");
      }

      const sdkCalls = calls.map((call) => {
        const fullAbi = JSON.parse(call.contractInterface.formatJson());
        const argsCount = call.args?.length ?? 0;

        // Filter ABI to find the specific function overload that matches our args count
        // This handles cases where there are multiple functions with the same name but different parameters
        const filteredAbi = fullAbi.filter((item: any) => {
          if (item.type !== "function") return true; // Keep non-function items
          if (item.name !== call.method) return true; // Keep other functions
          // For the target function, only keep the one with matching input count
          return (item.inputs?.length ?? 0) === argsCount;
        });

        return {
          abi: filteredAbi,
          functionName: call.method,
          address: call.contractAddress as `0x${string}`,
          args: call.args ?? [],
        };
      });

      const callPromise = executeMultipleClausesCall({
        thor,
        calls: sdkCalls,
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error(`Multiple calls timed out after ${callTimeoutMs}ms`)),
          callTimeoutMs
        )
      );

      const results = await Promise.race([callPromise, timeoutPromise]);

      // Map responses if mapResponse is provided, maintaining backward compatibility
      const mappedResults = calls.map((call, index) => {
        const rawResult = results[index];

        // ALWAYS wrap in array for backward-compatible response format
        // Old Connex format was decoded = [returnValue], so mapResponse functions expect res.decoded[0]
        const response: CallResponse = {
          decoded: [rawResult],
        };

        if (call.mapResponse) {
          return call.mapResponse(response);
        }

        // Return the raw result directly when no mapResponse
        return rawResult;
      });

      return mappedResults;
    },
    enabled: enableQueries,
    refetchInterval,
    refetchOnWindowFocus,
    staleTime,
    retry,
    retryDelay,
  });

  // Build call results with error handling
  const callResults: CallResult<any>[] = useMemo(() => {
    if (!result.data) {
      return calls.map(() => ({
        data: null,
        error: result.error as Error | null,
        success: false,
      }));
    }

    return result.data.map((data) => ({
      data,
      error: null,
      success: true,
    }));
  }, [result.data, result.error, calls]);

  const hasCallErrors = callResults.some((r) => !r.success);

  // Memoize the empty results array to prevent infinite re-renders
  // Using calls.length intentionally to avoid re-creating when calls array reference changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const emptyResults = useMemo(() => calls.map(() => null), [calls.length]);

  return {
    data: (result.data ?? emptyResults) as any[],

    results: (result.data ?? emptyResults) as any[],
    error: result.error,
    callResults,
    hasCallErrors,
    isError: result.isError || hasCallErrors,
    isPending: result.isPending,
    isLoading: result.isLoading,
    isFetching: result.isFetching,
    refetch: result.refetch,
  };
};
