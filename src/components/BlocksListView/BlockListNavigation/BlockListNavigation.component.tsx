import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { CoinInfoContext } from 'context/CoinInfo.context';

import classes from './BlockListNavigation.module.scss';

interface IProps {
    reverseDirection: boolean;
    blocksPerPage: number;
    currentHighest: number;
    currentLowest: number;
}

export const BlockListNavigation: React.FC<IProps> = ({ reverseDirection, blocksPerPage, currentHighest, currentLowest }) => {
    const coinInfo = useContext(CoinInfoContext);

    const makeLink = (backwards: boolean): string | undefined => {
        if (reverseDirection) {
            backwards = !backwards;
        }
        if (backwards) {
            if (currentLowest === 1) {
                return undefined;
            }
            if (currentLowest < blocksPerPage) {
                currentLowest = blocksPerPage + 1;
                currentHighest = blocksPerPage * 2;
            }
        }
        const newStart = (reverseDirection ? currentHighest : currentLowest) + (backwards ? -blocksPerPage : blocksPerPage);
        return `/${coinInfo.ticker}/blocks/?start=${newStart}&direction=${reverseDirection?'desc':'asc'}&count=${blocksPerPage}`;
    };

    const linkBackward = makeLink(true);
    const linkForward = makeLink(false);
    const labelBackward = reverseDirection ? '⇽ Newer' : '⇽ Older';
    const labelForward = reverseDirection ? 'Older ⇾' : 'Newer ⇾';

    return (
        <div className={classes.navigation}>
            {linkBackward ? (
                <Link to={linkBackward} className={classes.backwards}>{labelBackward}</Link>
            ) : labelBackward}
            <div className={classes.separator}>·</div>
            {linkForward ? (
                <Link to={linkForward}>{labelForward}</Link>
            ) : labelForward}
        </div>
    );
};
