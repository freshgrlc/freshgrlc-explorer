import React, { useMemo, useContext } from "react";

import { Cell } from "components/Cell/Cell.component";

import { formatTimeDiff } from "utils/formatTime.util";

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
  showPendingColumn?: boolean;
}

export const Transaction: React.FC<IProps> = React.memo(
  ({ transaction, showHeader, highlightRows, showPendingColumn }) => {
    const coinInfo = useContext(CoinInfoContext);

    const shortenedId = useMemo(
      () =>
        `${transaction.txid.substring(0, 8)}\u2025${transaction.txid.substring(
          transaction.txid.length - 8,
          transaction.txid.length
        )}`,
      [transaction]
    );
    const [byteCount, byteUnit] = useMemo(
      () => [transaction.size, 'bytes'],
      [transaction]
    );

    const timeSince: [ number|string, string|undefined ] = formatTimeDiff(0, transaction.pending);

    return (
      <div className={classes.transaction + (highlightRows ? ' ' + classes.transactionHighlightedRow : '')}>
        {(
          <>
            <Cell label={showHeader ? 'Transaction ID' : undefined} data={shortenedId} link={coinInfo ? `/${coinInfo.symbol.toLowerCase()}/transactions/${transaction.txid}` : undefined} cellStyle={{fontSize: 'small'}}/>
            <Cell label={showHeader ? 'Size' : undefined} data={byteCount} unit={byteUnit} alwaysSingular={true} cellStyle={{align: 'right', size: '100px'}} />
            <Cell label={showHeader ? 'Value' : undefined} data={transaction.totalvalue} unit={coinInfo ? coinInfo.symbol : ''} alwaysSingular={true} decimals={8} cellStyle={{align: 'right', size: '155px'}} />
            { showPendingColumn ? (<Cell label={showHeader ? 'Pending' : undefined} data={timeSince[0]} unit={timeSince[1]} alwaysSingular={typeof(timeSince[0]) === 'string'} />) : undefined }
          </>
        )}
      </div>
    );
  },
  (prev, next) =>
    prev.transaction.txid === next.transaction.txid &&
    prev.transaction.pending === next.transaction.pending &&
    prev.showHeader === next.showHeader
);
