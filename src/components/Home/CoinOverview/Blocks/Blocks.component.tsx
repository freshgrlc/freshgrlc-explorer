import React from "react";

import { Block } from "./Block/Block.component";

import { IBlock } from "interfaces/IBlock.interface";

// import classes from "./Blocks.module.scss";

interface IProps {
  blocks: IBlock[];
}

export const Blocks: React.FC<IProps> = ({ blocks }) => {
  return (
    <>
      {blocks.map((block) => (
        <Block key={block.hash} block={block} />
      ))}
    </>
  );
};
