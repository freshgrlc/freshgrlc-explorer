import React, { useContext } from 'react';

import { CoinInfoContext } from 'context/CoinInfo.context';

import { IBlock } from 'interfaces/IBlock.interface';

import { Cell } from 'components/Cell/Cell.component';

import { formatTime } from 'utils/formatTime.util';

import classes from './BlockSummary.module.scss';

interface IProps {
    block: IBlock;
    first?: boolean;
    highlighted?: boolean;
}

export const BlockSummary: React.FC<IProps> = ({ block, first, highlighted }) => {
    const coinInfo = useContext(CoinInfoContext);

    const isAddressMiner = block.miner.name.indexOf(' (') !== -1;
    const minerName = !isAddressMiner ? block.miner.name : '(' + block.miner.name.split(' (')[1];
    const minerLink = !isAddressMiner ? block.miner.website : `/${coinInfo.ticker}/address/${block.miner.name.split(' (')[0]}`;
    const minerLinkExternal = !isAddressMiner;

    return (
        <div className={classes.blocksummary + (highlighted ? ' ' + classes.highlighted : '')}>
            <Cell
                label={first ? 'Time' : undefined}
                largelabel={true}
                data={formatTime(block.firstseen ? block.firstseen : block.timestamp, true)}
                cellStyle={{
                    size: '250px'
                }}
            />
            <Cell
                label={first ? 'Height' : undefined}
                largelabel={true}
                data={block.height}
                link={`/${coinInfo.ticker}/blocks/${block.hash}`}
                cellStyle={{
                    size: '80px',
                    linkColor: 'normal'
                }}
            />
            <Cell
                label={first ? 'Blockhash' : undefined}
                largelabel={true}
                data={block.hash}
                link={`/${coinInfo.ticker}/blocks/${block.hash}`}
                cellStyle={{
                    size: '550px',
                    linkColor: 'normal'
                }}
            />
            <Cell
                label={first ? 'Transactions' : undefined}
                largelabel={true}
                data={block.transactions.length}
                cellStyle={{
                    size: '100px',
                    dataNotImportant: block.transactions.length === 1
                }}
            />
            <Cell
                label={first ? 'Transacted' : undefined}
                largelabel={true}
                data={block.totaltransacted}
                unit={coinInfo.displaySymbol}
                alwaysSingular={true}
                decimals={8}
                cellStyle={{
                    size: '140px',
                    align: 'right',
                    dataNotImportant: block.totaltransacted === 0.0
                }}
            />
            <Cell
                label={first ? 'Block size' : undefined}
                largelabel={true}
                data={block.size}
                unit="byte"
                cellStyle={{
                    size: '100px',
                    align: 'right'
                }}
            />
            <div className={classes.spacer}></div>
            <Cell
                label={first ? 'Mined by' : undefined}
                largelabel={true}
                data={minerName}
                notMono={true}
                link={minerLink}
                externalLink={minerLinkExternal}
                cellStyle={{
                    size: '160px',
                    align: 'left',
                    linkColor: minerLinkExternal ? 'accentuate' : 'normal'
                }}
            />
        </div>
    );
};
