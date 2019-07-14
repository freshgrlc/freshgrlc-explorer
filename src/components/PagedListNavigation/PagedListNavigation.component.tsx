import React from 'react';
import { Link } from 'react-router-dom';

import classes from './PagedListNavigation.module.scss';

interface IProps {
    baseUrl: string;
    currentOffset: number;
    offsetParamName?: string;
    entriesPerPage: number;
    reachedEndOfList?: boolean;
    labelBackward: string;
    labelForward: string;
}

export const PagedListNavigation: React.FC<IProps> = ({ baseUrl, currentOffset, offsetParamName, entriesPerPage, reachedEndOfList, labelBackward, labelForward }) => {
    if (!offsetParamName) {
        offsetParamName = 'offset'
    }

    const makeLink = (backwards: boolean): string | undefined => {
        var newOffset = currentOffset + (backwards ? -entriesPerPage : entriesPerPage);
        if (newOffset < 0) {
            if (currentOffset === 0) {
                return undefined;
            }
            newOffset = 0;
        }
        if (!backwards && reachedEndOfList) {
            return undefined;
        }

        return `${baseUrl}?${offsetParamName}=${newOffset}`;
    };

    const linkBackward = makeLink(true);
    const linkForward = makeLink(false);

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
