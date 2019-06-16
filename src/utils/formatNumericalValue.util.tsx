import React from "react";

export const rounded = (number: Number, decimals?: Number, maxDecimals?: Number): [number, string | undefined ] => {
    const negative = number < 0;
    const absolute = Math.abs(number.valueOf());
    const integer = Math.floor(absolute);
    const decimalpart = absolute - integer;
    const roundedDecimals = (decimals ? decimalpart.toFixed(decimals.valueOf()) : decimalpart.toString()).substring(2, 2 + (maxDecimals !== undefined ? maxDecimals.valueOf() : 8));

    return [ negative ? -integer : integer, roundedDecimals !== '' ? roundedDecimals : undefined ];
}

export const formatDecimal = (integer: number, roundedDecimals: string | undefined, decimalClass?: string): JSX.Element => {
    return (
        <>
            {integer}
            {roundedDecimals ? (
                <span className={decimalClass}>.{roundedDecimals}</span>
            ) : null}
        </>
    );
};

export const formatNumericalValue = (value: number | string, decimals?: Number, maxDecimals?: Number, unit?: string, alwaysSingular?: boolean, decimalClass?: string, unitClass?: string) => {
    var roundedData: [number, string | undefined ] | undefined;
    var formattedData: JSX.Element | string | undefined;
    var isExactlyOne: boolean = false;

    if (typeof(value) === 'number') {
        roundedData = rounded(value, decimals, maxDecimals);
        formattedData = formatDecimal(roundedData[0], roundedData[1], decimalClass)
    } else {
        value = value as string;
        roundedData = rounded(parseFloat(value), decimals, maxDecimals);
        formattedData = value;
    }
    isExactlyOne = roundedData[0] in [-1, 1];

    return (
        <>
          {formattedData}
          {unit ? <div className={unitClass}> {unit}{isExactlyOne || alwaysSingular ? '' : 's'}</div> : null}
        </>
    );
};
