import React from 'react';

import { CoinOverview } from './CoinOverview/CoinOverview.component';

import { getAllCoins } from 'utils/getCoinInfo.util';

import classes from './Home.module.scss';

export const Home: React.FC = () => {
    const coins = getAllCoins();
    return (
        <div className={classes.overviews}>
            <CoinOverview coinInfo={coins[0]} />
            <CoinOverview coinInfo={coins[1]} />
        </div>
    );
};
