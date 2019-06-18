import { CoinTickerSymbol } from 'interfaces/ICoinInfo.interface';

export const getBaseUrl = (ticker: CoinTickerSymbol) => `https://api.freshgrlc.net/blockchain/${ticker}`;
