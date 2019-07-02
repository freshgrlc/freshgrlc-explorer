import React from 'react';

import classes from './FreshGRLCBanner.module.scss';


interface IProps {
    title?: string,
    subdomain?: string,
    subtitle?: string,
    subtext?: string | JSX.Element
}

export const FreshGRLCBanner: React.FC<IProps> = function({ title, subdomain, subtitle, subtext }) {
    title = title ? title : 'FreshGRLC.NET';
    return (
        <div className={classes.banner}>
            <h1>{ subdomain ? (<span className={classes.subdomain}>{subdomain}.</span>) : ''}{title}</h1>
            { subtitle ? (<h2>{subtitle}</h2>) : undefined}
            { subtext ? (<div className={classes.subtext}>{subtext}</div>) : undefined}
        </div>
    );
};
