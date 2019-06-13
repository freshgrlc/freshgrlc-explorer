import React from "react";
import useFetch from "react-fetch-hook";

import { IExpandedTransaction } from "interfaces/ITransaction.interface";

import { getBaseUrl } from "utils/getBaseUrl.util";
import { Redirect } from "react-router";
import { TransactionHeader } from "./TransactionHeader/TransactionHeader.component";

import classes from "./TransactionView.module.scss";

interface IProps {
  routeParams: { coin: string; txid: string };
}

export const TransactionView: React.FC<IProps> = ({ routeParams }) => {
  const baseUrl = getBaseUrl(routeParams.coin);
  const { data: transaction, error } = useFetch<IExpandedTransaction>(
    `${baseUrl}/transactions/${routeParams.txid}/?expand=mutations`
  );
  if (error != null) {
    console.log(error);
    return <Redirect to="/error404" push={false} />;
  }
  return transaction != null ? (
    <div className={classes.transactionView}>
      <TransactionHeader transaction={transaction} />
    </div>
  ) : (
    <h1>wORKING ON It...</h1>
  );
};
