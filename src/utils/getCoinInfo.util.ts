import { CoinTickerSymbol, ICoinInfo } from 'interfaces/ICoinInfo.interface';

const Coins: ICoinInfo[] = [
    {
        ticker: 'grlc',
        name: 'garlicoin',
        displayName: 'Garlicoin',
        displaySymbol: 'GRLC',
        blockTime: 40,
        blockReward: 25,
        blockRewardHalvingInterval: 690000,
        logo: 'garlicoin.svg',
    },
    {
        ticker: 'tux',
        name: 'tuxcoin',
        displayName: 'Tuxcoin',
        displaySymbol: 'TUX',
        blockTime: 60,
        blockReward: 33.5,
        blockRewardHalvingInterval: 420690,
        logo: 'tuxcoin.svg',
    },
    {
        ticker: 'tgrlc',
        name: 'garlicoin-testnet',
        displayName: 'Garlicoin testnet',
        displaySymbol: 'tGRLC',
        blockTime: 40,
        blockReward: 50,
        blockRewardHalvingInterval: 690000,
        logo: 'garlicoin.svg',
    },
];

export const getCoinInfo = (ticker: CoinTickerSymbol): ICoinInfo => {
    return Coins.filter((coin) => coin.ticker === ticker)[0];
};

export const getAllCoins = () => Coins;
