import { useEffect } from "react";
import { useWallet } from "@vechain/vechain-kit";
import { analytics } from "@/utils/analytics";

/**
 * Hook to integrate analytics with wallet connection
 */
export const useAnalytics = () => {
  const { account } = useWallet();

  // Track user identity
  useEffect(() => {
    if (account?.address) {
      analytics.setUserAddress(account.address);
      analytics.identifyUser(account.address);
    } else {
      analytics.clearUserAddress();
      analytics.resetUser();
    }
  }, [account?.address]);

  return {
    analytics,
    userAddress: account?.address,
  };
};
