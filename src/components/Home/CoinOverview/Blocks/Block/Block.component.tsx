import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { Cell } from 'components/Cell/Cell.component';
import { Transactions } from '../../Transactions/Transactions.component';

import { CoinInfoContext } from 'context/CoinInfo.context';

import { IBlock } from 'interfaces/IBlock.interface';
import { ICellStyle } from 'interfaces/ICell.interface';

import { formatTime } from 'utils/formatTime.util';

import classes from './Block.module.scss';

interface IProps {
    block: IBlock;
}

export const Block: React.FC<IProps> = React.memo(
    ({ block }) => {
        const coinInfo = useContext(CoinInfoContext);
        const tableCellStyle: ICellStyle = { sunken: true };
        return coinInfo ? (
            <div className={classes.block}>
                <h3 className={classes.header}>
                    <Link to={`/${coinInfo.ticker}/blocks/${block.hash}`} className={classes.link}>
                        <div className={classes.headerLabel}>Block</div>
                        {block.hash}
                    </Link>
                </h3>
                <div className={classes.data}>
                    <Cell label="Height" data={block.height.toString()} cellStyle={tableCellStyle} />
                    <Cell label="Difficulty" data={block.difficulty.toString()} cellStyle={tableCellStyle} />
                    <Cell label="Received at" data={formatTime(block.firstseen)} cellStyle={tableCellStyle} />
                </div>
                <div className={classes.data}>
                    <Cell
                        label="Miner"
                        data={block.miner && block.miner.website ? block.miner.name : 'Unknown Pool'}
                        link={block.miner ? block.miner.website : undefined}
                        externalLink={true}
                        notMono={true}
                        cellStyle={tableCellStyle}
                    />
                    <Cell label="Size" data={block.size} unit="byte" thousandsSpacing={true} cellStyle={tableCellStyle} />
                    <Cell
                        label="Transactions"
                        data={block.transactions.length.toString()}
                        cellStyle={tableCellStyle}
                    />
                </div>
                <div className={classes.transactions}>
                    <Transactions transactions={block.transactions} height={4} highlightRows={true} />
                </div>
            </div>
        ) : null;
    },
    (prev, next) => prev.block.hash === next.block.hash
);
