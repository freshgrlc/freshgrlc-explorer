export interface ITransaction {
  confirmed: boolean;
  fee: number;
  txid: string;
  coinbase: boolean;
  totalvalue: number;
  firstseen: number;
  size: number;
}
