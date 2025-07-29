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
} from "antd";
// import type { FormProps } from "antd";
import { getContractAddress } from "@/utils/getContractAddress";
import { parsePriceToSqrtPriceX96 } from "@/utils/common";

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
      width={600}
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
                if (values.token0 >= values.token1) {
                  message.error("Token0 should be less than Token1");
                  return false;
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
          <Input />
        </Form.Item>
        <Form.Item rules={[{ required: true }]} label="Token 1" name="token1">
          <Input />
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
        <Form.Item required label="Tick Lower" name="tickLower">
          <InputNumber />
        </Form.Item>
        <Form.Item required label="Tick Upper" name="tickUpper">
          <InputNumber />
        </Form.Item>
        {/* <Form.Item required label="SqrtPriceX96" name="sqrtPriceX96">
          <InputNumber />
        </Form.Item> */}
        <Form.Item required label="Init Price(token1/token0)" name="price">
          <InputNumber min={0.000001} max={1000000} />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default AddPoolDrawer;
