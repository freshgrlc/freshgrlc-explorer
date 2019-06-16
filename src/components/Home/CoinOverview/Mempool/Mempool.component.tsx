import React from "react";

import { Section } from "../../../Section/Section.component";
import { Transactions } from "../Transactions/Transactions.component";
import { IUnconfirmedTransaction } from "../../../../interfaces/ITransaction.interface"

import classes from "./Mempool.module.scss";


interface IProps {
    transactions: IUnconfirmedTransaction[];
}


export const Mempool: React.FC<IProps> = ({ transactions }) => {
    return (
        <Section header="Unconfirmed Transactions">
            <div className={classes.mempool}>
              {transactions.length > 0 ? (
                <Transactions transactions={transactions} height={5} border={true} highlightRows={true}/>
              ) : (
                <span className={classes.none}><h4>No Unconfirmed Transactions</h4></span>
              )}
            </div>
        </Section>
    );
};