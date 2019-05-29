import React, { useMemo, useEffect, useState } from "react";

import { Row } from "./Row/Row.component";

import { IBlock, IBlockSimple } from "interfaces/IBlock.interface";
import { ICell } from "interfaces/ICell.interface";
import { ICoinInfo } from "interfaces/ICoinInfo.interface";
import { INetworkStats } from "interfaces/INetworkStats.interface";

import classes from "./NetworkInfo.module.scss";

import { adjustDifficulty } from "utils/adjustDifficulty.util";
import { formatTime } from "utils/formatTime.util";

interface IProps {
  latestBlock?: IBlock;
  coinInfo: ICoinInfo;
  baseUrl: string;
}

export const NetworkInfo: React.FC<IProps> = ({
  latestBlock,
  coinInfo,
  baseUrl
}) => {
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
    if (latestBlock != null) {
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

  const [yesterday, setYesterday] = useState<INetworkStats>({
    blocks: {},
    transactions: {}
  });

  const [allTime, setAllTime] = useState<INetworkStats>({
    blocks: {},
    transactions: {}
  });

  const [average5000, setAverage5000] = useState<string | undefined>(undefined);
  const [average50000, setAverage50000] = useState<string | undefined>(
    undefined
  );

  const [coins, setCoins] = useState<string | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const data = (await (await fetch(
        `${baseUrl}/networkstats/?since=${yesterdayDate}`
      )).json()) as INetworkStats;
      if (!cancelled) {
        setYesterday(data);
      }
    })();
    (async () => {
      const data = (await (await fetch(
        `${baseUrl}/networkstats/?since=0`
      )).json()) as INetworkStats;
      if (!cancelled) {
        setAllTime(data);
      }
    })();
    (async () => {
      const coins = ((await (await fetch(`${baseUrl}/coins/`)).json()) as {
        total: number;
      }).total;
      if (!cancelled) {
        setCoins(Math.round(coins).toString());
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [baseUrl, yesterdayDate]);

  useEffect(() => {
    if (latestBlock != null) {
      const getAverage = async (depth: number): Promise<number> => {
        const old = ((await (await fetch(
          `${baseUrl}/blocks/?start=-${depth}&limit=1`
        )).json()) as IBlockSimple[])[0];
        const timeDifference = latestBlock.timestamp - old.timestamp;
        return timeDifference / depth;
      };
      let cancelled = false;
      (async () => {
        const average = await getAverage(5000);
        if (!cancelled) {
          setAverage5000(average.toFixed(0));
        }
      })();
      (async () => {
        const average = await getAverage(50000);
        if (!cancelled) {
          setAverage50000(average.toFixed(0));
        }
      })();
      return () => {
        cancelled = true;
      };
    }
  }, [baseUrl, latestBlock]);

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
            data:
              yesterday.transactions.amount != null
                ? yesterday.transactions.amount.toString()
                : "0"
          },
          {
            label: "Total Value",
            data:
              yesterday.transactions.totalvalue != null
                ? Math.round(yesterday.transactions.totalvalue).toString()
                : "0"
          }
        ]
      },
      {
        label: "24 Mining Stats",
        cells: [
          {
            label: "Blocks Mined",
            data:
              yesterday.blocks.amount != null
                ? yesterday.blocks.amount.toString()
                : undefined
          },
          {
            label: "Coins Created",
            data:
              yesterday.blocks.amount != null
                ? (yesterday.blocks.amount * 25).toString()
                : undefined
          }
        ]
      },
      // TODO: Add the requests for this once indexer is running again
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
            data: average5000,
            unit: "seconds"
          },
          {
            label: "50,000 Blocks",
            data: average50000,
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
            data: allTime.transactions.amount
              ? allTime.transactions.amount.toString()
              : undefined
          },
          {
            label: "Coins Released (est.)",
            data: coins
          }
        ]
      }
    ];
    return data;
  }, [formattedBlock, coins, yesterday, allTime, average5000, average50000]);

  return (
    <div className={classes.network}>
      {table.map(entry => (
        <Row key={Math.random().toString() + Date.now()} {...entry} />
      ))}
    </div>
  );
};
