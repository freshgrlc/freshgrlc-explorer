import React, { useMemo, useContext } from "react";

import { Cell } from "components/Cell/Cell.component";

import {
  IBlockTransaction,
  IUnconfirmedTransaction,
} from "interfaces/ITransaction.interface";

import classes from "./Transaction.module.scss";

import { CoinInfoContext } from "context/CoinInfo.context"

interface IProps {
  transaction: IBlockTransaction | IUnconfirmedTransaction;
  showHeader: boolean;
  highlightRows?: boolean;
}

export const Transaction: React.FC<IProps> = React.memo(
  ({ transaction, showHeader, highlightRows }) => {
    const coinInfo = useContext(CoinInfoContext);

    const shortenedId = useMemo(
      () =>
        `${transaction.txid.substring(0, 12)}\u2025${transaction.txid.substring(
          transaction.txid.length - 12,
          transaction.txid.length
        )}`,
      [transaction]
    );
    const [byteCount, byteUnit] = useMemo(
      () => [transaction.size, 'bytes'],
      [transaction]
    );

    return (
      <div className={classes.transaction + (highlightRows ? ' ' + classes.transactionHighlightedRow : '')}>
        {(
          <>
            <Cell label={showHeader ? 'Transaction ID' : undefined} data={shortenedId} link={coinInfo ? `/${coinInfo.symbol.toLowerCase()}/transactions/${transaction.txid}` : undefined} cellStyle={{fontSize: 'small'}}/>
            <Cell label={showHeader ? 'Size' : undefined} data={byteCount} unit={byteUnit} alwaysSingular={true} cellStyle={{align: 'right', size: '100px'}} />
            <Cell label={showHeader ? 'Value' : undefined} data={transaction.totalvalue} unit={coinInfo ? coinInfo.symbol : ''} alwaysSingular={true} decimals={8} cellStyle={{align: 'right', size: '155px'}} />
          </>
        )}
      </div>
    );
  },
  (prev, next) =>
    prev.transaction.txid === next.transaction.txid &&
    prev.showHeader === next.showHeader
);
