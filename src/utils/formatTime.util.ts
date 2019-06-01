import { padNumber } from "./padNumber.util";

export const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return `${padNumber(date.getHours())}:${padNumber(
    date.getMinutes()
  )}:${padNumber(date.getSeconds())}`;
};
