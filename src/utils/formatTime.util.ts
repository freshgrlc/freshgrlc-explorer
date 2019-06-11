import { padNumber } from "./padNumber.util";

export const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  const zone = new Date()
    .toLocaleTimeString("en-us", { timeZoneName: "short" })
    .split(" ")[2];
  return `${padNumber(date.getHours())}:${padNumber(
    date.getMinutes()
  )}:${padNumber(date.getSeconds())} ${zone}`;
};
