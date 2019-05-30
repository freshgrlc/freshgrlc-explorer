import { ITransaction } from "./ITransaction.interface";
import { IMiner } from "./IMiner.interface";

export interface IBlockSimple {
  hash: string;
  timestamp: number;
  height: number;
  difficulty: number;
  relayedby: string;
  firstseen: number;
  size: number;
  miner: { href: string };
  transactions: { href: string };
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface IBlock
  extends Omit<Omit<IBlockSimple, "transactions">, "miner"> {
  transactions: ITransaction[];
  miner: IMiner;
}
