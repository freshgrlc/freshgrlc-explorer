import React from 'react';

import { Cell } from '../Cell/Cell.component';

import { IRow } from 'interfaces/IRow.interface';

import classes from './Row.module.scss';

export const Row: React.FC<IRow> = ({ label, labelWidth, cells, wide }) => {
    const getLabelStyle = (width?: string): React.CSSProperties => {
        var style: React.CSSProperties = {};

        if (width) {
            style.width = width;
        }

        return style;
    };

    var hasCellLabels: boolean = false;

    cells.forEach((cell) => {
        if (cell.label !== undefined) {
            hasCellLabels = true;
        }
    });

    return (
        <div
            className={`
        ${classes.row} ${hasCellLabels || wide ? classes.verticalPaddedRow : ''}`}
        >
            <h3
                className={`${classes.label} ${hasCellLabels ? classes.verticalPaddedLabel : ''} ${
                    wide ? classes.wideRowLabel : ''
                }`}
                style={getLabelStyle(labelWidth)}
            >
                {label}
            </h3>
            {cells.map((cell) => (
                <Cell key={Math.random() + Date.now().toString()} {...cell} />
            ))}
        </div>
    );
};
