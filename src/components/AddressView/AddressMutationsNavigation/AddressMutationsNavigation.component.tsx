import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { CoinInfoContext } from 'context/CoinInfo.context';

import { IAddressInfo } from 'interfaces/IAddressInfo.interface';

import classes from './AddressMutationsNavigation.module.scss';

interface IProps {
    address: IAddressInfo;
    currentOffset: number;
    mutationsPerPage: number;
    noMoreMutations?: boolean;
}

export const AddressMutationsNavigation: React.FC<IProps> = ({ address, currentOffset, mutationsPerPage, noMoreMutations }) => {
    const coinInfo = useContext(CoinInfoContext);

    const makeLink = (backwards: boolean): string | undefined => {
        var newOffset = currentOffset + (backwards ? -mutationsPerPage : mutationsPerPage);
        if (newOffset < 0) {
            if (currentOffset === 0) {
                return undefined;
            }
            newOffset = 0;
        }
        if (!backwards && noMoreMutations) {
            return undefined;
        }

        return `/${coinInfo.ticker}/address/${address.address}?mutationsOffset=${newOffset}`;
    };

    const linkBackward = makeLink(true);
    const linkForward = makeLink(false);
    const labelBackward = '⇽ Newer';
    const labelForward = 'Older ⇾';

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
