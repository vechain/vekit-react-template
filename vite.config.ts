/// <reference types="vitest" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { resolve } from "path";

// Deduplicate packages to prevent multiple registrations
const dedupe = [
  "@web3modal/ui",
  "@web3modal/core",
  "@walletconnect/modal",
  "@walletconnect/ethereum-provider",
];

export default defineConfig(({ mode }) => {
  return {
    plugins: [nodePolyfills(), react()],
    optimizeDeps: {
      include: [
        "@vechain/vechain-kit",
        "@walletconnect/modal",
        "@walletconnect/ethereum-provider",
        "react-device-detect",
        "@msgpack/msgpack",
      ],
      exclude: ["@web3modal/ui"],
      esbuildOptions: {
        target: "es2020",
      },
    },
    build: {
      commonjsOptions: {
        transformMixedEsModules: true,
        esmExternals: true,
      },
      target: "es2020",
      modulePreload: {
        polyfill: true,
      },
      minify: "esbuild",
      sourcemap: false,
      rollupOptions: {
        output: {
          sourcemap: false,
          chunkFileNames: "assets/[name]-[hash].js",
          entryFileNames: "assets/[name]-[hash].js",
          assetFileNames: "assets/[name]-[hash].[ext]",
          hoistTransitiveImports: false,
          preserveModules: false,
        },
      },
    },
    preview: {
      port: 5001,
      strictPort: true,
    },
    server: {
      port: 5001,
      strictPort: true,
      host: true,
      origin: "http://0.0.0.0:5001",
    },
    //vitest
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: [
        resolve(__dirname, "test/setup/setup.ts"),
        resolve(__dirname, "test/setup/resizeObserverMock.ts"),
      ],
    },
    resolve: {
      dedupe,
      alias: {
        "@": resolve(__dirname, "./src"),
        "@packages": resolve(__dirname, "../../packages"),
      },
    },
    base: mode === "production" ? "/" : "/",
  };
});
