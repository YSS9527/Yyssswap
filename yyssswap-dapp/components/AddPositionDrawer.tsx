"use client";

import { Drawer, Space, Button, Form, Input, Select, InputNumber } from "antd";
import type { FormProps } from "antd";

interface CreatePositionParams {
  token0: string;
  token1: string;
  index: number;
  amount0Desired: BigInt;
  amount1Desired: BigInt;
  recipient: string;
  deadline: BigInt;
}
interface AddPositionDrawerProps {
  open: boolean;
  onCancel: () => void;
  onCreatePool: (params: CreatePositionParams) => void;
}
const onFinish: FormProps<CreatePositionParams>["onFinish"] = (values) => {
  console.log();
  console.log("Success:", values);
};
const onFinishFailed: FormProps<CreatePositionParams>["onFinishFailed"] = (
  errorInfo
) => {
  console.log("Failed:", errorInfo);
};

const AddPositionDrawer = (props: AddPositionDrawerProps) => {
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
            onClick={() => {
              console.log("点击提交");
              onCreatePool({
                token0: "1",
                token1: "1",
                index: 1,
                amount0Desired: BigInt(1),
                amount1Desired: BigInt(1),
                recipient: "string",
                deadline: BigInt(1),
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
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item required label="Token 0" name="token0">
          <Input />
        </Form.Item>
        <Form.Item required label="Token 1" name="token1">
          <Input />
        </Form.Item>
        <Form.Item required label="Amount0 Desired" name="amount0Desired">
          <Input />
        </Form.Item>
        <Form.Item required label="Amount1 Desired" name="amount1Desired">
          <Input />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default AddPositionDrawer;
