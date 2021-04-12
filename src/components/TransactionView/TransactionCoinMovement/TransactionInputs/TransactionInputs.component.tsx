import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { CoinInfoContext } from 'context/CoinInfo.context';

import { ICoinbaseInfo, ISimplifiedTransactionInput, TransactionOutputType } from 'interfaces/ITransaction.interface';

import { formatNumericalValue } from 'utils/formatNumericalValue.util';

import classes from './TransactionInputs.module.scss';

interface IProps {
    inputs: ISimplifiedTransactionInput[];
    coinbase: ICoinbaseInfo | null;
    coinbaseAmount?: number;
}

const getInputSubtext = (inputType: TransactionOutputType): string | undefined => {
    if (inputType === 'p2pk') {
        return 'Using ancient signature-only redeemscript';
    }
    if (inputType === 'p2pkh') {
        return 'Using normal transaction redeemscript & signature';
    }
    if (inputType === 'p2wpkh') {
        return 'Using native SegWit transaction format for signature (subsidized)';
    }
    if (inputType === 'p2sh') {
        return 'Using custom redeemscript to unlock input (possibly p2sh-wrapped SegWit)';
    }
    if (inputType === 'p2wsh') {
        return 'Using custom redeemscript to unlock input in native SegWit transaction format';
    }
    return undefined;
};

export const TransactionInputs: React.FC<IProps> = ({ inputs, coinbase, coinbaseAmount }) => {
    const coinInfo = useContext(CoinInfoContext);
    return (
        <div className={classes.transactionInputs}>
            {inputs.map((input, index) => (
                <div key={index} className={classes.transactionInput}>
                    <div className={classes.source}>
                        <div className={classes.address}>
                            {input.type !== 'raw' && input.type !== 'data' ? (
                                <Link to={`/${coinInfo.ticker}/address/${input.address}`} className={classes.data}>{input.address}</Link>
                            ) : (
                                <div className={classes.data}>{input.address}</div>
                            )}
                            {getInputSubtext(input.type) !== undefined ? (
                                <div className={classes.signatureType}>
                                    <div className={classes.data}>{getInputSubtext(input.type)}</div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                    <div className={classes.inputsAmount}>
                        {coinInfo && input.txid ? (
                            <Link className={classes.data} to={`/${coinInfo.ticker}/transactions/${input.txid}`}>
                                {'('}
                                {formatNumericalValue(input.inputsAmount, {
                                    unit: 'input',
                                })}
                                {')'}
                            </Link>
                        ) : (
                            <div className={classes.data}>
                                {'('}
                                {formatNumericalValue(input.inputsAmount, {
                                    unit: 'input',
                                })}
                                {')'}
                            </div>
                        )}
                    </div>
                    <div className={classes.value}>
                        <div className={classes.data}>
                            {formatNumericalValue(input.amount, {
                                decimals: 8,
                                unit: coinInfo ? coinInfo.displaySymbol : undefined,
                                alwaysSingular: true,
                                decimalClass: classes.decimals,
                                unitClass: classes.unit,
                            })}
                        </div>
                    </div>
                </div>
            ))}
            {coinbase ? (
                <div className={classes.transactionInput}>
                    <div className={classes.source}>
                        <div className={classes.address + ' ' + classes.textAddress}>
                            <div className={classes.data}>Newly generated coins + transaction fees</div>
                            <div className={classes.coinbasedata}>
                                <div className={classes.header}>Data:</div>
                                <div className={classes.data}>
                                    {coinbase.data.map((segment, index) => 
                                        (<div className={classes.datasegment}>{segment}</div>)
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={classes.inputsAmount + ' ' + classes.coinbaseInput}>
                        <div className={classes.data}>(coinbase input)</div>
                    </div>
                    {coinbaseAmount !== undefined ? (
                        <div className={classes.value}>
                            <div className={classes.data}>
                                {formatNumericalValue(coinbaseAmount, {
                                    decimals: 8,
                                    unit: coinInfo ? coinInfo.displaySymbol : undefined,
                                    alwaysSingular: true,
                                    decimalClass: classes.decimals,
                                    unitClass: classes.unit,
                                })}
                            </div>
                        </div>
                    ) : null}
                </div>
            ) : null}
        </div>
    );
};
