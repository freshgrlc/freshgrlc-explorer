import React from "react";
import useFetch from "react-fetch-hook";

import { IExpandedTransaction, ITransactionInput, ISimplifiedTransactionInput } from "interfaces/ITransaction.interface";
import { CoinTickerSymbol } from "interfaces/ICoinInfo.interface";

import { getBaseUrl } from "utils/getBaseUrl.util";
import { getCoinInfo, getAllCoins } from "utils/getCoinInfo.util";
import { Redirect } from "react-router";
import { TransactionMetaInfo } from "./TransactionMetaInfo/TransactionMetaInfo.component";
import { TransactionCoinMovement } from "./TransactionCoinMovement/TransactionCoinMovement.component";

import { CoinInfoContext } from "context/CoinInfo.context";

import { SearchBar } from "components/SearchBar/SearchBar.component";
import { Section } from "components/Section/Section.component";
import { PageLoadAnimation } from "components/PageLoadAnimation/PageLoadAnimation.component";

import classes from "./TransactionView.module.scss";

interface IProps {
    routeParams: { coin: CoinTickerSymbol; txid: string };
}

const simplifyInputs = (inputs: ITransactionInput[]): ISimplifiedTransactionInput[] => {
    var simplifiedDict: { [key: string]: ISimplifiedTransactionInput } = {};

    inputs.forEach((input: ITransactionInput) => {
        const key = input.address + '-' + input.type;

        if (!(key in simplifiedDict)) {
            simplifiedDict[key] = {
                address: input.address,
                type: input.type,
                amount: input.amount,
                inputsAmount: 1,
                txid: input.spends.txid
            } as ISimplifiedTransactionInput
        } else {
            simplifiedDict[key].amount += input.amount;
            simplifiedDict[key].inputsAmount += 1;
            simplifiedDict[key].txid = undefined;
        }
    });

    return Object.values(simplifiedDict);
};

export const TransactionView: React.FC<IProps> = ({ routeParams }) => {
    const baseUrl = getBaseUrl(routeParams.coin);
    const coinInfo = getCoinInfo(routeParams.coin);
    const { data: transaction, error } = useFetch<IExpandedTransaction>(
        `${baseUrl}/transactions/${routeParams.txid}/?expand=block,inputs,outputs`
    );
    if (error != null) {
        console.log(error);
        return <Redirect to="/error404" push={false} />;
    }
    return transaction != null ? (
        <CoinInfoContext.Provider value={coinInfo}>
            <SearchBar coins={getAllCoins()} preferredCoin={coinInfo ? coinInfo.ticker : undefined} />
            <div className={classes.transactionView}>
                <h1>Transaction <span className={classes.txid}>{transaction.txid}</span></h1>
                <Section>
                    <TransactionMetaInfo transaction={transaction} />
                </Section>
                <Section header="Coins moved">
                    <TransactionCoinMovement transaction={transaction} simplifiedInputs={simplifyInputs(Object.values(transaction.inputs))} />
                </Section>
            </div>
        </CoinInfoContext.Provider>
    ) : <PageLoadAnimation />;

};
