import React, { useContext } from "react";
import { Link } from "react-router-dom";

import { Cell } from "../../../../Cell/Cell.component";
import { Transactions } from "../../Transactions/Transactions.component";

import { CoinInfoContext } from "context/CoinInfo.context";

import { IBlock } from "interfaces/IBlock.interface";

import { formatTime } from "utils/formatTime.util";

import classes from "./Block.module.scss";

interface IProps {
  block: IBlock;
}

export const Block: React.FC<IProps> = ({ block }) => {
  const coinInfo = useContext(CoinInfoContext);
  return coinInfo ? (
    <div className={classes.block}>
      <h3 className={classes.header}>
        <Link
          to={`/${coinInfo.symbol.toLowerCase()}/blocks/${block.hash}`}
          className={classes.link}
        >
          {block.hash}
        </Link>
      </h3>
      <div className={classes.data}>
        <Cell label="Height" data={block.height.toString()} />
        <Cell label="Difficulty" data={block.difficulty.toString()} />
        <Cell label="Firstseen" data={formatTime(block.firstseen)} />
      </div>
      <div className={classes.data}>
        <Cell
          label="Miner"
          data={block.miner.website ? block.miner.name : "(Unknown Pool)"}
          notMono={true}
        />
        <Cell label="Size" data={block.size.toString()} unit="bytes" />
        <Cell
          label="Transactions"
          data={block.transactions.length.toString()}
        />
      </div>
      <div className={classes.transactions}>
        <h4 className={classes.header}>Transactions</h4>
        <Transactions transactions={block.transactions} />
      </div>
    </div>
  ) : null;
};
