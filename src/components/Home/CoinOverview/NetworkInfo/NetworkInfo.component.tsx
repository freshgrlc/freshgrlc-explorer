import React, { useMemo, useEffect, useState } from "react";

import { Row } from "./Row/Row.component";

import { IBlock, IBlockSimple } from "interfaces/IBlock.interface";
import { ICell } from "interfaces/ICell.interface";
import { ICoinInfo } from "interfaces/ICoinInfo.interface";
import { INetworkStats } from "interfaces/INetworkStats.interface";
import { IPoolStat } from "interfaces/IPoolStat.interface";

import { adjustDifficulty } from "utils/adjustDifficulty.util";
import { formatTime } from "utils/formatTime.util";

import classes from "./NetworkInfo.module.scss";

interface IProps {
  latestBlock?: IBlock;
  coinInfo: ICoinInfo;
  baseUrl: string;
}

export const NetworkInfo: React.FC<IProps> = ({
  latestBlock,
  coinInfo,
  baseUrl,
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
        ).toFixed(3),
      };
    } else {
      return {};
    }
  }, [latestBlock, coinInfo]);

  const [yesterday, setYesterday] = useState<INetworkStats>({
    blocks: {},
    transactions: {},
    coins: {},
  });

  const [allTime, setAllTime] = useState<INetworkStats>({
    blocks: {},
    transactions: {},
    coins: {},
  });

  const [decentrailization50, setDecentralization50] = useState<
    string | undefined
  >(undefined);
  const [decentrailization90, setDecentralization90] = useState<
    string | undefined
  >(undefined);

  const [average5000, setAverage5000] = useState<string | undefined>(undefined);
  const [average50000, setAverage50000] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    const getNumberPoolsNeeded = (
      percentage: number,
      blocks: number,
      poolData: IPoolStat[]
    ): number => {
      const target = Math.ceil(blocks * percentage);
      let runningCount = 0;
      for (const [index, pool] of poolData.entries()) {
        runningCount += pool.amountmined;
        if (runningCount >= target) {
          const amount = index + 1;
          return amount;
        }
      }
      return poolData.length;
    };
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
      const poolData = ((await (await fetch(
        `${baseUrl}/poolstats/?since=${yesterdayDate}`
      )).json()) as IPoolStat[]).sort((a, b) =>
        a.amountmined > b.amountmined ? -1 : 1
      );
      if (!cancelled) {
        const blocks = poolData
          .map((pool) => pool.amountmined)
          .reduce((total, next) => total + next);

        setDecentralization50(
          getNumberPoolsNeeded(0.5, blocks, poolData).toString()
        );
        setDecentralization90(
          getNumberPoolsNeeded(0.9, blocks, poolData).toString()
        );
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
            data: formattedBlock.height,
          },
          {
            label: "Recieved at",
            data: formattedBlock.timestamp,
          },
        ],
      },
      {
        label: "Difficulty",
        cells: [
          {
            label: "Network",
            data: formattedBlock.difficulty,
          },
          {
            label: "Adjusted (50 coins/min)",
            data: formattedBlock.adjusted,
          },
        ],
      },
      {
        label: "24 Activity",
        cells: [
          {
            label: "Transactions",
            data:
              yesterday.transactions.amount != null
                ? yesterday.transactions.amount.toString()
                : undefined,
          },
          {
            label: "Total Value",
            data:
              yesterday.transactions.totalvalue != null
                ? Math.round(yesterday.transactions.totalvalue).toString()
                : undefined,
          },
        ],
      },
      {
        label: "24 Mining Stats",
        cells: [
          {
            label: "Blocks Mined",
            data:
              yesterday.blocks.amount != null
                ? yesterday.blocks.amount.toString()
                : undefined,
          },
          {
            label: "Coins Created",
            data:
              yesterday.blocks.amount != null
                ? (yesterday.blocks.amount * 25).toString()
                : undefined,
          },
        ],
      },
      {
        label: "Decentrilazation",
        cells: [
          {
            label: "Controlling 50%",
            data: decentrailization50,
            unit: "pools",
          },
          {
            label: "Controlling 90%",
            data: decentrailization90,
            unit: "pools",
          },
        ],
      },
      {
        label: "Average Blocktime",
        cells: [
          {
            label: "5,000 Blocks",
            data: average5000,
            unit: "seconds",
          },
          {
            label: "50,000 Blocks",
            data: average50000,
            unit: "seconds",
          },
        ],
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
              : undefined,
          },
          {
            label: "Coins Released (est.)",
            data: allTime.coins.released
              ? allTime.coins.released.toString()
              : undefined,
          },
        ],
      },
    ];
    return data;
  }, [
    formattedBlock,
    yesterday,
    allTime,
    average5000,
    average50000,
    decentrailization50,
    decentrailization90,
  ]);

  return (
    <div className={classes.network}>
      {table.map((entry) => (
        <Row key={Math.random().toString() + Date.now()} {...entry} />
      ))}
    </div>
  );
};
