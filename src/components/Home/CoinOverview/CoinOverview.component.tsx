import React, { useEffect, useState, useMemo } from "react";
import { Observable } from "rxjs";

import { Header } from "./Header/Header.component";
import { NetworkInfo } from "./NetworkInfo/NetworkInfo.component";

import { ICoinInfo } from "interfaces/ICoinInfo.interface";
import { IBlock } from "interfaces/IBlock.interface";

import classes from "./CoinOverview.module.scss";

interface IProps {
  coinInfo: ICoinInfo;
}

export const CoinOverview: React.FC<IProps> = ({ coinInfo }) => {
  const baseUrl = useMemo(
    () => `https://explorer.freshgrlc.net/api/${coinInfo.symbol.toLowerCase()}`,
    [coinInfo]
  );
  const [blocks, setBlocks] = useState<IBlock[]>([]);

  useEffect(() => {
    const obs = new Observable<IBlock>(subscriber => {
      const es = new EventSource(
        `${baseUrl}/events/subscribe?channels=blocks,keepalive`
      );
      (async () => {
        ((await (await fetch(
          `${baseUrl}/blocks/?start=-50&limit=50&expand=miner,transactions`
        )).json()) as any[]).forEach(block => subscriber.next(block));
        es.onmessage = message => {
          const data = message.data;
          if (data.event === "newblock") {
            subscriber.next(data.data);
          }
        };
        es.onerror = error => subscriber.error(error);
      })();
      return function unsubscribe() {
        es.close();
      };
    });
    const sub = obs.subscribe({
      next: data => {
        setBlocks(blocks => {
          const slice = blocks.slice();

          if (slice.length === 50) {
            slice.pop();
          }

          slice.unshift(data);

          return slice;
        });
      },
      error: error => console.error(error)
    });
    return () => {
      sub.unsubscribe();
    };
  }, [baseUrl]);

  return (
    <div className={classes.overview}>
      <Header name={coinInfo.name} displayName={coinInfo.displayName} />
      <NetworkInfo latestBlock={blocks[0]} coinInfo={coinInfo} baseUrl={baseUrl} />
      <ol>
        {blocks.map(block => (
          <li key={block.hash}>{block.height}</li>
        ))}
      </ol>
    </div>
  );
};
