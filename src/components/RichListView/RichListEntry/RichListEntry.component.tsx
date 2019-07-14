import React, { useContext } from 'react';

import { CoinInfoContext } from 'context/CoinInfo.context';

import { IRichListEntry } from 'interfaces/IRichListEntry.interface';

import { Cell } from 'components/Cell/Cell.component';

import classes from './RichListEntry.module.scss';

interface IProps {
    entry: IRichListEntry;
    totalcoins: number | undefined;
    first?: boolean;
    highlighted?: boolean;
}

export const RichListEntry: React.FC<IProps> = ({ entry, totalcoins, first, highlighted }) => {
    const coinInfo = useContext(CoinInfoContext);

    return (
        <div className={classes.richlistEntry + (highlighted ? ' ' + classes.highlighted : '')}>
            <Cell
                label={first ? 'Address' : undefined}
                largelabel={true}
                data={entry.address}
                link={`/${coinInfo.ticker}/address/${entry.address}`}
                notMono={entry.address.length > 34}
                cellStyle={{
                    size: '325px',
                    align: 'left'
                }}
            />
            <Cell
                label={first ? 'Balance' : undefined}
                largelabel={true}
                data={entry.balance}
                unit={coinInfo ? coinInfo.displaySymbol : undefined}
                alwaysSingular={true}
                decimals={8}
                cellStyle={{
                    size: '170px',
                    align: 'right'
                }}
            />
            <div className={classes.spacer}></div>
            <Cell
                label={first ? 'As %' : undefined}
                largelabel={true}
                data={totalcoins ? entry.balance * 100 / totalcoins : undefined }
                unit='%'
                alwaysSingular={true}
                decimals={3}
                cellStyle={{
                    size: '55px',
                    align: 'right'
                }}
            />
        </div>
    );
};
