import "./utils/analytics";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { VeChainKitProvider } from "@vechain/vechain-kit";
import { ChakraProvider, ColorModeScript, useColorMode } from "@chakra-ui/react";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { persister, queryClient } from "./utils/queryClient.ts";
import { darkTheme } from "./theme";
import { Analytics } from "@vercel/analytics/react";
import i18n from "./i18n/i18n.ts";
import { themeColors } from "./theme/colors.ts";

// type NETWORK_TYPE = "main" | "test" | "solo";

const walletConnectOptions = {
  projectId: "", // Change to your own project id from wallet connect website
  metadata: {
    name: "Your DApp Name",
    description: "Your DApp Description",
    url: window.location.origin,
    icons: [`${window.location.origin}/icon.png`],
  },
};

export const AppWrapper = () => {
  const { colorMode } = useColorMode();
  const [kitLanguage, setKitLanguage] = useState(i18n.language ?? "en");

  useEffect(() => {
    const handleLanguageChange = (language: string) => {
      setKitLanguage(language ?? "en");
      document.documentElement.lang = language ?? "en";
    };

    document.documentElement.lang = i18n.language ?? "en";
    i18n.on("languageChanged", handleLanguageChange);
    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, []);

  const isDark = colorMode === "dark";

  const kitTheme = isDark
    ? {
        textColor: themeColors.text.primary,
        modal: {
          backgroundColor: "rgba(21, 21, 21, 0.4)",
          border: "1px solid rgba(255, 255, 255, 0.20)",
          backdropFilter: "blur(20px)",
          rounded: "32px",
        },
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.24)",
          blur: "blur(15px)",
        },
        buttons: {
          primaryButton: {
            bg: "white",
            color: "blackAlpha.900",
            rounded: "full",
          },
          secondaryButton: {
            bg: "rgb(255 255 255 / 4%)",
            color: "white",
          },
        },
      }
    : {
        textColor: "#1A1A1A",
        modal: {
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          border: "1px solid rgba(0, 0, 0, 0.10)",
          backdropFilter: "blur(20px)",
          rounded: "32px",
        },
        overlay: {
          backgroundColor: "rgba(255, 255, 255, 0.24)",
          blur: "blur(15px)",
        },
        buttons: {
          primaryButton: {
            bg: "#1A1A1A",
            color: "white",
            rounded: "full",
          },
          secondaryButton: {
            bg: "rgb(0 0 0 / 4%)",
            color: "#1A1A1A",
          },
        },
      };

  return (
    <VeChainKitProvider
      dappKit={{
        allowedWallets: ["veworld", "sync2", "wallet-connect"],
        walletConnectOptions: walletConnectOptions,
      }}
      darkMode={isDark}
      language={kitLanguage}
      theme={kitTheme}
    >
      <App />
    </VeChainKitProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
      <ChakraProvider theme={darkTheme}>
        <ColorModeScript initialColorMode="dark" />
        <AppWrapper />
        <Analytics />
      </ChakraProvider>
    </PersistQueryClientProvider>
  </React.StrictMode>
);
