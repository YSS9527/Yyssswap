"use client";

import Layout from "@/components/Layout";
import { Card, Table, Button, Space, Flex, message } from "antd";
import React, { useState, useCallback } from "react";
import styles from "./positions.module.css";
import type { TableProps } from "antd";
import AddPositionDrawer from "@/components/AddPositionDrawer";
import { EthereumFilled } from "@ant-design/web3-icons";
import { getTokenInfo, parseBigIntToAmount } from "@/utils/common";

import {
  useReadPositionManagerGetAllPositions,
  useWriteErc20Approve,
  useWritePositionManagerMint,
  useWritePositionManagerBurn,
  useWritePositionManagerCollect,
} from "@/utils/contracts";
import { getContractAddress } from "@/utils/getContractAddress";
import { useAccount } from "@ant-design/web3";

const PositionsList: React.FC = () => {
  const [openAddPositionDrawer, setOpenAddPositionDrawer] = useState(false);
  const [loading, setLoading] = useState(false);
  const { account } = useAccount();

  const { data = [], refetch } = useReadPositionManagerGetAllPositions({
    address: getContractAddress("PositionManager"),
  });
  const { writeContractAsync: writeErc20Approve } = useWriteErc20Approve();
  const { writeContractAsync: writePositionManagerMint } =
    useWritePositionManagerMint();
  const { writeContractAsync: writePositionManagerBurn } =
    useWritePositionManagerBurn();
  const { writeContractAsync: writePositionManagerCollect } =
    useWritePositionManagerCollect();

  const columns: TableProps["columns"] = [
    {
      title: "Owner",
      dataIndex: "owner",
      key: "owner",
      width: 100,
      ellipsis: true,
    },
    {
      title: "Token 0",
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
      title: "Token 1",
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
      title: "Fee",
      dataIndex: "fee",
      key: "fee",
      render: (value: string) => {
        return `${parseInt(value) / 10000}%`;
      },
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
      render: (value, item) => {
        if (item.owner !== account?.address) {
          return "";
        }
        return (
          <Space>
            {item.liquidity > 0 && (
              <Button
                onClick={async () => {
                  try {
                    await writePositionManagerBurn({
                      address: getContractAddress("PositionManager"),
                      args: [item.id],
                    });
                    message.success("Delete Success");
                    refetch();
                  } catch (error: any) {
                    message.error(error.message);
                  }
                }}
              >
                Delete
              </Button>
            )}
            {(item.tokensOwed0 > 0 || item.tokensOwed1 > 0) && (
              <Button
                onClick={async () => {
                  try {
                    await writePositionManagerCollect({
                      address: getContractAddress("PositionManager"),
                      args: [item.id, account?.address as `0x${string}`],
                    });
                    message.success("Collect Success");
                    refetch();
                  } catch (error: any) {
                    message.error(error.message);
                  }
                }}
              >
                Collect
              </Button>
            )}
          </Space>
        );
      },
    },
  ];

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
        onCreatePosition={async (createParams) => {
          console.log("createParams", {
            ...createParams,
            recipient: account?.address as `0x${string}`,
          });
          setOpenAddPositionDrawer(false);
          setLoading(true);
          try {
            await writeErc20Approve({
              address: createParams.token0,
              args: [
                getContractAddress("PositionManager"),
                createParams.amount0Desired,
              ],
            });
            await writeErc20Approve({
              address: createParams.token1,
              args: [
                getContractAddress("PositionManager"),
                createParams.amount1Desired,
              ],
            });
            await writePositionManagerMint({
              address: getContractAddress("PositionManager"),
              args: [
                {
                  ...createParams,
                  recipient: account?.address as `0x${string}`,
                },
              ],
            });
            message.success("Add Position Success");
            refetch();
          } catch (error: any) {
            console.log(error);
            message.error(error.message);
          } finally {
            setLoading(false);
          }
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
