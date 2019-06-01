import React, {
  useMemo,
  useEffect,
  useState,
  useCallback,
  useContext,
} from "react";

import { Row } from "./Row/Row.component";

import { useGetData } from "hooks/useGetData.hook";

import { IBlock, IBlockSimple } from "interfaces/IBlock.interface";
import { ICell } from "interfaces/ICell.interface";
import { INetworkStats } from "interfaces/INetworkStats.interface";
import { IPoolStat } from "interfaces/IPoolStat.interface";

import { adjustDifficulty } from "utils/adjustDifficulty.util";
import { formatTime } from "utils/formatTime.util";
import { getNumberPoolsNeeded } from "utils/getNumberPoolsNeeded.util";

import classes from "./NetworkInfo.module.scss";
import { CoinInfoContext } from "context/CoinInfo.context";

interface IProps {
  latestBlock?: IBlock;
  baseUrl: string;
}

export const NetworkInfo: React.FC<IProps> = ({ latestBlock, baseUrl }) => {
  const coinInfo = useContext(CoinInfoContext);

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
    if (latestBlock != null && coinInfo) {
      return {
        height: latestBlock.height.toString(),
        timestamp: formatTime(latestBlock.firstseen),
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

  const yesterday = useGetData<INetworkStats>(
    `${baseUrl}/networkstats/?since=${yesterdayDate}`
  );

  const allTime = useGetData<INetworkStats>(`${baseUrl}/networkstats/?since=0`);

  const poolData = useGetData<IPoolStat[]>(
    `${baseUrl}/poolstats/?since=${yesterdayDate}`
  );

  const blocks = useMemo(() => {
    if (poolData) {
      return poolData
        .map((pool) => pool.amountmined)
        .reduce((total, next) => total + next);
    }
  }, [poolData]);

  const getDecentralization = useCallback(
    (percentage: number) => {
      if (poolData && blocks) {
        return getNumberPoolsNeeded(percentage, blocks, poolData).toString();
      }
    },
    [poolData, blocks]
  );

  const decentrailization50 = useMemo(() => {
    return getDecentralization(0.5);
  }, [getDecentralization]);

  const decentrailization90 = useMemo(() => {
    return getDecentralization(0.9);
  }, [getDecentralization]);

  const [average5000, setAverage5000] = useState<string | undefined>(undefined);
  const [average50000, setAverage50000] = useState<string | undefined>(
    undefined
  );

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
              yesterday != null
                ? yesterday.transactions.amount.toString()
                : undefined,
          },
          {
            label: "Total Value",
            data:
              yesterday != null && yesterday.transactions.totalvalue
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
              yesterday != null
                ? yesterday.blocks.amount.toString()
                : undefined,
          },
          {
            label: "Coins Created",
            data:
              yesterday != null
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
            data:
              allTime != null
                ? allTime.transactions.amount.toString()
                : undefined,
          },
          {
            label: "Coins Released (est.)",
            data:
              allTime != null
                ? Math.round(allTime.coins.released).toString()
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
        <Row key={entry.label} {...entry} />
      ))}
    </div>
  );
};
