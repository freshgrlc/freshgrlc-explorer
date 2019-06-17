import React, { useContext } from "react";
import { Link } from "react-router-dom";

import { Cell } from "components/Cell/Cell.component";
import { Transactions } from "../../Transactions/Transactions.component";

import { CoinInfoContext } from "context/CoinInfo.context";

import { IBlock } from "interfaces/IBlock.interface";

import { formatTime } from "utils/formatTime.util";

import classes from "./Block.module.scss";

interface IProps {
  block: IBlock;
}

export const Block: React.FC<IProps> = React.memo(
  ({ block }) => {
    const coinInfo = useContext(CoinInfoContext);
    return coinInfo ? (
      <div className={classes.block}>
        <h3 className={classes.header}>
          <Link
            to={`/${coinInfo.ticker}/blocks/${block.hash}`}
            className={classes.link}
          >
            {block.hash}
          </Link>
        </h3>
        <div className={classes.data}>
          <Cell
            label="Height"
            data={block.height.toString()}
            cellStyle={{ color: "normal" }}
          />
          <Cell
            label="Difficulty"
            data={block.difficulty.toString()}
            cellStyle={{ color: "lighter" }}
          />
          <Cell
            label="Received at"
            data={formatTime(block.firstseen)}
            cellStyle={{ color: "normal" }}
          />
        </div>
        <div className={classes.data}>
          <Cell
            label="Miner"
            data={block.miner.website ? block.miner.name : "Unknown Pool"}
            link={block.miner.website}
            externalLink={true}
            notMono={true}
            cellStyle={{ color: "lighter" }}
          />
          <Cell
            label="Size"
            data={block.size.toString()}
            unit="byte"
            cellStyle={{ color: "normal" }}
          />
          <Cell
            label="Transactions"
            data={block.transactions.length.toString()}
            cellStyle={{ color: "lighter" }}
          />
        </div>
        <div className={classes.transactions}>
          <Transactions
            transactions={block.transactions}
            height={4}
            highlightRows={true}
          />
        </div>
      </div>
    ) : null;
  },
  (prev, next) => prev.block.hash === next.block.hash
);
