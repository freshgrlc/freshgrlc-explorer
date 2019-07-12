import { IBlockTransaction } from './ITransaction.interface';
import { IMiner } from './IMiner.interface';
import { IReference } from './IReference.interface';

export interface IBlockSimple {
    hash: string;
    timestamp: number;
    height: number;
    difficulty: number;
    relayedby: string;
    firstseen: number;
    size: number;
    miner: IReference;
    transactions: IReference;
    totalfees: number;
    totaltransacted: number;
    miningreward: number;
}

export interface IBlock extends Omit<Omit<IBlockSimple, 'transactions'>, 'miner'> {
    transactions: IBlockTransaction[];
    miner: IMiner;
}
