import React from "react";

import { IBlock } from "interfaces/IBlock.interface";

// import classes from "./Block.module.scss";

interface IProps {
  block: IBlock;
}

export const Block: React.FC<IProps> = ({ block }) => {
  return <div>{block.hash}</div>;
};
