import React, { useMemo, useEffect, useState, useCallback, useContext } from 'react';
import useFetch from 'react-fetch-hook';

import { Row } from 'components/Row/Row.component';

import { CoinInfoContext } from 'context/CoinInfo.context';

import { IBlock, IBlockSimple } from 'interfaces/IBlock.interface';
import { INetworkStats } from 'interfaces/INetworkStats.interface';
import { IPoolStat } from 'interfaces/IPoolStat.interface';
import { IRichListEntry } from 'interfaces/IRichListEntry.interface';

import { formatTime } from 'utils/formatTime.util';
import { getNumberPoolsNeeded } from 'utils/getNumberPoolsNeeded.util';

import classes from './NetworkInfo.module.scss';
import { IRow } from 'interfaces/IRow.interface';

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
        difficulty?: number;
    } => {
        if (latestBlock != null && coinInfo) {
            return {
                height: latestBlock.height.toString(),
                url: `/${coinInfo.ticker}/blocks/${latestBlock.hash}`,
                timestamp: formatTime(latestBlock.firstseen),
                difficulty: latestBlock.difficulty,
            };
        } else {
            return {};
        }
    }, [latestBlock, coinInfo]);

    const { data: yesterday } = useFetch<INetworkStats>(`${baseUrl}/networkstats/?since=${yesterdayDate}`);

    const { data: totalTransactions } = useFetch<number>(`${baseUrl}/networkstats/transactions/amount/?since=0`);

    const { data: totalCoins } = useFetch<number>(`${baseUrl}/coins/total/released/`);

    const { data: poolData } = useFetch<IPoolStat[]>(`${baseUrl}/poolstats/?since=${yesterdayDate}`);

    const { data: richList } = useFetch<IRichListEntry[]>(`${baseUrl}/richlist/?limit=1000`);

    const blocks = useMemo(() => {
        if (poolData) {
            return poolData.map((pool) => pool.amountmined).reduce((total, next) => total + next);
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
    const [average50000, setAverage50000] = useState<Number | undefined>(undefined);

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

    const [addressesOwning50Percent, setAddressesOwning50Percent] = useState<number | string | undefined>(undefined);
    const [addressesOwning90Percent, setAddressesOwning90Percent] = useState<number | string | undefined>(undefined);

    useEffect(() => {
        if (!richList || !totalCoins) {
            setAddressesOwning50Percent(undefined);
            setAddressesOwning90Percent(undefined);
            return;
        }

        var currentTotal = 0.0;
        var found50 = false;
        var found90 = false;
        const totalFor50Percent = totalCoins / 2;
        const totalFor90Percent = totalCoins / 10 * 9;

        richList.forEach((entry, index) => {
            currentTotal += entry.balance;
            if (!found50 && currentTotal >= totalFor50Percent) {
                setAddressesOwning50Percent(index + 1);
                found50 = true;
            }
            if (!found90 && currentTotal >= totalFor90Percent) {
                setAddressesOwning90Percent(index + 1);
                found90 = true;
            }
        });
        if (!found90) {
            setAddressesOwning90Percent('> ' + richList.length);
            if (!found50) {
                setAddressesOwning50Percent('> ' + richList.length);
            }
        }
    }, [richList, totalCoins]);

    const table = useMemo(() => {
        let data: IRow[] = [
            {
                label: 'Latest Block',
                labelSubText: 'Explore blockchain ➔',
                labelSubTextLink: `/${coinInfo.ticker}/blocks/?start=${formattedBlock.height}&direction=desc`,
                cells: [
                    {
                        label: 'Height',
                        data: formattedBlock.height,
                        link: formattedBlock.url,
                        cellStyle: {
                            linkColor: 'accentuate',
                            sunken: true
                        }
                    },
                    {
                        label: 'Recieved at',
                        data: formattedBlock.timestamp,
                        cellStyle: {
                            sunken: true
                        }
                    },
                ],
            },
            {
                label: 'Mining difficulty',
                labelSubText: 'Difficulty graphs ➔',
                labelSubTextLink: `/${coinInfo.ticker}/difficultygraphs`,
                cells: [
                    {
                        label: 'Latest Block Difficulty',
                        data: formattedBlock.difficulty,
                        decimals: 3,
                        cellStyle: {
                            sunken: true
                        }
                    },
                    {
                        label: 'Est. Network Hashrate',
                        data: formattedBlock.difficulty !== undefined ? formattedBlock.difficulty * 2 ** 32 / (coinInfo.blockTime + 1) / 1000000000 : undefined,
                        unit: 'GH/s',
                        alwaysSingular: true,
                        decimals: 3,
                        cellStyle: {
                            sunken: true
                        }
                    },
                ],
            },
            {
                label: '24-hour Activity',
                labelSubText: 'Destroyed coin-days graph ➔',
                labelSubTextLink: `/${coinInfo.ticker}/coindaysdestroyedgraphs`,
                cells: [
                    {
                        label: 'Transactions',
                        data: yesterday != null ? yesterday.transactions.amount : undefined,
                        thousandsSpacing: true,
                        cellStyle: {
                            sunken: true
                        }
                    },
                    {
                        label: 'Destroyed coin-days ',
                        data:
                            yesterday != null && yesterday.transactions.coindaysdestroyed
                                ? yesterday.transactions.coindaysdestroyed
                                : undefined,
                        unit: undefined,
                        alwaysSingular: true,
                        decimals: 0,
                        thousandsSpacing: true,
                        cellStyle: {
                            sunken: true
                        }
                    },
                ],
            },
            {
                label: '24-hour Mining',
                cells: [
                    {
                        label: 'Blocks Mined',
                        data: yesterday != null ? yesterday.blocks.amount : undefined,
                        thousandsSpacing: true,
                        cellStyle: {
                            sunken: true
                        }
                    },
                    {
                        label: 'New Coins Released',
                        data: yesterday != null ? yesterday.coins.released : undefined,
                        unit: coinInfo ? coinInfo.displaySymbol : undefined,
                        thousandsSpacing: true,
                        alwaysSingular: true,
                        cellStyle: {
                            sunken: true
                        }
                    },
                ],
            },
            {
                label: 'Decentralization',
                labelSubText: 'Pool distribution graph ➔',
                labelSubTextLink: `/${coinInfo.ticker}/pooldistribution`,
                cells: [
                    {
                        label: 'Controlling 50%',
                        data: decentralization50,
                        unit: 'pool',
                        cellStyle: {
                            sunken: true
                        }
                    },
                    {
                        label: 'Controlling 90%',
                        data: decentralization90,
                        unit: 'pool',
                        cellStyle: {
                            sunken: true
                        }
                    },
                ],
            },
            {
                label: 'Wealth distribution',
                labelSubText: 'Show richlist ➔',
                labelSubTextLink: `/${coinInfo.ticker}/richlist`,
                cells: [
                    {
                        label: 'Owning 50%',
                        data: addressesOwning50Percent,
                        unit: 'addresses',
                        alwaysSingular: true,
                        cellStyle: {
                            sunken: true
                        }
                    },
                    {
                        label: 'Owning 90%',
                        data: addressesOwning90Percent,
                        unit: 'addresses',
                        alwaysSingular: true,
                        cellStyle: {
                            sunken: true
                        }
                    },
                ],
            },
            {
                label: 'Average Blocktime',
                cells: [
                    {
                        label: 'Over 5,000 Blocks',
                        data: average5000,
                        unit: 'second',
                        decimals: 2,
                        cellStyle: {
                            sunken: true
                        }
                    },
                    {
                        label: 'Over 50,000 Blocks',
                        data: average50000,
                        unit: 'second',
                        decimals: 2,
                        cellStyle: {
                            sunken: true
                        }
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
            //       cellStyle: {
            //           sunken: true
            //       }
            //     },
            //     {
            //       label: "Bitcoin",
            //       data: "32.120",
            //       unit: "satoshi"
            //       cellStyle: {
            //           sunken: true
            //       }
            //     }
            //   ]
            // },
            {
                label: 'Network Totals',
                cells: [
                    {
                        label: 'All-time Transactions',
                        data: totalTransactions != null ? totalTransactions : undefined,
                        thousandsSpacing: true,
                        cellStyle: {
                            sunken: true
                        }
                    },
                    {
                        label: 'Coins Released',
                        data: totalCoins != null ? totalCoins : undefined,
                        unit: coinInfo ? coinInfo.displaySymbol : undefined,
                        alwaysSingular: true,
                        decimals: 3,
                        thousandsSpacing: true,
                        cellStyle: {
                            sunken: true
                        }
                    },
                ],
            }
        ];
        return data;
    }, [
        formattedBlock,
        yesterday,
        totalCoins,
        totalTransactions,
        average5000,
        average50000,
        decentralization50,
        decentralization90,
        coinInfo,
        addressesOwning50Percent,
        addressesOwning90Percent
    ]);

    return (
        <div className={classes.network}>
            {table.map((entry, index) => (
                <Row key={index} extrawide={true} {...entry} />
            ))}
        </div>
    );
};
