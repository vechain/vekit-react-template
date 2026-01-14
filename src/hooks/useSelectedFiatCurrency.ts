import { useMemo } from "react";
import { CURRENCY, useVeChainKitConfig } from "@vechain/vechain-kit";

const SUPPORTED_FIAT_CURRENCIES: CURRENCY[] = ["usd", "eur", "gbp"];

export const useSelectedFiatCurrency = (): CURRENCY => {
  const config = useVeChainKitConfig();

  return useMemo<CURRENCY>(() => {
    const selectedCurrency = config?.currentCurrency?.toLowerCase();
    return SUPPORTED_FIAT_CURRENCIES.includes(selectedCurrency as CURRENCY)
      ? (selectedCurrency as CURRENCY)
      : "usd";
  }, [config?.currentCurrency]);
};
