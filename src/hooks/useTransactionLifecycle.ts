import { useEffect, useRef, useState, useCallback } from "react";
import type { TransactionStatusErrorType } from "@vechain/vechain-kit";
import type { TransactionReceipt } from "@vechain/sdk-network";

type TransactionStatus = "idle" | "pending" | "success" | "error";

interface UseTransactionLifecycleOptions {
  status: TransactionStatus | string;
  receipt: TransactionReceipt | null | undefined;
  error: TransactionStatusErrorType | null | undefined;
  onSuccess?: (txHash: string, receipt: TransactionReceipt) => void;
  onError?: (error: TransactionStatusErrorType) => void;
}

interface UseTransactionLifecycleResult {
  txHash: string;
  txError: TransactionStatusErrorType | null;
  reset: () => void;
}

export const useTransactionLifecycle = ({
  status,
  receipt,
  error,
  onSuccess,
  onError,
}: UseTransactionLifecycleOptions): UseTransactionLifecycleResult => {
  const processedTxHashesRef = useRef<Set<string>>(new Set());
  const [txHash, setTxHash] = useState<string>("");
  const [txError, setTxError] = useState<TransactionStatusErrorType | null>(null);

  useEffect(() => {
    if (status === "success" && receipt) {
      const hash = receipt.meta.txID;
      if (!hash || processedTxHashesRef.current.has(hash)) return;

      processedTxHashesRef.current.add(hash);
      setTxHash(hash);
      onSuccess?.(hash, receipt);
    }

    if (error) {
      setTxError(error);
      onError?.(error);
    }
  }, [status, receipt, error, onSuccess, onError]);

  const reset = useCallback(() => {
    setTxHash("");
    setTxError(null);
  }, []);

  return { txHash, txError, reset };
};
