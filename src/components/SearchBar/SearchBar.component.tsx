import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { Form } from "semantic-ui-react";

import { IAddressInfo } from "interfaces/IAddressInfo.interface";
import { IBlock } from "interfaces/IBlock.interface";
import { IBlockTransaction } from "interfaces/ITransaction.interface";

import { ICoinInfo, CoinTickerSymbol } from "interfaces/ICoinInfo.interface";

import { getBaseUrl } from "utils/getBaseUrl.util";

import classes from "./SearchBar.module.scss";
import "semantic-ui-css/semantic.min.css";


type ISearchResult = IBlock | IBlockTransaction | IAddressInfo | null;

interface ISearchResultWithContext {
    result: ISearchResult;
    network: CoinTickerSymbol;
};

interface IProps {
    coins: ICoinInfo[];
    preferredCoin?: CoinTickerSymbol;
}

export const SearchBar: React.FC<IProps> = function ({ coins, preferredCoin }) {
    const [searchFieldValue, updateSearchField] = useState<string>('');
    const [searchObject, setSearchObject] = useState<string>('');
    const [isLoading, setLoading] = useState<boolean>(false);
    const [isError, setError] = useState<boolean>(false);
    const [searchResults, setSearchResults] = useState<ISearchResultWithContext[] | undefined>(undefined);
    const [selectedObject, setSelectedObject] = useState<ISearchResultWithContext | undefined>(undefined);
    const [redirectUrl, redirectTo] = useState<string | undefined>(undefined);

    useEffect(() => {
        setError(false);
    }, [ searchFieldValue ]);

    useEffect(() => {
        if (searchObject === '') {
            setLoading(false);
            return;
        }

        setLoading(true);
        Promise.all(coins.map(async coin =>
            (await fetch(`${getBaseUrl(coin.ticker)}/search/${searchObject}`)).json() as Promise<ISearchResult>
        )).then(results => results.map((result, index) => {
            return {
                result: result,
                network: coins[index].ticker
            };
        }).filter(result =>
            result.result !== null
        )).then(setSearchResults);
    }, [ coins, searchObject ]);

    useEffect(() => {
        setLoading(false);
        if (searchResults === undefined) return;

        if (searchResults.length === 0) {
            setError(true);
            return;
        }

        if (searchResults.length > 1 && preferredCoin !== undefined) {
            const filtered = searchResults.filter(result => result.network === preferredCoin);
            if (filtered.length > 0) {
                setSelectedObject(filtered[0]);
                return;
            }
        }

        setSelectedObject(searchResults[0]);
    }, [ searchResults, preferredCoin ]);

    useEffect(() => {
        if (selectedObject === undefined || selectedObject.result === null) return;

        if (selectedObject.result.hasOwnProperty('txid')) {
            const transaction = selectedObject.result as IBlockTransaction;
            redirectTo(`/${selectedObject.network}/transactions/${transaction.txid}`);
        } else if (selectedObject.result.hasOwnProperty('hash')) {
            const block = selectedObject.result as IBlock;
            redirectTo(`/${selectedObject.network}/blocks/${block.hash}`);
        } else {
            const address = selectedObject.result as IAddressInfo;
            redirectTo(`/${selectedObject.network}/address/${address.address}`);
        }
    }, [ selectedObject ]);

    /* FIXME */
    return redirectUrl === undefined ? (
        <Form className={classes.searchbar} onSubmit={() => setSearchObject(searchFieldValue.trim())}>
            <Form.Input size='large' placeholder='Search for address, transaction or block...' loading={isLoading} error={isError} value={searchFieldValue} onChange={e => updateSearchField(e.target.value)} />
        </Form>
    ) : (
        <Form className={classes.searchbar} onSubmit={() => setSearchObject(searchFieldValue.trim())}>
            <Redirect push to={redirectUrl} />
            <Form.Input size='large' placeholder='Search for address, transaction or block...' loading={isLoading} error={isError} value={searchFieldValue} onChange={e => updateSearchField(e.target.value)} />
        </Form>
    );
};
