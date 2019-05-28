import React from "react";

import { CoinOverview } from "./CoinOverview/CoinOverview.component";

import { ICoinInfo } from "interfaces/ICoinInfo.interface";

// import classes from "./Home.module.scss"

export const Home: React.FC = () => {
  const coins: ICoinInfo[] = [
    {
      name: "garlicoin",
      displayName: "Garlicoin",
      symbol: "GRLC"
    },
    {
      name: "tuxcoin",
      displayName: "Tuxcoin",
      symbol: "TUX"
    }
  ];
  return (
    <div>
      {coins.map(coinInfo => (
        <CoinOverview key={coinInfo.symbol} coinInfo={coinInfo} />
      ))}
    </div>
  );
};
