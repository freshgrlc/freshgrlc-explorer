import React from 'react';

export const rounded = (number: number, decimals?: number, maxDecimals: number = 8): [number | string, string | undefined] => {
    const negative = number < 0;
    const absolute = Math.abs(number.valueOf());
    const integer = Math.floor(absolute);
    const decimalpart = absolute - integer;
    const roundTo = decimals !== undefined ? decimals : decimalpart.toString().length > 2 + maxDecimals ? maxDecimals : undefined;
    const roundedDecimals = (
        roundTo !== undefined ? decimalpart.toFixed(roundTo) : decimalpart.toString()
    ).substring(2, 2 + maxDecimals);

    return [
        negative ? integer === 0 ? '-0' : -integer : integer,
        roundedDecimals !== '' ? (
            decimals !== undefined ? roundedDecimals : roundedDecimals.replace(/0+$/, '')
        ) : undefined
    ];
};

export const formatDecimal = (integer: number | string, decimalClass?: string, roundedDecimals?: string): JSX.Element => {
    return (
        <>
            {integer}
            {roundedDecimals ? <span className={decimalClass}>.{roundedDecimals}</span> : null}
        </>
    );
};

interface INumericalValueOptions {
    decimals?: number;
    maxDecimals?: number;
    unit?: string;
    alwaysSingular?: boolean;
    decimalClass?: string;
    unitClass?: string;
    dimValue?: boolean;
}

export const formatNumericalValue = (value: number | string, options: INumericalValueOptions) => {
    const { decimals, maxDecimals, unit, alwaysSingular, decimalClass, unitClass } = options;

    let roundedData: [number | string, string | undefined] | undefined;
    let formattedData: JSX.Element | string | undefined;
    let isExactlyOne: boolean = false;

    if (typeof value === 'number') {
        roundedData = rounded(value, decimals, maxDecimals);
        formattedData = formatDecimal(roundedData[0], decimalClass, roundedData[1]);
    } else {
        roundedData = rounded(Number(value), decimals, maxDecimals);
        formattedData = value;
    }
    isExactlyOne = roundedData[0] in [-1, 1];

    return (
        <>
            {formattedData}
            {unit ? (
                <div className={unitClass}>
                    {' '}
                    {unit}
                    {isExactlyOne || alwaysSingular ? '' : 's'}
                </div>
            ) : null}
        </>
    );
};
