import React from 'react';

import { ICoinInfo, CoinTickerSymbol } from 'interfaces/ICoinInfo.interface';

import classes from './CoinSelector.module.scss';

interface ICombinedCoins {
    name: string;
    coins: CoinTickerSymbol[];
};

export type SingleOrCombinedCoin = ICoinInfo | ICombinedCoins;

interface IProps {
    coins: SingleOrCombinedCoin[];
}

const makeCoinsUrl = (coin: ICoinInfo | ICombinedCoins): string => {
    const combinedCoins = coin as ICombinedCoins;
    if (combinedCoins !== undefined && combinedCoins.coins !== undefined) {
        const combinedCoins = coin as ICombinedCoins;
        return combinedCoins.coins.join('+');
    }
    return (coin as ICoinInfo).ticker;
};

export const CoinSelector: React.FC<IProps> = function({ coins }) {
    return (
        <div className={classes.coinSelector}>
            Show information for:
            {
                coins.map((coin, index) => (
                    <React.Fragment key={index}>
                        {index ? (<span className={classes.separator}>{'\u25CF'}</span>) : ''}
                        <a className={classes.selectableCoin} href={`/${makeCoinsUrl(coin)}/home/`}>{coin.name}</a>
                    </React.Fragment>
                ))
            }
        </div>
    );
};
