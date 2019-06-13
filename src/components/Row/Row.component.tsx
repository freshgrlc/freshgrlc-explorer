import React from "react";

import { Cell } from "../Cell/Cell.component";

import { IRow } from "interfaces/IRow.interface";

import classes from "./Row.module.scss";

export const Row: React.FC<IRow> = ({ label, cells }) => {
  return (
    <div className={classes.row}>
      <h3 className={classes.label}>{label}</h3>
      {cells.map((cell) => (
        <Cell key={Math.random() + Date.now().toString()} {...cell} />
      ))}
    </div>
  );
};
