import React from 'react';

import { CoinOverview } from './CoinOverview/CoinOverview.component';
import { Banner } from 'components/Banner/Banner.component';

import { CoinTickerSymbol } from 'interfaces/ICoinInfo.interface';

import { getAllCoins, getCoinInfo } from 'utils/getCoinInfo.util';

import classes from './Home.module.scss';

interface IProps {
    routeParams: {
        coin1: CoinTickerSymbol;
        coin2?: CoinTickerSymbol;
    };
}

export const Home: React.FC<IProps> = ({ routeParams }) => {
    const coins = getAllCoins();
    var selectedCoins = [ coins[0] ];

    if (routeParams !== undefined) {
        if (routeParams.coin2 !== undefined) {
            selectedCoins = [
                routeParams.coin1,
                routeParams.coin2
            ].map(ticker => getCoinInfo(ticker as CoinTickerSymbol));
        } else {
            selectedCoins = [ getCoinInfo(routeParams.coin1 as CoinTickerSymbol) ];
        }
    }

    return (
        <div className={classes.home}>
            <Banner coins={coins} preferredCoin={selectedCoins.length === 1 ? selectedCoins[0].ticker : undefined} />
            <div className={classes.overview + (selectedCoins.length > 1 ? ' ' + classes.overviews : '')}>
                { selectedCoins.map((coin, index) => ( <CoinOverview key={index} coinInfo={coin} /> )) }
            </div>
        </div>
    );
};
