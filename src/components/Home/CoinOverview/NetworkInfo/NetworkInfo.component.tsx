import React, { useMemo, useEffect, useState } from "react";

import { Row } from "./Row/Row.component";

import { IBlock } from "interfaces/IBlock.interface";
import { ICell } from "interfaces/ICell.interface";
import { ICoinInfo } from "interfaces/ICoinInfo.interface";

import classes from "./NetworkInfo.module.scss";

import { adjustDifficulty } from "utils/adjustDifficulty.util";
import { formatTime } from "utils/formatTime.util";

interface IProps {
  latestBlock?: IBlock;
  coinInfo: ICoinInfo;
  baseUrl: string;
}

export const NetworkInfo: React.FC<IProps> = ({ latestBlock, coinInfo, baseUrl }) => {
  const yesterdayDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return (date.getTime() / 1000).toFixed(0);
  }, []);
  const formattedBlock = useMemo((): {
    height?: string;
    timestamp?: string;
    difficulty?: string;
    adjusted?: string;
  } => {
    if (latestBlock) {
      return {
        height: latestBlock.height.toString(),
        timestamp: formatTime(latestBlock.timestamp),
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
  const [yesterday, setYesterday] = useState({});
  const [allTime, setAllTime] = useState({});
  const [coins, setCoins] = useState<string | undefined>(undefined);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const data = ((await (await fetch(`${baseUrl}/networkstats/?since=${yesterdayDate}`)).json()));
      if (!cancelled) {
        setYesterday(data);
      }
    })();
    (async () => {
      const coins = ((await (await fetch(`${baseUrl}/coins/`)).json()) as {total: number}).total;
      if (!cancelled) {
        setCoins(Math.round(coins).toString());
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [baseUrl, yesterdayDate]);
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
      },
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
            data: "11"
          },
          {
            label: "Coins Released (est.)",
            data: coins
          }
        ]
      }
    ];
    return data;
  }, [formattedBlock, coinInfo, coins]);
  return (
    <div className={classes.network}>
      {table.map(entry => (
        <Row key={Math.random().toString() + Date.now()} {...entry} />
      ))}
    </div>
  );
};
