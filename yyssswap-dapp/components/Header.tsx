"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import styles from "./Layout.module.css";
import Image from "next/image";
import { ConnectButton, Connector } from "@ant-design/web3";
import React, { useState, useEffect } from "react";

const Header = () => {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);
  return (
    <>
      <div className={styles.header}>
        <Image
          src="/logo.png" // 路径从 public 目录开始
          alt="logo"
          width={60}
          height={60}
        />
        <div className={styles.nav}>
          <Link
            href="/"
            className={pathname == "/" ? styles.active : undefined}
          >
            Swap
          </Link>
          <Link
            href="/pool"
            className={
              pathname == "/pool"
                ? styles.active
                : undefined
            }
          >
            Pool
          </Link>
          <Link
            href="/position"
            className={
              pathname == "/position"
                ? styles.active
                : undefined
            }
          >
            Position
          </Link>
        </div>
        <div>
          {loading ? null : (
            <Connector
              modalProps={{
                mode: "simple",
              }}
            >
              <ConnectButton type="text" />
            </Connector>
          )}
        </div>
      </div>
    </>
  );
};
export default Header;
