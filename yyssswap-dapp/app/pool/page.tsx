"use client";

import Layout from "@/components/Layout";
import Link from "next/link";
import styles from "./pool.module.css";
import { Card, Table, Flex, Space, Button, TableProps, message } from "antd";
import React, { useState, useEffect } from "react";
import AddPoolDrawer from "@/components/AddPoolDrawer";
import { parseBigIntToAmount } from "@/utils/common";
import { EthereumFilled } from "@ant-design/web3-icons";

import { getContractAddress, getTokenInfo } from "@/utils/contractsInfo";
import {
  useReadPoolManagerGetAllPools,
  useWritePoolManagerCreateAndInitializePoolIfNecessary,
} from "@/utils/contracts";

const PoolList: React.FC = () => {
  const [openAddPoolDrawer, setOpenAddPoolDrawer] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data = [], refetch } = useReadPoolManagerGetAllPools({
    address: getContractAddress("PoolManager"),
  });
  const { writeContractAsync } =
    useWritePoolManagerCreateAndInitializePoolIfNecessary();

  const columns: TableProps["columns"] = [
    {
      title: "Token0",
      dataIndex: "token0",
      key: "token0",
      ellipsis: true,
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
      ellipsis: true,
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
      title: "Liquidity",
      dataIndex: "liquidity",
      key: "liquidity",
      render: (value: bigint) => {
        return value.toString();
      },
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

  return (
    <>
      <Card
        title={
          <Flex justify="space-between">
            <div>PoolList</div>
            <Space>
              <Button
                loading={loading}
                type="primary"
                onClick={() => setOpenAddPoolDrawer(true)}
              >
                Add Pool
              </Button>
            </Space>
          </Flex>
        }
        className={styles.poolCard}
      >
        <Table
          // title={() => (
          //   <Flex justify="space-between">
          //     <div>PoolList</div>
          //     <Space>
          //       <Button
          //         loading={loading}
          //         type="primary"
          //         onClick={() => setOpenAddPoolDrawer(true)}
          //       >
          //         Add Pool
          //       </Button>
          //     </Space>
          //   </Flex>
          // )}
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
