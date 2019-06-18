import { createContext } from 'react';

import { ICoinInfo } from 'interfaces/ICoinInfo.interface';

export const CoinInfoContext = createContext<ICoinInfo>(null!);
