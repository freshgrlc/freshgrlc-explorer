import React from 'react';

import classes from './PageLoadAnimation.module.scss';

import loading from 'assets/loading_large.svg';

export const PageLoadAnimation: React.FC = () => {
    return (
        <div className={classes.wrapper}>
            <div className={classes.pageLoad}>
                <div className={classes.inner}>
                    <img src={loading} alt="" />
                    <h3>Loading...</h3>
                </div>
            </div>
        </div>
    );
};
