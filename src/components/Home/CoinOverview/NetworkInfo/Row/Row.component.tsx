import React from "react";

import { ICell } from "interfaces/ICell.interface";

import { Cell } from "../../Cell/Cell.component";

import classes from "./Row.module.scss";

interface IProps {
  label: string;
  cells: [ICell, ICell];
}

export const Row: React.FC<IProps> = ({ label, cells }) => {
  return (
    <div className={classes.row}>
      <h3 className={classes.label}>{label}</h3>
      {cells.map((cell) => (
        <Cell key={Math.random() + cell.label} {...cell} />
      ))}
    </div>
  );
};
