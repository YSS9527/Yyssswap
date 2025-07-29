import { encodeSqrtRatioX96, TickMath } from "@uniswap/v3-sdk";
import type { Token } from "@ant-design/web3";
import { Hardhat, Sepolia, Localhost } from "@ant-design/web3-wagmi";

export const parsePriceToSqrtPriceX96 = (price: number): BigInt => {
  return BigInt(encodeSqrtRatioX96(price * 1000000, 1000000).toString());
};

const builtInTokens: Record<string, Token> = {
  "0x081a4A615a48A17e321804c5C3852E94ACB0C969": {
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
  "0x333377c2e62A7b836AC707ae9a51C9ef4B748Afb": {
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
  "0x650c2349aC2f162C9AFFb7d1Fb791CFb77b81EF1": {
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
  }
};

export const getTokenInfo = (address: string): Token => {
  if (builtInTokens[address]) {
    return builtInTokens[address];
  }
  return {
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

// 把数字转化为大整数，支持 4 位小数
export const parseAmountToBigInt = (amount: number, token?: Token): bigint => {
  return (
    BigInt(Math.floor(amount * 10000)) *
    BigInt(10 ** ((token?.decimal || 18) - 4))
  );
};

// 把大整数转化为数字，支持 4 位小数
export const parseBigIntToAmount = (amount: bigint, token?: Token): number => {
  return (
    Number((amount / BigInt(10 ** ((token?.decimal || 18) - 4))).toString()) /
    10000
  );
};

export const computeSqrtPriceLimitX96 = (
  pools: {
    pool: `0x${string}`;
    token0: `0x${string}`;
    token1: `0x${string}`;
    index: number;
    fee: number;
    feeProtocol: number;
    tickLower: number;
    tickUpper: number;
    tick: number;
    sqrtPriceX96: bigint;
  }[],
  zeroForOne: boolean
): bigint => {
  if (zeroForOne) {
    let minTickPool = pools[0];
    for (let i = 1; i < pools.length; i++) {
      if (minTickPool.tick > pools[i].tick) {
        minTickPool = pools[i];
      }
    }
    const minTick = minTickPool.tick ?? TickMath.MIN_TICK;
    const limitTick = Math.max(minTick - 10000, TickMath.MIN_TICK);
    return BigInt(TickMath.getSqrtRatioAtTick(limitTick).toString());
  } else {
    let maxTickPool = pools[0];
    for (let i = 1; i < pools.length; i++) {
      if (maxTickPool.tick < pools[i].tick) {
        maxTickPool = pools[i];
      }
    }
    const maxTick = maxTickPool.tick ?? TickMath.MAX_TICK;
    const limitTick = Math.min(maxTick + 10000, TickMath.MAX_TICK);
    return BigInt(TickMath.getSqrtRatioAtTick(limitTick).toString());
  }
};
