import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { ITransactionOutput } from 'interfaces/ITransaction.interface';
import { CoinInfoContext } from 'context/CoinInfo.context';

import { formatNumericalValue } from 'utils/formatNumericalValue.util';

import classes from './TransactionOutputs.module.scss';

interface IProps {
    outputs: ITransactionOutput[];
    padToAmount?: number;
}

export const TransactionOutputs: React.FC<IProps> = ({ outputs }) => {
    const convertDestination = (output: ITransactionOutput): [string, string, string] => {
        if (output.address === null) {
            return ['Raw redeemscript', 'Script', output.script];
        }

        const splitted = output.address.split(': ');
        if (splitted.length > 1) {
            return [splitted[0] + ' output', splitted[0], splitted[1]];
        }

        return [output.address, 'Script', output.script];
    };
    const getDestinationHeader = (output: ITransactionOutput): string => convertDestination(output)[0];
    const getDestinationRawType = (output: ITransactionOutput): string => convertDestination(output)[1];
    const getDestinationRaw = (output: ITransactionOutput): string => convertDestination(output)[2];
    const isDataOutput = (output: ITransactionOutput): boolean =>
        output.address && output.address.split(': ')[0] === 'Data' ? true : false;

    const coinInfo = useContext(CoinInfoContext);
    return (
        <div className={classes.transactionOutputs}>
            {outputs.map((output, index) => (
                <div key={index} className={classes.transactionOutput}>
                    <div className={classes.arrow}>➔</div>
                    <div className={classes.destination + (output.type === 'raw' ? ' ' + classes.destinationOverflow : '')}>
                        <div className={classes.address + (output.type === 'raw' ? ' ' + classes.rawOutput : '')}>
                            {output.type !== 'raw' && output.type !== 'data' ? (
                                <Link to={`/${coinInfo.ticker}/address/${output.address}`} className={classes.data}>{getDestinationHeader(output)}</Link>
                            ) : (
                                <div className={classes.data}>{getDestinationHeader(output)}</div>
                            )}
                        </div>
                        <div className={classes.script}>
                            <div className={classes.header}>{getDestinationRawType(output)}:</div>
                            <div className={classes.data}>{getDestinationRaw(output)}</div>
                        </div>
                    </div>
                    {output.amount !== 0 || !isDataOutput(output) ? (
                        <div className={classes.value}>
                            <div className={classes.data}>
                                {formatNumericalValue(output.amount, {
                                    decimals: 8,
                                    unit: coinInfo ? coinInfo.displaySymbol : undefined,
                                    alwaysSingular: true,
                                    decimalClass: classes.decimals,
                                    unitClass: classes.unit,
                                })}
                            </div>
                        </div>
                    ) : null}
                    {output.spentby ? (
                        <div className={classes.spent}>
                            {coinInfo ? (
                                <Link
                                    className={classes.data}
                                    to={`/${coinInfo.ticker}/transactions/${output.spentby.txid}`}
                                >
                                    Spent ➔
                                </Link>
                            ) : (
                                <div className={classes.data}>(spent)</div>
                            )}
                        </div>
                    ) : !isDataOutput(output) ? (
                        <div className={classes.unspent}>
                            <div className={classes.data}>(Unspent)</div>
                        </div>
                    ) : null}
                </div>
            ))}
        </div>
    );
};
