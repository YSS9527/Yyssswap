"use client";

import {
  Drawer,
  Space,
  Button,
  Form,
  Input,
  Select,
  InputNumber,
  message,
  Slider,
} from "antd";
import {
  getContractAddress,
  tokens,
  getTokenInfo,
  builtInTokens
} from "@/utils/contractsInfo";
import { parsePriceToSqrtPriceX96 } from "@/utils/common";
import { TokenSelect, type Token } from "@ant-design/web3";
interface CreatePoolParams {
  token0: `0x${string}`;
  token1: `0x${string}`;
  fee: number;
  tickLower: number;
  tickUpper: number;
  sqrtPriceX96: BigInt;
}
interface AddPoolDrawerProps {
  open: boolean;
  onCancel: () => void;
  onCreatePool: (params: CreatePoolParams) => void;
}

const AddPoolDrawer = (props: AddPoolDrawerProps) => {
  const { open, onCancel, onCreatePool } = props;
  const [form] = Form.useForm();
  return (
    <Drawer
      title="Add Pool"
      width={500}
      open={open}
      // onClose={onCancel}
      closeIcon={false}
      extra={
        <Space>
          <Button onClick={onCancel}>Cancel</Button>
          <Button
            type="primary"
            onClick={async () => {
              const values = await form.validateFields().then((values) => {
                if (values.token0 == values.token1) {
                  message.error("Token0 and Token1 need to be different");
                  return false;
                }
                if (values.token0 > values.token1) {
                  [values.token0, values.token1] = [
                    values.token1,
                    values.token0,
                  ];
                }
                onCreatePool({
                  ...values,
                  sqrtPriceX96: parsePriceToSqrtPriceX96(values.price),
                });
              });
            }}
          >
            Create
          </Button>
        </Space>
      }
    >
      <Form
        layout="vertical"
        form={form}
        initialValues={{
          token0: getContractAddress("DebugTokenA"),
          token1: getContractAddress("DebugTokenB"),
          fee: 3000,
          tickLower: -887272,
          tickUpper: 887272,
          price: 1,
        }}
      >
        <Form.Item required label="Token 0" name="token0">
          {/* <Input /> */}
          <Select options={tokens} />
          {/* <TokenSelect options={builtInTokens}/> */}
        </Form.Item>
        <Form.Item rules={[{ required: true }]} label="Token 1" name="token1">
          <Select options={tokens} />
          {/* <TokenSelect options={builtInTokens}/> */}
        </Form.Item>
        <Form.Item required label="Fee" name="fee">
          <Select
            // defaultValue={3000}
            options={[
              { value: 500, label: "0.05%" },
              { value: 3000, label: "0.3%" },
              { value: 10000, label: "1%" },
              { value: 20000, label: "2%", disabled: true },
            ]}
          />
        </Form.Item>
        <Form.Item
        //  required label="Tick"
        >
          <Form.Item
            label="TickLower"
            name="tickLower"
            required
            style={{ display: "inline-block", width: "calc(50%)" }}
          >
            <InputNumber
              style={{ width: "90%" }}
              placeholder="Input TickLower"
            />
          </Form.Item>
          <Form.Item
            label="TickUpper"
            name="tickUpper"
            required
            style={{
              display: "inline-block",
              width: "calc(50%)",
            }}
          >
            <InputNumber
              style={{ width: "90%" }}
              placeholder="Input TickUpper"
            />
          </Form.Item>
        </Form.Item>
        <Form.Item required label="Price(Token1/Token0)" name="price">
          <Slider min={1} max={100000} />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default AddPoolDrawer;
