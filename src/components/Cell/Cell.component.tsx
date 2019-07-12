import React from 'react';
import { Link } from 'react-router-dom';

import loading from 'assets/loading.gif';

import { ICell, ICellStyle } from 'interfaces/ICell.interface';

import { formatNumericalValue } from 'utils/formatNumericalValue.util';

import classes from './Cell.module.scss';

export const Cell: React.FC<ICell> = ({
    label,
    data,
    link,
    externalLink,
    unit,
    notMono,
    decimals,
    maxDecimals,
    alwaysSingular,
    cellStyle,
}) => {
    const wrapInLink = (contents: JSX.Element, cellStyle?: ICellStyle) => {
        let className = classes.link + (cellStyle && cellStyle.linkColor !== 'normal' ? ' ' + classes.accentuatedLink : '');
        return link ? (
            externalLink ? (
                <a
                    className={className}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={processInnerCellStyle(cellStyle)}
                >
                    {contents}
                </a>
            ) : (
                <Link className={className} to={link} style={processInnerCellStyle(cellStyle)}>
                    {contents}
                </Link>
            )
        ) : (
            <div style={processInnerCellStyle(cellStyle)}>{contents}</div>
        );
    };

    const processCellStyle = (innerCell: boolean, cellStyle?: ICellStyle): React.CSSProperties | undefined => {
        var style: React.CSSProperties = {};

        if (!cellStyle) {
            return undefined;
        }

        if (innerCell && cellStyle.align) {
            if (cellStyle.align === 'left') {
                style.marginRight = 'auto';
            } else if (cellStyle.align === 'right') {
                style.marginLeft = 'auto';
            }
        }

        if (!innerCell && cellStyle.size) {
            style.width = cellStyle.size;
        }

        if (!innerCell && cellStyle.fontSize) {
            style.fontSize = {
                normal: undefined,
                smaller: '90%',
                small: '85%',
            }[cellStyle.fontSize];
        }

        return style;
    };

    const processOuterCellStyle = (cellStyle?: ICellStyle): React.CSSProperties | undefined =>
        processCellStyle(false, cellStyle);
    const processInnerCellStyle = (cellStyle?: ICellStyle): React.CSSProperties | undefined =>
        processCellStyle(true, cellStyle);

    const hasData = data !== null && data !== undefined;
    const formattedData = hasData
        ? formatNumericalValue(data as (string | number), {
              decimals,
              maxDecimals,
              unit,
              alwaysSingular,
              decimalClass: classes.decimals,
              unitClass: classes.unit,
          })
        : undefined;

    return (
        <div className={`${classes.cell} ${cellStyle && cellStyle.color ? classes[cellStyle.color + 'Cell'] : ''}`}>
            {label ? <h4 className={classes.label}>{label}</h4> : null}
            <div className={classes.info} style={processOuterCellStyle(cellStyle)}>
                {hasData ? (
                    wrapInLink(<div className={notMono ? undefined : classes.mono}>{formattedData}</div>, cellStyle)
                ) : (
                    <img className={classes.loading} src={loading} alt="Loading" />
                )}
            </div>
        </div>
    );
};
