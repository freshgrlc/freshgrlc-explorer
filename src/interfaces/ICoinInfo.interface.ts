export type CoinTickerSymbol = 'grlc' | 'tux' | 'tgrlc';

export interface ICoinInfo {
    ticker: CoinTickerSymbol;
    name: string;
    displayName: string;
    displaySymbol: string;
    blockTime: number;
    blockReward: number;
    logo: string;
}
