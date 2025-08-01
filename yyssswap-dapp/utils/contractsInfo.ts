import type { Token } from "@ant-design/web3";
import { Hardhat, Sepolia, Localhost } from "@ant-design/web3-wagmi";
import { ETH, USDT } from "@ant-design/web3-assets/tokens";

export const builtInTokens: Token[] = [
  {
    icon: null,
    symbol: "DTA",
    decimal: 18,
    name: "DebugTokenA",
    availableChains: [
      {
        chain: Localhost,
        contract: "0x081a4A615a48A17e321804c5C3852E94ACB0C969",
      },
    ],
  },
  {
    icon: null,
    symbol: "DTB",
    decimal: 18,
    name: "DebugTokenB",
    availableChains: [
      {
        chain: Localhost,
        contract: "0x333377c2e62A7b836AC707ae9a51C9ef4B748Afb",
      },
    ],
  },
  {
    icon: null,
    symbol: "DTC",
    decimal: 18,
    name: "DebugTokenC",
    availableChains: [
      {
        chain: Localhost,
        contract: "0x650c2349aC2f162C9AFFb7d1Fb791CFb77b81EF1",
      },
    ],
  },
  ETH,
  USDT,
];
export const getTokenInfo = (address: string): Token => {
  let token;
  for (let i = 0; i < builtInTokens.length; i++) {
    const availableChains = builtInTokens[i].availableChains;
    for (let j = 0; j < availableChains.length; j++) {
      if (availableChains[j]?.contract == address) {
        token = builtInTokens[i];
        break;
      }
    }
  }
  // if (builtInTokens[address]) {
  //   return builtInTokens[address];
  // }
  return token
    ? token
    : {
        icon: null,
        symbol: address.slice(-3).toUpperCase(),
        decimal: 18,
        name: address,
        availableChains: [
          {
            chain: Hardhat,
            contract: address,
          },
          {
            chain: Sepolia,
            contract: address,
          },
        ],
      };
};

export const getContractAddress = (
  contract:
    | "PoolManager"
    | "PositionManager"
    | "SwapRouter"
    | "DebugTokenA"
    | "DebugTokenB"
    | "DebugTokenC"
): `0x${string}` => {
  const isProd = process.env.NODE_ENV === "production";
  if (contract === "PoolManager") {
    return isProd
      ? "0x30386Ce3C984B5a80ADe3b5F8f348224C5B3F7c6"
      : "0x30386Ce3C984B5a80ADe3b5F8f348224C5B3F7c6";
  }
  if (contract === "PositionManager") {
    return isProd
      ? "0x8Bb4f3DBdDb124112a333c719d22Eb38C1DbDEe8"
      : "0x8Bb4f3DBdDb124112a333c719d22Eb38C1DbDEe8";
  }
  if (contract === "SwapRouter") {
    return isProd
      ? "0x10762b68671b49e2b1297e3Aa03C2A603358c8a5"
      : "0x10762b68671b49e2b1297e3Aa03C2A603358c8a5";
  }
  if (contract === "DebugTokenA") {
    return isProd
      ? "0x081a4A615a48A17e321804c5C3852E94ACB0C969"
      : "0x081a4A615a48A17e321804c5C3852E94ACB0C969";
  }
  if (contract === "DebugTokenB") {
    return isProd
      ? "0x333377c2e62A7b836AC707ae9a51C9ef4B748Afb"
      : "0x333377c2e62A7b836AC707ae9a51C9ef4B748Afb";
  }
  if (contract === "DebugTokenC") {
    return isProd
      ? "0x650c2349aC2f162C9AFFb7d1Fb791CFb77b81EF1"
      : "0x650c2349aC2f162C9AFFb7d1Fb791CFb77b81EF1";
  }
  throw new Error("Invalid contract");
};

export const tokens = [
  {
    value: "0x081a4A615a48A17e321804c5C3852E94ACB0C969",
    label: "DebugTokenA",
  },
  {
    value: "0x333377c2e62A7b836AC707ae9a51C9ef4B748Afb",
    label: "DebugTokenB",
  },
  {
    value: "0x650c2349aC2f162C9AFFb7d1Fb791CFb77b81EF1",
    label: "DebugTokenC",
  },
];
