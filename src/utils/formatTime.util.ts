import { padNumber } from "./padNumber.util";

export const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return `${padNumber(date.getHours())}:${padNumber(
    date.getMinutes()
  )}:${padNumber(date.getSeconds())}`;
};
