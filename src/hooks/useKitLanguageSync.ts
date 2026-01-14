import { useEffect } from "react";
import { useVeChainKitConfig } from "@vechain/vechain-kit";
import i18n, { SUPPORTED_LANGUAGES } from "@/i18n/i18n";

const isSupportedLanguage = (
  language?: string
): language is (typeof SUPPORTED_LANGUAGES)[number] => {
  if (!language) return false;
  return SUPPORTED_LANGUAGES.includes(language as (typeof SUPPORTED_LANGUAGES)[number]);
};

export const useKitLanguageSync = () => {
  const config = useVeChainKitConfig();

  useEffect(() => {
    const language = config?.currentLanguage?.toLowerCase();
    if (!isSupportedLanguage(language)) return;

    if (i18n.language !== language) {
      void i18n.changeLanguage(language);
    }
  }, [config?.currentLanguage]);
};
