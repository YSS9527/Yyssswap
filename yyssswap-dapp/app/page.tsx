"use client";

import React, { useState } from "react";
import Layout from "@/components/Layout";
import styles from "./index.module.css";
import { Card, Input, Button, Space, Typography } from "antd";
import { TokenSelect, type Token } from "@ant-design/web3";
import { ETH, USDT } from "@ant-design/web3-assets/tokens";
import { SwapOutlined } from "@ant-design/icons";

const { Text } = Typography;

const Yyssswap = () => {
  const [tokenA, setTokenA] = useState<Token>(ETH);
  const [amountA, setAmountA] = useState(0);
  const [tokenB, setTokenB] = useState<Token>(USDT);
  const [amountB, setAmountB] = useState(0);
  const handleAmountAChange = (e: any) => {
    setAmountA(parseFloat(e.target.value));
  };
  const handleAmountBChange = (e: any) => {
    setAmountB(parseFloat(e.target.value));
  };
  const handleSwitch = () => {
    console.log("handleSwitch");
  };
  const handleMax = (tokenType: string) => {
    console.log("handleMax", tokenType);
  };
  return (
    <>
      <Layout>
        <Card title="Swap" className={styles.swapCard}>
          <Card>
            <Input
              variant="borderless"
              type="number"
              value={amountA}
              onChange={handleAmountAChange}
              addonAfter={
                <TokenSelect
                  onChange={setTokenA}
                  value={tokenA}
                  options={[ETH, USDT]}
                />
              }
            />
            <Space className={styles.swapSpace}>
              <Text type="secondary">$ 0.0</Text>
              <Space>
                <Text type="secondary">Balance: 0</Text>
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
          <Card>
            <Input
              variant="borderless"
              type="number"
              value={amountB}
              onChange={handleAmountBChange}
              addonAfter={
                <TokenSelect
                  onChange={setTokenB}
                  value={tokenB}
                  options={[ETH, USDT]}
                />
              }
            />
            <Space className={styles.swapSpace}>
              <Text type="secondary">$ 0.0</Text>
              <Space>
                <Text type="secondary">Balance: 0</Text>
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
      </Layout>
    </>
  );
};
export default Yyssswap;
