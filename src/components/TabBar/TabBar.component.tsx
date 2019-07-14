import React from 'react';
import { Link } from 'react-router-dom';

import { ITabBarOption } from 'interfaces/ITabBarOption.interface';

import classes from './TabBar.module.scss';

interface IProps {
    options: ITabBarOption[];
    selected?: string;
    parameterName?: string;
    baseUrl: string;
}

export const TabBar: React.FC<IProps> = ({ options, selected, parameterName, baseUrl }) => {
    if (!parameterName) {
        parameterName = 'show'
    }

    return (
        <div className={classes.wrapper}>
            <div className={classes.navigation}>
                {options.map((option, index) => (
                    <div key={index} className={classes.optionWrapper}>
                        {index !== 0 ? (
                            <span className={classes.separator}>·</span>
                        ) : undefined}
                        {option.name === selected ? (
                            <span className={classes.option}>{option.displayName}</span>
                        ) : (
                            <Link className={classes.option} to={`${baseUrl}?${parameterName}=${option.name}`}>{option.displayName}</Link>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
