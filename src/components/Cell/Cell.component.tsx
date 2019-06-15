import React from "react";

import loading from "assets/loading.gif";

import { ICell } from "interfaces/ICell.interface";

import classes from "./Cell.module.scss";

export const Cell: React.FC<ICell> = ({ label, data, link, unit, notMono }) => {
  const wrapInLink = (contents: JSX.Element) => {
    return link ? (
      <a href={link} target={'_blank'}>
        {contents}
      </a>
    ) : contents;
  };

  return (
    <div className={classes.cell}>
      {label ? <h4 className={classes.label}>{label}</h4> : null}
      <div className={classes.info}>
        {data ? wrapInLink(
          <>
            {notMono ? data : <div className={classes.mono}>{data}</div>}
            {unit ? <div className={classes.unit}> {unit}</div> : null}
          </>
        ) : (
          <img className={classes.loading} src={loading} alt="Loading" />
        )}
      </div>
    </div>
  );
};
