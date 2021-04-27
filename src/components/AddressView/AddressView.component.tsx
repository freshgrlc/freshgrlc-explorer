import React, { useEffect, useState } from 'react';
import useFetch from 'react-fetch-hook';

import { CoinTickerSymbol } from 'interfaces/ICoinInfo.interface';

import { getBaseUrl } from 'utils/getBaseUrl.util';
import { getCoinInfo, getAllCoins } from 'utils/getCoinInfo.util';
import { Redirect } from 'react-router';

import { CoinInfoContext } from 'context/CoinInfo.context';

import { IAddressInfo } from 'interfaces/IAddressInfo.interface';
import { IMutation } from 'interfaces/IMutation.interface';
import { ITransaction, ITransactionInput, ITransactionOutput, TransactionOutputType } from 'interfaces/ITransaction.interface';

import { Banner } from 'components/Banner/Banner.component';
import { Section } from 'components/Section/Section.component';
import { PagedListNavigation } from 'components/PagedListNavigation/PagedListNavigation.component';
import { PageLoadAnimation } from 'components/PageLoadAnimation/PageLoadAnimation.component';

import { AddressMutation } from './AddressMutation/AddressMutation.component';
import { AddressMetaInfo } from './AddressMetaInfo/AddressMetaInfo.component';

import classes from './AddressView.module.scss';

interface IProps {
    routeParams: { coin: CoinTickerSymbol; address: string };
    queryParams: { mutationsOffset?: string };
}

export const AddressView: React.FC<IProps> = ({ routeParams, queryParams }) => {
    const baseUrl = getBaseUrl(routeParams.coin);
    const coinInfo = getCoinInfo(routeParams.coin);

    const mutationsOffset = queryParams && queryParams.mutationsOffset ? parseInt(queryParams.mutationsOffset) : 0;

    const { isLoading, data: address, error } = useFetch<IAddressInfo>(
        `${baseUrl}/address/${routeParams.address}/`
    );
    const { isLoading: mutationsLoading, data: mutations } = useFetch<IMutation[]>(
        `${baseUrl}/address/${routeParams.address}/mutations/?start=${mutationsOffset}&limit=40`
    );

    const [addressType, setAddressType] = useState<TransactionOutputType | null | undefined>();
    useEffect(() => {
        let isMyAddress = (x: string | null) => {
            if (x === null) return false;
            if (x === address?.address) return true;
            if (address?.aliases && address.aliases.length >= 0) return address.aliases.includes(x);
            return false;
        };

        if (!mutations || mutations.length === 0) {
            setAddressType(mutations ? null : undefined);
        } else {
            const mutationType = mutations[0].change < 0.0 ? 'input' : 'output';
            fetch(`${getBaseUrl(coinInfo.ticker)}/transactions/${mutations[0].transaction.txid}/?expand=${mutationType}s`)
                .then(result => result.json())
                .then(result => {
                    const transaction: ITransaction = result;
                    if (mutationType === 'output') {
                        const myOutput = (Object.values(transaction.outputs) as ITransactionOutput[]).filter(output => isMyAddress(output.address));
                        if (myOutput.length > 0) {
                            setAddressType(myOutput[0].type);
                        }
                    } else {
                        const myInput = (Object.values(transaction.inputs) as ITransactionInput[]).filter(input => isMyAddress(input.address));
                        if (myInput.length > 0) {
                            setAddressType(myInput[0].type);
                        }
                    }
                });
        }
    }, [mutationsLoading, mutations, coinInfo, routeParams, address]);

    if (error != null) {
        console.log(error);
        return <Redirect to="/error404" push={false} />;
    }

    return (
        <CoinInfoContext.Provider value={coinInfo}>
            <Banner coins={getAllCoins()} preferredCoin={coinInfo ? coinInfo.ticker : undefined} />
            {!isLoading && address != null ? (
                <div className={classes.transactionView}>
                    <Section>
                        <AddressMetaInfo address={address} addressType={addressType} />
                    </Section>
                    <Section header="Recent transactions">
                    { !mutationsLoading && mutations != null ? (
                        mutations.length > 0 ? (
                            <>
                                <PagedListNavigation
                                    baseUrl={`/${coinInfo.ticker}/address/${address.address}`}
                                    currentOffset={mutationsOffset}
                                    offsetParamName="mutationsOffset"
                                    entriesPerPage={40}
                                    reachedEndOfList={mutations.length < 40}
                                    labelForward="Older ⇾"
                                    labelBackward="⇽ Newer"
                                />
                                <div className={classes.wrapper}>
                                    <div className={classes.mutations}>
                                        {mutations.map((mutation, index) => (
                                            <AddressMutation key={index} mutation={mutation} first={index === 0} highlight={index % 2 === 1} />
                                        ))}
                                    </div>
                                </div>
                                <PagedListNavigation
                                    baseUrl={`/${coinInfo.ticker}/address/${address.address}`}
                                    currentOffset={mutationsOffset}
                                    offsetParamName="mutationsOffset"
                                    entriesPerPage={40}
                                    reachedEndOfList={mutations.length < 40}
                                    labelForward="Older ⇾"
                                    labelBackward="⇽ Newer"
                                />
                            </>
                        ) : (
                            <div className={classes.none}>
                                <h4>No transactions yet for this address</h4>
                            </div>
                        )
                    ) : (
                        <PageLoadAnimation />
                    )}
                    </Section>
                </div>
            ) : (
                <PageLoadAnimation />
            )}
        </CoinInfoContext.Provider>
    );
};
