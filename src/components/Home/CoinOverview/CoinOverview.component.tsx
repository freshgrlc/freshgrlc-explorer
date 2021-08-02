import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useFetch from 'react-fetch-hook';

import { Section } from 'components/Section/Section.component';

import { Header } from './Header/Header.component';
import { NetworkInfo } from './NetworkInfo/NetworkInfo.component';
import { Mempool } from './Mempool/Mempool.component';
import { Blocks } from './Blocks/Blocks.component';

import { CoinInfoContext } from 'context/CoinInfo.context';
import { CoinEventsContext } from 'context/CoinEvents.context';

import { IBlock } from 'interfaces/IBlock.interface';
import { IUnconfirmedTransaction } from 'interfaces/ITransaction.interface';

import { getBaseUrl } from 'utils/getBaseUrl.util';

import classes from './CoinOverview.module.scss';


export const CoinOverview: React.FC = () => {
    const coinInfo = useContext(CoinInfoContext);
    const events = useContext(CoinEventsContext);
    const baseUrl = getBaseUrl(coinInfo.ticker);

    const blockCount = 10;

    const { data: firstBlocks } = useFetch<IBlock[]>(
        `${baseUrl}/blocks/?start=-${blockCount}&limit=${blockCount}&expand=miner,transactions`
    );
    const { data: firstUnconfirmedTransactions } = useFetch<IUnconfirmedTransaction[]>(
        `${baseUrl}/transactions/?confirmed=false`
    );
    const [blocks, setBlocks] = useState<IBlock[]>([]);
    const [unconfirmedTransactions, setUnconfirmedTransactions] = useState<IUnconfirmedTransaction[]>([]);

    const calculateAndInjectPendingTime = (transactions: IUnconfirmedTransaction[]): IUnconfirmedTransaction[] => {
        return (transactions as any[]).map((transaction: IUnconfirmedTransaction) => {
            if (transaction.firstseen !== null) {
                transaction.pending = Date.now() / 1000 - transaction.firstseen;
            }
            return transaction;
        });
    };

    useEffect(() => {
        if (firstBlocks != null && firstUnconfirmedTransactions != null) {
            setBlocks(firstBlocks.slice().reverse());
            setUnconfirmedTransactions(calculateAndInjectPendingTime(firstUnconfirmedTransactions));
            const bSub = events.blockEvents.subscribe((block) => {
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
            });
            const uSub = events.mempoolEvents.subscribe((mempool) =>
                setUnconfirmedTransactions(calculateAndInjectPendingTime(mempool))
            );

            return () => {
                bSub.unsubscribe();
                uSub.unsubscribe();
            };
        }
    }, [baseUrl, firstBlocks, firstUnconfirmedTransactions, events]);

    return (
        <div className={classes.overview}>
            <Section>
                <Header />
                <NetworkInfo latestBlock={blocks[0]} baseUrl={baseUrl} />
            </Section>
            <Mempool transactions={unconfirmedTransactions} />
            <Section header="Blockchain">
                <div className={classes.explore}>
                    {blocks && blocks[0] ? (
                        <Link to={`/${coinInfo.ticker}/blocks/?start=${blocks[0].height}&direction=desc`}>Explore ➔</Link>
                    ) : 'Explore ➔'}
                </div>
                <Blocks blocks={blocks} />
            </Section>
        </div>
    );
};
