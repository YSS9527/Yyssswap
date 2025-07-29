"use client";

import Layout from "@/components/Layout";
import Link from "next/link";
import styles from "./pool.module.css";
import {
  Card,
  Table,
  Flex,
  Space,
  Button,
  TableProps,
  message,
  Spin,
} from "antd";
import React, { useState, useEffect } from "react";
import AddPoolDrawer from "@/components/AddPoolDrawer";
import { getTokenInfo, parseBigIntToAmount } from "@/utils/common";
import { BitcoinCircleColorful, EthereumFilled } from "@ant-design/web3-icons";

import { getContractAddress } from "@/utils/getContractAddress";
import {
  useReadPoolManagerGetAllPools,
  useWritePoolManagerCreateAndInitializePoolIfNecessary,
} from "@/utils/contracts";

const columns: TableProps["columns"] = [
  {
    title: "Token0",
    dataIndex: "token0",
    key: "token0",
    render: (value: string) => {
      return (
        <>
          <EthereumFilled
            style={{
              fontSize: 20,
            }}
          />
          {getTokenInfo(value).name.toString()}
        </>
      );
    },
  },
  {
    title: "Token1",
    dataIndex: "token1",
    key: "token1",
    render: (value: string) => {
      return (
        <>
          <EthereumFilled
            style={{
              fontSize: 20,
            }}
          />
          {getTokenInfo(value).name.toString()}
        </>
      );
    },
  },
  {
    title: "Index",
    dataIndex: "index",
    key: "index",
  },
  {
    title: "Fee",
    dataIndex: "fee",
    key: "fee",
    render: (value: string) => {
      return `${parseInt(value) / 10000}%`;
    },
  },
  {
    title: "FeeProtocol",
    dataIndex: "feeProtocol",
    key: "feeProtocol",
  },
  {
    title: "TickLower",
    dataIndex: "tickLower",
    key: "tickLower",
  },
  {
    title: "TickUpper",
    dataIndex: "tickUpper",
    key: "tickUpper",
  },
  {
    title: "Tick",
    dataIndex: "tick",
    key: "tick",
  },
  {
    title: "Price",
    dataIndex: "sqrtPriceX96",
    key: "sqrtPriceX96",
    render: (value: bigint) => {
      return parseBigIntToAmount(value).toString();
    },
  },
];
// const data = [
//   {
//     token0: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
//     token1: "0xEcd0D12E21805803f70de03B72B1C162dB0898d9",
//     index: 0,
//     fee: 3000,
//     feeProtocol: 0,
//     tickLower: -100000,
//     tickUpper: 100000,
//     tick: 1000,
//     sqrtPriceX96: BigInt("7922737261735934252089901697281"),
//   },
// ];
const PoolList: React.FC = () => {
  const [openAddPoolDrawer, setOpenAddPoolDrawer] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data = [], refetch } = useReadPoolManagerGetAllPools({
    address: getContractAddress("PoolManager"),
  });

  const { writeContractAsync } =
    useWritePoolManagerCreateAndInitializePoolIfNecessary();
  return (
    <>
      <Card className={styles.poolCard}>
        <Table
          title={() => (
            <Flex justify="space-between">
              <div>PoolList</div>
              <Space>
                {/* <Link href="/positions">
                  <Button>MyPositions</Button>
                </Link> */}
                <Button
                  loading={loading}
                  type="primary"
                  onClick={() => setOpenAddPoolDrawer(true)}
                >
                  Add Pool
                </Button>
              </Space>
            </Flex>
          )}
          scroll={{ x: true }}
          columns={columns}
          dataSource={data}
        />
      </Card>
      <AddPoolDrawer
        open={openAddPoolDrawer}
        onCancel={() => {
          setOpenAddPoolDrawer(false);
        }}
        onCreatePool={async (createParams) => {
          setLoading(true);
          setOpenAddPoolDrawer(false);
          console.log(createParams);
          try {
            await writeContractAsync({
              address: getContractAddress("PoolManager"),
              args: [
                {
                  token0: createParams.token0,
                  token1: createParams.token1,
                  fee: createParams.fee,
                  tickLower: createParams.tickLower,
                  tickUpper: createParams.tickUpper,
                  sqrtPriceX96: createParams.sqrtPriceX96,
                },
              ],
            });
            message.success("Create Pool Success");
            refetch();
          } catch (error: any) {
            message.error(error.message);
          } finally {
            setLoading(false);
          }
        }}
      />
    </>
  );
};

const Pool = () => {
  return (
    <>
      <Layout>
        <PoolList />
      </Layout>
    </>
  );
};
export default Pool;
