import React from 'react';

import { ITransaction, ISimplifiedTransactionInput, ITransactionOutput } from 'interfaces/ITransaction.interface';

import { TransactionOutputs } from './TransactionOutputs/TransactionOutputs.component';
import { TransactionInputs } from './TransactionInputs/TransactionInputs.component';

import classes from './TransactionCoinMovement.module.scss';

interface IProps {
    transaction: ITransaction;
    simplifiedInputs: ISimplifiedTransactionInput[];
    outputs: ITransactionOutput[];
}

export const TransactionCoinMovement: React.FC<IProps> = ({ transaction, outputs, simplifiedInputs }) => {
    return (
        <div className={classes.coinMovement}>
            <TransactionInputs
                inputs={simplifiedInputs}
                coinbase={transaction.coinbase}
                coinbaseAmount={transaction.totalvalue}
            />
            <TransactionOutputs outputs={Object.values(outputs)} />
        </div>
    );
};
