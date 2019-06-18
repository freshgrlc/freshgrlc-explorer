import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { ITransactionOutput } from 'interfaces/ITransaction.interface';
import { CoinInfoContext } from 'context/CoinInfo.context';

import { formatNumericalValue } from 'utils/formatNumericalValue.util';

import classes from './TransactionOutputs.module.scss';

interface IProps {
    outputs: ITransactionOutput[];
}

export const TransactionOutputs: React.FC<IProps> = ({ outputs }) => {
    const convertDestination = (output: ITransactionOutput): [string, string] => {
        if (output.address === null) {
            return ['', output.script];
        }

        const splitted = output.address.split(': ');
        if (splitted.length > 1) {
            return [splitted[0] + ' output', splitted[1]];
        }

        return [output.address, output.script];
    };
    const getDestinationHeader = (output: ITransactionOutput): string => convertDestination(output)[0];
    const getDestinationRaw = (output: ITransactionOutput): string => convertDestination(output)[1];
    const isDataOutput = (output: ITransactionOutput): boolean =>
        output.address && output.address.split(': ')[0] === 'Data' ? true : false;

    const coinInfo = useContext(CoinInfoContext);
    return (
        <div className={classes.transactionOutputs}>
            {outputs.map((output, index) => (
                <div key={'output' + index} className={classes.transactionOutput}>
                    <div className={classes.destination}>
                        <div className={classes.address + (output.type === 'raw' ? ' ' + classes.rawOutput : '')}>
                            <div className={classes.data}>{getDestinationHeader(output)}</div>
                        </div>
                        <div className={classes.script}>
                            <div className={classes.header}>Script:</div>
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
