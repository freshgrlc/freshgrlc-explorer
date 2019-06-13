import React from "react";

import { IExpandedTransaction } from "interfaces/ITransaction.interface";
import { IRow } from "interfaces/IRow.interface";

import { formatTime } from "utils/formatTime.util";
import { Row } from "components/Row/Row.component";

import classes from "./TransactionHeader.module.scss";

interface IProps {
  transaction: IExpandedTransaction;
}

export const TransactionHeader: React.FC<IProps> = ({ transaction }) => {
  const rows: IRow[] = [
    {
      label: "Block",
      cells: [
        {
          label: "Hash",
          // extract hash abreviateor
        },
        {
          label: "Height",
          data: transaction.block.height.toString(),
        },
      ],
    },
    {
      label: "Value",
      cells: [
        {
          label: "Transacted Value",
          data: transaction.totalvalue.toFixed(3),
        },
        {
          label: "Miner fee",
          data: transaction.fee > 0 ? transaction.fee.toExponential(2) : "0",
        },
      ],
    },
    {
      label: "Misc",
      cells: [
        {
          label: "Received at",
          data: formatTime(transaction.firstseen),
          notMono: true,
        },
        {
          label: "Size",
          // extract pretty bytes function
        },
      ],
    },
  ];
  return (
    <div>
      <div className={classes.table}>
        {rows.map((row) => (
          <Row key={Math.random() + Date.now().toString()} {...row} />
        ))}
      </div>
    </div>
  );
};
