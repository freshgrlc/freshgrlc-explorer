import { ITransaction } from "./ITransaction.interface";
import { IMiner } from "./IMiner.interface";

export interface IBlock {
  hash: string;
  transactions: ITransaction[];
  timestamp: number;
  miner: IMiner;
  height: number;
  difficulty: number;
  relayedby: string;
  firstseen: number;
  size: number;
}
