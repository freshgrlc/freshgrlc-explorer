export const padNumber = (num: number): string => {
  if (num < 10 && num > -1) {
    return `0${num}`;
  } else {
    return num.toString();
  }
};
