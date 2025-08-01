"use client";

import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import styles from "./index.module.css";
import { Card, Input, Button, Space, Typography } from "antd";
import { SwapOutlined } from "@ant-design/icons";
import { useAccount, TokenSelect, type Token } from "@ant-design/web3";
import { ETH, USDT } from "@ant-design/web3-assets/tokens";
const { Text } = Typography;
import Balance from "@/components/Balance";

import {
  useReadPoolManagerGetPairs,
  useReadErc20BalanceOf,
} from "@/utils/contracts";
import { getContractAddress, getTokenInfo } from "@/utils/contractsInfo";
import { useTokenAddress } from "@/utils/common";
import { stringify } from "querystring";

const Swap = () => {
  const { account } = useAccount();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [tokenA, setTokenA] = useState<Token>();
  const [tokenB, setTokenB] = useState<Token>();
  const [amountA, setAmountA] = useState(0);
  const [amountB, setAmountB] = useState(0);
  const tokenAddressA = useTokenAddress(tokenA);
  const tokenAddressB = useTokenAddress(tokenB);

  const { data: pairs = [], refetch } = useReadPoolManagerGetPairs({
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
  };
  const handleAmountBChange = (e: any) => {
    setAmountB(parseFloat(e.target.value));
  };
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
          <Text type="secondary">$ 0.0</Text>
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
          <Text type="secondary">$ 0.0</Text>
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
