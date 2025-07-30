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
import { getContractAddress, tokens } from "@/utils/getContractAddress";
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
  onCreatePosition: (params: CreatePositionParams) => void;
}

const AddPositionDrawer = (props: AddPositionDrawerProps) => {
  const { open, onCancel, onCreatePosition } = props;
  const [form] = Form.useForm();
  return (
    <Drawer
      title="Add Position"
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
              await form.validateFields().then((values) => {
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
                onCreatePosition({
                  ...values,
                  amount0Desired: BigInt(values.amount0Desired),
                  amount1Desired: BigInt(values.amount1Desired),
                  deadline: BigInt(Date.now() + 100000),
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
          index: 0,
          amount0Desired: "1000",
          amount1Desired: "1000",
        }}
      >
        <Form.Item required label="Token 0" name="token0">
          <Select onChange={() => {}} options={tokens} />
        </Form.Item>
        <Form.Item required label="Token 1" name="token1">
          <Select options={tokens} />
        </Form.Item>
        <Form.Item required label="Pool Index" name="index">
          <InputNumber min={0} style={{ width: "80%" }} />
        </Form.Item>
        <Form.Item required label="Amount0 Desired" name="amount0Desired">
          <Input style={{ width: "80%" }} />
        </Form.Item>
        <Form.Item required label="Amount1 Desired" name="amount1Desired">
          <Input style={{ width: "80%" }} />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default AddPositionDrawer;
