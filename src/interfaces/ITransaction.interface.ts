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
  extends Omit<Omit<IUnconfirmedTransaction, "block">, "firstseen"> {
  firstseen: number;
  block: {
    href: string;
    hash: string;
    height: number;
  };
}

export interface IExpandedTransaction extends IBlockTransaction {
  inputs: { href: string };
  outputs: { href: string };
  mutations: {
    inputs: { [key: string]: number };
    outputs: { [key: string]: number };
  };
}
