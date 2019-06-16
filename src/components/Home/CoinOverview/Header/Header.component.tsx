import React, { useContext } from "react";

import { CoinInfoContext } from "context/CoinInfo.context";

import classes from "./Header.module.scss";

interface IProps {}

export const Header: React.FC<IProps> = () => {
  const coinInfo = useContext(CoinInfoContext);
  return coinInfo ? (
    <h1 className={classes.header}>
      <span className={classes.contents}>
        <img
          className={classes.img}
          src={require(`assets/logos/${coinInfo.logo}`)}
          alt=""
        />
        <span className={classes.text}>{coinInfo.displayName}</span>
      </span>
    </h1>
  ) : null;
};
