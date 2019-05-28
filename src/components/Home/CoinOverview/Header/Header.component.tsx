import React from "react";

import classes from "./Header.module.scss";

interface IProps {
  name: string;
  displayName: string;
}

export const Header: React.FC<IProps> = ({ name, displayName }) => {
  return (
    <h1 className={classes.header}>
      <img
        className={classes.img}
        src={require(`assets/logos/${name}.svg`)}
        alt=""
      />
      <span className={classes.text}>{displayName}</span>
    </h1>
  );
};
