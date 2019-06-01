import React from "react";

import loading from "assets/loading.gif";

import { ICell } from "interfaces/ICell.interface";

import classes from "./Cell.module.scss";

export const Cell: React.FC<ICell> = ({ label, data, unit, notMono }) => {
  return (
    <div className={classes.cell}>
      <h4 className={classes.label}>{label}</h4>
      <div className={classes.info}>
        {data ? (
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
