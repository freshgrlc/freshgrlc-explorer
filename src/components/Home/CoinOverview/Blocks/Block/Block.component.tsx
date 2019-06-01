import React from "react";
import { Link } from "react-router-dom";

import { IBlock } from "interfaces/IBlock.interface";

import { formatTime } from "utils/formatTime.util";

import classes from "./Block.module.scss";
import { Cell } from "../../Cell/Cell.component";

interface IProps {
  block: IBlock;
}

export const Block: React.FC<IProps> = ({ block }) => {
  return (
    <div className={classes.block}>
      <h3 className={classes.header}>
        <Link to="" className={classes.link}>
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
      <div className={classes.transactions}>c</div>
    </div>
  );
};
