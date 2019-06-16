import React from "react";
import { Link } from "react-router-dom";

import loading from "assets/loading.gif";

import { ICell, ICellStyle } from "interfaces/ICell.interface";

import classes from "./Cell.module.scss";

export const Cell: React.FC<ICell> = ({ label, data, link, externalLink, unit, notMono, decimals, alwaysSingular, cellStyle }) => {
  const wrapInLink = (contents: JSX.Element) => {
    return link ? externalLink ? (
      <a className={classes.link} href={link} target={'_blank'}>
        {contents}
      </a>
    ) : (
      <Link className={classes.link} to={link}>
        {contents}
      </Link>
    ) : contents;
  };

  const rounded = (number: Number, decimals?: Number): [number, string | undefined ] => {
      const negative = number < 0;
      const absolute = Math.abs(number.valueOf());
      const integer = Math.floor(absolute);
      const decimalpart = absolute - integer;
      const roundedDecimals = (decimals ? decimalpart.toFixed(decimals.valueOf()) : decimalpart.toString()).substring(2);

      return [ negative ? -integer : integer, roundedDecimals !== '' ? roundedDecimals : undefined ];
  }

  const formatDecimal = (integer: number, roundedDecimals: string | undefined): JSX.Element => {
      return (
          <>
              {integer}
              {roundedDecimals ? (
                  <span className={classes.decimals}>.{roundedDecimals}</span>
              ) : null}
          </>
      );
  };

  const processCellStyle = (cellStyle: ICellStyle | undefined, innerCell: boolean): React.CSSProperties | undefined => {
      var style: React.CSSProperties = {};

      if (!cellStyle) {
          return undefined;
      }

      if (innerCell && cellStyle.align === 'right') {
          style.marginLeft = 'auto';
      }

      if (!innerCell && cellStyle.size) {
          style.width = cellStyle.size;
      }

      if (!innerCell && cellStyle.fontSize) {
          style.fontSize = {
              'normal': undefined,
              'smaller': '90%',
              'small': '85%'
          }[cellStyle.fontSize];
      }

      return style;
  };

  const processOuterCellStyle = (cellStyle?: ICellStyle): React.CSSProperties | undefined => processCellStyle(cellStyle, false);
  const processInnerCellStyle = (cellStyle?: ICellStyle): React.CSSProperties | undefined => processCellStyle(cellStyle, true);

  var roundedData: [number, string | undefined ] | undefined;
  var formattedData: JSX.Element | string | undefined;
  var isExactlyOne: boolean = false;

  if (data) {
      if (typeof(data) === 'number') {
          roundedData = rounded(data, decimals);
          formattedData = formatDecimal(roundedData[0], roundedData[1])
      } else {
          data = data as string;
          roundedData = rounded(parseFloat(data), decimals);
          formattedData = data;
      }
      isExactlyOne = roundedData[0] in [-1, 1];
  }

  return (
    <div className={classes.cell + (cellStyle && cellStyle.color ? ' ' + classes[cellStyle.color + 'Cell'] : '')}>
      {label ? <h4 className={classes.label}>{label}</h4> : null}
      <div className={classes.info} style={processOuterCellStyle(cellStyle)}>
        {data ? wrapInLink(
          <>
            <div className={notMono ? undefined : classes.mono} style={processInnerCellStyle(cellStyle)}>{formattedData}</div>
            {unit ? <div className={classes.unit}> {unit}{isExactlyOne || alwaysSingular ? '' : 's'}</div> : null}
          </>
        ) : (
          <img className={classes.loading} src={loading} alt="Loading" />
        )}
      </div>
    </div>
  );
};
