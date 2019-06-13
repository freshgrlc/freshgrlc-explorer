import React from "react";

import { Transaction } from "../Transaction/Transaction.component";

import {
  IBlockTransaction,
  IUnconfirmedTransaction,
} from "interfaces/ITransaction.interface";

import classes from "./Transactions.module.scss";

interface IProps {
  transactions: IBlockTransaction[] | IUnconfirmedTransaction[];
}

export const Transactions: React.FC<IProps> = ({ transactions }) => {
  return (
    <div className={classes.transactions}>
      {(transactions as any[]).map(
        (transaction: IBlockTransaction | IUnconfirmedTransaction, index) =>
          index === 0 ? (
            <Transaction
              key={transaction.txid}
              transaction={transaction}
              showHeader={true}
            />
          ) : (
            <Transaction
              key={transaction.txid}
              transaction={transaction}
              showHeader={false}
            />
          )
      )}
    </div>
  );
};
