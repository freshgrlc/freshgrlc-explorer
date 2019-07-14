import React, { useContext } from 'react';

import { CoinInfoContext } from 'context/CoinInfo.context';

import { IMutation } from 'interfaces/IMutation.interface';

import { Cell } from 'components/Cell/Cell.component';

import { formatTime } from 'utils/formatTime.util';

import classes from './AddressMutation.module.scss';

interface IProps {
    mutation: IMutation;
    first?: boolean;
    highlight?: boolean;
}

export const AddressMutation: React.FC<IProps> = ({ mutation, first, highlight }) => {
    const coinInfo = useContext(CoinInfoContext);

    return (
        <div className={classes.mutation + (highlight ? ' ' + classes.highlighted : '')}>
            <Cell
                label={first ? 'Time' : undefined}
                largelabel={true}
                data={formatTime(mutation.time, true)}
                notMono={true}
                cellStyle={{
                    size: '200px'
                }}
            />
            <Cell
                label={first ? 'Transaction' : undefined}
                largelabel={true}
                data={mutation.transaction.txid}
                link={`/${coinInfo.ticker}/transactions/${mutation.transaction.txid}`}
                cellStyle={{
                    size: '580px',
                    linkColor: 'normal'
                }}
            />
            <Cell
                label={first ? 'Mutation' : undefined}
                largelabel={true}
                data={mutation.change}
                unit={coinInfo ? coinInfo.displaySymbol : ''}
                alwaysSingular={true}
                decimals={8}
                cellStyle={{
                    align: 'right',
                    size: '140px',
                    textColor: mutation.change < 0.0 ? '#e83737' : '#1bb11b'
                }}
            />
            <Cell
                label={first ? 'Confirmed' : undefined}
                largelabel={true}
                data={mutation.confirmed ? '✓' : 'Pending...'}
                notMono={true}
                cellStyle={{
                    size: '80px',
                    dataNotImportant: !mutation.confirmed,
                    textColor: mutation.confirmed ? '#1bb11b' : undefined
                }}
            />
        </div>
    );
};
