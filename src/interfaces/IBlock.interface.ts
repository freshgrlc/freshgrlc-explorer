import { IBlockTransaction } from "./ITransaction.interface";
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

export interface IBlock
  extends Omit<Omit<IBlockSimple, "transactions">, "miner"> {
  transactions: IBlockTransaction[];
  miner: IMiner;
}
