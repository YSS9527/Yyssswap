import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";

const config: HardhatUserConfig = {
  // solidity: "0.8.28",
  solidity: {
    version: "0.8.28", // 你的编译器版本
    settings: {
      optimizer: {
        enabled: true, // 必须启用优化器
        runs: 200
      },
      viaIR: true // 启用IR模式
    }
  }
};

export default config;
