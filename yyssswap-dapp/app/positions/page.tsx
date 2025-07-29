"use client";

import Layout from "@/components/Layout";
import { Card, Table, Button, Space, Flex } from "antd";
import React, { useState } from "react";
import styles from "./positions.module.css";
import type { TableProps } from "antd";
import AddPositionDrawer from "@/components/AddPositionDrawer";

import { useReadPositionManagerGetAllPositions } from "@/utils/contracts";
import { getContractAddress } from "@/utils/getContractAddress";

const columns: TableProps["columns"] = [
  {
    title: "Owner",
    dataIndex: "owner",
    key: "owner",
    ellipsis: true,
  },
  {
    title: "Token 0",
    dataIndex: "token0",
    key: "token0",
    ellipsis: true,
  },
  {
    title: "Token 1",
    dataIndex: "token1",
    key: "token1",
    ellipsis: true,
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
  },
  {
    title: "Liquidity",
    dataIndex: "liquidity",
    key: "liquidity",
    render: (value: bigint) => {
      return value.toString();
    },
  },
  {
    title: "Tick Lower",
    dataIndex: "tickLower",
    key: "tickLower",
  },
  {
    title: "Tick Upper",
    dataIndex: "tickUpper",
    key: "tickUpper",
  },
  {
    title: "Tokens Owed 0",
    dataIndex: "tokensOwed0",
    key: "tokensOwed0",
    render: (value: bigint) => {
      return value.toString();
    },
  },
  {
    title: "Tokens Owed 1",
    dataIndex: "tokensOwed1",
    key: "tokensOwed1",
    render: (value: bigint) => {
      return value.toString();
    },
  },
  {
    title: "Fee Growth Inside 0",
    dataIndex: "feeGrowthInside0LastX128",
    key: "feeGrowthInside0LastX128",
    render: (value: bigint) => {
      return value.toString();
    },
  },
  {
    title: "Fee Growth Inside 1",
    dataIndex: "feeGrowthInside1LastX128",
    key: "feeGrowthInside1LastX128",
    render: (value: bigint) => {
      return value.toString();
    },
  },
  {
    title: "Actions",
    key: "actions",
    render: () => (
      <Space className={styles.actions}>
        <a>Delete</a>
        <a>Collect</a>
      </Space>
    ),
  },
];
// const data = [
//   {
//     owner: "0x1234567890abcdef1234567890abcdef12345678",
//     token0: "0x1234567890abcdef1234567890abcdef12345678",
//     token1: "0x1234567890abcdef1234567890abcdef12345678",
//     index: 0,
//     fee: 3000,
//     liquidity: BigInt(1234560000000),
//     tickLower: -123456,
//     tickUpper: 123456,
//     tokensOwed0: BigInt(123456),
//     tokensOwed1: BigInt(654321),
//     feeGrowthInside0LastX128: BigInt(123456),
//     feeGrowthInside1LastX128: BigInt(654321),
//   },
// ];
const PositionsList: React.FC = () => {
  const [openAddPositionDrawer, setOpenAddPositionDrawer] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data = [], refetch } = useReadPositionManagerGetAllPositions({
    address: getContractAddress("PositionManager"),
  });

  return (
    <Card className={styles.positionsList}>
      <Table
        title={() => {
          return (
            <>
              <Flex justify="space-between">
                <span> My Positions</span>
                <Space>
                  <Button
                    type="primary"
                    onClick={() => setOpenAddPositionDrawer(true)}
                    loading={loading}
                  >
                    Add Position
                  </Button>
                </Space>
              </Flex>
            </>
          );
        }}
        scroll={{ x: true }}
        columns={columns}
        dataSource={data}
      ></Table>
      <AddPositionDrawer
        open={openAddPositionDrawer}
        onCancel={() => {
          setOpenAddPositionDrawer(false);
        }}
        onCreatePool={() => {
          setOpenAddPositionDrawer(false);
        }}
      ></AddPositionDrawer>
    </Card>
  );
};

const Positions = () => {
  return (
    <>
      <Layout>
        <PositionsList />
      </Layout>
    </>
  );
};
export default Positions;
