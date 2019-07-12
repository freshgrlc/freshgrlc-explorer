import React, { useContext } from 'react';

import { getBaseUrl } from 'utils/getBaseUrl.util';
import { getCoinInfo, getAllCoins } from 'utils/getCoinInfo.util';
import { Redirect } from 'react-router';

import { CoinInfoContext } from 'context/CoinInfo.context';

import { IExpandedBlockTransaction } from 'interfaces/ITransaction.interface';
import { IBlock } from 'interfaces/IBlock.interface';

import { formatTime } from 'utils/formatTime.util';

import { Cell } from 'components/Cell/Cell.component';
import { ICellStyle } from 'interfaces/ICell.interface';


import classes from './TransactionSummary.module.scss';

interface IProps {
    transaction: IExpandedBlockTransaction;
    block: IBlock;
    first?: boolean;
}

export const TransactionSummary: React.FC<IProps> = ({ transaction, block, first }) => {
    const coinInfo = useContext(CoinInfoContext);
    return (
        <div className={classes.transactionSummary}>
            <Cell
                label={first ? 'First seen at' : undefined}
                largelabel={true}
                data={formatTime(
                    transaction.firstseen ? transaction.firstseen :
                    block.firstseen ? block.firstseen : block.timestamp,
                    true)}
                notMono={true}
                cellStyle={{
                    size: '200px',
                }}
            />
            <Cell
                label={first ? 'Transaction ID' : undefined}
                largelabel={true}
                data={transaction.txid}
                link={`/${coinInfo.ticker}/transactions/${transaction.txid}`}
                cellStyle={{
                    size: '580px',
                    linkColor: 'normal'
                }}
            />
            <Cell
                label={first ? 'Total transacted' : undefined}
                largelabel={true}
                data={transaction.totalvalue}
                unit={coinInfo ? coinInfo.displaySymbol : undefined}
                alwaysSingular={true}
                decimals={8}
                cellStyle={{
                    size: '140px',
                    align: 'right'
                }}
            />
            {!transaction.coinbase ? (
                <Cell
                    label={first ? 'Feerate' : undefined}
                    largelabel={true}
                    data={(transaction.fee / transaction.size) * 1000000}
                    unit={coinInfo ? 'µ' + coinInfo.displaySymbol + '/byte' : undefined}
                    alwaysSingular={true}
                    decimals={3}
                    cellStyle={{
                        size: '140px',
                        align: 'right'
                    }}
                />
            ) : (
                <Cell
                    label={first ? 'Feerate' : undefined}
                    largelabel={true}
                    data="-"
                    cellStyle={{
                        size: '140px'
                    }}
                />
            )}
            <Cell
                label={first ? 'Size' : undefined}
                largelabel={true}
                data={transaction.size}
                unit="byte"
                cellStyle={{
                    size: '100px',
                    align: 'right'
                }}
            />
            {transaction.coinbase ? (
                <Cell
                    label={first ? 'Inputs' : undefined}
                    largelabel={true}
                    data="(Coinbase)"
                    notMono={true}
                    cellStyle={{
                        size: '100px',
                        fontSize: 'small'
                    }}
                />
            ) : (
                <Cell
                    label={first ? 'Inputs' : undefined}
                    largelabel={true}
                    data={Object.keys(transaction.inputs).length}
                    cellStyle={{
                        size: '100px',
                    }}
                />
            )}
            <Cell
                label={first ? 'Outputs' : undefined}
                largelabel={true}
                data={Object.keys(transaction.outputs).length}
                cellStyle={{
                    size: '60px',
                }}
            />
        </div>
    );
};
