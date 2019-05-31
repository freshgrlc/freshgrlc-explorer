export interface IUnconfirmedTransaction {
  confirmed: boolean;
  fee: number;
  txid: string;
  block: null;
  coinbase: boolean;
  totalvalue: number;
  firstseen: null;
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
