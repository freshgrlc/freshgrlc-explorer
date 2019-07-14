import React from 'react';
import useFetch from 'react-fetch-hook';

import { CoinTickerSymbol } from 'interfaces/ICoinInfo.interface';

import { getBaseUrl } from 'utils/getBaseUrl.util';
import { getCoinInfo, getAllCoins } from 'utils/getCoinInfo.util';
import { Redirect } from 'react-router';

import { CoinInfoContext } from 'context/CoinInfo.context';

import { IRichListEntry } from 'interfaces/IRichListEntry.interface';
import { ICoinsInfo } from 'interfaces/ICoinsInfo.interface';

import { Banner } from 'components/Banner/Banner.component';
import { Section } from 'components/Section/Section.component';
import { PagedListNavigation } from 'components/PagedListNavigation/PagedListNavigation.component';
import { PageLoadAnimation } from 'components/PageLoadAnimation/PageLoadAnimation.component';

import { RichListEntry } from './RichListEntry/RichListEntry.component';

import classes from './RichListView.module.scss';

interface IProps {
    routeParams: {
        coin: CoinTickerSymbol;
    };
    queryParams: {
        offset?: string | number;
    };
}

export const RichListView: React.FC<IProps> = ({ routeParams, queryParams }) => {
    const baseUrl = getBaseUrl(routeParams.coin);
    const coinInfo = getCoinInfo(routeParams.coin);
    const entriesPerPage = 40;

    if (!queryParams || !queryParams.offset) {
        queryParams = {};
        queryParams.offset = 0;
    } else {
        queryParams.offset = parseInt(queryParams.offset as string);
    }

    const { data: entries, isLoading, error } = useFetch<IRichListEntry[]>(
        `${baseUrl}/richlist/?start=${queryParams.offset}&limit=${entriesPerPage}`
    );
    const { data: coinsInfo } = useFetch<ICoinsInfo>(`${baseUrl}/coins/`);

    if (error != null) {
        console.log(error);
        return <Redirect to="/error404" push={false} />;
    }

    return (
        <CoinInfoContext.Provider value={coinInfo}>
            <Banner coins={getAllCoins()} preferredCoin={coinInfo ? coinInfo.ticker : undefined} />
            <Section header="Browse Richlist">
                {!isLoading && entries != null ? (
                    <>
                        <PagedListNavigation
                            baseUrl={`/${coinInfo.ticker}/richList`}
                            currentOffset={queryParams.offset}
                            entriesPerPage={entriesPerPage}
                            reachedEndOfList={entries.length < entriesPerPage}
                            labelForward="Next ⇾"
                            labelBackward="⇽ Back"
                        />
                        <div className={classes.wrapper}>
                            <div className={classes.richlist}>
                                {entries.map((entry, index) => (
                                    <RichListEntry key={index} position={queryParams.offset as number + index + 1} entry={entry} totalcoins={coinsInfo ? coinsInfo.total.released : undefined} first={index === 0} highlighted={index % 2 === 1} />
                                ))}
                            </div>
                        </div>
                        <PagedListNavigation
                            baseUrl={`/${coinInfo.ticker}/richList`}
                            currentOffset={queryParams.offset}
                            entriesPerPage={entriesPerPage}
                            reachedEndOfList={entries.length < entriesPerPage}
                            labelForward="Next ⇾"
                            labelBackward="⇽ Back"
                        />
                    </>
                ) : (
                    <>
                        <p>Loading blocks {queryParams.offset + 1} to {queryParams.offset + entriesPerPage}</p>
                        <PageLoadAnimation />
                    </>
                )}
            </Section>
        </CoinInfoContext.Provider>
    );
};
