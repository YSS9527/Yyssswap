"use client";

import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import styles from "./index.module.css";
import { Card, Input, Button, Space, Typography, Radio, message } from "antd";
import type { CheckboxGroupProps } from "antd/es/checkbox";
import { SwapOutlined } from "@ant-design/icons";
import { useAccount, TokenSelect, type Token } from "@ant-design/web3";
// import { ETH, USDT } from "@ant-design/web3-assets/tokens";
const { Text, Title } = Typography;
import Balance from "@/components/Balance";

import { useSimulateContract, usePublicClient } from "wagmi";
import { getContractAddress, getTokenInfo } from "@/utils/contractsInfo";
import {
  useTokenAddress,
  parseAmountToBigInt,
  parseBigIntToAmount,
  computeSqrtPriceLimitX96,
} from "@/utils/common";
import {
  swapRouterAbi,
  useReadPoolManagerGetPairs,
  useReadPoolManagerGetAllPools,
  useSimulateISwapRouterQuoteExactInput,
} from "@/utils/contracts";

const radioOptions: CheckboxGroupProps<string>["options"] = [
  { label: "MarketValue", value: "0" },
  { label: "1%", value: "0.01" },
  { label: "5%", value: "0.05" },
  { label: "10%", value: "0.1" },
];

const Swap = () => {
  const [slippage, setSlippage] = useState("0"); // 滑点设置
  const [tokens, setTokens] = useState<Token[]>([]);
  const [tokenA, setTokenA] = useState<Token>();
  const [tokenB, setTokenB] = useState<Token>();
  const [amountA, setAmountA] = useState(0);
  const [amountB, setAmountB] = useState(0);
  const tokenAddressA = useTokenAddress(tokenA);
  const tokenAddressB = useTokenAddress(tokenB);
  const [token0, token1] =
    tokenAddressA && tokenAddressB && tokenAddressA < tokenAddressB
      ? [tokenAddressA, tokenAddressB]
      : [tokenAddressB, tokenAddressA]; // pool池中是按地址大小进行排序
  const zeroForOne = token0 === tokenAddressA; // 为true token0 换token1
  const [isExactInput, setIsExactInput] = useState(true); //默认指定输入Sell

  const { account } = useAccount();
  const { data: pairs = [] } = useReadPoolManagerGetPairs({
    address: getContractAddress("PoolManager"),
  });
  useEffect(() => {
    const pairsC = JSON.parse(JSON.stringify(pairs));
    const addressArray: `0x${string}`[] = [];
    pairsC.map((pair: any) => {
      !addressArray.includes(pair.token0) ? addressArray.push(pair.token0) : "";
      !addressArray.includes(pair.token1) ? addressArray.push(pair.token1) : "";
    });
    const tokensOption: Token[] = addressArray.map(getTokenInfo);
    if (tokensOption.length) {
      setTokens(tokensOption);
      setTokenA(tokensOption[0]);
      setTokenB(tokensOption[1]);
    }
  }, [pairs]);

  const handleAmountAChange = (e: any) => {
    setAmountA(parseFloat(e.target.value));
    setIsExactInput(true); //触发sell框输入
  };
  const handleAmountBChange = (e: any) => {
    setAmountB(parseFloat(e.target.value));
    setIsExactInput(false); //触发buy框输入
  };
  useEffect(() => {
    isExactInput
      ? updateAmountBWithAmountA(amountA)
      : updateAmountAWithAmountB(amountB);
  }, [isExactInput, tokenA, tokenB, amountA, amountB, slippage]);

  // 处理交易池
  const { data: pools = [] } = useReadPoolManagerGetAllPools({
    address: getContractAddress("PoolManager"),
  });
  const swapPools = pools.filter((pool: any) => {
    return (
      pool.token0 === token0 && pool.token1 === token1 && pool.liquidity > 0
    );
  });
  console.log("swapPools", swapPools);
  const swapIndexPath: number[] = swapPools
    .sort((a: any, b: any) => {
      if (a.tick !== b.tick) {
        if (zeroForOne) {
          // token0 交换 token1 时，tick 越大意味着 token0 价格越高，所以要把 tick 大的放前面
          return b.tick > a.tick ? 1 : -1;
        }
        return a.tick > b.tick ? 1 : -1;
      }
      return a.fee - b.fee;
    })
    .map((pool: any) => pool.index);
  // 计算本次交易的价格限制
  const sqrtPriceLimitX96 = swapPools.length
    ? computeSqrtPriceLimitX96(swapPools, zeroForOne, Number(slippage))
    : 0;
  const publicClient = usePublicClient();
  // const simulateContract = useSimulateContract();
  // 固定输入，计算输出
  const updateAmountBWithAmountA = async (amount: number) => {
    if (
      !publicClient ||
      !tokenAddressA ||
      !tokenAddressB ||
      isNaN(amount) ||
      amount === 0
    ) {
      return;
    }
    if (tokenAddressA === tokenAddressB) {
      message.error("Please select different tokens");
      return;
    }
    try {
      const newAmountB = await publicClient.simulateContract({
        address: getContractAddress("SwapRouter"),
        abi: swapRouterAbi,
        functionName: "quoteExactInput",
        args: [
          {
            tokenIn: tokenAddressA,
            tokenOut: tokenAddressB,
            indexPath: swapIndexPath,
            // amountIn: parseAmountToBigInt(amount, tokenA),
            amountIn: amount,
            sqrtPriceLimitX96,
          },
        ],
      });
      console.log("newAmountB", newAmountB);
      setAmountB(parseBigIntToAmount(newAmountB.result, tokenB));
      setIsExactInput(true);
    } catch (e: any) {
      console.log(e.message);
      message.error(e.message);
    }
  };
  // 固定输出，计算输入
  const updateAmountAWithAmountB = (amount: Number) => {};

  const handleSwitch = () => {
    setTokenA(tokenB);
    setTokenB(tokenA);
    setAmountA(amountB);
    setAmountB(amountA);
  };
  const handleMax = async (tokenType: string) => {
    console.log("handleMax", tokenType);
  };
  return (
    <Card title="Swap" className={styles.swapCard}>
      <div className={styles.slippage}>
        <Text
          className={styles.slippageText}
        >{`When the value of an ${tokenA?.symbol} is ${Number(slippage) + 1}  ${tokenB?.symbol}`}</Text>
        <Radio.Group
          block
          options={radioOptions}
          defaultValue="MarketValue"
          optionType="button"
          value={slippage}
          onChange={(e) => {
            setSlippage(e.target.value);
          }}
        />
      </div>
      <Card title="Sell">
        <Input
          variant="borderless"
          type="number"
          value={amountA}
          onChange={handleAmountAChange}
          addonAfter={
            <TokenSelect onChange={setTokenA} value={tokenA} options={tokens} />
          }
        />
        <Space className={styles.swapSpace}>
          <Text type="secondary">$ 9999</Text>
          <Space>
            <Text type="secondary">
              Balance: <Balance token={tokenA} />
            </Text>
            <Button size="small" type="link" onClick={() => handleMax("A")}>
              Max
            </Button>
          </Space>
        </Space>
      </Card>
      <Space className={styles.switchBtn}>
        <Button
          shape="circle"
          icon={<SwapOutlined />}
          onClick={handleSwitch}
        ></Button>
      </Space>
      <Card title="Buy">
        <Input
          variant="borderless"
          type="number"
          value={amountB}
          onChange={handleAmountBChange}
          addonAfter={
            <TokenSelect
              onChange={setTokenB}
              value={tokenB}
              // options={[ETH, USDT]}
              options={tokens}
            />
          }
        />
        <Space className={styles.swapSpace}>
          <Text type="secondary">$ 6666</Text>
          <Space>
            <Text type="secondary">
              Balance: <Balance token={tokenB} />
            </Text>
            <Button size="small" type="link" onClick={() => handleMax("B")}>
              Max
            </Button>
          </Space>
        </Space>
      </Card>
      <Button type="primary" size="large" block className={styles.swapBtn}>
        Swap
      </Button>
    </Card>
  );
};
export default () => {
  return (
    <>
      <Layout>
        <Swap></Swap>
      </Layout>
    </>
  );
};
