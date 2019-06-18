import React, { useEffect, useState } from "react";
import { Subject } from "rxjs";
import useFetch from "react-fetch-hook";

import { Section } from "components/Section/Section.component";

import { Header } from "./Header/Header.component";
import { NetworkInfo } from "./NetworkInfo/NetworkInfo.component";
import { Mempool } from "./Mempool/Mempool.component";
import { Blocks } from "./Blocks/Blocks.component";

import { CoinInfoContext } from "context/CoinInfo.context";

import { ICoinInfo } from "interfaces/ICoinInfo.interface";
import { IBlock } from "interfaces/IBlock.interface";
import { IUnconfirmedTransaction } from "interfaces/ITransaction.interface";
import { IEventMessage } from "interfaces/IEventMessage.interface";

import { getBaseUrl } from "utils/getBaseUrl.util";

import classes from "./CoinOverview.module.scss";

interface IProps {
  coinInfo: ICoinInfo;
}

export const CoinOverview: React.FC<IProps> = ({ coinInfo }) => {
  const baseUrl = getBaseUrl(coinInfo.ticker);

  const blockCount = 10;

  const { data: firstBlocks } = useFetch<IBlock[]>(
    `${baseUrl}/blocks/?start=-${blockCount}&limit=${blockCount}&expand=miner,transactions`
  );
  const { data: firstUnconfirmedTransactions } = useFetch<
    IUnconfirmedTransaction[]
  >(`${baseUrl}/transactions/?confirmed=false`);
  const [blocks, setBlocks] = useState<IBlock[]>([]);
  const [unconfirmedTransactions, setUnconfirmedTransactions] = useState<
    IUnconfirmedTransaction[]
  >([]);

  const calculateAndInjectPendingTime = (
    transactions: IUnconfirmedTransaction[]
  ): IUnconfirmedTransaction[] => {
    return (transactions as any[]).map(
      (transaction: IUnconfirmedTransaction) => {
        if (transaction.firstseen !== null) {
          transaction.pending = Date.now() / 1000 - transaction.firstseen;
        }
        return transaction;
      }
    );
  };

  useEffect(() => {
    if (firstBlocks != null && firstUnconfirmedTransactions != null) {
      setBlocks(firstBlocks.slice().reverse());
      setUnconfirmedTransactions(
        calculateAndInjectPendingTime(firstUnconfirmedTransactions)
      );
      const blocksSubject = new Subject<IBlock>();
      const unconfirmedTransactionsSubject = new Subject<
        IUnconfirmedTransaction[]
      >();
      const bSub = blocksSubject.subscribe({
        next: (block) => {
          setBlocks((blocks) => {
            if (blocks[0].hash !== block.hash) {
              const slice = blocks.slice();
              slice.pop();
              slice.unshift(block);
              return slice;
            } else {
              return blocks;
            }
          });
        },
      });
      const uSub = unconfirmedTransactionsSubject.subscribe({
        next: (mempool) => {
          setUnconfirmedTransactions(calculateAndInjectPendingTime(mempool));
        },
      });
      const es = new EventSource(
        `${baseUrl}/events/subscribe?channels=mempool,blocks,keepalive`
      );
      es.addEventListener("message", (message) => {
        const { event, data } = JSON.parse(message.data) as IEventMessage;
        if (event === "mempoolupdate") {
          unconfirmedTransactionsSubject.next(
            (data as unknown) as IUnconfirmedTransaction[]
          );
        } else if (event === "newblock") {
          blocksSubject.next((data as unknown) as IBlock);
        }
      });

      return () => {
        bSub.unsubscribe();
        uSub.unsubscribe();
        es.close();
      };
    }
  }, [baseUrl, firstBlocks, firstUnconfirmedTransactions]);

  return (
    <CoinInfoContext.Provider value={coinInfo}>
      <div className={classes.overview}>
        <Section>
          <Header />
          <NetworkInfo latestBlock={blocks[0]} baseUrl={baseUrl} />
        </Section>
        <Mempool transactions={unconfirmedTransactions} />
        <Section header="Blockchain">
          <Blocks blocks={blocks} />
        </Section>
      </div>
    </CoinInfoContext.Provider>
  );
};
