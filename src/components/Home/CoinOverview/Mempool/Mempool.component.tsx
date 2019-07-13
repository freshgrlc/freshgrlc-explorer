import React from 'react';

import { Section } from 'components/Section/Section.component';
import { Transactions } from '../Transactions/Transactions.component';
import { IUnconfirmedTransaction } from 'interfaces/ITransaction.interface';

import classes from './Mempool.module.scss';

interface IProps {
    transactions: IUnconfirmedTransaction[];
}

export const Mempool: React.FC<IProps> = ({ transactions }) => {
    return (
        <Section header="Transactions waiting for confirmation">
            <div className={classes.mempool}>
                {transactions.length > 0 ? (
                    <div className={classes.wrapper}>
                        <Transactions
                            transactions={transactions}
                            height={5}
                            border={false}
                            highlightRows={true}
                            showPendingColumn={true}
                        />
                    </div>
                ) : (
                    <span className={classes.none}>
                        <h4>No unconfirmed transactions</h4>
                    </span>
                )}
            </div>
        </Section>
    );
};
