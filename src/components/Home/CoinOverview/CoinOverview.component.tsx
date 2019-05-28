import React, { useEffect, useState } from "react";
import { Observable } from "rxjs";

import { ICoinInfo } from "interfaces/ICoinInfo.interface";

// import classes from "./Coin.module.scss"

interface IProps {
  coinInfo: ICoinInfo;
}

export const CoinOverview: React.FC<IProps> = ({ coinInfo }) => {
  const [blocks, setBlocks] = useState<any[]>([]);

  useEffect(() => {
    const baseUrl = `https://explorer.freshgrlc.net/api/${coinInfo.symbol.toLowerCase()}`;
    const obs = new Observable<any>(subscriber => {
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
      return () => es.close();
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
  }, [coinInfo]);
  return (
    <ol>
      {blocks.map(block => (
        <li key={block.hash}>{block.height}</li>
      ))}
    </ol>
  );
};
