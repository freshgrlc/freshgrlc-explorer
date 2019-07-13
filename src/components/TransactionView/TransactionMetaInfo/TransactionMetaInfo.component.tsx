import React, { useContext } from 'react';

import { ICell, ICellStyle } from 'interfaces/ICell.interface';
import { IRow } from 'interfaces/IRow.interface';
import { IBlockTransactionWithBlockInfo } from 'interfaces/ITransaction.interface';

import { CoinInfoContext } from 'context/CoinInfo.context';

import { Row } from 'components/Row/Row.component';

import { formatTime, formatTimeDiffToString } from 'utils/formatTime.util';

import classes from './TransactionMetaInfo.module.scss';

interface IProps {
    transaction: IBlockTransactionWithBlockInfo;
}

export const TransactionMetaInfo: React.FC<IProps> = ({ transaction }) => {
    const coinInfo = useContext(CoinInfoContext);

    const table: IRow[] = ([
        {
            label: 'Received',
            cells: [
                {
                    data: formatTime(transaction.firstseen, true),
                },
            ],
        },
        {
            label: 'Confirmed',
            cells: [
                {
                    data: transaction.block
                        ? formatTime(
                              transaction.block.firstseen ? transaction.block.firstseen : transaction.block.timestamp,
                              true
                          ) +
                          (transaction.firstseen
                              ? ` (After ${formatTimeDiffToString(transaction.firstseen, transaction.block.firstseen)})`
                              : '')
                        : '-',
                },
            ],
        },
        {
            label: 'In block',
            cells: [
                {
                    data: transaction.block ? transaction.block.hash : '-',
                    link:
                        transaction.block && coinInfo
                            ? `/${coinInfo.ticker}/blocks/${transaction.block.hash}`
                            : undefined,
                    cellStyle: {
                        linkColor: 'normal'
                    }
                },
            ],
        },
        {
            label: 'Total transacted',
            cells: [
                {
                    data: transaction.totalvalue,
                    unit: coinInfo ? coinInfo.displaySymbol : undefined,
                    alwaysSingular: true,
                },
            ],
        },
        {
            label: 'Size',
            cells: [
                {
                    data: transaction.size,
                    unit: 'byte',
                },
            ],
        },
        {
            label: 'Mining fee',
            cells: [
                transaction.fee !== 0
                    ? {
                          data: transaction.fee,
                          unit: coinInfo ? coinInfo.displaySymbol : undefined,
                          alwaysSingular: true,
                      }
                    : transaction.coinbase
                    ? {
                          data: 'None: coinbase transaction',
                          notMono: true,
                      }
                    : {
                          data: 'Free',
                          notMono: true,
                      },
            ],
        },
        {
            label: 'Feerate',
            cells: [
                !transaction.coinbase
                    ? {
                          data: (transaction.fee / transaction.size) * 1000000,
                          unit: coinInfo ? 'µ' + coinInfo.displaySymbol + '/byte' : undefined,
                          alwaysSingular: true,
                          decimals: 3,
                      }
                    : {
                          data: '-',
                      },
            ],
        },
    ] as IRow[]).map(
        (row: IRow): IRow => {
            row.cells.forEach((cell: ICell) => {
                if (cell.cellStyle === undefined) {
                    cell.cellStyle = {} as ICellStyle;
                }
                cell.cellStyle.align = 'left';
            });
            return row;
        }
    );

    return (
        <div className={classes.transactionMetaInfo}>
            <h3 className={classes.header}>
                Transaction <span className={classes.txid}>{transaction.txid}</span>
            </h3>
            {table.map((entry, index) => (
                <Row key={index} wide={true} labelWidth="200px" {...entry} />
            ))}
        </div>
    );
};
