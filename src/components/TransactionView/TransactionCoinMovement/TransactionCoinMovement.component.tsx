import React from "react";

import {
  IExpandedTransaction,
  ISimplifiedTransactionInput,
} from "interfaces/ITransaction.interface";

import { TransactionOutputs } from "./TransactionOutputs/TransactionOutputs.component";
import { TransactionInputs } from "./TransactionInputs/TransactionInputs.component";

import classes from "./TransactionCoinMovement.module.scss";

interface IProps {
  transaction: IExpandedTransaction;
  simplifiedInputs: ISimplifiedTransactionInput[];
}

export const TransactionCoinMovement: React.FC<IProps> = ({
  transaction,
  simplifiedInputs,
}) => {
  return (
    <div className={classes.coinMovement}>
      <TransactionInputs
        inputs={simplifiedInputs}
        coinbase={transaction.coinbase}
        coinbaseAmount={transaction.totalvalue}
      />
      <div className={classes.coinMovementArrow}>➔</div>
      <TransactionOutputs outputs={Object.values(transaction.outputs)} />
    </div>
  );
};
