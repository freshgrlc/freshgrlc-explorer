import { padNumber } from "./padNumber.util";

export const formatTime = (
  timestamp: number | null | undefined,
  alwaysIncludeDate?: boolean
): string => {
  if (timestamp === null || timestamp === undefined) {
    return "Unknown";
  }

  const includeDate: boolean =
    alwaysIncludeDate || Date.now() / 1000 - timestamp > 86400;
  const date = new Date(timestamp * 1000);
  const zone = new Date()
    .toLocaleTimeString("en-us", { timeZoneName: "short" })
    .split(" ")[2];

  /* FIXME: Detect browsers for people that don't get how calenders work */
  return (
    (includeDate
      ? `${padNumber(date.getDate())}-${padNumber(
          date.getMonth() + 1
        )}-${padNumber(date.getFullYear())} `
      : "") +
    `${padNumber(date.getHours())}:${padNumber(date.getMinutes())}:${padNumber(
      date.getSeconds()
    )} ${zone}`
  );
};

export const formatTimeDiff = (
  timestamp1: number | undefined | null,
  timestamp2: number | undefined
): [number | string, string | undefined] => {
  if (
    timestamp1 === undefined ||
    timestamp1 === null ||
    timestamp2 === undefined
  ) {
    return ["Unknown", undefined];
  }

  const timeDiff = timestamp2 - timestamp1;

  if (timeDiff < 60) {
    return ["<1", "minute"];
  }
  if (timeDiff < 3600) {
    return [Math.round(timeDiff / 60), "minute"];
  }
  if (timeDiff < 86400) {
    return [Math.round(timeDiff / 3600), "hour"];
  }
  if (timeDiff < 604800) {
    return [Math.round(timeDiff / 86400), "day"];
  }
  if (timeDiff < 2592000) {
    return [Math.round(timeDiff / 604800), "week"];
  }
  if (timeDiff < 220752000) {
    return [Math.round(timeDiff / 2592000), "month"];
  }
  return [Math.round(timeDiff / 220752000), "year"];
};

export const formatTimeSince = (
  timestamp: number | undefined | null
): [number | string, string | undefined] => {
  return formatTimeDiff(timestamp, Date.now() / 1000);
};
