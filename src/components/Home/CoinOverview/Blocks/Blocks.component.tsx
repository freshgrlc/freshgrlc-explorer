import React from 'react';

import { Block } from './Block/Block.component';
import { Link } from './Link/Link.component';

import { IBlock } from 'interfaces/IBlock.interface';

// import classes from "./Blocks.module.scss";

interface IProps {
    blocks: IBlock[];
}

export const Blocks: React.FC<IProps> = ({ blocks }) => {
    return (
        <>
            {blocks.map((block) => (
                <React.Fragment key={block.hash}>
                    <Block block={block} />
                    <Link />
                </React.Fragment>
            ))}
        </>
    );
};
