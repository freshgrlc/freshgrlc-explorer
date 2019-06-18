import React from 'react';

import classes from './Link.module.scss';

interface IProps {}

export const Link: React.FC<IProps> = () => {
    return <div className={classes.link}></div>;
};
