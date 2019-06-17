import { IBlock } from "./IBlock.interface";

export type TransactionOutputType =
  | "p2pk"
  | "p2pkh"
  | "p2sh"
  | "p2wpkh"
  | "p2wsh"
  | "data"
  | "raw";

export interface IUnconfirmedTransaction {
  confirmed: boolean;
  fee: number;
  txid: string;
  block: null;
  coinbase: boolean;
  totalvalue: number;
  firstseen: number | null;
  pending?: number;
  size: number;
}

export interface IBlockTransaction
  extends Omit<IUnconfirmedTransaction, "block"> {
  block: {
    href: string;
    hash: string;
    height: number;
  };
}

export interface IReference {
  href: string;
}

export interface ITransactionReference extends IReference {
  txid: string;
}

export interface ISpentTransactionOutputReference
  extends ITransactionReference {
  input: number;
}

export interface ITransactionOutputReference extends ITransactionReference {
  output: number;
}

export interface ITransactionInput {
  amount: number;
  type: TransactionOutputType;
  spends: ITransactionOutputReference;
  address: string;
}

export interface ISimplifiedTransactionInput {
  address: string;
  type: TransactionOutputType;
  amount: number;
  inputsAmount: number;
  txid: string | undefined;
}

export interface ITransactionOutput {
  spentby: ISpentTransactionOutputReference;
  amount: number;
  address: string | null;
  type: TransactionOutputType;
  script: string;
}

export interface IExpandedTransaction extends Omit<IBlockTransaction, "block"> {
  inputs: { [key: string]: ITransactionInput };
  outputs: { [key: string]: ITransactionOutput };
  mutations: IReference;
  block: IBlock;
}
