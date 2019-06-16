import React, {
  useMemo,
  useEffect,
  useState,
  useCallback,
  useContext,
} from "react";
import useFetch from "react-fetch-hook";

import { Row } from "components/Row/Row.component";

import { CoinInfoContext } from "context/CoinInfo.context";

import { IBlock, IBlockSimple } from "interfaces/IBlock.interface";
import { INetworkStats } from "interfaces/INetworkStats.interface";
import { IPoolStat } from "interfaces/IPoolStat.interface";

import { adjustDifficulty } from "utils/adjustDifficulty.util";
import { formatTime } from "utils/formatTime.util";
import { getNumberPoolsNeeded } from "utils/getNumberPoolsNeeded.util";

import classes from "./NetworkInfo.module.scss";
import { IRow } from "interfaces/IRow.interface";

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
    url?: string;
    timestamp?: string;
    difficulty?: Number;
    adjusted?: Number;
  } => {
    if (latestBlock != null && coinInfo) {
      return {
        height: latestBlock.height.toString(),
        url: `/${coinInfo.ticker}/blocks/${latestBlock.hash}`,
        timestamp: formatTime(latestBlock.firstseen),
        difficulty: latestBlock.difficulty,
        adjusted: adjustDifficulty(
          latestBlock.difficulty,
          coinInfo.blockTime,
          coinInfo.blockReward
        ),
      };
    } else {
      return {};
    }
  }, [latestBlock, coinInfo]);

  const { data: yesterday } = useFetch<INetworkStats>(
    `${baseUrl}/networkstats/?since=${yesterdayDate}`
  );

  const { data: allTime } = useFetch<INetworkStats>(
    `${baseUrl}/networkstats/?since=0`
  );

  const { data: poolData } = useFetch<IPoolStat[]>(
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

  const decentralization50 = useMemo(() => {
    return getDecentralization(0.5);
  }, [getDecentralization]);

  const decentralization90 = useMemo(() => {
    return getDecentralization(0.9);
  }, [getDecentralization]);

  const [average5000, setAverage5000] = useState<Number | undefined>(undefined);
  const [average50000, setAverage50000] = useState<Number | undefined>(
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
          setAverage5000(average);
        }
      })();
      (async () => {
        const average = await getAverage(50000);
        if (!cancelled) {
          setAverage50000(average);
        }
      })();
      return () => {
        cancelled = true;
      };
    }
  }, [baseUrl, latestBlock]);

  const table = useMemo(() => {
    let data: IRow[] = [
      {
        label: "Latest Block",
        cells: [
          {
            label: "Height",
            data: formattedBlock.height,
            link: formattedBlock.url
          },
          {
            label: "Recieved at",
            data: formattedBlock.timestamp,
          },
        ],
      },
      {
        label: "Mining Difficulty",
        cells: [
          {
            label: "Network",
            data: formattedBlock.difficulty,
            decimals: 3
          },
          {
            label: "Adjusted (50 coins/min)",
            data: formattedBlock.adjusted,
            decimals: 3
          },
        ],
      },
      {
        label: "24-hour Activity",
        cells: [
          {
            label: "Transactions",
            data:
              yesterday != null
                ? yesterday.transactions.amount.toString()
                : undefined,
          },
          {
            label: "Transacted Value",
            data:
              yesterday != null && yesterday.transactions.totalvalue
                ? yesterday.transactions.totalvalue
                : undefined,
            unit: coinInfo ? coinInfo.displaySymbol : undefined,
            alwaysSingular: true,
            decimals: 2
          },
        ],
      },
      {
        label: "24-hour Mining",
        cells: [
          {
            label: "Blocks Mined",
            data:
              yesterday != null
                ? yesterday.blocks.amount.toString()
                : undefined,
          },
          {
            label: "New Coins Released",
            data:
              yesterday != null
                ? yesterday.coins.released
                : undefined,
            unit: coinInfo ? coinInfo.displaySymbol : undefined,
            alwaysSingular: true
          },
        ],
      },
      {
        label: "Decentralization",
        cells: [
          {
            label: "Controlling 50%",
            data: decentralization50,
            unit: "pool",
          },
          {
            label: "Controlling 90%",
            data: decentralization90,
            unit: "pool",
          },
        ],
      },
      {
        label: "Average Blocktime",
        cells: [
          {
            label: "Over 5,000 Blocks",
            data: average5000,
            unit: "second",
            decimals: 2
          },
          {
            label: "Over 50,000 Blocks",
            data: average50000,
            unit: "second",
            decimals: 2
          },
        ],
      },
      // {
      //   label: "Coin Value",
      //   cells: [
      //     {
      //       label: "Fiat",
      //       data: "0.279",
      //       unit: "cent"
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
                ? allTime.transactions.amount
                : undefined,
          },
          {
            label: "Coins Released",
            data:
              allTime != null
                ? allTime.coins.released
                : undefined,
            unit: coinInfo ? coinInfo.displaySymbol : undefined,
            alwaysSingular: true,
            maxDecimals: 3
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
    decentralization50,
    decentralization90,
    coinInfo
  ]);

  return (
    <div className={classes.network}>
      {table.map((entry) => (
        <Row key={entry.label} {...entry} />
      ))}
    </div>
  );
};
