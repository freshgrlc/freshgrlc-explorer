import React from "react";

export const rounded = (
  number: number,
  decimals?: number,
  maxDecimals?: number
): [number, string | undefined] => {
  const negative = number < 0;
  const absolute = Math.abs(number.valueOf());
  const integer = Math.floor(absolute);
  const decimalpart = absolute - integer;
  const roundedDecimals = (decimals
    ? decimalpart.toFixed(decimals.valueOf())
    : decimalpart.toString()
  ).substring(2, 2 + (maxDecimals !== undefined ? maxDecimals.valueOf() : 8));

  return [
    negative ? -integer : integer,
    roundedDecimals !== "" ? roundedDecimals : undefined,
  ];
};

export const formatDecimal = (
  integer: number,
  decimalClass?: string,
  roundedDecimals?: string
): JSX.Element => {
  return (
    <>
      {integer}
      {roundedDecimals ? (
        <span className={decimalClass}>.{roundedDecimals}</span>
      ) : null}
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
}

export const formatNumericalValue = (
  value: number | string,
  options: INumericalValueOptions
) => {
  const {
    decimals,
    maxDecimals,
    unit,
    alwaysSingular,
    decimalClass,
    unitClass,
  } = options;

  let roundedData: [number, string | undefined] | undefined;
  let formattedData: JSX.Element | string | undefined;
  let isExactlyOne: boolean = false;

  if (typeof value === "number") {
    roundedData = rounded(value, decimals, maxDecimals);
    formattedData = formatDecimal(roundedData[0], decimalClass, roundedData[1]);
  } else {
    value = value as string;
    roundedData = rounded(parseFloat(value), decimals, maxDecimals);
    formattedData = value;
  }
  isExactlyOne = roundedData[0] in [-1, 1];

  return (
    <>
      {formattedData}
      {unit ? (
        <div className={unitClass}>
          {" "}
          {unit}
          {isExactlyOne || alwaysSingular ? "" : "s"}
        </div>
      ) : null}
    </>
  );
};
