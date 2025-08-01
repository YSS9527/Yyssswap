import { encodeSqrtRatioX96, TickMath } from "@uniswap/v3-sdk";
import type { Token } from "@ant-design/web3";
import { useChainId } from "wagmi";

// 根据 Token 查 address
export const useTokenAddress = (token?: Token): `0x${string}` | undefined => {
  const chainId = useChainId();
  return token?.availableChains.find((item) => item.chain.id === chainId)
    ?.contract as `0x${string}` | undefined;
};

export const parsePriceToSqrtPriceX96 = (price: number): BigInt => {
  return BigInt(encodeSqrtRatioX96(price * 1000000, 1000000).toString());
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
  zeroForOne: boolean,
  slippage: number
): bigint => {
  if (zeroForOne) {
    let minTickPool = pools[0];
    for (let i = 1; i < pools.length; i++) {
      if (minTickPool.tick > pools[i].tick) {
        minTickPool = pools[i];
      }
    }
    const minTick = minTickPool.tick ?? TickMath.MIN_TICK;
    const limitTick = Math.max(minTick * (1 - slippage), TickMath.MIN_TICK);
    return BigInt(TickMath.getSqrtRatioAtTick(limitTick).toString());
  } else {
    let maxTickPool = pools[0];
    for (let i = 1; i < pools.length; i++) {
      if (maxTickPool.tick < pools[i].tick) {
        maxTickPool = pools[i];
      }
    }
    const maxTick = maxTickPool.tick ?? TickMath.MAX_TICK;
    const limitTick = Math.min(maxTick * (1 + slippage), TickMath.MAX_TICK);
    return BigInt(TickMath.getSqrtRatioAtTick(limitTick).toString());
  }
};
