import React from "react";

export const rounded = (
  number: number,
  decimals: number = 0,
  maxDecimals: number = decimals
): [number, string] => {
  number = Math.round(number * 10 ** decimals) / 10 ** decimals;
  const formatted = number
    .toFixed(decimals)
    .replace(/\.?0+$/, "")
    .split(".");

  return [
    Number(formatted[0]),
    (formatted[1] ? formatted[1] : "").padEnd(maxDecimals, "0"),
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

  let roundedData: [number, string] | undefined;
  let formattedData: JSX.Element | string | undefined;
  let isExactlyOne: boolean = false;

  if (typeof value === "number") {
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
          {" "}
          {unit}
          {isExactlyOne || alwaysSingular ? "" : "s"}
        </div>
      ) : null}
    </>
  );
};
