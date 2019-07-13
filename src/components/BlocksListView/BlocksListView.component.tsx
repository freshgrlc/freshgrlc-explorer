import React from 'react';
import useFetch from 'react-fetch-hook';

import { CoinTickerSymbol } from 'interfaces/ICoinInfo.interface';

import { getBaseUrl } from 'utils/getBaseUrl.util';
import { getCoinInfo, getAllCoins } from 'utils/getCoinInfo.util';
import { Redirect } from 'react-router';

import { CoinInfoContext } from 'context/CoinInfo.context';

import { IBlock } from 'interfaces/IBlock.interface';

import { Banner } from 'components/Banner/Banner.component';
import { Section } from 'components/Section/Section.component';
import { PageLoadAnimation } from 'components/PageLoadAnimation/PageLoadAnimation.component';
import { BlockSummary } from './BlockSummary/BlockSummary.component';
import { BlockListNavigation } from './BlockListNavigation/BlockListNavigation.component';

import classes from './BlocksListView.module.scss';

interface IProps {
    routeParams: {
        coin: CoinTickerSymbol;
        hash: string;
        location: any;
    };
    queryParams: {
        start?: string | number;
        count?: string | number;
        direction?: 'asc' | 'desc';
    };
}

export const BlocksListView: React.FC<IProps> = ({ routeParams, queryParams }) => {
    const baseUrl = getBaseUrl(routeParams.coin);
    const coinInfo = getCoinInfo(routeParams.coin);

    if (!queryParams || !queryParams.start) {
        queryParams = {};
        queryParams.start = 1;
        queryParams.direction = 'asc';
    } else if (!queryParams.direction) {
        queryParams.direction = 'desc';
    }
    if (!queryParams.count) {
        queryParams.count = 40;
    }

    queryParams.start = parseInt(queryParams.start as string);
    queryParams.count = parseInt(queryParams.count as string);

    const reverseDirection = queryParams.direction === 'desc';

    var apiStart = !reverseDirection ? queryParams.start : queryParams.start - queryParams.count + 1;
    if (apiStart < 1) {
        apiStart = 1;
    }

    const { data: blocks, error } = useFetch<IBlock[]>(
        `${baseUrl}/blocks/?start=${apiStart}&limit=${queryParams.count}&expand=transactions,miner`
    );

    if (error != null) {
        console.log(error);
        return <Redirect to="/error404" push={false} />;
    }


    if (blocks != null && blocks.length > 0) {
        const lowestBlock = blocks[0].height;
        const highestBlock = blocks[blocks.length-1].height;
        const firstBlock = !reverseDirection ? lowestBlock : highestBlock;
        const lastBlock = reverseDirection ? lowestBlock : highestBlock;

        return (
            <CoinInfoContext.Provider value={coinInfo}>
                <Banner coins={getAllCoins()} preferredCoin={coinInfo ? coinInfo.ticker : undefined} />
                <Section header="Browse blockchain">
                    <p>Showing blocks {firstBlock} to {lastBlock}</p>
                    <BlockListNavigation
                        blocksPerPage={queryParams.count}
                        reverseDirection={reverseDirection}
                        currentLowest={lowestBlock}
                        currentHighest={highestBlock}
                    />
                    <div className={classes.wrapper}>
                        <div className={classes.blockList}>
                            {(queryParams.direction === 'asc' ? blocks : blocks.reverse()).map((block: IBlock, index: number) => (
                                <BlockSummary key={index} block={block} first={index === 0} highlighted={index % 2 === 1}/>
                            ))}
                        </div>
                    </div>
                    <BlockListNavigation
                        blocksPerPage={queryParams.count}
                        reverseDirection={reverseDirection}
                        currentLowest={lowestBlock}
                        currentHighest={highestBlock}
                    />
                </Section>
            </CoinInfoContext.Provider>
        );
    } else {
        return <PageLoadAnimation />;
    }
};
