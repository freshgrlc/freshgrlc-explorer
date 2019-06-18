import React from 'react';

import classes from './Section.module.scss';

interface IProps {
    children?: any;
    header?: string;
}

export const Section: React.FC<IProps> = ({ children, header }) => {
    return (
        <div className={classes.pagesection}>
            {header ? <h2 className={classes.sectionheader}>{header}</h2> : null}
            {children}
        </div>
    );
};
