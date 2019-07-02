import React from 'react';

import { ICoinInfo, CoinTickerSymbol } from 'interfaces/ICoinInfo.interface';

import { FreshGRLCBanner } from './FreshGRLCBanner/FreshGRLCBanner.component';
import { CoinSelector, SingleOrCombinedCoin } from './CoinSelector/CoinSelector.component';
import { SearchBar } from './SearchBar/SearchBar.component';

import { getCoinInfo } from 'utils/getCoinInfo.util';


interface IProps {
    coins: ICoinInfo[];
    preferredCoin?: CoinTickerSymbol;
}

export const Banner: React.FC<IProps> = function({ coins, preferredCoin }) {
    const selectableCoins: SingleOrCombinedCoin[] = [
        getCoinInfo('grlc'),
        getCoinInfo('tux'),
        { name: '(both)', coins: ['grlc', 'tux'] },
        getCoinInfo('tgrlc')
    ];
    return (
        <FreshGRLCBanner subdomain="explorer" subtitle="Multi-Blockchain Explorer" subtext={(
            <>
                <CoinSelector coins={selectableCoins} />
                <SearchBar coins={coins} preferredCoin={preferredCoin} />
            </>
        )}/>
    );
};
