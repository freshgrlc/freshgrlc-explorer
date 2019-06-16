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
      logo: "garlicoin.svg"
    },
    {
      name: "tuxcoin",
      displayName: "Tuxcoin",
      symbol: "TUX",
      blockTime: 60,
      blockReward: 33.5,
      logo: "tuxcoin.svg"
    },
    {
      name: "garlicoin-testnet",
      displayName: "Garlicoin testnet",
      symbol: "tGRLC",
      blockTime: 40,
      blockReward: 50,
      logo: "garlicoin.svg"
    }
  ];
  return (
    <div className={classes.overviews}>
      <CoinOverview coinInfo={coins[0]} />
      <CoinOverview coinInfo={coins[1]} />
    </div>
  );
};
