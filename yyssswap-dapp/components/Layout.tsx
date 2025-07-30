"use client";

import React from "react";
import Header from "./Header";
import styles from "./Layout.module.css";
import {
  WagmiWeb3ConfigProvider,
  MetaMask,
  OkxWallet,
  TokenPocket,
  WalletConnect,
  Mainnet,
  Localhost,
  Sepolia,
} from "@ant-design/web3-wagmi";
import { useAccount, http } from "wagmi";

interface LayoutProps {
  children: React.ReactNode;
}

const LayoutContent: React.FC<LayoutProps> = ({ children }) => {
  const { address } = useAccount();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(false);
  }, []);

  if (loading || !address) {
    return (
      <div className={styles.connectTip}>Please Connect Wallet First.</div>
    );
  }
  return <>{children}</>;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <WagmiWeb3ConfigProvider
      eip6963={{
        autoAddInjectedWallets: true,
      }}
      ens
      chains={[Localhost, Sepolia, Mainnet]}
      transports={{
        [Localhost.id]: http("http://127.0.0.1:8545"),
        [Sepolia.id]: http("https://api.zan.top/public/eth-sepolia"),
      }}
      wallets={[
        MetaMask(),
        WalletConnect(),
        TokenPocket({
          group: "Popular",
        }),
        OkxWallet(),
      ]}
      walletConnect={{
        projectId: "d0e9eab1caf19722d0e8e63f6ff38d2b",
      }}
    >
      <div className={styles.layout}>
        <Header />
        {/* {children} */}
        <LayoutContent>{children}</LayoutContent>
      </div>
    </WagmiWeb3ConfigProvider>
  );
};

export default Layout;
