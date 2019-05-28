import React, { useMemo } from "react";

import { Row } from "./Row/Row.component";

import { IBlock } from "interfaces/IBlock.interface";
import { ICell } from "interfaces/ICell.interface";

import classes from "./NetworkInfo.module.scss";

interface IProps {
  latestBlock: IBlock;
}

export const NetworkInfo: React.FC<IProps> = ({ latestBlock }) => {
  const formattedBlock = useMemo(() => {
    return {
      height: latestBlock.height.toString(),
      timestamp: latestBlock.timestamp.toString(),
      difficulty: latestBlock.difficulty.toFixed(3),
      adjusted: (latestBlock.difficulty * 0).toFixed(3)
    };
  }, [latestBlock]);
  const table = useMemo(() => {
    const data: Array<{ label: string; cells: [ICell, ICell] }> = [
      {
        label: "Latest Block",
        cells: [
          {
            label: "Height",
            data: formattedBlock.height
          },
          {
            label: "Recieved at",
            data: formattedBlock.timestamp
          }
        ]
      },
      {
        label: "Difficulty",
        cells: [
          {
            label: "Network",
            data: formattedBlock.difficulty
          },
          {
            label: "Adjusted (50 coins/min)",
            data: formattedBlock.adjusted
          }
        ]
      }
    ];
    return data;
  }, []);
  return (
    <div className={classes.network}>
      {table.map(entry => (
        <Row key={Math.random().toString() + Date.now()} {...entry} />
      ))}
    </div>
  );
};
