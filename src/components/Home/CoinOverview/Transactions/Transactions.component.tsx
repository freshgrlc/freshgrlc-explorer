import React from "react";

import { Transaction } from "../Transaction/Transaction.component";

import {
  IBlockTransaction,
  IUnconfirmedTransaction,
} from "interfaces/ITransaction.interface";

import classes from "./Transactions.module.scss";

interface IProps {
  transactions: IBlockTransaction[] | IUnconfirmedTransaction[];
  highlightRows?: boolean;
  border?: boolean;
  height: number;
  showPendingColumn?: boolean;
}

export const Transactions: React.FC<IProps> = ({
  transactions,
  highlightRows,
  border,
  height,
  showPendingColumn,
}) => {
  const calcHeight = (height: number): React.CSSProperties => {
    var style: React.CSSProperties = {};

    style.height = 31 + 30 * height;
    return style;
  };

  return (
    <div
      className={`${classes.transactions} ${
        border ? classes.highLightedTransactions : ""
      }
      `}
      style={calcHeight(height)}
    >
      {(transactions as any[]).map(
        (transaction: IBlockTransaction | IUnconfirmedTransaction, index) =>
          index === 0 ? (
            <Transaction
              key={transaction.txid}
              transaction={transaction}
              highlightRows={highlightRows}
              showPendingColumn={showPendingColumn}
              showHeader={true}
            />
          ) : (
            <Transaction
              key={transaction.txid}
              transaction={transaction}
              highlightRows={highlightRows}
              showPendingColumn={showPendingColumn}
              showHeader={false}
            />
          )
      )}
    </div>
  );
};
