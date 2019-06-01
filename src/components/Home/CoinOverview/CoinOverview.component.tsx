import React, { useEffect, useState, useMemo } from "react";
import { Subject } from "rxjs";

import { Header } from "./Header/Header.component";
import { NetworkInfo } from "./NetworkInfo/NetworkInfo.component";
import { Blocks } from "./Blocks/Blocks.component";

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

  const blockCount = useMemo(() => 10, []);

  const firstBlocks = useGetData<IBlock[]>(
    `${baseUrl}/blocks/?start=-${blockCount}&limit=${blockCount}&expand=miner,transactions`
  );
  const firstUnconfirmedTransactions = useGetData<IUnconfirmedTransaction[]>(
    `${baseUrl}/transactions/?confirmed=false`
  );
  const [blocks, setBlocks] = useState<IBlock[]>([]);
  const [unconfirmedTransactions, setUnconfirmedTransactions] = useState<
    IUnconfirmedTransaction[]
  >([]);

  useEffect(() => {
    if (firstBlocks && firstUnconfirmedTransactions) {
      setBlocks(firstBlocks.slice().reverse());
      setUnconfirmedTransactions(firstUnconfirmedTransactions);
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
  }, [baseUrl, firstBlocks, firstUnconfirmedTransactions]);

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
      <Blocks blocks={blocks} />
    </div>
  );
};
