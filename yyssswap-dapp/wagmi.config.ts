import { defineConfig } from "@wagmi/cli";
import { hardhat, react } from "@wagmi/cli/plugins";

export default defineConfig({
  out: "utils/contracts.ts",
  contracts: [],
  plugins: [
    hardhat({
      project: "../yyssswap-contract",
    }),
    react(),
  ],
});
