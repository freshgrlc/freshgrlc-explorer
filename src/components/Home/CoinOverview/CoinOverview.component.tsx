import React, { useEffect, useState, useMemo } from "react";
import { Subject } from "rxjs";

import { Header } from "./Header/Header.component";
import { NetworkInfo } from "./NetworkInfo/NetworkInfo.component";

import { ICoinInfo } from "interfaces/ICoinInfo.interface";
import { IBlock } from "interfaces/IBlock.interface";
import { IUnconfirmedTransaction } from "interfaces/ITransaction.interface";
import { IEventMessage } from "interfaces/IEventMessage.interface";

import classes from "./CoinOverview.module.scss";
import { useGetData } from "hooks/useGetData.hook";

interface IProps {
  coinInfo: ICoinInfo;
}

export const CoinOverview: React.FC<IProps> = ({ coinInfo }) => {
  const baseUrl = useMemo(
    () =>
      `https://api.freshgrlc.net/blockchain/${coinInfo.symbol.toLowerCase()}`,
    [coinInfo]
  );
  const first50Blocks = useGetData<IBlock[]>(
    `${baseUrl}/blocks/?start=-50&limit=50&expand=miner,transactions`
  );
  const firstUnconfirmedTransactions = useGetData<IUnconfirmedTransaction[]>(
    `${baseUrl}/transactions/?confirmed=false`
  );
  const [blocks, setBlocks] = useState<IBlock[]>([]);
  const [unconfirmedTransactions, setUnconfirmedTransactions] = useState<
    IUnconfirmedTransaction[]
  >([]);

  useEffect(() => {
    if (first50Blocks && firstUnconfirmedTransactions) {
      setBlocks(first50Blocks);
      setUnconfirmedTransactions(firstUnconfirmedTransactions);
      const blocksSubject = new Subject<IBlock>();
      const unconfirmedTransactionsSubject = new Subject<
        IUnconfirmedTransaction[]
      >();
      const bSub = blocksSubject.subscribe({
        next: (block) => {
          setBlocks((blocks) => {
            const slice = blocks.slice();
            slice.pop();
            slice.unshift(block);
            return slice;
          });
        },
      });
      const uSub = unconfirmedTransactionsSubject.subscribe({
        next: (mempool) => {
          setUnconfirmedTransactions(mempool);
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
  }, [baseUrl, first50Blocks, firstUnconfirmedTransactions]);

  return (
    <div className={classes.overview}>
      <Header name={coinInfo.name} displayName={coinInfo.displayName} />
      <NetworkInfo
        latestBlock={blocks[0]}
        coinInfo={coinInfo}
        baseUrl={baseUrl}
      />
      <ol>
        {unconfirmedTransactions.map((unconfirmedTransaction) => (
          <li key={unconfirmedTransaction.txid}>
            {unconfirmedTransaction.txid}
          </li>
        ))}
      </ol>
      <ol>
        {blocks.map((block) => (
          <li key={block.hash}>{block.height}</li>
        ))}
      </ol>
    </div>
  );
};
