import React, { useMemo, useState } from "react";

import { Row } from "./Row/Row.component";

import { IBlock } from "interfaces/IBlock.interface";
import { ICell } from "interfaces/ICell.interface";
import { ICoinInfo } from "interfaces/ICoinInfo.interface";

import classes from "./NetworkInfo.module.scss";

interface IProps {
  latestBlock?: IBlock;
  coinInfo: ICoinInfo;
}

const adjustDifficulty = (
  difficulty: number,
  blockTime: number,
  blockReward: number
) => {
  return ((difficulty * blockTime) / 60 / blockReward) * 50;
};

export const NetworkInfo: React.FC<IProps> = ({ latestBlock, coinInfo }) => {
  const [loadMore, setLoadMore] = useState(false);
  const formattedBlock = useMemo(() => {
    if (latestBlock) {
      return {
        height: latestBlock.height.toString(),
        timestamp: latestBlock.timestamp.toString(),
        difficulty: latestBlock.difficulty.toFixed(3),
        adjusted: adjustDifficulty(
          latestBlock.difficulty,
          coinInfo.blockTime,
          coinInfo.blockReward
        ).toFixed(3)
      };
    } else {
      return {};
    }
  }, [latestBlock, coinInfo]);
  const table = useMemo(() => {
    let data: Array<{ label: string; cells: [ICell, ICell] }> = [
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
    if (loadMore) {
      data = [
        ...data,
        {
          label: "24 Activity",
          cells: [
            {
              label: "Transactions",
              data: "100"
            },
            {
              label: "Total Value",
              data: "100"
            }
          ]
        },
        {
          label: "24 Mining Stats",
          cells: [
            {
              label: "Blocks Mined",
              data: "100"
            },
            {
              label: "Generated Wealth",
              data: "100",
              unit: "dollars"
            }
          ]
        },
        {
          label: "Decentrilazation",
          cells: [
            {
              label: "Controlling 50%",
              data: "3",
              unit: "pools"
            },
            {
              label: "Controlling 90%",
              data: "8",
              unit: "pools"
            }
          ]
        },
        {
          label: "Average Blocktime",
          cells: [
            {
              label: "5,000 Blocks",
              data: coinInfo.blockTime.toString(),
              unit: "seconds"
            },
            {
              label: "50,000 Blocks",
              data: coinInfo.blockTime.toString(),
              unit: "seconds"
            }
          ]
        },
        // {
        //   label: "Coin Value",
        //   cells: [
        //     {
        //       label: "Fiat",
        //       data: "0.279",
        //       unit: "cents"
        //     },
        //     {
        //       label: "Bitcoin",
        //       data: "32.120",
        //       unit: "satoshi"
        //     }
        //   ]
        // },
        {
          label: "Network Totals",
          cells: [
            {
              label: "All-time Transactions",
              data: "11",
            },
            {
              label: "Coins Released (est.)",
              data: "-5",
            }
          ]
        }
      ];
    }
    return data;
  }, [formattedBlock, loadMore, coinInfo]);
  return (
    <div className={classes.network}>
      {table.map(entry => (
        <Row key={Math.random().toString() + Date.now()} {...entry} />
      ))}
      {!loadMore ? (
        <button onClick={() => setLoadMore(true)}>Load More</button>
      ) : null}
    </div>
  );
};
