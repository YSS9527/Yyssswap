import { type Token } from "@ant-design/web3";
import { useTokenAddress } from "@/utils/common";
import { useReadErc20BalanceOf } from "@/utils/contracts";
import { useAccount } from "wagmi";
import { CryptoPrice } from "@ant-design/web3";

export default function Balance(props: { token?: Token }) {
  const token = props.token;
  const { address } = useAccount();
  const tokenAddress = useTokenAddress(token);
  const { data: balance } = useReadErc20BalanceOf({
    address: tokenAddress,
    args: [address as `0x${string}`],
    query: {
      enabled: !!tokenAddress,
      refetchInterval: 5000,
    },
  });
  return balance === undefined ? (
    <>{0}</>
  ) : (
    <>
      <CryptoPrice
        value={balance}
        symbol={token?.symbol}
        decimals={0}
        // decimals={props.token?.decimal}
        // fixed={2}
      />
    </>
  );
}
