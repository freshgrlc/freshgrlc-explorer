import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { CoinInfoContext } from 'context/CoinInfo.context';

import { ICell, ICellStyle } from 'interfaces/ICell.interface';
import { IRow } from 'interfaces/IRow.interface';
import { IBlock } from 'interfaces/IBlock.interface';

import { formatTime, formatTimeDiffToString } from 'utils/formatTime.util';

import { Row } from 'components/Row/Row.component';

import classes from './BlockMetaInfo.module.scss';

interface IProps {
    block: IBlock;
}

export const BlockMetaInfo: React.FC<IProps> = ({ block }) => {
    const coinInfo = useContext(CoinInfoContext);

    const table: IRow[] = ([
        {
            label: 'Height',
            cells: [
                {
                    data: block.height,
                },
            ],
        },
        {
            label: 'Block received',
            cells: [
                {
                    data: block.firstseen
                        ? (formatTime(block.firstseen, true) +
                          ` (After ${formatTimeDiffToString(block.timestamp, block.firstseen, true)})`
                        ) : '-',
                    notMono: true
                },
            ],
        },
        {
            label: 'Transactions',
            cells: [
                {
                    data: block.transactions.length
                },
            ],
        },
        {
            label: 'Total size',
            cells: [
                {
                    data: block.size,
                    unit: 'byte'
                },
            ],
        },
        {
            label: 'Total transacted',
            cells: [
                {
                    data: block.totaltransacted,
                    unit: coinInfo.displaySymbol,
                    alwaysSingular: true,
                    decimals: 8
                },
            ],
        },
        {
            label: 'Total mining fees',
            cells: [
                {
                    data: block.totalfees,
                    unit: coinInfo.displaySymbol,
                    alwaysSingular: true,
                    decimals: 8
                },
            ],
        },
        {
            label: 'Mining started',
            cells: [
                {
                    data: formatTime(block.timestamp, true),
                    notMono: true,
                },
            ],
        },
        {
            label: 'Miner',
            cells: [
                {
                    data: block.miner.name,
                    notMono: true,
                    link: block.miner.website,
                    externalLink: true
                },
            ],
        },
        {
            label: 'Mining reward',
            cells: [
                {
                    data: block.miningreward,
                    unit: coinInfo.displaySymbol,
                    alwaysSingular: true,
                    decimals: 8
                },
            ],
        },
        {
            label: 'Mining difficulty',
            cells: [
                {
                    data: block.difficulty,
                },
            ],
        }
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
        <div className={classes.blockMetaInfo}>
            <h3 className={classes.header}>
                Block <span className={classes.blockhash}>{block.hash}</span>
                <div className={classes.explore}>
                    <Link to={`/${coinInfo.ticker}/blocks/?start=${block.height - (block.height % 40) + 40}`}>Show in list ➔</Link>
                </div>
            </h3>
            {table.map((entry, index) => (
                <Row key={index} wide={true} labelWidth="200px" {...entry} />
            ))}
        </div>
    );
};
