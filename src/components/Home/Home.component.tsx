import React from "react";

import { CoinOverview } from "./CoinOverview/CoinOverview.component";

import { ICoinInfo } from "interfaces/ICoinInfo.interface";

import classes from "./Home.module.scss";

export const Home: React.FC = () => {
  const coins: ICoinInfo[] = [
    {
      name: "garlicoin",
      displayName: "Garlicoin",
      symbol: "GRLC",
      blockTime: 40,
      blockReward: 25,
    },
    {
      name: "tuxcoin",
      displayName: "Tuxcoin",
      symbol: "TUX",
      blockTime: 60,
      blockReward: 33.5,
    },
  ];
  return (
    <div className={classes.overviews}>
      <div style={{ flex: "1 0 0" }}></div>
      <CoinOverview coinInfo={coins[0]} />
      <div style={{ flex: "1 0 0" }}></div>
      <CoinOverview coinInfo={coins[1]} />
      <div style={{ flex: "1 0 0" }}></div>
    </div>
  );
};
